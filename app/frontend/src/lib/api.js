
Action: file_editor create /app/frontend/src/lib/api.js --file-text "import axios from \"axios\";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem(\"mq_token\");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const auth = {
  signup: (email, password, name) => api.post(\"/auth/signup\", { email, password, name }),
  login:  (email, password)        => api.post(\"/auth/login\", { email, password }),
  me:     ()                       => api.get(\"/me\"),
};

export const content = {
  courses: ()       => api.get(\"/courses\"),
  course:  (id)     => api.get(`/courses/${id}`),
  lesson:  (id)     => api.get(`/lessons/${id}`),
  complete: (lesson_id, correct_count, total_questions) =>
    api.post(\"/lessons/complete\", { lesson_id, correct_count, total_questions }),
  refillHearts: () => api.post(\"/hearts/refill\"),
};

export const leaderboardApi = {
  list: () => api.get(\"/leaderboard\"),
};

export const payments = {
  checkout: (origin_url) => api.post(\"/payments/checkout\", { origin_url }),
  status:   (sid)        => api.get(`/payments/status/${sid}`),
};
"
Observation: Create successful: /app/frontend/src/lib/api.js
