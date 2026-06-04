
Action: file_editor create /app/frontend/src/pages/CourseDetail.jsx --file-text "import React, { useEffect, useState } from \"react\";
import { useNavigate, useParams } from \"react-router-dom\";
import AppShell from \"../components/AppShell\";
import { content } from \"../lib/api\";
import { useAuth } from \"../context/AuthContext\";
import { Lock, Check, Star, BookOpen } from \"lucide-react\";

const OFFSETS = [0, 1, 2, 3, 4, 5, 6, 7];

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    content.course(courseId).then(r => setCourse(r.data));
  }, [courseId]);

  if (!course) return <AppShell><div className=\"page\"><p className=\"text-mute\">Loading course…</p></div></AppShell>;

  const completed = new Set(user?.lessons_completed || []);

  // Find first uncompleted lesson id (for \"current\" highlight)
  let currentId = null;
  outer: for (const s of course.sections) {
    for (const u of s.units) {
      for (const l of u.lessons) {
        if (!completed.has(l.id)) { currentId = l.id; break outer; }
      }
    }
  }

  return (
    <AppShell>
      <div className=\"page\">
        <div style={{ marginBottom: \"1rem\", display: \"flex\", alignItems: \"center\", gap: \"0.75rem\" }}>
          <span style={{ fontFamily: \"Fredoka\", fontSize: \"2.5rem\", color: `var(--${course.color}-base)` }}>{course.emoji}</span>
          <div>
            <h1 className=\"text-h1\">{course.title}</h1>
            <p className=\"text-mute\">{course.subtitle}</p>
          </div>
        </div>

        {course.sections.map((s, si) => (
          <section key={s.id} style={{ marginTop: \"2rem\" }}>
            <div className={`section-banner section-banner--${course.color}`}>
              <div className=\"section-banner__eyebrow\">Section {si + 1}</div>
              <div className=\"section-banner__title\">{s.title}</div>
              <div className=\"section-banner__sub\">{s.subtitle}</div>
            </div>

            {s.units.map((u) => (
              <div key={u.id} style={{ marginBottom: \"2.5rem\" }}>
                <div style={{ textAlign: \"center\", marginBottom: \"0.5rem\" }}>
                  <h3 className=\"text-h3\">{u.title}</h3>
                </div>
                <div className=\"path-wrap\" data-testid={`unit-${u.id}`}>
                  {u.lessons.map((l, li) => {
                    const isComplete = completed.has(l.id);
                    const isCurrent = currentId === l.id;
                    const isLocked = !isComplete && !isCurrent;
                    return (
                      <div
                        key={l.id}
                        className={`path-node path-node--offset-${OFFSETS[li % OFFSETS.length]}`}
                      >
                        <button
                          data-testid={`lesson-node-${l.id}`}
                          aria-label={l.title}
                          disabled={isLocked}
                          className={`path-circle path-circle--${course.color} ${isComplete ? \"path-circle--complete\" : \"\"} ${isCurrent ? \"path-circle--current\" : \"\"} ${isLocked ? \"path-circle--locked\" : \"\"}`}
                          onClick={() => { if (!isLocked) nav(`/lesson/${l.id}`); }}
                        >
                          {isComplete ? <Check size={36} strokeWidth={3} /> : isLocked ? <Lock size={28} strokeWidth={3} /> : <Star size={32} strokeWidth={3} fill=\"currentColor\" />}
                          {isCurrent && (
                            <span className=\"path-start-callout\">START</span>
                          )}
                          <span className=\"path-circle__label\">L{li + 1}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        ))}

        <div style={{ textAlign: \"center\", marginTop: \"2rem\" }}>
          <button className=\"duo-btn duo-btn--ghost\" onClick={() => nav(\"/learn\")} data-testid=\"back-to-courses\">
            <BookOpen size={16} strokeWidth={3} /> All courses
          </button>
        </div>
      </div>
    </AppShell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/CourseDetail.jsx
