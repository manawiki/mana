export async function handleLogout() {
   try {
      await fetch("api/users/logout", {
         method: "POST",
         credentials: "include",
         headers: {
            "Content-Type": "application/json",
         },
      });

      // We need to do this because the payload rest logout has the wrong cookie domain
      await fetch("/logout", {
         method: "POST",
      });

      location.replace("/");
   } catch (error) {
      console.error("Logout failed:", error);
   }
}
