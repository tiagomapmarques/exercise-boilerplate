import type { Plugin } from 'vite';

const scriptRegex = /\s*<script\b[^>]*\bsrc\b[^>]*><\/script>/gu;
const stylesheetRegex = /\s*<link\b[^>]*\brel=["']stylesheet["'][^>]*\/?>/gu;

const stripBlockingTags = (html: string) => {
  const toEntry = (match: RegExpExecArray) => ({
    index: match.index,
    match: match[0],
  });

  const scripts = [...html.matchAll(scriptRegex)].map(toEntry);
  const stylesheets = [...html.matchAll(stylesheetRegex)].map(toEntry);

  const tags = [...scripts, ...stylesheets]
    .sort((left, right) => left.index - right.index)
    .map(({ match }) => match);

  const htmlStripped = html
    .replace(scriptRegex, '')
    .replace(stylesheetRegex, '');

  return { htmlStripped, tags };
};

/** Moves external scripts and stylesheets to the end of `<body>`, improving First Contentful Paint. */
export const deferRenderBlocking = (): Plugin => {
  return {
    name: 'defer-render-blocking',
    transformIndexHtml: {
      order: 'post',
      handler(html, { filename }) {
        if (!html.includes('</body>')) {
          // Integrates with Rollup's build output rather than writing to stdout directly
          this.warn(
            `defer-render-blocking: </body> not found, skipping for ${filename}`,
          );
          return html;
        }

        const { htmlStripped, tags } = stripBlockingTags(html);

        return htmlStripped.replace('</body>', `${tags.join('')}\n</body>`);
      },
    },
  };
};
