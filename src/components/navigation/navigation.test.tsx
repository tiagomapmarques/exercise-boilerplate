import { renderApp, screen, userEvent } from '@/testing';

import { Navigation } from './navigation';

vi.mock('@mantine/core', async (importOriginal) => {
  const original = await importOriginal<typeof import('@mantine/core')>();
  return {
    ...original,
    useMantineColorScheme: vi.fn(original.useMantineColorScheme),
  };
});

describe(Navigation, () => {
  test('displays links', () => {
    renderApp(<Navigation />, {
      providers: { router: true },
    });

    expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('navigates to home page', async () => {
    renderApp(<Navigation />, {
      providers: { router: true },
    });

    expect(location.pathname).not.toBe('/');

    await userEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(location.pathname).toBe('/');
  });

  test('navigates to about page', async () => {
    renderApp(<Navigation />, {
      providers: { router: true },
    });

    expect(location.pathname).not.toBe('/about');

    await userEvent.click(screen.getByRole('link', { name: 'About' }));

    expect(location.pathname).toBe('/about');
  });
});
