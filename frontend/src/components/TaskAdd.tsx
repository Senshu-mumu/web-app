"use client";

import { useMemo, useState } from "react";
import {
  Field,
  HStack,
  Stack,
  Input,
  NativeSelect,
  Textarea,
  Button,
  Dialog,
  Box,
  Text,
} from "@chakra-ui/react";

import type { TaskCreate, Priority } from "@/lib/types";

type Props = {
  onCreate: (payload: TaskCreate) => Promise<void>;
};

const initialForm: TaskCreate = {
  task_name: "",
  tag: "",
  detail_task: "",
  priority: "中",
  deadline: "",
  achievement: false,
};

export default function TaskAdd({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<TaskCreate>(initialForm);

  const canSubmit = useMemo(() => !!form.task_name?.trim(), [form.task_name]);

  const closeAndReset = () => {
    setOpen(false);
    setErr(null);
    setForm(initialForm);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!form.task_name.trim()) {
      setErr("タスク名は必須です");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({ ...form, deadline: form.deadline || null });
      closeAndReset();
    } catch (e: any) {
      setErr(e?.message ?? "追加に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(!!e.open)}>
      {/* ここが「タスク追加」ボタン */}
      <Dialog.Trigger asChild>
        <Button colorPalette="teal" mb={4}>
          タスク追加
        </Button>
      </Dialog.Trigger>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded="2xl">
          <Dialog.Header>
            <Dialog.Title>タスク追加</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <form onSubmit={onSubmit} id="task-add-form">
              <Stack gap={4}>
                {err && (
                  <Box borderWidth="1px" borderColor="red.200" rounded="xl" p={3}>
                    <Text color="red.600">{err}</Text>
                  </Box>
                )}

                <HStack gap={3} align="end" flexWrap="wrap">
                  <Field.Root flex="1" minW="220px">
                    <Field.Label>タスク名</Field.Label>
                    <Input
                      value={form.task_name}
                      onChange={(e) => setForm((s) => ({ ...s, task_name: e.target.value }))}
                      placeholder="例：レポート提出"
                    />
                  </Field.Root>

                  <Field.Root flex="1" minW="180px">
                    <Field.Label>タグ</Field.Label>
                    <Input
                      value={form.tag ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, tag: e.target.value }))}
                      placeholder="例：PBL"
                    />
                  </Field.Root>

                  <Field.Root minW="160px">
                    <Field.Label>期限</Field.Label>
                    <Input
                      type="date"
                      value={form.deadline ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, deadline: e.target.value }))}
                    />
                  </Field.Root>

                  <Field.Root minW="140px">
                    <Field.Label>優先度</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={form.priority}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, priority: e.target.value as Priority }))
                        }
                      >
                        <option value="最重要">最重要</option>
                        <option value="重要">重要</option>
                        <option value="高">高</option>
                        <option value="中">中</option>
                        <option value="低">低</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                </HStack>

                <Field.Root>
                  <Field.Label>詳細</Field.Label>
                  <Textarea
                    value={form.detail_task ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, detail_task: e.target.value }))}
                    rows={4}
                    placeholder="補足があれば入力"
                  />
                </Field.Root>
              </Stack>
            </form>
          </Dialog.Body>

          <Dialog.Footer>
            <HStack gap={2}>
              <Button variant="outline" onClick={closeAndReset} disabled={submitting}>
                キャンセル
              </Button>

              <Button
                colorPalette="teal"
                type="submit"
                form="task-add-form"
                loading={submitting}
                loadingText="追加中..."
                disabled={!canSubmit || submitting}
              >
                追加する
              </Button>
            </HStack>
          </Dialog.Footer>

          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}