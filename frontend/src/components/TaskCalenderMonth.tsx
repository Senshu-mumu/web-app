"use client";

import { useMemo, useState } from "react";
import { Box, Button, Flex, SimpleGrid, Stack, Text, Badge } from "@chakra-ui/react";
import type { Task, Priority } from "@/lib/types";

// TaskFusen.tsx と同じ優先度→色（colorPaletteに使う）
function getPriorityColor(priority: Priority) {
    switch (priority) {
        case "最重要":
            return "red";
        case "重要":
            return "orange";
        case "高":
            return "yellow";
        case "中":
            return "green";
        case "低":
        default:
            return "blue";
    }
}

// "YYYY-MM-DD" を Date に（ローカル時刻のズレ回避のため日付だけ扱う）
function parseYmdToLocalDate(ymd: string): Date {
    const [y, m, d] = ymd.split("-").map((x) => Number(x));
    return new Date(y, m - 1, d, 12, 0, 0); // 12:00固定で日付ズレを避ける
}

function ymdKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
}

function addMonths(date: Date, delta: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1, 12, 0, 0);
}

function daysInMonth(date: Date): number {
    const y = date.getFullYear();
    const m = date.getMonth();
    return new Date(y, m + 1, 0).getDate();
}

type Props = {
    tasks: Task[];
};

export default function TaskCalendarMonth({ tasks }: Props) {
    const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

    const monthLabel = `${cursor.getFullYear()}年${cursor.getMonth() + 1}月`;

    // deadline で日付ごとにタスクを束ねる
    const tasksByDay = useMemo(() => {
        const map = new Map<string, Task[]>();
        for (const t of tasks) {
            if (!t.deadline) continue;
            const key = t.deadline; // FastAPI date → "YYYY-MM-DD"
            const arr = map.get(key) ?? [];
            arr.push(t);
            map.set(key, arr);
        }
        return map;
    }, [tasks]);

    const gridCells = useMemo(() => {
        const first = startOfMonth(cursor);
        const total = daysInMonth(cursor);

        // 日曜始まり（Sun=0）でオフセット
        const offset = first.getDay();

        const cells: Array<{ date: Date | null; key: string }> = [];
        for (let i = 0; i < offset; i++) {
            cells.push({ date: null, key: `pad-${i}` });
        }
        for (let day = 1; day <= total; day++) {
            const d = new Date(cursor.getFullYear(), cursor.getMonth(), day, 12, 0, 0);
            cells.push({ date: d, key: ymdKey(d) });
        }

        // 6週固定にして見た目安定（42セル）
        while (cells.length < 42) {
            cells.push({ date: null, key: `tail-${cells.length}` });
        }

        return cells;
    }, [cursor]);

    const todayKey = ymdKey(new Date());

    return (
        <Box mt={8}>
            <Flex justify="space-between" align="center" mb={3}>
                <Text fontSize="lg" fontWeight="bold">
                    カレンダー（{monthLabel}）
                </Text>

                <Flex gap={2}>
                    <Button variant="outline" onClick={() => setCursor(addMonths(cursor, -1))}>
                        前の月
                    </Button>
                    <Button variant="outline" onClick={() => setCursor(startOfMonth(new Date()))}>
                        今月
                    </Button>
                    <Button variant="outline" onClick={() => setCursor(addMonths(cursor, 1))}>
                        次の月
                    </Button>
                </Flex>
            </Flex>

            {/* 曜日 */}
            <SimpleGrid columns={7} gap={2} mb={2}>
                {["日", "月", "火", "水", "木", "金", "土"].map((w) => (
                    <Text key={w} fontSize="sm" fontWeight="bold" textAlign="center">
                        {w}
                    </Text>
                ))}
            </SimpleGrid>

            {/* 日付グリッド */}
            <SimpleGrid columns={7} gap={2}>
                {gridCells.map(({ date, key }) => {
                    const isEmpty = date === null;
                    const dayKey = isEmpty ? "" : ymdKey(date!);
                    const dayTasks = isEmpty ? [] : (tasksByDay.get(dayKey) ?? []);
                    const isToday = !isEmpty && dayKey === todayKey;

                    return (
                        <Box
                            key={key}
                            minH="120px"
                            rounded="xl"
                            border="1px solid"
                            borderColor={isToday ? "teal.400" : "gray.200"}
                            p={2}
                            bg={isEmpty ? "black" : "white"}
                            opacity={isEmpty ? 0.6 : 1}
                        >
                            <Flex justify="space-between" align="center" mb={1}>
                                <Text fontSize="sm" fontWeight="bold" color="black">
                                    {isEmpty ? "" : `${date!.getMonth() + 1}/${date!.getDate()}`}
                                </Text>
                                {isToday && <Badge colorPalette="teal">Today</Badge>}
                            </Flex>

                            <Stack gap={1}>
                                {dayTasks.map((t) => (
                                    <Box
                                        key={t.id}
                                        rounded="md"
                                        px={2}
                                        py={1}
                                        border="1px solid rgba(0,0,0,0.08)"
                                        bg={`${getPriorityColor(t.priority)}.200`}
                                    >
                                        <Text
                                            fontSize="sm"
                                            color="black"
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {t.task_name}
                                        </Text>

                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    );
                })}
            </SimpleGrid>
        </Box>
    );
}
