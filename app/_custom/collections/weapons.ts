import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Weapons: CollectionConfig = {
    slug: "weapons",
    labels: { singular: "weapon", plural: "weapons" },
    admin: {
        group: "Custom",
        useAsTitle: "name",
    },

    access: {
        create: isStaff,
        read: () => true,
        update: isStaff,
        delete: isStaff,
    },
    fields: [
        {
            name: "id",
            type: "text",
        },
        {
            name: "name",
            type: "text",
        },
        {
            name: "desc",
            type: "text",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "images",
        },
        {
            name: "rarity",
            type: "relationship",
            relationTo: "rarities",
        },
        {
            name: "type",
            type: "relationship",
            relationTo: "weaponTypes",
        },
        {
            name: "splash",
            type: "upload",
            relationTo: "images",
        },
        {
            name: "checksum",
            type: "text",
            required: true,
        },
    ],
};
