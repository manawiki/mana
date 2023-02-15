import type { CollectionConfig } from "payload/types";
import {
    isAdmin,
    isAdminFieldLevel,
    isAdminorUser,
    isLoggedIn,
} from "../access";
import type { User } from "../../payload-types";

export const postsslug = "posts";
export const Posts: CollectionConfig = {
    slug: postsslug,
    // auth: true,
    admin: {
        useAsTitle: "title",
    },
    access: {
        create: isLoggedIn,
        read: () => true, //isAdminAuthororPublished
        update: isAdminorUser("author"), //isAdminorAuthor
        delete: isAdmin, //isAdminorAuthor
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
            index: true,
        },
        {
            name: "publishedAt",
            type: "date",
        },
        {
            name: "author",
            type: "relationship",
            relationTo: "users",
            required: true,
            defaultValue: ({ user }: { user: User }) => user.id,
            access: {
                update: isAdminFieldLevel,
            },
            maxDepth: 2,
        },
        {
            name: "site",
            type: "relationship",
            relationTo: "sites",
            required: true,
            maxDepth: 0,
        },
        {
            name: "banner",
            type: "upload",
            relationTo: "images",
        },
        {
            name: "notes",
            type: "relationship",
            relationTo: "notes",
            required: true,
            hasMany: true,
            maxDepth: 1,
        },
        { name: "isPublished", type: "checkbox", defaultValue: false },
    ],
};
