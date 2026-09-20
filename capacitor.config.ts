import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.Monobloc.app",
  appName: "Monobloc",
  webDir: "public",
  server: {
    url: "http://192.168.1.215:3000",
    cleartext: true,
  },
};

export default config;