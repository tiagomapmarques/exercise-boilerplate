import { useEffect } from 'react';

/** Hides the document throbber on mount and shows it on unmount. */
export const useDocumentThrobber = () => {
  useEffect(() => {
    const documentThrobber = document.querySelector('#document-throbber');

    if (!documentThrobber) {
      // biome-ignore lint/suspicious/noConsole: Useful error at runtime
      console.error('Document throbber not available in the DOM.');
    }

    documentThrobber?.classList.remove('active');

    return () => {
      documentThrobber?.classList.add('active');
    };
  }, []);
};
