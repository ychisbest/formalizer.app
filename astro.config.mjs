import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { DEFAULT_LOCALE_SETTING, LOCALES_SETTING } from './src/locales';

import tailwindcss from '@tailwindcss/vite';


import icon from 'astro-icon';


import react from '@astrojs/react';


// https://astro.build/config
export default defineConfig({
  // Set your site's URL
  site: 'https://formalizer.app',

  i18n: {
    defaultLocale: DEFAULT_LOCALE_SETTING,
    locales: Object.keys(LOCALES_SETTING),
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [mdx(), sitemap({
    i18n: {
      defaultLocale: DEFAULT_LOCALE_SETTING,
      locales: Object.fromEntries(
        Object.entries(LOCALES_SETTING).map(
          ([key, value]) => [key, value.lang ?? key]
        )
      ),
    },
  }), icon(), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});