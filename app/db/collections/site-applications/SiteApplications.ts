import type { CollectionConfig } from "payload/types";

import type { RemixRequestContext } from "remix.env";

import {
   canCreateApplication,
   canDeleteApplication,
   canReadApplication,
   canUpdateApplication,
} from "./access";

export const SiteApplications: CollectionConfig = {
   slug: "siteApplications",
   access: {
      create: canCreateApplication,
      read: canReadApplication,
      update: canUpdateApplication,
      delete: canDeleteApplication,
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
         name: "reviewReply",
         type: "textarea",
      },
   ],
};
