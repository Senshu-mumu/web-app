"use client";

import { useState } from "react";
import { Button, Table, Box, Text, Flex } from "@chakra-ui/react";
import type { Task } from "@/lib/types";

type Props = {
  tasks: Task[];
  onAchieve: (id: number, achievement: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function TasksTable({ tasks, onAchieve, onDelete }: Props) {
  const [achievingId, setAchievingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleUnachieve = async (id: number) => {
    setAchievingId(id);
    try {
      await onAchieve(id, false);
    } finally {
      setAchievingId(null);
    }
  };

  const handleAchieve = async (id: number) => {
    setAchievingId(id);
    try {
      await onAchieve(id, true);
    } finally {
      setAchievingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (!tasks?.length) {
    return (
      <Box rounded="xl" border="1px solid" borderColor="gray.200" p={4}>
        <Text>タスクがありません。</Text>
      </Box>
    );
  }

  return (
    <Table.Root size="md" variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader width={"15%"}>タスク名</Table.ColumnHeader>
          <Table.ColumnHeader width={"8%"}>優先度</Table.ColumnHeader>
          <Table.ColumnHeader width={"10%"}>タグ</Table.ColumnHeader>
          <Table.ColumnHeader width={"15%"}>期限</Table.ColumnHeader>
          <Table.ColumnHeader width={"38%"}>詳細</Table.ColumnHeader>
          <Table.ColumnHeader width={"20%"}>操作</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tasks.map((t) => (
          <Table.Row key={t.id}>
            <Table.Cell>{t.task_name}</Table.Cell>
            <Table.Cell>{t.priority}</Table.Cell>
            <Table.Cell>{t.tag ?? "-"}</Table.Cell>
            <Table.Cell>{t.deadline ?? "-"}</Table.Cell>
            <Table.Cell>{t.detail_task ?? "-"}</Table.Cell>
            <Table.Cell>
              <Flex gap={2}>
                <Button
                  onClick={() => handleUnachieve(t.id)}
                  loading={achievingId === t.id}
                  disabled={!t.achievement}
                >
                  未達成
                </Button>

                <Button
                  onClick={() => handleDelete(t.id)}
                  loading={deletingId === t.id}
                >
                  削除
                </Button>
              </Flex>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
