import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: `/${process.env.VITE_NAME}/`,
  server: {
    https: {
      key: fs.readFileSync('/etc/ssl/private/privkey.pem'),
      cert: fs.readFileSync('/etc/ssl/certs/fullchain.pem'),
    },
    host: true,  // Allow access from external IPs
    port: 443,
  },
})
