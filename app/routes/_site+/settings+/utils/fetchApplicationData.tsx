import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";

export async function fetchApplicationData({
   payload,
   siteSlug,
   user,
}: {
   payload: Payload;
   siteSlug: string | undefined;
   user: RemixRequestContext["user"];
}) {
   const { docs } = await payload.find({
      collection: "siteApplications",
      where: {
         "site.slug": {
            equals: siteSlug,
         },
      },
      overrideAccess: false,
      user,
      depth: 2,
      sort: "-createdAt",
   });
   const applications = docs.map((doc) => ({
      id: doc.id,
      createdBy: {
         id: doc.createdBy.id,
         username: doc.createdBy.username,
         avatar: {
            url: doc.createdBy.avatar?.url,
         },
      },
      discordUsername: doc?.discordUsername,
      createdAt: doc.createdBy.createdAt,
      reviewMessage: doc.reviewMessage,
      status: doc.status,
      primaryDetails: doc.primaryDetails,
      additionalNotes: doc.additionalNotes,
   }));
   return applications;
}
