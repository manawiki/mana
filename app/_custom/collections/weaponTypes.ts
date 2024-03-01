import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const WeaponTypes: CollectionConfig = {
    slug: "weaponTypes",
    labels: { singular: "weaponType", plural: "weaponTypes" },
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
            name: "checksum",
            type: "text",
            required: true,
        },
    ],
};
