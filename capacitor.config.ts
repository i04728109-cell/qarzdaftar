import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uz.qarzdaftar.client",
  appName: "QarzDaftar",
  webDir: "public",
  server: {
    // The Android client uses the same live QarzDaftar account and backend as the website.
    url: "https://qarzdaftar-i04728109-cells-projects.vercel.app",
    cleartext: false
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
