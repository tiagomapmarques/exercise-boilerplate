// biome-ignore lint/style/noDefaultExport: Required by postcss-load-config
export default {
  plugins: {
    'postcss-preset-mantine': {
      autoRem: true, // Auto-converts px to rem, required for Mantine's responsive spacing
      mixins: {
        // Mantine only ships `larger-than` for media queries
        'container-larger-than': (_: unknown, breakpoint: string) => ({
          [`@container (min-width: ${breakpoint})`]: { '@mixin-content': {} },
        }),
      },
    },
    // Resolves the breakpoint names the mixins take. Neither a media query nor
    // a container query can read a custom property, so these are a copy of
    // Mantine's default `theme.breakpoints` and have to change whenever the
    // `AppShell` theme overrides them. They use `rem` rather than Mantine's
    // `em`, since `em` in a container query follows the container's font size.
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36rem',
        'mantine-breakpoint-sm': '48rem',
        'mantine-breakpoint-md': '62rem',
        'mantine-breakpoint-lg': '75rem',
        'mantine-breakpoint-xl': '88rem',
      },
    },
  },
};
