import { PassThrough } from "stream";

import {
   createReadableStreamFromReadable,
   type EntryContext,
} from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

import { IsBotProvider } from "~/utils/isBotProvider";

const ABORT_DELAY = 10000;

export default async function handleRequest(
   request: Request,
   responseStatusCode: number,
   responseHeaders: Headers,
   remixContext: EntryContext,
) {
   const callbackName = isbot(request?.headers?.get("user-agent") ?? "")
      ? "onAllReady"
      : "onShellReady";

   return new Promise(async (resolve, reject) => {
      const { pipe, abort } = renderToPipeableStream(
         <IsBotProvider isBot={isbot(request.headers.get("User-Agent") ?? "")}>
            <RemixServer context={remixContext} url={request.url} />
         </IsBotProvider>,
         {
            [callbackName]: () => {
               const body = new PassThrough();

               responseHeaders.set("Content-Type", "text/html");

               resolve(
                  new Response(createReadableStreamFromReadable(body), {
                     headers: responseHeaders,
                     status: responseStatusCode,
                  }),
               );

               pipe(body);
            },
            onShellError(error: unknown) {
               reject(error);
            },
            onError(error: unknown) {
               responseStatusCode = 500;
               console.error(error);
            },
         },
      );

      setTimeout(abort, ABORT_DELAY);
   });
}
