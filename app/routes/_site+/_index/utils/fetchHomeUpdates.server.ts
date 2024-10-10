import type { Payload } from "payload";

import type { Update } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { isSiteAdmin } from "~/db/access/isSiteAdmin";
import { isSiteOwner } from "~/db/access/isSiteOwner";
import { gql } from "~/utils/cache.server";
import { gqlFetch } from "~/utils/fetchers.server";

export async function fetchHomeUpdates({
   payload,
   siteSlug,
   user,
   request,
   updatesPage = 1,
}: {
   payload: Payload;
   siteSlug: string | undefined;
   user?: RemixRequestContext["user"];
   request: Request;
   updatesPage?: number;
}): Promise<Update[]> {
   const sites = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      user,
      overrideAccess: false,
      depth: 0,
   });

   const site = sites?.docs[0];

   const isOwner = isSiteOwner(user?.id, site?.owner as any);
   const isAdmin = isSiteAdmin(user?.id, site?.admins as any[]);

   //@ts-ignore
   const { updates } = await gqlFetch({
      isCustomDB: false,
      isCached: isOwner || isAdmin ? false : true,
      query: UPDATES_QUERY,
      request,
      variables: {
         updatesPage,
         siteId: site?.id,
      },
   });

   return updates.docs;
}

const UPDATES_QUERY = gql`
   query ($updatesPage: Int, $siteId: JSON!) {
      updates: Updates(
         where: { site: { equals: $siteId } }
         limit: 20
         sort: "-createdAt"
         page: $updatesPage
      ) {
         docs {
            id
            createdAt
            entry {
               id
               content
            }
         }
      }
   }
`;
