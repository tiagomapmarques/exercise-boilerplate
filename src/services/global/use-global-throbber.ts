import { useEffect } from 'react';

/** Hides the global throbber on mount and shows it on unmount. */
export const useGlobalThrobber = () => {
  useEffect(() => {
    const globalThrobber = document.getElementById('global-throbber');

    if (!globalThrobber) {
      // biome-ignore lint/suspicious/noConsole: Useful error at runtime
      console.error('Global throbber not available in the DOM.');
    }

    globalThrobber?.classList.remove('active');

    return () => {
      globalThrobber?.classList.add('active');
    };
  }, []);
};
