import { useFetcher } from "@remix-run/react";

export async function handleLogout(sitePath: string) {
   try {
      await fetch("api/users/logout", {
         method: "POST",
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
         },
      });

      // console.log("Logout response:", await res.json());

      // We need to do this because the payload rest logout has the wrong cookie domain
      await fetch("/logout", {
         method: "POST",
         // headers: {
         //    "Content-Type": "application/json",
         // },
         // body: JSON.stringify({
         //    intent: "logout",
         // }),
      });

      // console.log("Logout response:", res);

      location.reload();
   } catch (error) {
      console.error("Logout failed:", error);
   }
}
