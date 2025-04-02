import { Trans } from '@lingui/react';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';

export const NotFoundContainer = () => {
  const navigate = useNavigate();

  return (
    <Stack align="start">
      <Title>
        <Trans id="boilerplate.not-found.title" />
      </Title>

      <Text>
        <Trans id="boilerplate.not-found.content" />
      </Text>

      <Button onClick={() => navigate({ to: '/' })}>
        <Trans id="boilerplate.actions.go-to-start" />
      </Button>
    </Stack>
  );
};
