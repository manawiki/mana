import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { loginPath } from "~/utils/login-path.server";

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   console.log("got here");
   const { intent } = await zx.parseForm(request, {
      intent: z.enum(["publish", "followSite", "unfollow"]),
   });

   const { siteSlug } = await getSiteSlug(request, payload, user);

   if (!user)
      throw redirect(loginPath, {
         status: 302,
      });

   switch (intent) {
      case "followSite": {
         //We need to get the current sites of the user, then prepare the new sites array
         const userId = user?.id;
         invariant(userId);
         const userData = user
            ? await payload.findByID({
                 collection: "users",
                 id: userId,
                 user,
              })
            : undefined;
         const userCurrentSites = userData?.sites || [];
         //@ts-ignore
         const sites = userCurrentSites.map(({ id }: { id }) => id);
         //Finally we update the user with the new site id

         const siteData = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteSlug,
               },
            },
            user,
         });
         const siteUID = siteData?.docs[0]?.id;
         await payload.update({
            collection: "users",
            id: userId ?? "",
            data: { sites: [...sites, siteUID] },
            overrideAccess: false,
            user,
         });

         const { totalDocs } = await payload.find({
            collection: "users",
            where: {
               sites: {
                  equals: siteUID,
               },
            },
            depth: 0,
         });

         return await payload.update({
            collection: "sites",
            id: siteUID as string,
            data: { followers: totalDocs },
         });
      }
      case "unfollow": {
         const userId = user?.id;

         const siteData = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteSlug,
               },
            },
            user,
         });
         const siteUID = siteData?.docs[0]?.id;
         const site = await payload.findByID({
            collection: "sites",
            id: siteUID as string,
            user,
         });

         // Prevent site creator from leaving own site
         //@ts-ignore
         if (site.owner?.id === userId) {
            return json(
               {
                  errors: "Cannot unfollow your own site",
               },
               { status: 400 },
            );
         }

         invariant(userId);

         const userData = user
            ? await payload.findByID({
                 collection: "users",
                 id: userId,
                 user,
              })
            : undefined;

         const userCurrentSites = userData?.sites || [];
         //@ts-ignore
         const sites = userCurrentSites.map(({ id }: { id }) => id);

         //Remove the current site from the user's sites array
         const index = sites.indexOf(site.id);
         if (index > -1) {
            // only splice array when item is found
            sites.splice(index, 1); // 2nd parameter means remove one item only
         }

         await payload.update({
            collection: "users",
            id: userId ?? "",
            data: { sites },
            overrideAccess: false,
            user,
         });

         const { totalDocs } = await payload.find({
            collection: "users",
            where: {
               sites: {
                  equals: siteUID,
               },
            },
            depth: 0,
         });

         return await payload.update({
            collection: "sites",
            id: siteUID as string,
            data: { followers: totalDocs },
         });
      }
   }
}
