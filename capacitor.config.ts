import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
   appId: "wiki.mana",
   appName: "Mana",
   server: {
      url: "https://mana.wiki/hq",
      // url: "http://localhost:3000/starrail",
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
