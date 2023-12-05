/**
 * This file contains utilities for using client hints for user preference which
 * are needed by the server, but are only known by the browser.
 */
import * as React from "react";

import { getHintUtils } from "@epic-web/client-hints";
import {
   clientHint as colorSchemeHint,
   subscribeToSchemeChange,
} from "@epic-web/client-hints/color-scheme";
import { clientHint as timeZoneHint } from "@epic-web/client-hints/time-zone";
import { useRevalidator, useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { type loader as rootLoader } from "~/root";

const hintsUtils = getHintUtils({
   theme: colorSchemeHint,
   timeZone: timeZoneHint,
   // add other hints here
});

export const { getHints } = hintsUtils;

/**
 * @returns an object with the client hints and their values
 */
export function useHints() {
   const requestInfo = useRequestInfo();
   return requestInfo.hints;
}

/**
 * @returns inline script element that checks for client hints and sets cookies
 * if they are not set then reloads the page if any cookie was set to an
 * inaccurate value.
 */
export function ClientHintCheck({ nonce }: { nonce: string }) {
   const { revalidate } = useRevalidator();
   React.useEffect(
      () => subscribeToSchemeChange(() => revalidate()),
      [revalidate],
   );

   return (
      <script
         nonce={nonce}
         dangerouslySetInnerHTML={{
            __html: hintsUtils.getClientHintCheckScript(),
         }}
      />
   );
}

/**
 * @returns the request info from the root loader
 */
export function useRequestInfo() {
   const data = useRouteLoaderData<typeof rootLoader>("root");
   invariant(data?.requestInfo, "No requestInfo found in root loader");

   return data.requestInfo;
}
