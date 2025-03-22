import { Button, Stack, Text } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

export const NotFoundContainer = () => {
  const navigate = useNavigate();

  return (
    <Stack align="start">
      <Text>Oops… Something went wrong on our end</Text>

      <Button onClick={() => navigate({ to: '/' })}>Go to start</Button>
    </Stack>
  );
};
