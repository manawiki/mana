import type { CollectionConfig } from "payload/types";

import {
   isStaff,
   isStaffFieldLevel,
   isStaffOrSelfFieldLevel,
} from "./users.access";

export const serverEnv = process.env.NODE_ENV;
export const usersSlug = "users";
import { canUpdateUser } from "./users.access";

export const Users: CollectionConfig = {
   slug: usersSlug,
   auth: {
      tokenExpiration: 60 * 60 * 24 * 30, // 30 days
      useAPIKey: true,
      verify: {
         generateEmailHTML: ({ token, user }) => {
            // Use the token provided to allow your user to verify their account
            const url =
               serverEnv == "development"
                  ? `http://localhost:3000/verify?token=${token}`
                  : `https://${
                       process.env.HOST_DOMAIN ?? "mana.wiki"
                    }/verify?token=${token}`;

            return `
            <span>Hey ${user.email}, thanks for registering at ${
               process.env.HOST_DOMAIN ?? "mana.wiki"
            }</span>
            <br><br>
            <table width="100%" cellspacing="0" cellpadding="0">
               <tr>
                  <td>
                     <table cellspacing="0" cellpadding="0">
                           <tr>
                              <td style="border-radius: 2px;" bgcolor="#3b82f6">
                                 <a href="${url}&email=${encodeURIComponent(
                                    user.email,
                                 )}" style="padding: 8px 12px; border: 1px solid #3b82f6;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                                       Verify Email             
                                 </a>
                              </td>
                           </tr>
                     </table>
                  </td>
               </tr>
            </table>
          `;
         },
      },
      forgotPassword: {
         generateEmailHTML: (prop) => {
            const token = prop?.token;
            // Use the token provided to allow your user to verify their account
            const url =
               serverEnv == "development"
                  ? `http://localhost:3000/reset-password?token=${token}`
                  : `https://${
                       process.env.HOST_DOMAIN ?? "mana.wiki"
                    }/reset-password?token=${token}`;

            return `
            <br><br>
            <table width="100%" cellspacing="0" cellpadding="0">
               <tr>
                  <td>
                     <table cellspacing="0" cellpadding="0">
                           <tr>
                              <td style="border-radius: 2px;" bgcolor="#3b82f6">
                                 <a href="${url}" style="padding: 8px 12px; border: 1px solid #3b82f6;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                                       Reset Password             
                                 </a>
                              </td>
                           </tr>
                     </table>
                  </td>
               </tr>
            </table>
          `;
         },
      },
      cookies: {
         secure: serverEnv !== "development",
         sameSite: "lax",
      },
   },
   admin: {
      useAsTitle: "email",
   },
   access: {
      read: () => true,
      create: () => true,
      delete: isStaff,
      update: canUpdateUser,
      // @ts-expect-error - this is a payload type bug
      admin: isStaff,
   },
   fields: [
      {
         name: "username",
         type: "text",
         unique: true,
      },
      {
         name: "stripeCustomerId",
         type: "text",
         unique: true,
         access: {
            read: isStaffFieldLevel,
         },
      },
      {
         name: "email",
         type: "email",
         label: "User email",
         required: true,
         unique: true,
         access: {
            read: isStaffOrSelfFieldLevel,
         },
      },
      {
         name: "roles",
         type: "select",
         hasMany: true,
         defaultValue: ["user"],
         access: {
            create: isStaffFieldLevel,
            update: isStaffFieldLevel,
         },
         options: [
            {
               label: "Staff",
               value: "staff",
            },
            {
               label: "User",
               value: "user",
            },
         ],
      },
      {
         name: "sites",
         type: "relationship",
         relationTo: "sites",
         maxDepth: 2,
         hasMany: true,
         access: {
            read: isStaffOrSelfFieldLevel,
         },
      },
      {
         name: "avatar",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "apiKey",
         type: "text",
         access: {
            read: isStaffOrSelfFieldLevel,
         },
      },
      {
         name: "enableAPIKey",
         type: "text",
         access: {
            read: isStaffOrSelfFieldLevel,
         },
      },
      {
         name: "loginAttempts",
         type: "number",
         access: {
            read: isStaffOrSelfFieldLevel,
         },
      },
   ],
};
