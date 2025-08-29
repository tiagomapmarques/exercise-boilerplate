import { Trans } from '@lingui/react';
import { Stack, Title } from '@mantine/core';

import { About } from '@/components/about';

export const AboutContainer = () => {
  return (
    <Stack>
      <Title>
        <Trans id="pages.about.title" />
      </Title>

      <About />
    </Stack>
  );
};
