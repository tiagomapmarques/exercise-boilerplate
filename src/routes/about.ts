import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  staticData: {
    getTitle: (i18n) => i18n.t({ id: 'pages.about.title' }),
  },
});
