import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  staticData: {
    getTitle: (i18n) => i18n.t({ id: 'pages.home.title' }),
  },
});
