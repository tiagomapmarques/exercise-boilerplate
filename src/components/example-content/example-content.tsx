import { Trans } from '@lingui/react';
import { Stack, Text } from '@mantine/core';

export const ExampleContent = () => {
  return (
    <Stack>
      <Text>
        <Trans id="pages.home.instructions" />
      </Text>
    </Stack>
  );
};
