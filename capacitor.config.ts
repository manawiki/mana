import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
   appId: "wiki.mana",
   appName: "mana",
   webDir: "public/build",
   bundledWebRuntime: false,
   server: {
      url: "http://localhost:3000",
      cleartext: true,
   },
};

export default config;
