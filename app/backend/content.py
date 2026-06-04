"\"\"\"Seed content for MathQuest courses.

Hierarchy: Course -> Section (3) -> Unit (5) -> Lesson (5)
Each lesson contains 3-5 multiple-choice questions with explanations.
\"\"\"
from typing import List, Dict, Any
import random


# ---- HAND-WRITTEN QUESTION BANKS ----

MATH_QUESTIONS = [
    {\"q\": \"What is 7 + 8?\", \"options\": [\"13\", \"14\", \"15\", \"16\"], \"answer\": 2, \"explain\": \"7 + 8 = 15. Try grouping: 7 + 3 = 10, then 10 + 5 = 15.\"},
    {\"q\": \"Solve: 12 × 5\", \"options\": [\"50\", \"55\", \"60\", \"65\"], \"answer\": 2, \"explain\": \"12 × 5 = 60. Think of it as 10×5 + 2×5 = 50 + 10.\"},
    {\"q\": \"What is 144 ÷ 12?\", \"options\": [\"10\", \"11\", \"12\", \"13\"], \"answer\": 2, \"explain\": \"12 × 12 = 144, so 144 ÷ 12 = 12.\"},
    {\"q\": \"Solve for x: 2x + 4 = 14\", \"options\": [\"3\", \"5\", \"7\", \"9\"], \"answer\": 1, \"explain\": \"Subtract 4: 2x = 10. Divide by 2: x = 5.\"},
    {\"q\": \"What is the area of a square with side 6?\", \"options\": [\"12\", \"24\", \"30\", \"36\"], \"answer\": 3, \"explain\": \"Area = side² = 6 × 6 = 36.\"},
    {\"q\": \"Simplify: 3/9\", \"options\": [\"1/2\", \"1/3\", \"2/3\", \"3/4\"], \"answer\": 1, \"explain\": \"Divide top and bottom by 3 → 1/3.\"},
    {\"q\": \"What is 25% of 200?\", \"options\": [\"25\", \"40\", \"50\", \"75\"], \"answer\": 2, \"explain\": \"25% = 1/4, and 200 ÷ 4 = 50.\"},
    {\"q\": \"Sum of angles in a triangle?\", \"options\": [\"90°\", \"180°\", \"270°\", \"360°\"], \"answer\": 1, \"explain\": \"Every triangle's interior angles sum to 180°.\"},
    {\"q\": \"What is √81?\", \"options\": [\"7\", \"8\", \"9\", \"10\"], \"answer\": 2, \"explain\": \"9 × 9 = 81.\"},
    {\"q\": \"Solve: (-3) × (-4)\", \"options\": [\"-12\", \"-7\", \"7\", \"12\"], \"answer\": 3, \"explain\": \"A negative times a negative is positive: 12.\"},
    {\"q\": \"What's the next prime after 7?\", \"options\": [\"8\", \"9\", \"10\", \"11\"], \"answer\": 3, \"explain\": \"11 is prime; 8, 9, 10 are composite.\"},
    {\"q\": \"Pythagorean: a=3, b=4, c=?\", \"options\": [\"5\", \"6\", \"7\", \"12\"], \"answer\": 0, \"explain\": \"3² + 4² = 9 + 16 = 25 = 5².\"},
    {\"q\": \"Slope of y = 2x + 3?\", \"options\": [\"1\", \"2\", \"3\", \"5\"], \"answer\": 1, \"explain\": \"In y = mx + b, m is the slope. Here m = 2.\"},
    {\"q\": \"Derivative of x²?\", \"options\": [\"x\", \"2x\", \"x²\", \"2\"], \"answer\": 1, \"explain\": \"d/dx (x²) = 2x by the power rule.\"},
    {\"q\": \"What is 0! (zero factorial)?\", \"options\": [\"0\", \"1\", \"undefined\", \"infinity\"], \"answer\": 1, \"explain\": \"By convention, 0! = 1.\"},
]

GREEK_QUESTIONS = [
    {\"q\": \"How do you say 'hello' in Greek?\", \"options\": [\"Ciao\", \"Γειά σου (Yia sou)\", \"Hola\", \"Bonjour\"], \"answer\": 1, \"explain\": \"Γειά σου literally means 'health to you'.\"},
    {\"q\": \"What does 'Ευχαριστώ' mean?\", \"options\": [\"Goodbye\", \"Please\", \"Thank you\", \"Sorry\"], \"answer\": 2, \"explain\": \"Ευχαριστώ (efharistó) = thank you.\"},
    {\"q\": \"The Greek letter Ω is called?\", \"options\": [\"Alpha\", \"Sigma\", \"Phi\", \"Omega\"], \"answer\": 3, \"explain\": \"Ω is Omega, the last letter of the Greek alphabet.\"},
    {\"q\": \"What is 'water' in Greek?\", \"options\": [\"Νερό\", \"Φωτιά\", \"Άνεμος\", \"Γη\"], \"answer\": 0, \"explain\": \"Νερό (neró) means water.\"},
    {\"q\": \"Translate: 'Καλημέρα'\", \"options\": [\"Good night\", \"Good morning\", \"Goodbye\", \"Welcome\"], \"answer\": 1, \"explain\": \"Καλημέρα = Good morning (literally 'good day').\"},
    {\"q\": \"Greek letter for sound 'p'?\", \"options\": [\"Π\", \"Ρ\", \"Φ\", \"Β\"], \"answer\": 0, \"explain\": \"Π (Pi) makes the 'p' sound. Ρ (Rho) is 'r'.\"},
    {\"q\": \"What is 'one' in Greek?\", \"options\": [\"Δύο\", \"Ένα\", \"Τρία\", \"Τέσσερα\"], \"answer\": 1, \"explain\": \"Ένα (éna) = one.\"},
    {\"q\": \"Meaning of 'φιλοσοφία'?\", \"options\": [\"Mathematics\", \"Music\", \"Philosophy\", \"Politics\"], \"answer\": 2, \"explain\": \"Φιλοσοφία literally means 'love of wisdom'.\"},
    {\"q\": \"'Αντίο' means?\", \"options\": [\"Hello\", \"Please\", \"Goodbye\", \"Yes\"], \"answer\": 2, \"explain\": \"Αντίο (adío) = goodbye.\"},
    {\"q\": \"Greek letter Δ is called?\", \"options\": [\"Delta\", \"Gamma\", \"Theta\", \"Lambda\"], \"answer\": 0, \"explain\": \"Δ is Delta.\"},
    {\"q\": \"How to say 'yes'?\", \"options\": [\"Όχι\", \"Ναι\", \"Ίσως\", \"Ποτέ\"], \"answer\": 1, \"explain\": \"Ναι (ne) = yes. Όχι = no.\"},
    {\"q\": \"What is 'sun' in Greek?\", \"options\": [\"Φεγγάρι\", \"Ήλιος\", \"Αστέρι\", \"Ουρανός\"], \"answer\": 1, \"explain\": \"Ήλιος (ílios) = sun.\"},
]

ASTRO_QUESTIONS = [
    {\"q\": \"Which planet is closest to the Sun?\", \"options\": [\"Venus\", \"Mercury\", \"Earth\", \"Mars\"], \"answer\": 1, \"explain\": \"Mercury is the innermost planet.\"},
    {\"q\": \"What is a light-year a measure of?\", \"options\": [\"Time\", \"Brightness\", \"Distance\", \"Mass\"], \"answer\": 2, \"explain\": \"It's the distance light travels in one year (~9.46 trillion km).\"},
    {\"q\": \"What powers the Sun?\", \"options\": [\"Combustion\", \"Nuclear fusion\", \"Nuclear fission\", \"Gravity alone\"], \"answer\": 1, \"explain\": \"Hydrogen fuses into helium in the Sun's core.\"},
    {\"q\": \"Speed of light in vacuum?\", \"options\": [\"3×10⁵ km/s\", \"3×10⁸ m/s\", \"3×10⁶ m/s\", \"3×10¹⁰ m/s\"], \"answer\": 1, \"explain\": \"c ≈ 299,792,458 m/s ≈ 3×10⁸ m/s.\"},
    {\"q\": \"What's at the center of our galaxy?\", \"options\": [\"A red giant\", \"A neutron star\", \"A supermassive black hole\", \"A quasar\"], \"answer\": 2, \"explain\": \"Sagittarius A* is a ~4 million solar mass black hole.\"},
    {\"q\": \"Which is NOT a type of galaxy?\", \"options\": [\"Spiral\", \"Elliptical\", \"Irregular\", \"Cubic\"], \"answer\": 3, \"explain\": \"Galaxies are spiral, elliptical, or irregular (and lenticular).\"},
    {\"q\": \"The Big Bang occurred ~ how long ago?\", \"options\": [\"4.5 billion yrs\", \"13.8 billion yrs\", \"100 billion yrs\", \"1 trillion yrs\"], \"answer\": 1, \"explain\": \"~13.8 Gyr ago, per CMB measurements.\"},
    {\"q\": \"What is Hubble's Law about?\", \"options\": [\"Gravity\", \"Galaxy recession\", \"Atomic spectra\", \"Stellar fusion\"], \"answer\": 1, \"explain\": \"Galaxies recede at v = H₀ × d — the universe is expanding.\"},
    {\"q\": \"A star's color tells us its...\", \"options\": [\"Age only\", \"Temperature\", \"Distance\", \"Composition only\"], \"answer\": 1, \"explain\": \"Blue = hot (>10,000 K), red = cool (~3,000 K).\"},
    {\"q\": \"What is dark matter?\", \"options\": [\"Hot gas\", \"Antimatter\", \"Unknown non-luminous mass\", \"Black holes only\"], \"answer\": 2, \"explain\": \"It interacts gravitationally but emits no light; nature unknown.\"},
    {\"q\": \"Escape velocity from Earth?\", \"options\": [\"~7 km/s\", \"~11 km/s\", \"~30 km/s\", \"~300 km/s\"], \"answer\": 1, \"explain\": \"~11.2 km/s to escape Earth's gravity.\"},
    {\"q\": \"What is a neutron star made of?\", \"options\": [\"Pure energy\", \"Mostly neutrons\", \"Antimatter\", \"Plasma\"], \"answer\": 1, \"explain\": \"Stellar remnant of dense, degenerate neutrons.\"},
]

CODE_QUESTIONS = [
    {\"q\": \"What does 'HTML' stand for?\", \"options\": [\"Hyper Trainer Markup Language\", \"HyperText Markup Language\", \"HighText Machine Language\", \"Hyperlink Text Manage Lang\"], \"answer\": 1, \"explain\": \"HyperText Markup Language is the standard for web pages.\"},
    {\"q\": \"Python: print(type([])) outputs?\", \"options\": [\"<class 'list'>\", \"<class 'dict'>\", \"<class 'tuple'>\", \"<class 'set'>\"], \"answer\": 0, \"explain\": \"[] is an empty list.\"},
    {\"q\": \"JS: typeof null is?\", \"options\": [\"'null'\", \"'undefined'\", \"'object'\", \"'number'\"], \"answer\": 2, \"explain\": \"A famous JS quirk: typeof null === 'object'.\"},
    {\"q\": \"Which is NOT a loop?\", \"options\": [\"for\", \"while\", \"switch\", \"do-while\"], \"answer\": 2, \"explain\": \"switch is a conditional, not a loop.\"},
    {\"q\": \"Big-O of binary search?\", \"options\": [\"O(1)\", \"O(log n)\", \"O(n)\", \"O(n²)\"], \"answer\": 1, \"explain\": \"Halve the search space each step → logarithmic time.\"},
    {\"q\": \"Git command to save changes locally?\", \"options\": [\"git push\", \"git commit\", \"git stash\", \"git pull\"], \"answer\": 1, \"explain\": \"commit records changes to the local repository.\"},
    {\"q\": \"CSS: which is a flex container property?\", \"options\": [\"display: flex\", \"flex: 1\", \"align-self\", \"order\"], \"answer\": 0, \"explain\": \"display: flex turns an element into a flex container.\"},
    {\"q\": \"SQL: which clause filters rows?\", \"options\": [\"SELECT\", \"WHERE\", \"ORDER BY\", \"GROUP BY\"], \"answer\": 1, \"explain\": \"WHERE filters rows before grouping.\"},
    {\"q\": \"What is recursion?\", \"options\": [\"A loop\", \"Function calling itself\", \"An array op\", \"A class\"], \"answer\": 1, \"explain\": \"A function that calls itself with a base case to terminate.\"},
    {\"q\": \"Python list comprehension result: [x*2 for x in range(3)]\", \"options\": [\"[0,1,2]\", \"[0,2,4]\", \"[2,4,6]\", \"[1,2,3]\"], \"answer\": 1, \"explain\": \"range(3) → 0,1,2 → ×2 → 0,2,4.\"},
    {\"q\": \"HTTP status 404 means?\", \"options\": [\"OK\", \"Server error\", \"Not found\", \"Unauthorized\"], \"answer\": 2, \"explain\": \"404 = the requested resource is not found.\"},
    {\"q\": \"Which is functional-style?\", \"options\": [\"for-loop with mutation\", \"array.map(fn)\", \"i++\", \"var x = 1\"], \"answer\": 1, \"explain\": \"map returns a new array — no mutation.\"},
]

POOLS = {
    \"math\": MATH_QUESTIONS,
    \"greek\": GREEK_QUESTIONS,
    \"astro\": ASTRO_QUESTIONS,
    \"code\": CODE_QUESTIONS,
}

COURSES_META = [
    {
        \"id\": \"math\",
        \"title\": \"Mathematics\",
        \"subtitle\": \"From arithmetic to calculus, build true math intuition.\",
        \"color\": \"math\",
        \"emoji\": \"∑\",
        \"sections\": [
            {\"title\": \"Arithmetic Foundations\", \"subtitle\": \"Numbers, operations & order\"},
            {\"title\": \"Algebra Essentials\", \"subtitle\": \"Equations, variables & functions\"},
            {\"title\": \"Geometry & Beyond\", \"subtitle\": \"Shapes, areas & a peek into calculus\"},
        ],
    },
    {
        \"id\": \"greek\",
        \"title\": \"Greek\",
        \"subtitle\": \"Speak the language of philosophers and gods.\",
        \"color\": \"greek\",
        \"emoji\": \"Ω\",
        \"sections\": [
            {\"title\": \"Alphabet & Sounds\", \"subtitle\": \"Read the Greek letters fluently\"},
            {\"title\": \"Daily Conversation\", \"subtitle\": \"Greet, thank, and connect\"},
            {\"title\": \"Travel & Culture\", \"subtitle\": \"Order food, ask directions, share stories\"},
        ],
    },
    {
        \"id\": \"astro\",
        \"title\": \"Astrophysics\",
        \"subtitle\": \"Stars, galaxies, black holes — the universe explained.\",
        \"color\": \"astrophysics\",
        \"emoji\": \"★\",
        \"sections\": [
            {\"title\": \"Our Solar System\", \"subtitle\": \"Planets, moons & the Sun\"},
            {\"title\": \"Stars & Stellar Death\", \"subtitle\": \"Fusion, supernovae & remnants\"},
            {\"title\": \"Galaxies & Cosmology\", \"subtitle\": \"Big Bang, dark matter, expansion\"},
        ],
    },
    {
        \"id\": \"code\",
        \"title\": \"Coding\",
        \"subtitle\": \"Think like a programmer. Build like an engineer.\",
        \"color\": \"coding\",
        \"emoji\": \"λ\",
        \"sections\": [
            {\"title\": \"Programming Basics\", \"subtitle\": \"Variables, types & control flow\"},
            {\"title\": \"Data & Algorithms\", \"subtitle\": \"Lists, maps & complexity\"},
            {\"title\": \"Web & Real Projects\", \"subtitle\": \"HTML/CSS/JS, Git & APIs\"},
        ],
    },
]


def build_lessons(pool_key: str, course_id: str, section_idx: int, unit_idx: int, unit_title: str) -> List[Dict[str, Any]]:
    \"\"\"Build 5 lessons per unit. Each lesson has 4 questions drawn from the pool.\"\"\"
    pool = POOLS[pool_key]
    lessons = []
    seed = hash((course_id, section_idx, unit_idx)) & 0xFFFFFFFF
    rng = random.Random(seed)
    for li in range(5):
        # Pick 4 questions, deterministic per (course, section, unit, lesson)
        idxs = rng.sample(range(len(pool)), k=min(4, len(pool)))
        qs = []
        for qi in idxs:
            base = pool[qi]
            qs.append({
                \"question\": base[\"q\"],
                \"options\": list(base[\"options\"]),
                \"answer\": base[\"answer\"],
                \"explanation\": base[\"explain\"],
            })
        lessons.append({
            \"id\": f\"{course_id}-s{section_idx+1}-u{unit_idx+1}-l{li+1}\",
            \"title\": f\"{unit_title} · Lesson {li+1}\",
            \"xp_reward\": 15,
            \"questions\": qs,
        })
    return lessons


def build_courses() -> List[Dict[str, Any]]:
    unit_themes = {
        \"math\": [
            [\"Counting & Place Value\", \"Addition Magic\", \"Subtraction Tricks\", \"Multiplication Tables\", \"Division Mastery\"],
            [\"Linear Equations\", \"Inequalities\", \"Functions Intro\", \"Quadratics\", \"Systems of Equations\"],
            [\"Triangles & Pythagoras\", \"Circles & π\", \"Area & Volume\", \"Limits Preview\", \"Derivatives Sneak Peek\"],
        ],
        \"greek\": [
            [\"Vowels\", \"Consonants\", \"Diphthongs\", \"Reading Practice\", \"Common Words\"],
            [\"Greetings\", \"Numbers 1-20\", \"Family & Friends\", \"Food & Drinks\", \"Polite Phrases\"],
            [\"At the Taverna\", \"Buying Tickets\", \"Directions\", \"Greek Myths\", \"Modern Slang\"],
        ],
        \"astro\": [
            [\"The Sun\", \"Inner Planets\", \"Outer Planets\", \"Moons & Rings\", \"Comets & Asteroids\"],
            [\"Hertzsprung-Russell\", \"Main Sequence Stars\", \"Red Giants\", \"Supernovae\", \"Neutron Stars & BHs\"],
            [\"The Milky Way\", \"Galaxy Types\", \"The Big Bang\", \"Cosmic Microwave BG\", \"Dark Matter & Energy\"],
        ],
        \"code\": [
            [\"Variables & Types\", \"Strings & Numbers\", \"If / Else\", \"Loops\", \"Functions\"],
            [\"Arrays / Lists\", \"Maps / Dicts\", \"Sorting Algorithms\", \"Big-O Notation\", \"Recursion\"],
            [\"HTML Basics\", \"CSS Layouts\", \"JavaScript Events\", \"Git & GitHub\", \"REST APIs\"],
        ],
    }

    courses = []
    for meta in COURSES_META:
        course_id = meta[\"id\"]
        pool_key = course_id if course_id != \"astro\" else \"astro\"
        pool_key = {\"math\": \"math\", \"greek\": \"greek\", \"astro\": \"astro\", \"code\": \"code\"}[course_id]
        sections_out = []
        for si, section in enumerate(meta[\"sections\"]):
            units_out = []
            for ui, unit_title in enumerate(unit_themes[course_id][si]):
                lessons = build_lessons(pool_key, course_id, si, ui, unit_title)
                units_out.append({
                    \"id\": f\"{course_id}-s{si+1}-u{ui+1}\",
                    \"title\": unit_title,
                    \"lessons\": lessons,
                })
            sections_out.append({
                \"id\": f\"{course_id}-s{si+1}\",
                \"title\": section[\"title\"],
                \"subtitle\": section[\"subtitle\"],
                \"units\": units_out,
            })
        courses.append({
            \"id\": meta[\"id\"],
            \"title\": meta[\"title\"],
            \"subtitle\": meta[\"subtitle\"],
            \"color\": meta[\"color\"],
            \"emoji\": meta[\"emoji\"],
            \"sections\": sections_out,
        })
    return courses


COURSES = build_courses()


def get_lesson_by_id(lesson_id: str):
    for c in COURSES:
        for s in c[\"sections\"]:
            for u in s[\"units\"]:
                for l in u[\"lessons\"]:
                    if l[\"id\"] == lesson_id:
                        return {\"course\": c, \"section\": s, \"unit\": u, \"lesson\": l}
    return None


def get_course_summary():
    \"\"\"Return courses without lesson questions (lighter for /courses listing).\"\"\"
    out = []
    for c in COURSES:
        sections = []
        for s in c[\"sections\"]:
            units = []
            for u in s[\"units\"]:
                lessons = [{\"id\": l[\"id\"], \"title\": l[\"title\"], \"xp_reward\": l[\"xp_reward\"]} for l in u[\"lessons\"]]
                units.append({\"id\": u[\"id\"], \"title\": u[\"title\"], \"lessons\": lessons})
            sections.append({\"id\": s[\"id\"], \"title\": s[\"title\"], \"subtitle\": s[\"subtitle\"], \"units\": units})
        out.append({
            \"id\": c[\"id\"], \"title\": c[\"title\"], \"subtitle\": c[\"subtitle\"],
            \"color\": c[\"color\"], \"emoji\": c[\"emoji\"], \"sections\": sections,
        })
    return out
"
