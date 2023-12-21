export async function handleLogout(sitePath: string) {
   const safeSitePath = sitePath.replace("http", "https");

   const logoutUrl =
      process.env.NODE_ENV === "development"
         ? `http://localhost:3000/api/users/logout`
         : `${safeSitePath}api/users/logout`;

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
