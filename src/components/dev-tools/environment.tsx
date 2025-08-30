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
    <Container fluid>
      <Title size="md" style={{ paddingBlock: '1rem' }}>
        Environment variables
      </Title>

      <Divider />

      <SimpleGrid
        spacing="lg"
        cols={{ base: 1, md: 2, lg: 3 }}
        style={{ paddingTop: '1rem' }}
      >
        {environment.map(([key, value]) => (
          <Box key={`Environment-${key}`}>
            <Group
              justify="space-between"
              wrap="nowrap"
              style={{ paddingBottom: '1rem' }}
            >
              <Text truncate size="sm" style={{ fontStretch: 'condensed' }}>
                {key} <Code>[{typeof value}]</Code>
              </Text>

              <Code>{JSON.stringify(value)}</Code>
            </Group>

            <Divider />
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};
