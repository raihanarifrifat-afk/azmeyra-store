import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
          if (/node_modules\/react-router(-dom)?\//.test(id)) return 'vendor-router';
          if (/node_modules\/framer-motion\//.test(id)) return 'vendor-motion';
          if (/node_modules\/lucide-react\//.test(id)) return 'vendor-icons';
          if (/node_modules\/@supabase\//.test(id)) return 'vendor-supabase';
        }
      }
    }
  }
});
