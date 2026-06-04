
Action: file_editor create /app/frontend/src/pages/Premium.jsx --file-text "import React, { useState } from \"react\";
import AppShell from \"../components/AppShell\";
import { useAuth } from \"../context/AuthContext\";
import { Check, Crown, Heart, Snowflake, Star, X } from \"lucide-react\";
import { payments } from \"../lib/api\";

const BENEFITS = [
  { icon: X,        text: \"No ads, ever.\" },
  { icon: Heart,    text: \"Unlimited hearts — never get locked out of a lesson.\" },
  { icon: Snowflake,text: \"Streak Freeze: keep your streak even if you miss a day.\" },
  { icon: Star,     text: \"Premium leaderboard badge & double MP weekends.\" },
];

export default function Premium() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(\"\");

  const upgrade = async () => {
    setBusy(true); setErr(\"\");
    try {
      const { data } = await payments.checkout(window.location.origin);
      window.location.href = data.url;
    } catch (e) {
      setErr(e?.response?.data?.detail || \"Could not start checkout\");
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className=\"page\">
        <div className=\"premium-hero\">
          <Crown size={48} strokeWidth={3} style={{ color: \"#5a3d00\" }} />
          <h1>MathQuest Premium</h1>
          <p>Learn without limits. Skip ads. Keep your streak alive.</p>
        </div>

        <div className=\"benefit-row\">
          {BENEFITS.map((b, i) => (
            <div key={i} className=\"benefit\" data-testid={`benefit-${i}`}>
              <span className=\"benefit__check\"><Check size={18} strokeWidth={3} /></span>
              <b.icon size={20} strokeWidth={3} style={{ color: \"var(--mp-shadow)\" }} />
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        {user?.premium ? (
          <div className=\"duo-card\" style={{ textAlign: \"center\" }} data-testid=\"already-premium\">
            <Crown size={36} strokeWidth={3} style={{ color: \"var(--mp-base)\" }} />
            <h2 className=\"text-h2\" style={{ marginTop: 8 }}>You're a Premium member 🎉</h2>
            <p className=\"text-mute\">Enjoy ad-free, unlimited learning.</p>
          </div>
        ) : (
          <>
            <div style={{ display: \"flex\", justifyContent: \"center\", marginTop: \"1rem\" }}>
              <button
                data-testid=\"upgrade-btn\"
                onClick={upgrade}
                disabled={busy}
                className=\"duo-btn duo-btn--mp duo-btn--xl\"
              >
                {busy ? \"Redirecting…\" : \"Upgrade for $4.99 / mo\"}
              </button>
            </div>
            {err && <p style={{ color: \"var(--danger-shadow)\", marginTop: \"1rem\", textAlign: \"center\", fontWeight: 700 }}>{err}</p>}
            <p className=\"text-mute\" style={{ textAlign: \"center\", marginTop: \"0.75rem\", fontSize: \"0.85rem\" }}>
              Powered by Stripe. Cancel anytime.
            </p>
          </>
        )}
      </div>
    </AppShell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Premium.jsx
