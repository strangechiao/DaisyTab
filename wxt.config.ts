import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: '+简 Tabs',
    description: '+简 Tabs new tab extension',
    icons: {
      16: 'logo.svg',
      32: 'logo.svg',
      48: 'logo.svg',
      96: 'logo.svg',
      128: 'logo.svg',
    },
  },
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
