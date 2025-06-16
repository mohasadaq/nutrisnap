
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.nutrisnap',
  appName: 'nutrisnap',
  // webDir is ignored if server.url is set and the app is configured to load from a live URL.
  // It's typically 'out' for static exports or a directory with static assets.
  // For loading a live Next.js app, 'public' can be a placeholder but isn't strictly used by Capacitor for content.
  webDir: 'public', 
  server: {
    // This URL tells Capacitor to load the web content from your Next.js server.
    // For local development:
    // 1. Ensure your Next.js dev server is running (e.g., `npm run dev`).
    // 2. Replace 'localhost' with your computer's local network IP address if your
    //    Android device/emulator cannot access 'localhost' directly.
    //    Example: 'http://192.168.1.100:3000'
    //
    // For a production mobile app:
    // 1. Deploy your Next.js application to a hosting service (e.g., Vercel, Firebase App Hosting).
    // 2. Replace this URL with the public URL of your deployed Next.js application.
    //    Example: 'https://your-nutrisnap-app.vercel.app'
    url: 'http://localhost:3000',
    // Allows HTTP traffic for local development on Android.
    // For production deployments using HTTPS, you might set this to false or remove it.
    cleartext: true, 
  }
};

export default config;
