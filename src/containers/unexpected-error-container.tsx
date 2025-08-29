import { Trans } from '@lingui/react';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useRouter } from '@tanstack/react-router';

export const UnexpectedErrorContainer = () => {
  const router = useRouter();

  return (
    <Stack align="start">
      <Title>
        <Trans id="pages.unexpected-error.title" />
      </Title>

      <Text>
        <Trans id="pages.unexpected-error.content" />
      </Text>

      <Button onClick={() => router.history.back()}>
        <Trans id="actions.go-back" />
      </Button>
    </Stack>
  );
};
