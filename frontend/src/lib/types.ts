export type Priority = "低" | "中" | "高" | "重要" | "最重要";

export const PRIORITY_ORDER: Record<Priority, number> = {
  "低": 1,
  "中": 2,
  "高": 3,
  "重要": 4,
  "最重要": 5,
};

export type Task = {
  id: number;
  task_name: string;
  tag?: string | null;
  detail_task?: string | null;
  priority: Priority;
  deadline?: string | null;     // FastAPI date → string
  achievement: boolean;
};

export type TaskCreate = Omit<Task, "id">;

export type UserRead = {
  id: number;
  email?: string | null;
  full_name?: string | null;
  picture?: string | null;   // ★追加
  is_active: boolean;
  created_at: string;
};

export type Token = {
  access_token: string;
  token_type: "bearer";
};
