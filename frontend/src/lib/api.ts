import type { Task, TaskCreate, UserRead } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

// --- 共通fetch（cookie前提） ---
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  // bodyがあるときだけ JSON を付けたいなら、呼び出し側で付けてもOK
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include", // ★ cookie(JWT)送る
  });

  // 204対応
  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

// --- ログアウト（サーバーcookieも消す） ---
/*
export async function logoutServer(): Promise<void> {
  // FastAPI側は POST /auth/logout
  await api<void>("/auth/logout", { method: "POST" });
}
*/
export const logoutServer = () =>
  api<void>("/auth/logout/", { method: "POST" }); // ← /auth/ なのでAPIに行く

// --- UI側ログアウト（画面遷移） ---
export function logoutUI() {
  window.location.href = "/";
}

// ---- Users ----
export const fetchMe = () => api<UserRead>("/users/me");

// OAuthのみ版では password を受け取らない想定（バックエンドもそう直してある）
export const deleteMe = () =>
  api<void>("/users/me", {
    method: "DELETE",
  });

// ---- Tasks ----
export const fetchTasks = () => api<Task[]>("/tasks");

export const createTask = (payload: TaskCreate) =>
  api<Task>("/tasks", { method: "POST", body: JSON.stringify(payload) });

export const deleteTask = (id: number) =>
  api<void>(`/tasks/${id}`, { method: "DELETE" });

export const setTaskAchievement = (id: number, achievement: boolean) =>
  api<void>(`/tasks/${id}/achievement`, {
    method: "PATCH",
    body: JSON.stringify({ achievement }),
  });
