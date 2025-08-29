import { Trans } from '@lingui/react';
import { Box, Text } from '@mantine/core';

export const ExampleContent = () => {
  return (
    <Box>
      <Text>
        <Trans id="pages.home.instructions" />
      </Text>
    </Box>
  );
};
