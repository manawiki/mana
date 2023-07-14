import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
   appId: "wiki.mana",
   appName: "Mana",
   server: {
      url: "https://mana.wiki/",
      // url: "http://localhost:3000/",
      // cleartext: true,
   },
   ios:{
      appendUserAgent:"isIOS",
   },
   android:{
      appendUserAgent:"isAndroid",
   },
   "plugins": {
      "SplashScreen": {
        "launchAutoHide": false
      }
    },
};

export default config;
