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

import classes from './environment.module.css';

export const Environment = () => {
  const environment = Object.entries({ ...import.meta.env }).toSorted(
    ([left], [right]) => {
      const isLeftVite = left.startsWith('VITE_');
      const isRightVite = right.startsWith('VITE_');
      if (isLeftVite === isRightVite) {
        return 0;
      }
      return isLeftVite ? -1 : 1;
    },
  );

  return (
    <Container fluid className={classes.Environment}>
      <Title size="md" className={classes.title}>
        Environment variables
      </Title>

      <Divider />

      <SimpleGrid spacing="md" className={classes.grid}>
        {environment.map(([key, value]) => (
          <Box key={`Environment-SimpleGrid-${key}`}>
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
