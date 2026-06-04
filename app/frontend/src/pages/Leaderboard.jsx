
Action: file_editor create /app/frontend/src/pages/Leaderboard.jsx --file-text "import React, { useEffect, useState } from \"react\";
import AppShell from \"../components/AppShell\";
import { leaderboardApi } from \"../lib/api\";
import { Coins, Crown, Flame, Trophy } from \"lucide-react\";
import { useAuth } from \"../context/AuthContext\";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    leaderboardApi.list().then(r => setRows(r.data)).finally(() => setLoading(false));
  }, []);

  const rankClass = (r) => r === 1 ? \"lb-row--gold\" : r === 2 ? \"lb-row--silver\" : r === 3 ? \"lb-row--bronze\" : \"\";

  return (
    <AppShell>
      <div className=\"page\">
        <div style={{ display: \"flex\", alignItems: \"center\", gap: \"0.75rem\", marginBottom: \"1.5rem\" }}>
          <Trophy size={32} strokeWidth={3} style={{ color: \"var(--mp-base)\" }} />
          <div>
            <h1 className=\"text-h1\">Leaderboard</h1>
            <p className=\"text-mute\">Top learners worldwide, ranked by MP.</p>
          </div>
        </div>

        {loading && <p className=\"text-mute\">Loading…</p>}
        {!loading && rows.length === 0 && <p className=\"text-mute\">No one's on the board yet. Be the first!</p>}

        <div data-testid=\"leaderboard-list\">
          {rows.map((r) => (
            <div
              key={r.id}
              data-testid={`lb-row-${r.rank}`}
              className={`lb-row ${rankClass(r.rank)} ${user?.id === r.id ? \"is-me\" : \"\"}`}
            >
              <span className=\"lb-row__rank\">{r.rank}</span>
              <div className=\"lb-row__name\">
                {r.name}
                {r.premium && <Crown size={16} strokeWidth={3} style={{ display: \"inline\", marginLeft: 6, color: \"var(--mp-base)\" }} />}
              </div>
              <span className=\"stat-chip stat-chip--streak\" style={{ marginRight: \"0.25rem\" }}>
                <Flame size={14} strokeWidth={3} /> {r.streak}
              </span>
              <span className=\"lb-row__mp\">
                <Coins size={16} strokeWidth={3} className=\"coin-anim\" /> {r.mp} MP
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Leaderboard.jsx
