const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_URL = `${BASE_URL}/api/auth`;

// the error handler responds with { error, errors? }, not { message }
const errorMessage = (data, fallback) =>
  data.errors?.map((e) => e.message).join(" ") || data.error || fallback;

export async function register(username, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(errorMessage(data, "Registration failed"));
  }

  return data;
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(errorMessage(data, "Login failed"));
  }

  return data.data.token;
}

export async function getMe(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(errorMessage(data, "Authentication failed"));
  }

  return data.data;
}