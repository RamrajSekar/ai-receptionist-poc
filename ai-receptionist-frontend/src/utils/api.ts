export const API_BASE = import.meta.env.VITE_API_BASE_URL;


export const api = {
  get: async (path: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}${path}`,
       {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  post: async (path: string, body: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to post");
    return res.json();
  },

  put: async (path: string, body?: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error("Failed to put");
    return res.json();
  },

  delete: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    return res.json();
  },
};
