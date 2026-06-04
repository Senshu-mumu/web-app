"use client";

import { useRouter } from "next/navigation";

import {
    Box,
    Button,
    Heading,
    IconButton,
    Stack,
    Text,
    Avatar,
    HStack
} from "@chakra-ui/react";
import { Drawer } from "@chakra-ui/react";
import type { UserRead } from "@/lib/types";

type Props = {
    me: UserRead | null;
    onLogout: () => Promise<void>;
};

export default function UserMenuDrawer({ me, onLogout }: Props) {
    const router = useRouter();

    return (
        <Drawer.Root placement="end">
            <Drawer.Trigger asChild>
                <IconButton variant="outline" aria-label="ユーザーメニュー" size="md">
                    ☰
                </IconButton>
            </Drawer.Trigger>

            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content rounded="2xl">
                    <Drawer.Header>
                        <Heading size="md">ユーザー管理</Heading>
                    </Drawer.Header>

                    <Drawer.Body>
                        <Stack gap={4}>
                            <Box>
                                <HStack gap={3} mt={2} align="center">
                                    <Avatar.Root size="lg" shape="rounded">
                                        <Avatar.Image src={me?.picture ?? undefined}/>
                                        <Avatar.Fallback name={me?.full_name ?? "User"}/>
                                    </Avatar.Root>
                                    <Box>
                                        <Text fontWeight="bold">{me?.full_name ?? "User"}</Text>
                                        {me?.email && (
                                            <Text fontSize="sm" color="gray.600">
                                                {me.email}
                                            </Text>
                                        )}
                                    </Box>
                                </HStack>
                            </Box>

                            <Stack gap={2}>
                                <Button variant="outline" onClick={() => router.push("/settings/delete")}>
                                    アカウント削除
                                </Button>

                                <Button
                                    colorPalette="red"
                                    variant="outline"
                                    onClick={async () => {
                                        try {
                                            await onLogout(); // cookie削除
                                        } finally {
                                            window.location.href = "/"; // ★確実に遷移（リロード込み）
                                        }
                                    }}
                                >
                                    ログアウト
                                </Button>
                            </Stack>
                        </Stack>
                    </Drawer.Body>

                    <Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <Button variant="outline">閉じる</Button>
                        </Drawer.CloseTrigger>
                    </Drawer.Footer>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    );
}
