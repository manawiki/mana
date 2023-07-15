import type { Session } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import { settings } from "mana-config";

export type ToastMessage = { message: string; type: "success" | "error" };

const sessionSecret = process.env.PAYLOADCMS_SECRET ?? "DEFAULT_SECRET";
const isDev = process.env.NODE_ENV == "development";

export const { commitSession, getSession } = createCookieSessionStorage({
   cookie: {
      name: "__message",
      secure: isDev ? false : true,
      path: "/",
      domain: isDev ? "localhost" : `.${settings.domain}`,
      secrets: [sessionSecret],
      httpOnly: isDev ? false : true,
      sameSite: isDev ? "lax" : "none",
   },
});

export function setSuccessMessage(session: Session, message: string) {
   session.flash("toastMessage", { message, type: "success" } as ToastMessage);
}

export function setErrorMessage(session: Session, message: string) {
   session.flash("toastMessage", { message, type: "error" } as ToastMessage);
}
