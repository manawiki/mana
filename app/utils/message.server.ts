import type { Session } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
export type ToastMessage = { message: string; type: "success" | "error" };

const sessionSecret = process.env.PAYLOADCMS_SECRET ?? "DEFAULT_SECRET";

export const { commitSession, getSession } = createCookieSessionStorage({
   cookie: {
      name: "__message",
      secure:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? false
            : true,
      path: "/",
      domain:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? "localhost"
            : ".mana.wiki",
      secrets: [sessionSecret],
      httpOnly:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? false
            : true,
      sameSite:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? "lax"
            : "none",
   },
});

export function setSuccessMessage(session: Session, message: string) {
   session.flash("toastMessage", { message, type: "success" } as ToastMessage);
}

export function setErrorMessage(session: Session, message: string) {
   session.flash("toastMessage", { message, type: "error" } as ToastMessage);
}
