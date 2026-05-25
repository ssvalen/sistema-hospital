
export const authApi = {
  async login(username: string, password: string, signal?: AbortSignal) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login fallido");

    return res.json();
  },
};
