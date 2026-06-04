
Action: file_editor create /app/frontend/src/pages/PaymentSuccess.jsx --file-text "import React, { useEffect, useState } from \"react\";
import { Link, useSearchParams } from \"react-router-dom\";
import { payments } from \"../lib/api\";
import { useAuth } from \"../context/AuthContext\";
import { Crown, BookOpen, Loader2, AlertTriangle } from \"lucide-react\";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sid = params.get(\"session_id\");
  const { refresh } = useAuth();
  const [state, setState] = useState({ phase: \"checking\", attempts: 0 });

  useEffect(() => {
    if (!sid) { setState({ phase: \"error\" }); return; }
    let cancelled = false;

    const poll = async (attempts = 0) => {
      if (cancelled) return;
      if (attempts >= 8) { setState({ phase: \"timeout\" }); return; }
      try {
        const { data } = await payments.status(sid);
        if (cancelled) return;
        if (data.payment_status === \"paid\") {
          await refresh();
          setState({ phase: \"paid\" });
          return;
        }
        if (data.status === \"expired\") {
          setState({ phase: \"expired\" });
          return;
        }
        setState({ phase: \"checking\", attempts });
        setTimeout(() => poll(attempts + 1), 2000);
      } catch {
        setTimeout(() => poll(attempts + 1), 2000);
      }
    };
    poll(0);

    return () => { cancelled = true; };
  }, [sid, refresh]);

  return (
    <div className=\"auth-frame\">
      <div className=\"auth-card\" style={{ textAlign: \"center\" }}>
        {state.phase === \"checking\" && (
          <>
            <Loader2 size={48} strokeWidth={3} className=\"coin-anim\" style={{ color: \"var(--mp-base)\" }} />
            <h1 className=\"auth-title\" style={{ marginTop: 8 }}>Confirming payment…</h1>
            <p className=\"auth-sub\">Hang tight, this only takes a few seconds.</p>
          </>
        )}
        {state.phase === \"paid\" && (
          <>
            <Crown size={64} strokeWidth={3} style={{ color: \"var(--mp-base)\" }} />
            <h1 className=\"auth-title\" data-testid=\"payment-success-title\">You're Premium! 🎉</h1>
            <p className=\"auth-sub\">No ads, unlimited hearts, streak freeze enabled.</p>
            <Link to=\"/learn\" data-testid=\"payment-success-continue\" className=\"duo-btn duo-btn--math duo-btn--xl duo-btn--block\" style={{ marginTop: 16 }}>
              <BookOpen size={16} strokeWidth={3} /> Start learning
            </Link>
          </>
        )}
        {state.phase === \"expired\" && (
          <>
            <AlertTriangle size={48} strokeWidth={3} style={{ color: \"var(--danger-base)\" }} />
            <h1 className=\"auth-title\">Session expired</h1>
            <p className=\"auth-sub\">Your checkout session expired. Try again.</p>
            <Link to=\"/premium\" className=\"duo-btn duo-btn--mp duo-btn--block\" style={{ marginTop: 16 }}>Try again</Link>
          </>
        )}
        {state.phase === \"timeout\" && (
          <>
            <AlertTriangle size={48} strokeWidth={3} style={{ color: \"var(--danger-base)\" }} />
            <h1 className=\"auth-title\">Still processing…</h1>
            <p className=\"auth-sub\">If you completed payment, your premium will be granted shortly. Check your profile.</p>
            <Link to=\"/profile\" className=\"duo-btn duo-btn--ghost duo-btn--block\" style={{ marginTop: 16 }}>Go to profile</Link>
          </>
        )}
        {state.phase === \"error\" && (
          <>
            <AlertTriangle size={48} strokeWidth={3} style={{ color: \"var(--danger-base)\" }} />
            <h1 className=\"auth-title\">Missing session</h1>
            <p className=\"auth-sub\">No session id was provided.</p>
            <Link to=\"/premium\" className=\"duo-btn duo-btn--mp duo-btn--block\" style={{ marginTop: 16 }}>Back to Premium</Link>
          </>
        )}
      </div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/PaymentSuccess.jsx
