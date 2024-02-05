export function isSiteAdmin(userId: string | undefined, admins: string[]) {
   return userId ? admins.includes(userId) : false;
}
