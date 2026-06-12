import { Trans } from '@lingui/react';
import { Stack, Text } from '@mantine/core';

import { license, name, version } from '@/build-info';

export const About = () => {
  return (
    <Stack>
      <Text>{name}</Text>
      <Text>v{version}</Text>
      <Text>
        <Trans id="pages.about.license" values={{ license }} />
      </Text>
    </Stack>
  );
};
