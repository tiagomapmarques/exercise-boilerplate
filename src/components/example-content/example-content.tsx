import { Trans } from '@lingui/react';
import { Box, Text } from '@mantine/core';

export const ExampleContent = () => {
  return (
    <Box>
      <Text>
        <Trans id="home.instructions" />
      </Text>
    </Box>
  );
};
