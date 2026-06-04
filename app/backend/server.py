"\"\"\"MathQuest backend — gamified learning API.

Auth (JWT), users, MP/streak/hearts tracking, lesson completion,
leaderboard, and Stripe checkout for premium subscription.
\"\"\"
import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)

from content import COURSES, get_lesson_by_id, get_course_summary


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / \".env\")

# --- ENV ---
MONGO_URL = os.environ[\"MONGO_URL\"]
DB_NAME = os.environ[\"DB_NAME\"]
JWT_SECRET = os.environ[\"JWT_SECRET\"]
STRIPE_API_KEY = os.environ[\"STRIPE_API_KEY\"]

JWT_ALG = \"HS256\"
JWT_EXP_DAYS = 30

# Premium plan (server-side fixed price)
PREMIUM_PRICE_USD = 4.99

# Special unlock credentials (capitalization-sensitive)
SPECIAL_EMAIL = \"omerobdr@gmail.com\"
SPECIAL_PASSWORD = \"152181isA\"

# --- DB ---
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# --- APP ---
app = FastAPI(title=\"MathQuest API\")
api = APIRouter(prefix=\"/api\")
bearer = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format=\"%(asctime)s - %(name)s - %(levelname)s - %(message)s\")
logger = logging.getLogger(\"mathquest\")


# ============================================================
# Models
# ============================================================
class SignupReq(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class LoginReq(BaseModel):
    email: EmailStr
    password: str


class CheckoutReq(BaseModel):
    origin_url: str


class LessonCompleteReq(BaseModel):
    lesson_id: str
    correct_count: int
    total_questions: int


class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    mp: int
    streak: int
    hearts: int
    level: int
    premium: bool
    lessons_completed: List[str]
    last_lesson_date: Optional[str] = None
    created_at: str


# ============================================================
# Auth helpers
# ============================================================
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(\"utf-8\"), bcrypt.gensalt()).decode(\"utf-8\")


def verify_password(pw: str, pw_hash: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(\"utf-8\"), pw_hash.encode(\"utf-8\"))
    except Exception:
        return False


def make_token(user_id: str) -> str:
    payload = {
        \"sub\": user_id,
        \"exp\": datetime.now(timezone.utc) + timedelta(days=JWT_EXP_DAYS),
        \"iat\": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.lower().startswith(\"bearer \"):
        raise HTTPException(status_code=401, detail=\"Missing bearer token\")
    token = authorization.split(\" \", 1)[1].strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        user_id = payload[\"sub\"]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail=\"Invalid token\")
    user = await db.users.find_one({\"id\": user_id}, {\"_id\": 0})
    if not user:
        raise HTTPException(status_code=401, detail=\"User not found\")
    return user


def user_to_public(u: dict) -> dict:
    return {
        \"id\": u[\"id\"],
        \"email\": u[\"email\"],
        \"name\": u.get(\"name\") or u[\"email\"].split(\"@\")[0],
        \"mp\": u.get(\"mp\", 0),
        \"streak\": u.get(\"streak\", 0),
        \"hearts\": u.get(\"hearts\", 5),
        \"level\": u.get(\"level\", 1),
        \"premium\": u.get(\"premium\", False),
        \"lessons_completed\": u.get(\"lessons_completed\", []),
        \"last_lesson_date\": u.get(\"last_lesson_date\"),
        \"created_at\": u.get(\"created_at\"),
    }


# ============================================================
# Routes
# ============================================================
@api.get(\"/\")
async def root():
    return {\"service\": \"MathQuest\", \"status\": \"ok\"}


@api.post(\"/auth/signup\")
async def signup(req: SignupReq):
    existing = await db.users.find_one({\"email\": req.email})
    if existing:
        raise HTTPException(status_code=400, detail=\"Email already registered\")

    # Special unlock — only matches with EXACT capitalisation
    is_special = (req.email == SPECIAL_EMAIL and req.password == SPECIAL_PASSWORD)

    user_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()
    user = {
        \"id\": user_id,
        \"email\": req.email,
        \"name\": req.name or req.email.split(\"@\")[0],
        \"password_hash\": hash_password(req.password),
        \"mp\": 0,
        \"streak\": 0,
        \"hearts\": 5,
        \"level\": 1,
        \"premium\": bool(is_special),
        \"lessons_completed\": [],
        \"last_lesson_date\": None,
        \"created_at\": now_iso,
    }
    await db.users.insert_one(user)
    token = make_token(user_id)
    return {\"token\": token, \"user\": user_to_public(user)}


@api.post(\"/auth/login\")
async def login(req: LoginReq):
    user = await db.users.find_one({\"email\": req.email}, {\"_id\": 0})
    if not user or not verify_password(req.password, user[\"password_hash\"]):
        raise HTTPException(status_code=401, detail=\"Invalid email or password\")

    # Re-check special unlock on each login (capitalisation matters)
    if req.email == SPECIAL_EMAIL and req.password == SPECIAL_PASSWORD and not user.get(\"premium\"):
        await db.users.update_one({\"id\": user[\"id\"]}, {\"$set\": {\"premium\": True}})
        user[\"premium\"] = True

    token = make_token(user[\"id\"])
    return {\"token\": token, \"user\": user_to_public(user)}


@api.get(\"/me\")
async def me(user=Depends(get_current_user)):
    return user_to_public(user)


# ---- Content ----
@api.get(\"/courses\")
async def list_courses():
    return get_course_summary()


@api.get(\"/courses/{course_id}\")
async def get_course(course_id: str):
    summary = get_course_summary()
    for c in summary:
        if c[\"id\"] == course_id:
            return c
    raise HTTPException(status_code=404, detail=\"Course not found\")


@api.get(\"/lessons/{lesson_id}\")
async def get_lesson(lesson_id: str, user=Depends(get_current_user)):
    found = get_lesson_by_id(lesson_id)
    if not found:
        raise HTTPException(status_code=404, detail=\"Lesson not found\")
    # Strip answers? We need them in lesson player for instant grading client-side.
    # Send answers (this is a learning app, not a quiz with cheating concerns).
    return {
        \"lesson\": found[\"lesson\"],
        \"course\": {\"id\": found[\"course\"][\"id\"], \"title\": found[\"course\"][\"title\"], \"color\": found[\"course\"][\"color\"]},
        \"unit_title\": found[\"unit\"][\"title\"],
    }


@api.post(\"/lessons/complete\")
async def complete_lesson(req: LessonCompleteReq, user=Depends(get_current_user)):
    found = get_lesson_by_id(req.lesson_id)
    if not found:
        raise HTTPException(status_code=404, detail=\"Lesson not found\")

    base_xp = found[\"lesson\"][\"xp_reward\"]
    accuracy = (req.correct_count / max(req.total_questions, 1))
    earned = max(5, int(round(base_xp * accuracy)))

    # streak update
    today = datetime.now(timezone.utc).date()
    last = user.get(\"last_lesson_date\")
    last_date = datetime.fromisoformat(last).date() if last else None
    if last_date == today:
        new_streak = user.get(\"streak\", 0) or 1
    elif last_date == today - timedelta(days=1):
        new_streak = user.get(\"streak\", 0) + 1
    else:
        new_streak = 1

    completed = user.get(\"lessons_completed\", [])
    if req.lesson_id not in completed:
        completed = completed + [req.lesson_id]

    new_mp = user.get(\"mp\", 0) + earned
    new_level = 1 + (new_mp // 100)

    # Lose a heart if any wrong answers and not premium
    new_hearts = user.get(\"hearts\", 5)
    if not user.get(\"premium\") and req.correct_count < req.total_questions:
        new_hearts = max(0, new_hearts - 1)

    await db.users.update_one(
        {\"id\": user[\"id\"]},
        {\"$set\": {
            \"mp\": new_mp,
            \"streak\": new_streak,
            \"level\": new_level,
            \"hearts\": new_hearts,
            \"lessons_completed\": completed,
            \"last_lesson_date\": datetime.now(timezone.utc).isoformat(),
        }},
    )
    updated = await db.users.find_one({\"id\": user[\"id\"]}, {\"_id\": 0})
    return {
        \"mp_earned\": earned,
        \"user\": user_to_public(updated),
    }


@api.post(\"/hearts/refill\")
async def refill_hearts(user=Depends(get_current_user)):
    \"\"\"Premium users can refill hearts for free; free users pay 50 MP.\"\"\"
    if user.get(\"hearts\", 5) >= 5:
        return {\"user\": user_to_public(user)}
    if user.get(\"premium\"):
        await db.users.update_one({\"id\": user[\"id\"]}, {\"$set\": {\"hearts\": 5}})
    else:
        if user.get(\"mp\", 0) < 50:
            raise HTTPException(status_code=400, detail=\"Not enough MP (need 50)\")
        await db.users.update_one(
            {\"id\": user[\"id\"]},
            {\"$set\": {\"hearts\": 5}, \"$inc\": {\"mp\": -50}},
        )
    updated = await db.users.find_one({\"id\": user[\"id\"]}, {\"_id\": 0})
    return {\"user\": user_to_public(updated)}


@api.get(\"/leaderboard\")
async def leaderboard():
    cursor = db.users.find({}, {\"_id\": 0, \"password_hash\": 0}).sort(\"mp\", -1).limit(50)
    rows = []
    rank = 1
    async for u in cursor:
        rows.append({
            \"rank\": rank,
            \"id\": u[\"id\"],
            \"name\": u.get(\"name\") or u[\"email\"].split(\"@\")[0],
            \"mp\": u.get(\"mp\", 0),
            \"streak\": u.get(\"streak\", 0),
            \"level\": u.get(\"level\", 1),
            \"premium\": u.get(\"premium\", False),
        })
        rank += 1
    return rows


# ============================================================
# Stripe — Premium subscription via one-time checkout
# ============================================================
@api.post(\"/payments/checkout\")
async def create_checkout(req: CheckoutReq, request: Request, user=Depends(get_current_user)):
    if user.get(\"premium\"):
        raise HTTPException(status_code=400, detail=\"Already premium\")

    host_url = str(request.base_url).rstrip(\"/\")
    webhook_url = f\"{host_url}/api/webhook/stripe\"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    origin = req.origin_url.rstrip(\"/\")
    success_url = f\"{origin}/payment/success?session_id={{CHECKOUT_SESSION_ID}}\"
    cancel_url = f\"{origin}/premium\"

    metadata = {\"user_id\": user[\"id\"], \"email\": user[\"email\"], \"purpose\": \"premium_monthly\"}
    creq = CheckoutSessionRequest(
        amount=float(PREMIUM_PRICE_USD),
        currency=\"usd\",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session = await stripe_checkout.create_checkout_session(creq)

    await db.payment_transactions.insert_one({
        \"id\": str(uuid.uuid4()),
        \"session_id\": session.session_id,
        \"user_id\": user[\"id\"],
        \"email\": user[\"email\"],
        \"amount\": PREMIUM_PRICE_USD,
        \"currency\": \"usd\",
        \"metadata\": metadata,
        \"payment_status\": \"initiated\",
        \"status\": \"open\",
        \"created_at\": datetime.now(timezone.utc).isoformat(),
    })

    return {\"url\": session.url, \"session_id\": session.session_id}


@api.get(\"/payments/status/{session_id}\")
async def payment_status(session_id: str, request: Request, user=Depends(get_current_user)):
    tx = await db.payment_transactions.find_one({\"session_id\": session_id}, {\"_id\": 0})
    if not tx:
        raise HTTPException(status_code=404, detail=\"Transaction not found\")

    # If already processed, return cached result (idempotency)
    if tx.get(\"payment_status\") == \"paid\":
        return {\"payment_status\": \"paid\", \"status\": tx.get(\"status\"), \"already_processed\": True}

    host_url = str(request.base_url).rstrip(\"/\")
    webhook_url = f\"{host_url}/api/webhook/stripe\"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    status = await stripe_checkout.get_checkout_status(session_id)

    update = {\"payment_status\": status.payment_status, \"status\": status.status}
    await db.payment_transactions.update_one({\"session_id\": session_id}, {\"$set\": update})

    # Grant premium only once, after successful payment
    if status.payment_status == \"paid\" and tx.get(\"payment_status\") != \"paid\":
        await db.users.update_one({\"id\": tx[\"user_id\"]}, {\"$set\": {\"premium\": True}})

    return {\"payment_status\": status.payment_status, \"status\": status.status}


@api.post(\"/webhook/stripe\")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get(\"Stripe-Signature\", \"\")
    host_url = str(request.base_url).rstrip(\"/\")
    webhook_url = f\"{host_url}/api/webhook/stripe\"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        evt = await stripe_checkout.handle_webhook(body, signature)
    except Exception as e:
        logger.exception(\"Webhook error\")
        raise HTTPException(status_code=400, detail=f\"Webhook error: {e}\")

    if evt.session_id:
        tx = await db.payment_transactions.find_one({\"session_id\": evt.session_id}, {\"_id\": 0})
        if tx:
            await db.payment_transactions.update_one(
                {\"session_id\": evt.session_id},
                {\"$set\": {\"payment_status\": evt.payment_status, \"status\": \"complete\" if evt.payment_status == \"paid\" else tx.get(\"status\")}},
            )
            if evt.payment_status == \"paid\" and tx.get(\"payment_status\") != \"paid\":
                await db.users.update_one({\"id\": tx[\"user_id\"]}, {\"$set\": {\"premium\": True}})

    return {\"received\": True}


# ============================================================
# Wire-up
# ============================================================
app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get(\"CORS_ORIGINS\", \"*\").split(\",\"),
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)


@app.on_event(\"shutdown\")
async def shutdown_db_client():
    client.close()
"
