// Shared account store for the website and the course app (the course platform's database, behind its API).
// Switched on with USER_STORE=worker (+ COURSE_INTERNAL_TOKEN). With the switch off the site keeps using Notion,
// so flipping the variable back is the whole rollback.

const API_BASE = (process.env.COURSE_API_BASE || "https://api.mostafayasser.com").replace(/\/$/, "");
const TOKEN = process.env.COURSE_INTERNAL_TOKEN;
const TIMEOUT_MS = 8000;

export const accountsApiEnabled = () => process.env.USER_STORE === "worker" && !!TOKEN;

export class AccountsError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

async function call(path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE}/internal/users/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new AccountsError("unreachable", 0);
  }
  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new AccountsError(data.error || "failed", res.status);
  return data;
}

// -> { id, email, name, phone, status, passwordHash, createdAt } or null
export async function findAccount(email) {
  return (await call("find", { email })).user;
}

// -> { created, claimed, user }. Throws AccountsError("exists_with_password") / ("blocked").
export function createAccount({ email, name, phone, passwordHash, source }) {
  return call("create", { email, name, phone, passwordHash, source });
}

export function updateAccount(email, fields) {
  return call("update", { email, ...fields });
}

// Throws AccountsError("has_purchases") for people who bought a course.
export function deleteAccount(email) {
  return call("delete", { email });
}
