export async function handleLogout(sitePath: string) {
   try {
      const res = await fetch("api/users/logout", {
         method: "POST",
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
         },
      });
      const json = await res.json();

      console.log("log out", json);
      location.reload();
   } catch (error) {
      console.error("Logout failed:", error);
   }
}
