
Action: file_editor create /app/frontend/src/pages/Auth.jsx --file-text "import React, { useState } from \"react\";
import { useNavigate, Link } from \"react-router-dom\";
import { useAuth } from \"../context/AuthContext\";
import { BookOpen } from \"lucide-react\";

export default function Auth({ mode }) {
  const isLogin = mode === \"login\";
  const { login, signup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [name, setName] = useState(\"\");
  const [err, setErr] = useState(\"\");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(\"\");
    setBusy(true);
    try {
      if (isLogin) await login(email, password);
      else         await signup(email, password, name);
      nav(\"/learn\");
    } catch (e2) {
      setErr(e2?.response?.data?.detail || \"Something went wrong.\");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className=\"auth-frame\">
      <Link to=\"/\" className=\"top-bar__brand\" style={{ marginBottom: \"1.5rem\" }}>
        <BookOpen size={28} strokeWidth={3} style={{ color: \"var(--math-base)\" }} /> MathQuest
      </Link>
      <form onSubmit={submit} className=\"auth-card\" data-testid={isLogin ? \"login-form\" : \"signup-form\"}>
        <h1 className=\"auth-title\">{isLogin ? \"Welcome back\" : \"Create your account\"}</h1>
        <p className=\"auth-sub\">{isLogin ? \"Pick up where you left off.\" : \"Save your progress and earn MP.\"}</p>

        {!isLogin && (
          <>
            <label className=\"duo-label\">Name</label>
            <input
              data-testid=\"auth-name\"
              className=\"duo-input\"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=\"Your display name\"
            />
          </>
        )}

        <label className=\"duo-label\">Email</label>
        <input
          data-testid=\"auth-email\"
          type=\"email\"
          className=\"duo-input\"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder=\"you@example.com\"
        />

        <label className=\"duo-label\">Password</label>
        <input
          data-testid=\"auth-password\"
          type=\"password\"
          className=\"duo-input\"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder=\"••••••••\"
        />

        {err && (
          <div data-testid=\"auth-error\" style={{
            marginTop: \"1rem\",
            background: \"#ffecec\", color: \"var(--danger-shadow)\",
            border: \"2px solid #ffd0d0\",
            padding: \"0.6rem 0.8rem\", borderRadius: \"0.75rem\", fontWeight: 700, fontSize: \"0.85rem\",
          }}>
            {err}
          </div>
        )}

        <button
          data-testid=\"auth-submit\"
          type=\"submit\"
          disabled={busy}
          className=\"duo-btn duo-btn--math duo-btn--block\"
          style={{ marginTop: \"1.5rem\" }}
        >
          {busy ? \"Please wait…\" : isLogin ? \"Log in\" : \"Create account\"}
        </button>

        <div style={{ textAlign: \"center\", marginTop: \"1.25rem\", fontWeight: 700, fontSize: \"0.85rem\", color: \"var(--text-secondary)\" }}>
          {isLogin ? (
            <>New here? <Link data-testid=\"auth-switch\" to=\"/signup\" style={{ color: \"var(--math-base)\" }}>Create an account</Link></>
          ) : (
            <>Already have one? <Link data-testid=\"auth-switch\" to=\"/login\" style={{ color: \"var(--math-base)\" }}>Log in</Link></>
          )}
        </div>
      </form>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Auth.jsx
