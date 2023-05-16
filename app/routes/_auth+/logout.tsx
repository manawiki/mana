import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ context: { res } }) => {
   const isDev = process.env.NODE_ENV == "development";
   const cookieOptions = {
      domain: isDev ? "localhost" : ".mana.wiki",
      secure: isDev ? false : true,
      path: "/",
      httpOnly: isDev ? false : true,
      sameSite: isDev ? "lax" : ("none" as any), // Litteral types out of wack, typescript?
   };
   res.clearCookie("payload-token", cookieOptions);
   return redirect("/hq");
};

export default () => {
   <div className="container place-content-center">
      <h2>You have been successfully logged out</h2>
   </div>;
};
