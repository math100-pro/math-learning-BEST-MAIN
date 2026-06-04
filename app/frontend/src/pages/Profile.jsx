
Action: file_editor create /app/frontend/src/pages/Profile.jsx --file-text "import React from \"react\";
import AppShell from \"../components/AppShell\";
import { useAuth } from \"../context/AuthContext\";
import { Coins, Flame, Heart, Crown, BookOpen, Award, Sparkles } from \"lucide-react\";
import { Link } from \"react-router-dom\";
import { content as api } from \"../lib/api\";

export default function Profile() {
  const { user, setUser } = useAuth();

  if (!user) return null;

  const stats = [
    { label: \"MP earned\", value: user.mp, icon: Coins, color: \"var(--mp-base)\" },
    { label: \"Day streak\", value: user.streak, icon: Flame, color: \"var(--streak-base)\" },
    { label: \"Hearts\", value: user.hearts, icon: Heart, color: \"var(--heart-base)\" },
    { label: \"Level\", value: user.level, icon: Award, color: \"var(--astrophysics-base)\" },
    { label: \"Lessons done\", value: user.lessons_completed.length, icon: BookOpen, color: \"var(--math-base)\" },
  ];

  const refill = async () => {
    try {
      const { data } = await api.refillHearts();
      setUser(data.user);
    } catch (e) {
      alert(e?.response?.data?.detail || \"Refill failed\");
    }
  };

  return (
    <AppShell>
      <div className=\"page\">
        <div style={{ display: \"flex\", alignItems: \"center\", gap: \"1rem\", marginBottom: \"1.5rem\" }}>
          <div style={{
            width: 80, height: 80, borderRadius: \"50%\",
            background: \"linear-gradient(135deg, var(--math-base), var(--greek-base))\",
            color: \"white\", display: \"flex\", alignItems: \"center\", justifyContent: \"center\",
            fontFamily: \"Fredoka\", fontSize: 36, fontWeight: 700, border: \"3px solid white\",
            boxShadow: \"0 4px 0 var(--neutral-base)\"
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className=\"text-h1\" data-testid=\"profile-name\">{user.name}</h1>
            <p className=\"text-mute\" data-testid=\"profile-email\">{user.email}</p>
            {user.premium && (
              <span className=\"stat-chip stat-chip--premium\" style={{ marginTop: 8 }} data-testid=\"profile-premium-badge\">
                <Crown size={14} strokeWidth={3} /> Premium
              </span>
            )}
          </div>
        </div>

        <div style={{ display: \"grid\", gap: \"0.75rem\", gridTemplateColumns: \"repeat(auto-fit, minmax(140px, 1fr))\" }}>
          {stats.map((s) => (
            <div key={s.label} className=\"duo-card\" style={{ textAlign: \"center\" }} data-testid={`stat-${s.label.replace(/\s/g, \"-\").toLowerCase()}`}>
              <s.icon size={28} strokeWidth={3} style={{ color: s.color }} />
              <div style={{ fontFamily: \"Fredoka\", fontWeight: 700, fontSize: \"1.8rem\" }}>{s.value}</div>
              <div style={{ fontSize: \"0.7rem\", fontWeight: 800, letterSpacing: \"0.14em\", textTransform: \"uppercase\", color: \"var(--text-secondary)\" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: \"2rem\", display: \"flex\", gap: \"0.75rem\", flexWrap: \"wrap\" }}>
          {user.hearts < 5 && (
            <button data-testid=\"refill-hearts\" className=\"duo-btn duo-btn--danger\" onClick={refill}>
              <Heart size={16} strokeWidth={3} fill=\"white\" /> Refill hearts {user.premium ? \"(free)\" : \"(-50 MP)\"}
            </button>
          )}
          {!user.premium && (
            <Link to=\"/premium\" data-testid=\"profile-go-premium\" className=\"duo-btn duo-btn--mp\">
              <Sparkles size={16} strokeWidth={3} /> Get Premium
            </Link>
          )}
          <Link to=\"/learn\" className=\"duo-btn duo-btn--math\" data-testid=\"profile-continue-learning\">
            <BookOpen size={16} strokeWidth={3} /> Continue learning
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Profile.jsx
