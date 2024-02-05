export function isSiteContributor(
   userId: string | undefined,
   contributors: string[] | undefined,
) {
   return contributors && userId ? contributors.includes(userId) : false;
}
