import {
  Box,
  Code,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';

import classNames from './environment.module.css';

export const Environment = () => {
  const environment = Object.entries({ ...import.meta.env }).sort(
    ([left], [right]) => {
      const leftStarts = left.startsWith('VITE_');
      const rightStarts = right.startsWith('VITE_');
      if (leftStarts === rightStarts) {
        return 0;
      }
      return leftStarts ? -1 : 1;
    },
  );

  return (
    <Container fluid className={classNames.container}>
      <Title size="md" className={classNames.title}>
        Environment variables
      </Title>

      <Divider />

      <SimpleGrid spacing="md" className={classNames.grid}>
        {environment.map(([key, value]) => (
          <Box key={`Environment-${key}`}>
            <Group justify="space-between">
              <Text truncate size="sm">
                {key}
              </Text>

              <Code>{JSON.stringify(value)}</Code>
            </Group>

            <Divider mt="md" />
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};
