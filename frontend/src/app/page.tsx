"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { fetchMe } from "@/lib/api";
import { FcGoogle } from "react-icons/fc";
const API_BASE = "https://api.mumusen-net.com";

export default function HomeLoginPage() {
  useEffect(() => {
    // ログイン済みなら /task へ
    (async () => {
      try {
        await fetchMe();
        window.location.href = "/task";
      } catch {
        // 未ログインならそのまま
      }
    })();
  }, []);

  const onGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google/login`;
  };

  return (
    <Box minH="100vh">
      {/* 背景 */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        bgGradient="linear(to-br, teal.50, cyan.50, purple.50)"
      />
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        opacity={0.35}
        bgImage="radial-gradient(circle at 20% 10%, rgba(0,0,0,0.10) 0, rgba(0,0,0,0) 45%), radial-gradient(circle at 80% 30%, rgba(0,0,0,0.10) 0, rgba(0,0,0,0) 40%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.10) 0, rgba(0,0,0,0) 45%)"
      />

      <Container position="relative" zIndex={1} maxW="container.lg" py={{ base: 10, md: 16 }}>
        {/* ヘッダー */}
        <Flex justify="space-between" align="center" mb={{ base: 10, md: 14 }}>
          <HStack gap={3}>
            <Box
              w="10"
              h="10"
              rounded="2xl"
              bg="white"
              borderWidth="1px"
              boxShadow="sm"
              display="grid"
              placeItems="center"
            >
              <Box w="5" h="5" rounded="md" bg="teal.400" />
            </Box>
            <Text fontWeight="bold" fontSize="lg">
              Todo Fusen
            </Text>
          </HStack>
        </Flex>

        {/* メイン */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 8, md: 10 }} alignItems="center">
          {/* 左：キャッチ */}
          <Stack gap={5}>
            <Stack gap={3}>
              <Heading size={{ base: "2xl", md: "3xl" }} lineHeight="1.15">
                付箋みたいに、
                <br />
                タスクを軽やかに。
              </Heading>
              <Text fontSize="lg" color="gray.400">
                優先度・期限・達成状況をまとめて管理。
                <br />
                カレンダー表示で「今日やること」がすぐ分かる。
              </Text>
            </Stack>

            <Box
              rounded="2xl"
              bg="gray.200"
              borderWidth="1px"
              boxShadow="md"
              p={5}
            >
              <Stack gap={3}>
                <Text fontSize="sm" color="gray.600">
                  このサービスは <b>Googleログインのみ</b>対応です。
                </Text>
                <Button
                  onClick={onGoogleLogin}
                  size="lg"
                  rounded="xl"
                  colorPalette="teal"
                  justifyContent="center"
                >
                  Googleでログインしてはじめる
                </Button>
                <Text fontSize="xs" color="black">
                  ログイン後、タスク画面へ移動します。
                </Text>
              </Stack>
            </Box>
          </Stack>

          {/* 右：機能カード */}
          <Stack gap={4} color="black">
            <FeatureCard
              title="付箋のような見た目で見やすく整理"
              description="タスク名がタイトルの付箋のような見た目で表示。優先度ごとに色分け。"
            />
            <FeatureCard
              title="期限をつければカレンダーに集約"
              description="1ヶ月カレンダーで、締切の見落としを減らす。"
            />
            <FeatureCard
              title="登録は簡単"
              description="自分のGoogleアカウントでログインするだけ。"
            />
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function FeatureCard(props: { title: string; description: string }) {
  return (
    <Box rounded="2xl" bg="gray.200" borderWidth="1px" boxShadow="sm" p={5}>
      <Stack gap={2}>
        <Text fontWeight="bold">{props.title}</Text>
        <Text color="gray.700">{props.description}</Text>
      </Stack>
    </Box>
  );
}
