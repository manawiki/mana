import type { PaginatedDocs } from "payload/database";
import { select, type Select } from "payload-query";

import type { Post, User } from "payload/generated-types";
import type { Image } from "~/db/payload-custom-types";

export function filterAuthorFields(
   data: PaginatedDocs<Post>,
   selectConfig: Partial<Record<keyof any, boolean>>,
) {
   const authorSelect: Select<User> = {
      id: false,
      username: true,
      avatar: true,
   };

   const avatarSelect: Select<Image> = {
      id: false,
      url: true,
   };

   const bannerSelect: Select<Image> = {
      id: false,
      url: true,
   };

   const filtered = data.docs.map((doc) => {
      const authorFull = select(authorSelect, doc.author);

      const banner = doc.banner && select(bannerSelect, doc.banner);

      const post = select(selectConfig, doc);

      //Combine author object after pruning image fields
      const author = {
         ...authorFull,
         avatar: authorFull?.avatar && select(avatarSelect, authorFull?.avatar),
      };

      //Combine final result
      const result = {
         ...post,
         author,
         banner,
      };

      return result;
   });

   //Extract pagination fields
   const { docs, ...pagination } = data;

   //Combine filtered docs with pagination info
   const result = { docs: filtered, ...pagination };

   return result;
}
