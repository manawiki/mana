// https://github.com/remix-run/remix/issues/2813
import { Buffer } from "buffer";

import { startTransition, StrictMode } from "react";

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

// https://github.com/remix-run/remix/issues/2813
globalThis.Buffer = Buffer;

startTransition(() => {
   hydrateRoot(
      document,
      <StrictMode>
         <RemixBrowser />
      </StrictMode>,
   );
});
