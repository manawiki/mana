import type { CollectionConfig } from "payload/types";
import {
   authenticatedAndStaff,
   isStaffFieldLevel,
   isStaffOrSelf,
} from "../access";
import { serverEnv, domainCookie } from "../../shared";

export const usersSlug = "users";
export const Users: CollectionConfig = {
   slug: usersSlug,
   auth: {
      verify: {
         generateEmailHTML: ({ token, user }) => {
            // Use the token provided to allow your user to verify their account
            const url =
               serverEnv == "local"
                  ? `http://localhost:3000/verify?token=${token}`
                  : serverEnv == "dev-server"
                  ? `https://manatee.wiki/verify?token=${token}`
                  : `https://mana.wiki/verify?token=${token}`;

            return `
            <span>Hey ${user.email}, thanks for registering at Mana.</span>
            <br><br>
            <table width="100%" cellspacing="0" cellpadding="0">
               <tr>
                  <td>
                     <table cellspacing="0" cellpadding="0">
                           <tr>
                              <td style="border-radius: 2px;" bgcolor="#3b82f6">
                                 <a href="${url}&email=${user.email}" style="padding: 8px 12px; border: 1px solid #3b82f6;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
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
         //@ts-expect-error
         generateEmailHTML: ({ token, user }) => {
            // Use the token provided to allow your user to verify their account
            const url =
               serverEnv == "local"
                  ? `http://localhost:3000/reset-password?token=${token}`
                  : serverEnv == "dev-server"
                  ? `https://manatee.wiki/reset-password?token=${token}`
                  : `https://mana.wiki/reset-password?token=${token}`;

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
         domain: domainCookie,
         secure: serverEnv == "local" ? false : true,
         sameSite: serverEnv == "local" ? "lax" : "none",
      },
   },
   admin: {
      useAsTitle: "email",
   },
   access: {
      read: () => true,
      create: () => true,
      delete: authenticatedAndStaff,
      update: isStaffOrSelf,
   },
   fields: [
      {
         name: "username",
         type: "text",
         unique: true,
      },
      {
         name: "roles",
         saveToJWT: true,
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
         saveToJWT: true,
         type: "relationship",
         relationTo: "sites",
         hasMany: true,
      },
      {
         name: "avatar",
         type: "upload",
         relationTo: "images",
      },
   ],
};
