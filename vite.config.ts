import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/node_modules/@react-three/')) return 'three-react-vendor';
            if (id.includes('/node_modules/three/')) return 'three-core-vendor';
            if (id.includes('recharts')) return 'charts-vendor';
            if (id.includes('react-markdown') || id.includes('remark-math') || id.includes('rehype-katex') || id.includes('katex')) return 'markdown-vendor';
            if (id.includes('motion')) return 'motion-vendor';
            if (id.includes('gsap')) return 'animation-vendor';
            if (id.includes('@supabase')) return 'supabase-vendor';
            return undefined;
          },
        },
      },
      chunkSizeWarningLimit: 500,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
