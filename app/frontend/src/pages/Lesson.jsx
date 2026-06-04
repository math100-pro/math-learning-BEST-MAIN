
Action: file_editor create /app/frontend/src/pages/Lesson.jsx --file-text "import React, { useEffect, useState } from \"react\";
import { useNavigate, useParams } from \"react-router-dom\";
import { X, Coins, Flame, Heart } from \"lucide-react\";
import { content } from \"../lib/api\";
import { useAuth } from \"../context/AuthContext\";
import AdOverlay from \"../components/AdOverlay\";
import Confetti from \"../components/Confetti\";

export default function Lesson() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const { user, setUser } = useAuth();

  const [data, setData] = useState(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [done, setDone] = useState(null); // result payload
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Show ad first (only for non-premium)
    if (user && !user.premium) setShowAd(true);
    content.lesson(lessonId).then(r => setData(r.data));
  }, [lessonId, user]);

  if (!data) return <div className=\"lesson-frame\"><div style={{ padding: 24 }}>Loading…</div></div>;

  const lesson = data.lesson;
  const course = data.course;
  const q = lesson.questions[idx];
  const total = lesson.questions.length;
  const progress = ((idx + (revealed ? 1 : 0)) / total) * 100;

  const onCheck = () => {
    if (selected == null) return;
    const ok = selected === q.answer;
    setRevealed(true);
    if (ok) setCorrectCount((c) => c + 1);
  };

  const onContinue = async () => {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
      return;
    }
    // finished
    setSubmitting(true);
    try {
      const { data: res } = await content.complete(lesson.id, correctCount + (revealed && selected === q.answer ? 0 : 0), total);
      // correctCount already includes the last correct answer? we increment only on reveal+correct
      setUser(res.user);
      setDone(res);
    } finally {
      setSubmitting(false);
    }
  };

  if (showAd) return <AdOverlay onSkip={() => setShowAd(false)} />;

  if (done) {
    return (
      <div className=\"lesson-frame\">
        <Confetti />
        <div className=\"celebration\">
          <div className=\"celebration__emoji\">🎉</div>
          <div className=\"celebration__title\">Lesson complete!</div>
          <div className=\"celebration__row\">
            <div className=\"celebration__pill mp\">
              <div className=\"label\">Total MP</div>
              <div className=\"value\">+{done.mp_earned}</div>
            </div>
            <div className=\"celebration__pill streak\">
              <div className=\"label\">Streak</div>
              <div className=\"value\">
                <Flame size={20} strokeWidth={3} style={{ display: \"inline\", verticalAlign: \"-4px\", marginRight: 4 }} />
                {done.user.streak}
              </div>
            </div>
            <div className=\"celebration__pill\">
              <div className=\"label\">Accuracy</div>
              <div className=\"value\">{Math.round((correctCount / total) * 100)}%</div>
            </div>
          </div>
          <div style={{ display: \"flex\", gap: \"0.75rem\", marginTop: \"1rem\", flexWrap: \"wrap\", justifyContent: \"center\" }}>
            <button
              data-testid=\"lesson-continue-after\"
              className={`duo-btn duo-btn--${course.color} duo-btn--xl`}
              onClick={() => nav(`/course/${course.id}`)}
            >
              Continue
            </button>
            <button
              data-testid=\"lesson-back-home\"
              className=\"duo-btn duo-btn--ghost duo-btn--xl\"
              onClick={() => nav(\"/learn\")}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=\"lesson-frame\">
      <div className=\"lesson-top\">
        <button data-testid=\"lesson-close\" className=\"lesson-close\" onClick={() => nav(-1)}>
          <X size={26} strokeWidth={3} />
        </button>
        <div className=\"progress-track\">
          <div className={`progress-fill progress-fill--${course.color}`} style={{ width: `${progress}%` }} />
        </div>
        {user && (
          <span data-testid=\"lesson-hearts\" className=\"stat-chip stat-chip--heart\">
            <Heart size={16} strokeWidth={3} fill=\"currentColor\" /> {user.hearts}
          </span>
        )}
      </div>

      <div className=\"lesson-body\">
        <div style={{ fontWeight: 800, fontSize: \"0.7rem\", letterSpacing: \"0.16em\", textTransform: \"uppercase\", color: \"var(--text-secondary)\" }}>
          Question {idx + 1} / {total}
        </div>
        <div className=\"lesson-question\" data-testid=\"lesson-question\">{q.question}</div>
        <div className=\"lesson-visual\" aria-hidden=\"true\">
          <span style={{ color: `var(--${course.color}-base)` }}>{course.title === \"Mathematics\" ? \"∑\" : course.title === \"Greek\" ? \"Ω\" : course.title === \"Astrophysics\" ? \"★\" : \"λ\"}</span>
        </div>

        <div className=\"option-row\">
          {q.options.map((opt, i) => {
            let cls = \"option-btn\";
            if (revealed) {
              if (i === q.answer) cls += \" is-correct\";
              else if (i === selected) cls += \" is-wrong\";
            } else if (i === selected) {
              cls += \" is-selected\";
            }
            return (
              <button
                key={i}
                data-testid={`option-${i}`}
                disabled={revealed}
                className={cls}
                onClick={() => !revealed && setSelected(i)}
              >
                <span className=\"option-btn__index\">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`lesson-footer ${revealed ? (selected === q.answer ? \"is-correct\" : \"is-wrong\") : \"\"}`}>
        <div className=\"lesson-footer__inner\">
          {revealed ? (
            <>
              <div>
                <div className={`lesson-feedback__title ${selected === q.answer ? \"ok\" : \"bad\"}`}>
                  {selected === q.answer ? \"Nice!\" : \"Not quite.\"}
                </div>
                <div className=\"lesson-feedback__explain\">{q.explanation}</div>
              </div>
              <button
                data-testid=\"lesson-continue\"
                disabled={submitting}
                className={`duo-btn duo-btn--${selected === q.answer ? course.color : \"danger\"} duo-btn--xl`}
                onClick={onContinue}
              >
                {submitting ? \"Saving…\" : idx + 1 < total ? \"Continue\" : \"Finish\"}
              </button>
            </>
          ) : (
            <>
              <div className=\"text-mute\" style={{ fontSize: \"0.85rem\" }}>
                Pick the best answer
              </div>
              <button
                data-testid=\"lesson-check\"
                disabled={selected == null}
                className={`duo-btn duo-btn--${course.color} duo-btn--xl`}
                onClick={onCheck}
              >
                Check
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Lesson.jsx
