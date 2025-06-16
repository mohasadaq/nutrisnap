
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.nutrisnap',
  appName: 'nutrisnap',
  // webDir is set to 'out' for static exports.
  // This is used when building a Capacitor app from a static Next.js build.
  webDir: 'out', 
  server: {
    // If you deploy your Next.js app to a server (e.g., Vercel, Firebase App Hosting)
    // and want the Capacitor app to load content from that live URL (e.g., to enable Server Actions/AI features),
    // you would uncomment 'url' and set it to your deployed app's URL.
    // For a static build bundled with Capacitor, 'url' is typically not set or is ignored.
    // url: 'http://localhost:3000', // Example for local dev, or 'https://your-app.vercel.app' for production
    
    // Allows HTTP traffic for local development if 'url' is set to an HTTP address.
    // For production deployments using HTTPS, you might set this to false or remove it if 'url' is HTTPS.
    cleartext: true, 
  }
};

export default config;
