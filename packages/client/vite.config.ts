import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import prismjs from 'vite-plugin-prismjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    prismjs({
      languages: 'all',
      plugins: ['line-numbers'],
      theme: 'coy',
      css: true,
    }),
  ],
});
