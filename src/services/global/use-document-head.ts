import { useLayoutEffect } from 'react';
import type { MessageDescriptor } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { useMatches } from '@tanstack/react-router';

/** Syncs `document.title` and `document.documentElement.lang` with the active route and locale. */
export const useDocumentHead = (values?: MessageDescriptor['values']) => {
  const { i18n } = useLingui();
  const hasTranslations = Object.keys(i18n.messages).length > 0;

  const getTitle = useMatches({
    select: (matches) =>
      matches.findLast(({ staticData }) => staticData?.getTitle)?.staticData
        ?.getTitle,
  });

  const appTitle = i18n.t({ id: 'titles.app' });
  const pageTitle = getTitle?.(i18n, values);
  const documentTitle = pageTitle ? `${appTitle} - ${pageTitle}` : appTitle;

  useLayoutEffect(() => {
    if (document.documentElement.lang !== i18n.locale) {
      document.documentElement.lang = i18n.locale;
    }

    if (hasTranslations && document.title !== documentTitle) {
      document.title = documentTitle;
    }
  }, [i18n.locale, hasTranslations, documentTitle]);
};
