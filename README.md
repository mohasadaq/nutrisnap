# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running on an Android Phone (with AI Features Enabled)

The simplest way to run this Next.js application with its AI features enabled on an Android phone is by accessing it through the phone's web browser. The application needs to be running on a server (either your local development server or a deployed hosting service).

### Option 1: Development & Local Network Testing

This method is suitable for quickly testing on an Android device that is on the same Wi-Fi network as your development computer.

1.  **Start the Next.js Development Server:**
    Open your project terminal and run:
    ```bash
    npm run dev
    ```
    This typically starts the server at `http://localhost:3000`.

2.  **Find Your Computer's Local IP Address:**
    *   **macOS:** Go to System Settings > Wi-Fi, click the "Details..." button for your connected network. Your IP address is listed there.
    *   **Windows:** Open Command Prompt and type `ipconfig`. Look for the "IPv4 Address" under your active network adapter (e.g., Wireless LAN adapter Wi-Fi).
    *   **Linux:** Open a terminal and type `hostname -I` or `ip addr show`.

    Your local IP address will look something like `192.168.1.105` or `10.0.0.5`.

3.  **Access the App on Your Android Phone:**
    *   Ensure your Android phone is connected to the same Wi-Fi network as your computer.
    *   Open a web browser (like Chrome) on your Android phone.
    *   In the address bar, type `http://<YOUR_COMPUTER_IP>:3000` (replace `<YOUR_COMPUTER_IP>` with the IP address you found in step 2). For example: `http://192.168.1.105:3000`.

    You should now see your Next.js application running in the browser, and the AI features should work by communicating with your local development server.

### Option 2: Production & Access from Anywhere

To make your application accessible from anywhere and shareable, you need to deploy it to a hosting service.

1.  **Deploy Your Next.js Application:**
    Choose a hosting platform that supports Node.js applications (which Next.js requires for its server-side features, including Server Actions for AI). Popular options include:
    *   [Vercel](https://vercel.com/) (highly recommended for Next.js)
    *   [Netlify](https://www.netlify.com/)
    *   Firebase App Hosting (ensure you configure it for a backend/SSR)
    *   AWS Amplify, Google Cloud Run, Azure App Service, etc.

2.  **Set Environment Variables:**
    During the deployment process on your chosen hosting platform, make sure to set the `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) environment variable with your actual Google AI API key. This is crucial for the AI features to work in the deployed version.

3.  **Access the Deployed App:**
    Once deployed, your hosting provider will give you a public URL (e.g., `https://your-app-name.vercel.app`).
    Open this URL in the web browser on your Android phone. The application and its AI features will be fully functional.

### Optional: Progressive Web App (PWA) for an App-Like Experience

For a more integrated, app-like experience from the browser, you can enhance your Next.js app to be a Progressive Web App (PWA). This involves adding a web manifest file and a service worker. PWAs can:
*   Be "Added to Home Screen" on Android, creating an app icon.
*   Launch in a standalone window without browser UI.
*   Offer some offline capabilities (though server-dependent AI features will still require an internet connection).

Setting up a PWA is an additional step beyond simple browser access.

---

The `capacitor.config.ts` file and the `android/` directory in this project are specifically for building a native Android application package using Capacitor. If you choose one of the browser-based methods described above, these Capacitor-specific parts are not directly used for that access method.
