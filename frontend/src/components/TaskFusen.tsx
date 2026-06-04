"use client";

import { useEffect, useState } from "react";
import { Box, Text, SimpleGrid, Stack, Badge, Flex, Button, Heading } from "@chakra-ui/react";
import type { Task, Priority } from "@/lib/types";

type Props = {
  tasks: Task[];
  onAchieve: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case "最重要":
      return "red.400";
    case "重要":
      return "orange.400";
    case "高":
      return "yellow.400";
    case "中":
      return "green.400";
    case "低":
    default:
      return "blue.400";
  }
}

function TaskCard({
  task,
  onAchieve,
  onDelete,
}: {
  task: Task;
  onAchieve: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [achieving, setAchieving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const bg = getPriorityColor(task.priority);

  const handleAchieve = async () => {
    setAchieving(true);
    try {
      await onAchieve(task.id);
    } finally {
      setAchieving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box
      bg={bg}
      p={4}
      rounded="xl"
      boxShadow="md"
      border="1px solid rgba(0,0,0,0.08)"
    >
      <Stack gap={2}>
        <Flex justify="space-between" align="center">
          <Badge>重要度:{task.priority ?? ""}</Badge>
          {task.tag && <Badge>{task.tag}</Badge>}
        </Flex>

        <Stack fontSize="sm">
          <Text color="black">{task.task_name}</Text>
          {task.tag && <Text color="black">タグ: {task.tag}</Text>}
          <Text color="black">期限: {task.deadline ?? "なし"}</Text>
        </Stack>

        {task.detail_task && (
          <Text color="black" fontSize="sm">
            {task.detail_task}
          </Text>
        )}

        <Flex gap={2}>
          <Button width={"50%"} onClick={handleAchieve} loading={achieving} loadingText="更新中...">
            <Text color="black">達成</Text>
          </Button>

          <Button width={"50%"} onClick={handleDelete} loading={deleting} loadingText="削除中...">
            <Text color="black">削除</Text>
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}

export default function TasksFusen({ tasks, onAchieve, onDelete }: Props) {
  const [items, setItems] = useState<Task[]>(tasks);

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  if (!items?.length) return <Text>タスクがありません。</Text>;

  return (
    <Box>
      <Heading size="md">タスク一覧</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {items.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAchieve={onAchieve}
            onDelete={onDelete}
          />
        ))}
      </SimpleGrid>

    </Box>

  );
}
