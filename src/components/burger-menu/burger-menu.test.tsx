import { render, resizeViewport, screen, userEvent } from '@/testing';

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
        <div data-slot="Content">Mock content</div>
      </BurgerMenu>,
    );

    expect(screen.queryByText('Exercise boilerplate')).not.toBeInTheDocument();
    expect(screen.getByTestId('Content')).toBeVisible();
  });

  it('reflects the open state its parent passes', () => {
    const { rerender } = render(
      <BurgerMenu opened={false} setOpened={undefined} />,
    );

    expect(
      screen.getByRole('button', { name: 'Menu' }).firstElementChild,
    ).not.toHaveAttribute('data-opened');

    rerender(<BurgerMenu opened={true} setOpened={undefined} />);

    expect(
      screen.getByRole('button', { name: 'Menu' }).firstElementChild,
    ).toHaveAttribute('data-opened', 'true');

    rerender(<BurgerMenu opened={false} setOpened={undefined} />);

    expect(
      screen.getByRole('button', { name: 'Menu' }).firstElementChild,
    ).not.toHaveAttribute('data-opened');
  });

  it('tells assistive technology whether the menu is open', () => {
    const { rerender } = render(
      <BurgerMenu opened={false} setOpened={undefined} />,
    );

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    rerender(<BurgerMenu opened={true} setOpened={undefined} />);

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('asks its parent to open a closed menu and to close an open one', async () => {
    const setOpened = vi.fn((update) => update(false));

    const { rerender } = render(
      <BurgerMenu opened={false} setOpened={setOpened} />,
    );

    expect(setOpened).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

    expect(setOpened).toHaveBeenCalledExactlyOnceWith(expect.any(Function));
    expect(setOpened.mock.results[0].value).toBe(true);

    setOpened.mockImplementation((update) => update(true));
    rerender(<BurgerMenu opened={true} setOpened={setOpened} />);

    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

    expect(setOpened).toHaveBeenCalledTimes(2);
    expect(setOpened.mock.results[1].value).toBe(false);
  });

  describe('the viewport is sm or wider', () => {
    beforeEach(async () => {
      await resizeViewport('sm');
    });

    it('hides the menu button', () => {
      render(<BurgerMenu opened={false} setOpened={undefined} />);

      expect(screen.getByLabelText('Menu')).not.toBeVisible();
    });
  });
});
