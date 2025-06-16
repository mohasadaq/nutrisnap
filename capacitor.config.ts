
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.nutrisnap',
  appName: 'nutrisnap',
  // When loading from a live server (for AI features to work), 
  // 'webDir' is less critical but often set to 'public' or a similar
  // directory that might contain static assets not served by Next.js.
  // Capacitor still needs a valid directory here for its build process.
  webDir: 'public', 
  server: {
    // For AI features to work in the mobile app, this URL MUST point to
    // your deployed Next.js application server (e.g., https://your-app.vercel.app).
    // For local development with a physical device or emulator on the same network,
    // use your computer's local IP address: e.g., 'http://192.168.1.100:3000'.
    // 'http://localhost:3000' works if running the Next.js dev server and an
    // Android emulator on the same machine.
    url: 'http://localhost:3000', 
    
    // Allows HTTP traffic for local development if 'url' is set to an HTTP address.
    // For production deployments using HTTPS, you might set this to false or remove it.
    cleartext: true, 
  }
};

export default config;
