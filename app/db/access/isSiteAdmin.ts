export function isSiteAdmin(
   userId: string | undefined,
   admins: string[] | undefined,
) {
   return userId && admins ? admins.includes(userId) : false;
}
