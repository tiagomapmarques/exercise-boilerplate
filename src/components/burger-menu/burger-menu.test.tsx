import { render, renderComponent, screen, userEvent } from '@/testing';

import { BurgerMenu } from './burger-menu';

describe(BurgerMenu, () => {
  it('displays a menu button', () => {
    render(<BurgerMenu opened={false} setOpened={undefined} />);

    expect(screen.getByRole('button', { name: 'Menu' })).toBeVisible();
  });

  it('displays the app title', () => {
    render(<BurgerMenu opened={false} setOpened={undefined} />);

    expect(screen.getByText('Exercise boilerplate')).toBeVisible();
  });

  it('displays custom content', () => {
    render(
      <BurgerMenu opened={false} setOpened={undefined}>
        <div data-slot="Content"></div>
      </BurgerMenu>,
    );

    expect(screen.queryByText('Exercise boilerplate')).not.toBeInTheDocument();
    expect(screen.getByTestId('Content')).not.toBeVisible();
  });

  describe('parent control', () => {
    it('reacts to opened prop change', () => {
      const { rerender } = renderComponent(BurgerMenu, {
        opened: false,
        setOpened: undefined,
      });

      expect(
        screen.getByRole('button', { name: 'Menu' }).firstChild,
      ).not.toHaveAttribute('data-opened');

      rerender({ opened: true, setOpened: undefined });

      expect(
        screen.getByRole('button', { name: 'Menu' }).firstChild,
      ).toHaveAttribute('data-opened', 'true');

      rerender({ opened: false, setOpened: undefined });

      expect(
        screen.getByRole('button', { name: 'Menu' }).firstChild,
      ).not.toHaveAttribute('data-opened');
    });

    it('toggles opened prop', async () => {
      const setOpened = vi.fn((fn) => fn(false));

      const { rerender } = renderComponent(BurgerMenu, {
        opened: false,
        setOpened,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

      expect(setOpened).toHaveBeenCalledTimes(1);
      expect(setOpened.mock.results[0].value).toBeTruthy();

      setOpened.mockImplementation((fn) => fn(true));
      rerender({ opened: true, setOpened });

      await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

      expect(setOpened).toHaveBeenCalledTimes(2);
      expect(setOpened.mock.results[1].value).toBeFalsy();
    });
  });
});
