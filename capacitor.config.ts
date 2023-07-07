import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
   appId: "wiki.mana",
   appName: "mana",
   webDir: "public/build",
   bundledWebRuntime: false,
   server: {
      url: "https://mana.wiki/hq",
      cleartext: true,
   },
};

export default config;
