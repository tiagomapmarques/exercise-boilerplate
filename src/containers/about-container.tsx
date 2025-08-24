import { Trans } from '@lingui/react';
import { Stack, Title } from '@mantine/core';

import { About } from '@/components/about';

export const AboutContainer = () => {
  return (
    <Stack gap="sm">
      <Title>
        <Trans id="about.title" />
      </Title>

      <About />
    </Stack>
  );
};
