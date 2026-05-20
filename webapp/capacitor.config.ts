import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ai.charmcoach.app",
  appName: "Charm",
  webDir: "dist",
  server: {
    url: "https://qmljqmmksnby.dev.vibecode.run",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#000000",
  },
};

export default config;
