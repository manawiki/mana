import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import * as cookie from "cookie";

// We need to do this because the payload rest logout has the wrong cookie domain
export async function loader({ request }: ActionFunctionArgs) {
   return redirect("/", logoutHeader(request));
}

export async function action({ request }: ActionFunctionArgs) {
   return new Response("Logged out", logoutHeader(request));
}

function logoutHeader(request: Request) {
   const hostname = new URL(request.url).hostname;

   // set the cookie on domain level so all subdomains can access it
   let domain = hostname.split(".").slice(-2).join(".");

   // delete the cookie payload-token
   const deleteCookie = cookie.serialize("payload-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && domain !== "localhost",
      sameSite: "lax",
      path: "/",
      //delete cookie
      expires: new Date(0),
      domain,
   });

   return {
      headers: {
         "Set-Cookie": deleteCookie,
      },
   };
}
