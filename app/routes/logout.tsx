import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { domainCookie } from "../../shared";

export const action: ActionFunction = async ({ context: { res } }) => {
  const cookieOptions = {
    domain: domainCookie,
    secure:
      process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local" ? false : true,
    path: "/",
    httpOnly:
      process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local" ? false : true,
    sameSite:
      process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
        ? "lax"
        : ("none" as any), // Litteral types out of wack, typescript?
  };
  res.clearCookie("payload-token", cookieOptions);
  return redirect("/");
};

export default () => {
  <div className="container place-content-center">
    <h2>You have been successfully logged out</h2>
  </div>;
};
