import type { PropsWithChildren } from 'react';

import { mockConsole, renderHook, screen } from '@/testing';

import { useGlobalThrobber } from './use-global-throbber';

describe(useGlobalThrobber, () => {
  const consoleError = mockConsole('error');

  it('logs an error with no div#global-throbber', () => {
    renderHook(useGlobalThrobber);

    expect(consoleError).toHaveBeenCalledWith(
      'Global throbber not available in the DOM.',
    );
  });

  describe('with div#global-throbber', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <>
        {/** biome-ignore lint/correctness/useUniqueElementIds: ID must match index.html */}
        <div
          id="global-throbber"
          data-slot="GlobalThrobber"
          className="active"
        />
        {children}
      </>
    );

    it('does not log errors', () => {
      renderHook(useGlobalThrobber, { wrapper });

      expect(consoleError).not.toHaveBeenCalled();
    });

    it('toggles active class', () => {
      const { unmount } = renderHook(useGlobalThrobber, { wrapper });

      const globalThrobber = screen.getByTestId('GlobalThrobber');

      expect(globalThrobber).toHaveAttribute('class', '');

      unmount();

      expect(globalThrobber).toHaveAttribute('class', 'active');
    });
  });
});
