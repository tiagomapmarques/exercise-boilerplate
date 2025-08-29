import { Trans } from '@lingui/react';
import { Stack, Title } from '@mantine/core';

import { ExampleContent } from '@/components/example-content';

export const HomeContainer = () => {
  return (
    <Stack>
      <Title>
        <Trans id="pages.home.title" />
      </Title>

      <ExampleContent />
    </Stack>
  );
};
