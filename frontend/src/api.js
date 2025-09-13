const BASE = process.env.REACT_APP_API || "http://localhost:5000/api";

export async function fetchJSON(url, opts) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const TransactionsAPI = {
  list: () => fetchJSON(`${BASE}/transactions`),
  get:  (id) => fetchJSON(`${BASE}/transactions/${id}`),
  create: (body) =>
    fetchJSON(`${BASE}/transactions`, { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    fetchJSON(`${BASE}/transactions/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id) =>
    fetchJSON(`${BASE}/transactions/${id}`, { method: "DELETE" })
};
