import '@testing-library/react';
import '@mantine/core/styles.css';

import { act, configure } from '@testing-library/react';

import { userEvent } from '@/testing';

configure({
  testIdAttribute: 'data-slot',
});

// Wrap `userEvent.click` in an `act` due to inner state changes in the router
const userEventClick = userEvent.click;
userEvent.click = async (...args) => {
  await act(async () => {
    await userEventClick(...args);
  });
};

// Since `@tanstack/react-router` and `@mantine/core` are needed when creating
// the `@/testing` utilities and because some component tests require them to
// be mocked, these dependencies need to be mocked globally instead of locally
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...original,
    Outlet: vi.fn(() => <div data-slot="Outlet" />),
  };
});
vi.mock('@mantine/core', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/core')>();
  return {
    ...original,
    useMantineColorScheme: vi.fn(original.useMantineColorScheme),
  };
});

// Reset the document title after each test
const originalDocumentTitle = document.title;
afterEach(() => {
  document.title = originalDocumentTitle;
});
