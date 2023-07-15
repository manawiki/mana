import type { CapacitorConfig } from "@capacitor/cli";
import { settings } from "mana-config";

const config: CapacitorConfig = {
   appId: "wiki.mana",
   appName: "Mana",
   server: {
      url: settings.domainFull,
      // url: "http://localhost:3000/",
      // cleartext: true,
   },
   ios: {
      appendUserAgent: "isIOS",
   },
   android: {
      appendUserAgent: "isAndroid",
   },
   plugins: {
      SplashScreen: {
         launchAutoHide: false,
      },
   },
};

export default config;
