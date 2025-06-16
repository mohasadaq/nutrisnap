import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.nutrisnap',
  appName: 'nutrisnap',
  webDir: 'out' // Changed from 'public' to 'out' for static export
};

export default config;
