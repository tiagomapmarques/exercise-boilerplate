import { Stack, Title } from '@mantine/core';

import { About } from '@/components/about';

export const AboutContainer = () => {
  return (
    <Stack gap="sm">
      <Title>About</Title>

      <About />
    </Stack>
  );
};
