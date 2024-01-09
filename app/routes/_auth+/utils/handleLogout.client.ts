import { log } from "console";

export async function handleLogout(sitePath: string) {
   let logoutUrl =
      process.env.NODE_ENV === "development"
         ? `http://localhost:3000/api/users/logout`
         : `https://mana.wiki/api/users/logout`;

   if (document?.location?.origin)
      logoutUrl = `${document.location.origin}/api/users/logout`;

   console.log(logoutUrl);

   try {
      await fetch(logoutUrl, {
         method: "POST",
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
         },
      });
      location.reload();
   } catch (error) {
      console.error("Logout failed:", error);
   }
}
