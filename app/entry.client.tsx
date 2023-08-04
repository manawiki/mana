import { startTransition, StrictMode } from "react";

import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import { initI18nextClient } from "./utils/i18n/i18next.client";

const callback = () =>
   startTransition(() => {
      hydrateRoot(
         document,
         <I18nextProvider i18n={i18next}>
            <StrictMode>
               <RemixBrowser />
            </StrictMode>
         </I18nextProvider>
      );
   });

if (process.env.NODE_ENV === "development") {
   import("remix-development-tools").then(({ initClient }) => {
      // Add all the dev tools props here into the client
      initClient();

      //This works fine
      callback();
      // this loops
      // initI18nextClient(callback);
   });
} else {
   initI18nextClient(callback);
}

// async function hydrate() {
//    startTransition(() => {
//       hydrateRoot(
//          document,
//          <I18nextProvider i18n={i18next}>
//             <StrictMode>
//                <RemixBrowser />
//             </StrictMode>
//          </I18nextProvider>
//       );
//    });
// }

// initI18nextClient(hydrate);
