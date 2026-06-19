import { Trans } from '@lingui/react';
import { Stack, Text } from '@mantine/core';

import { license, name, version } from '@/build-info';

const versionLabel = `v${version}`;

export const About = () => {
  return (
    <Stack>
      <Text>{name}</Text>
      <Text>{versionLabel}</Text>
      <Text>
        <Trans id="pages.about.license" values={{ license }} />
      </Text>
    </Stack>
  );
};
