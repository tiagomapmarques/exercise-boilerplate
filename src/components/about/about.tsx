import { Trans } from '@lingui/react';
import { Stack, Text } from '@mantine/core';

// biome-ignore lint/style/noRestrictedImports: Used for example purposes only
import { license, name, version } from '../../../package.json' with {
  type: 'json',
};

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
