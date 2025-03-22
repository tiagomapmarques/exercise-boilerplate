import { Stack, Title } from '@mantine/core';

import { ExampleContent } from '@/components/example-content';

export const HomeContainer = () => {
  return (
    <Stack gap="sm">
      <Title>Home</Title>

      <ExampleContent />
    </Stack>
  );
};
