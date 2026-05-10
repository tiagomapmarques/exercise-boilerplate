// biome-ignore lint/style/noDefaultExport: Required by postcss-load-config
export default {
  plugins: {
    'postcss-preset-mantine': {
      autoRem: true, // Auto-converts px to rem, required for Mantine's responsive spacing
    },
  },
};
