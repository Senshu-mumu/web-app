"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { deleteMe, logoutServer } from "@/lib/api";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onDelete = async () => {
    setErr(null);
    setLoading(true);
    try {
      await deleteMe();          // ユーザー削除（タスクも削除）
      await logoutServer();      // ★ cookie削除（FastAPI）
      router.replace("/");
    } catch (e: any) {
      setErr(e?.message ?? "退会に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <Heading size="lg" mb={4}>
        退会（登録解除）
      </Heading>

      <Box borderWidth="1px" rounded="xl" p={4} mb={4}>
        <Stack gap={2}>
          <Text fontWeight="bold">注意</Text>
          <Text>・あなたのアカウント情報が削除されます。</Text>
          <Text>・あなたが作成したタスクもすべて削除されます。</Text>
          <Text>・この操作は取り消せません。</Text>
        </Stack>
      </Box>

      <Stack gap={4}>
        <Checkbox.Root
          checked={agreed}
          onCheckedChange={(e) => setAgreed(!!e.checked)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>
            上記の注意事項を理解し、アカウント削除に同意します
          </Checkbox.Label>
        </Checkbox.Root>

        {err && (
          <Box borderWidth="1px" borderColor="red.200" rounded="xl" p={3}>
            <Text color="red.600">{err}</Text>
          </Box>
        )}

        <Button
          colorPalette="red"
          onClick={onDelete}
          disabled={!agreed}
          loading={loading}
        >
          退会する（削除）
        </Button>

        <Button variant="outline" onClick={() => router.back()}>
          戻る
        </Button>
      </Stack>
    </Container>
  );
}
