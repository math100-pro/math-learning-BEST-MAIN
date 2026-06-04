
Action: file_editor create /app/frontend/src/components/AppShell.jsx --file-text "import React from \"react\";
import { NavLink, useNavigate } from \"react-router-dom\";
import { Home, Trophy, User as UserIcon, Crown, BookOpen, LogOut, Flame, Coins, Heart } from \"lucide-react\";
import { useAuth } from \"../context/AuthContext\";

const NAV = [
  { to: \"/learn\", label: \"Learn\", icon: Home, testid: \"nav-learn\" },
  { to: \"/leaderboard\", label: \"Leaderboard\", icon: Trophy, testid: \"nav-leaderboard\" },
  { to: \"/premium\", label: \"Premium\", icon: Crown, testid: \"nav-premium\" },
  { to: \"/profile\", label: \"Profile\", icon: UserIcon, testid: \"nav-profile\" },
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className=\"app-shell\">
      <aside className=\"sidebar\">
        <div className=\"sidebar__brand\">
          <BookOpen size={26} strokeWidth={2.8} style={{ display: \"inline\", marginRight: 8, color: \"var(--math-base)\" }} />
          MathQuest
        </div>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            data-testid={n.testid}
            className={({ isActive }) => `sidebar__item ${isActive ? \"is-active\" : \"\"}`}
          >
            <n.icon size={22} strokeWidth={2.6} />
            {n.label}
          </NavLink>
        ))}
        <button
          data-testid=\"nav-logout\"
          onClick={() => { logout(); navigate(\"/\"); }}
          className=\"sidebar__item\"
          style={{ marginTop: \"auto\", background: \"transparent\", border: \"none\", textAlign: \"left\", cursor: \"pointer\" }}
        >
          <LogOut size={22} strokeWidth={2.6} />
          Log out
        </button>
      </aside>

      <div className=\"app-shell-content\">
        <div className=\"top-bar\">
          <div className=\"top-bar__brand\">MathQuest</div>
          {user && (
            <div style={{ display: \"flex\", gap: \"0.5rem\", alignItems: \"center\", flexWrap: \"wrap\" }}>
              <span data-testid=\"stat-streak\" className=\"stat-chip stat-chip--streak\">
                <Flame size={16} strokeWidth={3} className=\"flame-anim\" /> {user.streak}
              </span>
              <span data-testid=\"stat-hearts\" className=\"stat-chip stat-chip--heart\">
                <Heart size={16} strokeWidth={3} fill=\"currentColor\" /> {user.hearts}
              </span>
              <span data-testid=\"stat-mp\" className=\"stat-chip stat-chip--mp\">
                <Coins size={16} strokeWidth={3} className=\"coin-anim\" /> {user.mp} MP
              </span>
              {user.premium && (
                <span data-testid=\"stat-premium\" className=\"stat-chip stat-chip--premium\">
                  <Crown size={16} strokeWidth={3} /> PRO
                </span>
              )}
            </div>
          )}
        </div>

        {children}

        <nav className=\"bottom-nav\">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`${n.testid}-mobile`}
              className={({ isActive }) => `bottom-nav__item ${isActive ? \"is-active\" : \"\"}`}
            >
              <n.icon size={22} strokeWidth={2.6} />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/components/AppShell.jsx
