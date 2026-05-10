import { useEffect } from 'react';
import { useLingui } from '@lingui/react';
import { useMatches } from '@tanstack/react-router';

/** Syncs `document.title` and `document.documentElement.lang` with the active route and locale. */
export const useDocumentHead = () => {
  const { i18n } = useLingui();
  const getTitle = useMatches({
    select: (matches) =>
      matches.findLast(({ staticData }) => staticData?.getTitle)?.staticData
        ?.getTitle,
  });

  useEffect(() => {
    document.documentElement.lang = i18n.locale;

    if (Object.keys(i18n.messages).length > 0) {
      const appTitle = i18n.t({ id: 'titles.app' });
      const pageTitle = getTitle?.(i18n);
      document.title = pageTitle ? `${appTitle} - ${pageTitle}` : appTitle;
    }
  }, [i18n, getTitle]);
};
