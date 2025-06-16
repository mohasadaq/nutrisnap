
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.nutrisnap',
  appName: 'nutrisnap',
  webDir: 'public', // Changed from 'out'
  server: {
    // For local development, ensure your Next.js dev server is running (npm run dev)
    // and accessible from your Android device/emulator.
    // You might need to use your computer's local network IP instead of 'localhost'.
    // Example: url: 'http://192.168.1.100:3000'
    url: 'http://localhost:3000',
    cleartext: true, // Allows HTTP traffic for local development on Android
    // For production, replace 'http://localhost:3000' 
    // with the URL of your deployed Next.js application.
    // Example: url: 'https://your-nutrisnap-app.com'
    // You might also set cleartext to false for production HTTPS.
  }
};

export default config;
