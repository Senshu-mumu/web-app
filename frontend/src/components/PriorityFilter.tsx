"use client";

import { Stack, Heading, Text, Slider } from "@chakra-ui/react";

type Props = {
  value: number; // 1〜5
  onChange: (v: number) => void;
};

export default function PriorityFilter({ value, onChange }: Props) {
  return (
    <Stack gap={5} mb={4} width={"20%"} top={""}>
      <Heading size="md" >表示する優先度</Heading>

      <Text fontSize="sm">
        現在:{" "}
        {value === 1
          ? "低 以上"
          : value === 2
            ? "中 以上"
            : value === 3
              ? "高 以上"
              : value === 4
                ? "重要 以上"
                : "最重要のみ"}
      </Text>

      <Slider.Root
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={(details) => {
          const v = details.value[0] ?? 1;
          onChange(v);
        }}
        colorPalette="teal"
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </Stack>
  );
}
