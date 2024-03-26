import { resolve } from "node:path";

import type { EntryContext } from "@remix-run/node";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { initReactI18next } from "react-i18next";
import { RemixI18Next } from "remix-i18next/server";

import { config } from "./config"; // your i18n configuration file

export const i18nextServer = new RemixI18Next({
   detection: {
      supportedLanguages: config.supportedLngs,
      fallbackLanguage: config.fallbackLng,
   },
   // This is the configuration for i18next used
   // when translating messages server-side only
   i18next: {
      ...config,
      backend: {
         loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
   },
   // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
   // E.g. The Backend plugin for loading translations from the file system
   // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
   plugins: [Backend],
});

export async function createI18nextServerInstance(
   request: Request,
   remixContext: EntryContext,
) {
   // Create a new instance of i18next so every request will have a
   // completely unique instance and not share any state
   const instance = createInstance();
   let lng = await i18nextServer.getLocale(request);
   let ns = i18nextServer.getRouteNamespaces(remixContext);

   await instance
      .use(initReactI18next) // Tell our instance to use react-i18next
      .use(Backend) // Setup our backend
      .init({
         ...config, // spread the configuration
         lng, // detect locale from the request
         ns, // detect what namespaces the routes about to render want to use
         backend: {
            loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
         },
      });

   return instance;
}
