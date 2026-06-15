import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://michalfapso.github.io',
  base: '/movement-piestany-website',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  output: 'static',
});
