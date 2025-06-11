import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [sveltekit()],
    resolve: {
      alias: {
        $lib: path.resolve('./src/lib')
      }
    },
    server: {
      fs: {
        allow: ['.']
      }
    },
    optimizeDeps: {
      exclude: ['better-sqlite3']
    },
    ssr: {
      noExternal: ['better-sqlite3']
    },
    define: {
      // Pass environment variables to the client side
      'process.env.DB_PATH': JSON.stringify(env.DB_PATH),
      'process.env.MPESA_CONSUMER_KEY': JSON.stringify(env.MPESA_CONSUMER_KEY),
      'process.env.MPESA_CONSUMER_SECRET': JSON.stringify(env.MPESA_CONSUMER_SECRET),
      'process.env.MPESA_PASSKEY': JSON.stringify(env.MPESA_PASSKEY),
      'process.env.MPESA_SHORTCODE': JSON.stringify(env.MPESA_SHORTCODE),
      'process.env.MPESA_CALLBACK_URL': JSON.stringify(env.MPESA_CALLBACK_URL)
    }
  };
}); 