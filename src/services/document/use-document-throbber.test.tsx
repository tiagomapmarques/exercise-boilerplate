import type { PropsWithChildren } from 'react';

import { mockConsole, renderHook, screen } from '@/testing';

import { useDocumentThrobber } from './use-document-throbber';

describe(useDocumentThrobber, () => {
  const consoleError = mockConsole('error');

  it('logs an error with no div#document-throbber', () => {
    renderHook(useDocumentThrobber);

    expect(consoleError).toHaveBeenCalledWith(
      'Document throbber not available in the DOM.',
    );
  });

  describe('with div#document-throbber', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <>
        <div
          id="document-throbber"
          data-slot="DocumentThrobber"
          className="active"
        />
        {children}
      </>
    );

    it('does not log errors', () => {
      renderHook(useDocumentThrobber, { wrapper });

      expect(consoleError).not.toHaveBeenCalled();
    });

    it('toggles active class', () => {
      const { unmount } = renderHook(useDocumentThrobber, { wrapper });

      const documentThrobber = screen.getByTestId('DocumentThrobber');

      expect(documentThrobber).toHaveAttribute('class', '');

      unmount();

      expect(documentThrobber).toHaveAttribute('class', 'active');
    });
  });
});
