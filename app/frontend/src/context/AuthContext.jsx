
Action: file_editor create /app/frontend/src/context/AuthContext.jsx --file-text "import React, { createContext, useContext, useEffect, useState, useCallback } from \"react\";
import { auth } from \"../lib/api\";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const t = localStorage.getItem(\"mq_token\");
    if (!t) { setUser(null); setLoading(false); return; }
    try {
      const { data } = await auth.me();
      setUser(data);
    } catch {
      localStorage.removeItem(\"mq_token\");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    const { data } = await auth.login(email, password);
    localStorage.setItem(\"mq_token\", data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (email, password, name) => {
    const { data } = await auth.signup(email, password, name);
    localStorage.setItem(\"mq_token\", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(\"mq_token\");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
"
Observation: Create successful: /app/frontend/src/context/AuthContext.jsx
