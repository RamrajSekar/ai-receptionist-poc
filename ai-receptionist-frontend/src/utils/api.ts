export const API_BASE = "";

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },

  post: async (path: string, body: any) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to post");
    return res.json();
  },

  put: async (path: string, body?: any) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
