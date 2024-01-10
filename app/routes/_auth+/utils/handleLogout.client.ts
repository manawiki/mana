export async function handleLogout(sitePath: string) {
   try {
      await fetch("api/users/logout", {
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
