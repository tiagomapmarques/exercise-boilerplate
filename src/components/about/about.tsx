import { Trans } from '@lingui/react';
import { Text } from '@mantine/core';

import { license, name, version } from '../../../package.json';

export const About = () => {
  return (
    <>
      <Text>{name}</Text>
      <Text>v{version}</Text>
      <Text>
        <Trans id="boilerplate.about.license" values={{ license }} />
      </Text>
    </>
  );
};
