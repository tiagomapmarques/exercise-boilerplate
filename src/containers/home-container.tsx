import { Trans } from '@lingui/react';
import { Stack, Title } from '@mantine/core';

import { ExampleContent } from '@/components/example-content';

export const HomeContainer = () => {
  return (
    <Stack gap="sm">
      <Title>
        <Trans id="boilerplate.home.title" />
      </Title>

      <ExampleContent />
    </Stack>
  );
};
