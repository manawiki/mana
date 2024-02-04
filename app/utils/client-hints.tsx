/**
 * This file contains utilities for using client hints for user preference which
 * are needed by the server, but are only known by the browser.
 */
import * as React from "react";

import { clientHint as colorSchemeHint } from "@epic-web/client-hints/color-scheme";
import { clientHint as timeZoneHint } from "@epic-web/client-hints/time-zone";
import { useFetchers, useRevalidator } from "@remix-run/react";

import type { Theme } from "./theme.server";
import { useRootLoaderData } from "./useSiteLoaderData";

const hintsUtils = getHintUtils({
   theme: colorSchemeHint,
   timeZone: timeZoneHint,
   // add other hints here
});

export const { getHints } = hintsUtils;

/**
 * @returns an object with the client hints and their values from the root loader
 */
export function useHints() {
   const data = useRootLoaderData();

   return data.requestInfo;
}

/**
 * @returns theme from client hints optimistically
 */
export function useTheme() {
   const hints = useHints();

   const fetchers = useFetchers();
   const themeFetcher = fetchers.find(
      (f) => f.formAction === "/action/theme-toggle",
   );

   return (
      (themeFetcher?.formData?.get("theme") as Theme) ?? hints.theme ?? "light"
   );
}

/**
 * @returns inline script element that checks for client hints and sets cookies
 * if they are not set then reloads the page if any cookie was set to an
 * inaccurate value.
 */
export function ClientHintCheck({ nonce }: { nonce?: string }) {
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
 * Subscribe to changes in the user's color scheme preference. Optionally pass
 * in a cookie name to use for the cookie that will be set if different from the
 * default.
 */
export function subscribeToSchemeChange(
   subscriber: (value: "dark" | "light") => void,
   cookieName: string = "CH-prefers-color-scheme",
) {
   const schemaMatch = window.matchMedia("(prefers-color-scheme: dark)");
   function handleThemeChange() {
      const value = schemaMatch.matches ? "dark" : "light";
      const domain = document.location.hostname.split(".").slice(-2).join(".");

      // don't set the domain if domain = fly.dev
      // this is to prevent infinite reloads due to supercookie public suffix list https://publicsuffix.org/
      // ideally, we should make sure this check is done for other dev environments as well
      document.cookie = `${cookieName}=${value}; Max-Age=31536000; Path=/; ${
         domain !== "fly.dev" ? `Domain=${domain}` : ""
      }`;
      subscriber(value);
   }
   schemaMatch.addEventListener("change", handleThemeChange);
   return function cleanupSchemaChange() {
      schemaMatch.removeEventListener("change", handleThemeChange);
   };
}

export function getHintUtils<Hints extends Record<string, ClientHint<any>>>(
   hints: Hints,
) {
   function getCookieValue(cookieString: string, name: string) {
      const hint = hints[name];
      if (!hint) {
         throw new Error(
            `Unknown client hint: ${
               typeof name === "string" ? name : "Unknown"
            }`,
         );
      }
      const value = cookieString
         .split(";")
         .map((c: string) => c.trim())
         .find((c: string) => c.startsWith(hint.cookieName + "="))
         ?.split("=")[1];

      return value ? decodeURIComponent(value) : null;
   }

   function getHints(request?: Request): ClientHintsValue<Hints> {
      const cookieString =
         typeof document !== "undefined"
            ? document.cookie
            : typeof request !== "undefined"
              ? request.headers.get("Cookie") ?? ""
              : "";

      return Object.entries(hints).reduce((acc, [name, hint]) => {
         const hintName = name;
         if ("transform" in hint) {
            // @ts-expect-error - this is fine (PRs welcome though)
            acc[hintName] = hint.transform(
               getCookieValue(cookieString, hintName) ?? hint.fallback,
            );
         } else {
            // @ts-expect-error - this is fine (PRs welcome though)
            acc[hintName] =
               getCookieValue(cookieString, hintName) ?? hint.fallback;
         }
         return acc;
      }, {} as ClientHintsValue<Hints>);
   }

   /**
    * This returns a string of JavaScript that can be used to check if the client
    * hints have changed and will reload the page if they have.
    */
   function getClientHintCheckScript() {
      return `
const domain = document.location.hostname.split(".").slice(-2).join(".");
const cookies = document.cookie.split(';').map(c => c.trim()).reduce((acc, cur) => {
	const [key, value] = cur.split('=');
	acc[key] = value;
	return acc;
}, {});
let cookieChanged = false;
const hints = [
${Object.values(hints)
   .map((hint) => {
      const cookieName = JSON.stringify(hint.cookieName);
      return `{ name: ${cookieName}, actual: String(${hint.getValueCode}), cookie: cookies[${cookieName}] }`;
   })
   .join(",\n")}
];
for (const hint of hints) {
	if (decodeURIComponent(hint.cookie) !== hint.actual) {
		cookieChanged = true;
		let newCookie = encodeURIComponent(hint.name) + '=' + encodeURIComponent(hint.actual) + '; Max-Age=31536000; path=/; Domain=';
      if( domain !== "fly.dev" ) { newCookie += domain; }
      document.cookie = newCookie;
	}
}
// if the cookie changed, reload the page, unless the browser doesn't support
// cookies (in which case we would enter an infinite loop of reloads)
if (cookieChanged && navigator.cookieEnabled) {
	window.location.reload();
}
			`;
   }

   return { getHints, getClientHintCheckScript };
}

export type ClientHint<Value> = {
   cookieName: string;
   getValueCode: string;
   fallback: Value;
   transform?: (value: string) => Value;
};

export type ClientHintsValue<ClientHintsRecord> = {
   [K in keyof ClientHintsRecord]: ClientHintsRecord[K] extends ClientHint<
      infer Value
   >
      ? ClientHintsRecord[K]["transform"] extends (value: string) => Value
         ? ReturnType<ClientHintsRecord[K]["transform"]>
         : ClientHintsRecord[K]["fallback"]
      : never;
};
