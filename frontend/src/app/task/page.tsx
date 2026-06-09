"use client";

import { useEffect, useState } from "react";
import { Container, Heading, Text, Flex } from "@chakra-ui/react";

import PriorityFilter from "@/components/PriorityFilter";
import TasksTable from "@/components/TasksTable";
import TasksFusen from "@/components/TaskFusen";
import TaskAdd from "@/components/TaskAdd";
import TaskCalendarMonth from "@/components/TaskCalenderMonth";
import TopBarDemo from "@/components/Topbar";
import UserMenuDrawer from "@/components/UserMenuDrawer";

import { PRIORITY_ORDER, type Task, type TaskCreate, type UserRead } from "@/lib/types";
import {
  fetchTasks,
  createTask,
  deleteTask,
  setTaskAchievement,
  fetchMe,
  logoutServer,
} from "@/lib/api";

export default function Page() {
  const [me, setMe] = useState<UserRead | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [priorityLevel, setPriorityLevel] = useState(1);

  const reload = async () => {
    setTasks(await fetchTasks());
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const user = await fetchMe(); // 401なら例外
        setMe(user);
        await reload();
      } catch {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const onSetAchievement = async (id: number, achievement: boolean) => {
    await setTaskAchievement(id, achievement);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, achievement } : t)));
  };

  const onCreate = async (payload: TaskCreate) => {
    await createTask(payload);
    await reload();
  };

  const achievedTasks = tasks.filter((t) => t.achievement === true);
  const notAchievedTasks = tasks.filter(
    (t) => t.achievement === false && PRIORITY_ORDER[t.priority] >= priorityLevel
  );

  const onLogout = async () => {
    try {
      await logoutServer(); // cookie削除
    } finally {
      // 画面遷移は Drawer 側で / に飛ばす
    }
  };

  const handleLogout = async () => {
  	await logoutServer();
  };

  return (
    <Container maxW="container.lg" py={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">タスク追加</Heading>

        {/* 右上：ユーザー操作をドロワーに集約 */}
        <UserMenuDrawer me={me} onLogout={handleLogout} />
      </Flex>

      {loading && <Text>読み込み中...</Text>}

      <TaskAdd onCreate={onCreate} />

      <TaskCalendarMonth tasks={notAchievedTasks} />

      <PriorityFilter value={priorityLevel} onChange={setPriorityLevel} />

      <TasksFusen
        tasks={notAchievedTasks}
        onAchieve={(id) => onSetAchievement(id, true)}
        onDelete={onDelete}
      />

      <Text mt={6} mb={2}>
        達成済みタスク
      </Text>

      <TasksTable tasks={achievedTasks} onAchieve={onSetAchievement} onDelete={onDelete} />
    </Container>
  );
}
