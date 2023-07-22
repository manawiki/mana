import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { settings } from "mana-config";

export const action: ActionFunction = async ({ context: { res } }) => {
   const isDev = process.env.NODE_ENV == "development";
   const cookieOptions = {
      domain: isDev ? "localhost" : `.${settings.domain}`,
      secure: isDev ? false : true,
      path: "/",
      httpOnly: isDev ? false : true,
      sameSite: isDev ? "lax" : ("none" as any), // Litteral types out of wack, typescript?
   };
   res.clearCookie("payload-token", cookieOptions);
   return redirect("/");
};

export default () => {
   <div className="container place-content-center">
      <h2>You have been successfully logged out</h2>
   </div>;
};
