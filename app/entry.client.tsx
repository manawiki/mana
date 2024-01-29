// https://github.com/remix-run/remix/issues/2813
import { Buffer } from "buffer";

import { startTransition, StrictMode } from "react";

import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import { initI18nextClient } from "./utils/i18n/i18next.client";

// https://github.com/remix-run/remix/issues/2813
globalThis.Buffer = Buffer;

async function hydrate() {
   startTransition(() => {
      hydrateRoot(
         document,
         <I18nextProvider i18n={i18next}>
            <StrictMode>
               <RemixBrowser />
            </StrictMode>
         </I18nextProvider>,
      );
   });
}

initI18nextClient(hydrate);
