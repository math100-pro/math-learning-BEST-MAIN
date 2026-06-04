
Action: file_editor create /app/frontend/src/pages/Landing.jsx --file-text "import React from \"react\";
import { Link } from \"react-router-dom\";
import { Flame, Coins, Trophy, BookOpen, Sparkles, Crown } from \"lucide-react\";

export default function Landing() {
  return (
    <div className=\"landing\">
      <div className=\"landing__nav\">
        <div className=\"top-bar__brand\">
          <BookOpen size={28} strokeWidth={3} style={{ color: \"var(--math-base)\" }} />
          MathQuest
        </div>
        <div style={{ display: \"flex\", gap: \"0.75rem\" }}>
          <Link to=\"/login\" data-testid=\"landing-login\" className=\"duo-btn duo-btn--ghost duo-btn--sm\">Log in</Link>
          <Link to=\"/signup\" data-testid=\"landing-signup\" className=\"duo-btn duo-btn--math duo-btn--sm\">Get started</Link>
        </div>
      </div>

      <div className=\"landing__hero\">
        <h1 className=\"landing__title\">
          Learn anything. <em>Earn MP.</em> Keep your streak.
        </h1>
        <p className=\"landing__sub\">
          A gamified learning playground for Math, Greek, Astrophysics & Coding.
          Tiny lessons. Big wins. Built for the dopamine generation.
        </p>
        <div className=\"landing__cta-row\">
          <Link to=\"/signup\" data-testid=\"landing-cta-start\" className=\"duo-btn duo-btn--math duo-btn--xl\">
            <Sparkles size={18} strokeWidth={3} /> Start learning free
          </Link>
          <Link to=\"/login\" data-testid=\"landing-cta-login\" className=\"duo-btn duo-btn--ghost duo-btn--xl\">
            I already have an account
          </Link>
        </div>

        <div className=\"landing__feature-row\">
          <div className=\"feature-card\">
            <Flame size={28} strokeWidth={3} style={{ color: \"var(--streak-base)\" }} className=\"flame-anim\" />
            <div className=\"feature-card__title\">Daily streaks</div>
            <div className=\"feature-card__sub\">Show up every day. Watch your fire grow.</div>
          </div>
          <div className=\"feature-card\">
            <Coins size={28} strokeWidth={3} style={{ color: \"var(--mp-base)\" }} />
            <div className=\"feature-card__title\">MP (Math Points)</div>
            <div className=\"feature-card__sub\">Earn MP for every correct answer. Climb the ranks.</div>
          </div>
          <div className=\"feature-card\">
            <Trophy size={28} strokeWidth={3} style={{ color: \"var(--coding-base)\" }} />
            <div className=\"feature-card__title\">Leaderboards</div>
            <div className=\"feature-card__sub\">Race friends to the top each week.</div>
          </div>
          <div className=\"feature-card\">
            <Crown size={28} strokeWidth={3} style={{ color: \"var(--astrophysics-base)\" }} />
            <div className=\"feature-card__title\">Premium</div>
            <div className=\"feature-card__sub\">Skip ads, unlimited hearts, $4.99/mo.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Landing.jsx
