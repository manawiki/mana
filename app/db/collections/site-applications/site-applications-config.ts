import type { CollectionConfig } from "payload/types";

import type { RemixRequestContext } from "remix.env";

import {
   updateApplicationFieldAsSiteAdmin,
   canCreateApplication,
   canReadApplication,
   canUpdateDeleteApplication,
} from "./site-applications-access";

export const SiteApplications: CollectionConfig = {
   slug: "siteApplications",
   access: {
      create: canCreateApplication,
      read: canReadApplication,
      update: canUpdateDeleteApplication,
      delete: canUpdateDeleteApplication,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "createdBy",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         required: true,
         defaultValue: ({ user }: { user: RemixRequestContext["user"] }) =>
            user?.id,
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         hasMany: false,
      },
      {
         name: "status",
         type: "select",
         options: [
            {
               label: "Under Review",
               value: "under-review",
            },
            {
               label: "Approved",
               value: "approved",
            },
            {
               label: "Denied",
               value: "denied",
            },
         ],
         access: {
            update: updateApplicationFieldAsSiteAdmin,
         },
      },
      {
         name: "discordUsername",
         type: "text",
      },
      {
         name: "primaryDetails",
         type: "textarea",
      },
      {
         name: "additionalNotes",
         type: "textarea",
      },
      {
         name: "reviewMessage",
         type: "textarea",
      },
   ],
};
