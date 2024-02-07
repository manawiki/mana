export function isSiteStaff(roles: ["staff" | "user"] | undefined) {
   return roles ? roles.includes("staff") : false;
}
