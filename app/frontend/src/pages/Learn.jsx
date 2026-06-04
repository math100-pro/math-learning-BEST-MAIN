
Action: file_editor create /app/frontend/src/pages/Learn.jsx --file-text "import React, { useEffect, useState } from \"react\";
import { useNavigate } from \"react-router-dom\";
import AppShell from \"../components/AppShell\";
import { content } from \"../lib/api\";
import { ChevronRight } from \"lucide-react\";

export default function Learn() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    content.courses().then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className=\"page\">
        <div style={{ marginBottom: \"1.5rem\" }}>
          <h1 className=\"text-h1\">Pick a course</h1>
          <p className=\"text-mute\" style={{ marginTop: \"0.25rem\" }}>
            4 courses · hundreds of bite-sized lessons · earn MP every time.
          </p>
        </div>

        {loading && <p className=\"text-mute\">Loading…</p>}

        <div style={{ display: \"grid\", gap: \"1rem\", gridTemplateColumns: \"repeat(auto-fit, minmax(240px, 1fr))\" }}>
          {courses.map((c) => (
            <div
              key={c.id}
              data-testid={`course-tile-${c.id}`}
              className={`course-tile course-tile--${c.color}`}
              onClick={() => nav(`/course/${c.id}`)}
              role=\"button\"
              tabIndex={0}
            >
              <div className=\"course-tile__emoji\">{c.emoji}</div>
              <div className=\"course-tile__title\">{c.title}</div>
              <div className=\"course-tile__sub\">{c.subtitle}</div>
              <div style={{ marginTop: \"0.75rem\", display: \"inline-flex\", gap: 6, alignItems: \"center\", fontWeight: 800, fontSize: \"0.8rem\", color: \"var(--text-secondary)\", textTransform: \"uppercase\", letterSpacing: \"0.08em\" }}>
                Start <ChevronRight size={16} strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Learn.jsx
