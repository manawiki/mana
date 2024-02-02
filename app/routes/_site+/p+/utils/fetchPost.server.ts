import { redirect } from "@remix-run/node";
import type { Payload } from "payload";
import { select } from "payload-query";
import invariant from "tiny-invariant";

import type { RemixRequestContext } from "remix.env";
import { isSiteOwnerOrAdmin } from "~/db/collections/site/access";

import { fetchPostWithSlug } from "./fetchPostWithSlug.server";

export async function fetchPost({
   p,
   payload,
   user,
   siteSlug,
   page = 1,
}: {
   p: string;
   payload: Payload;
   user?: RemixRequestContext["user"];
   siteSlug: string;
   page: number | undefined;
}) {
   const { postData } = await fetchPostWithSlug({
      p,
      payload,
      siteSlug,
      user,
   });

   //If can't find post with slug, attempt to findById
   if (!postData) {
      const postById = await payload.findByID({
         collection: "posts",
         id: p,
      });

      if (!postById) throw redirect("/404", 404);

      //Post exists, we received the ID as a URL param and want to redirect to the canonical path instead.
      throw redirect(`/${postById.site.slug}/p/${postById.slug}`, 301);
   }

   if (!user) {
      //If anon and data exists, return post data now
      if (postData) {
         return { post: postData, postContent: postData.content.content };
      }
      //Otherwise post doesn't exist
      if (!postData) {
         throw redirect("/404", 404);
      }
   }

   //Now we handle authenticated querying
   invariant(user, "Not logged in");

   const hasAccess = isSiteOwnerOrAdmin(user?.id, postData.site);

   //If user has access, pull versions
   if (hasAccess) {
      const postContent = await payload.findByID({
         collection: "postContents",
         id: postData.id,
         draft: true,
      });
      const versionData = await payload.findVersions({
         collection: "postContents",
         depth: 2,
         where: {
            parent: {
               equals: postContent.id,
            },
         },
         limit: 20,
         user,
         page,
      });
      const versions = versionData.docs
         .filter((doc) => doc.version._status === "published")
         .map((doc) => {
            const versionRow = select({ id: true, updatedAt: true }, doc);
            const version = select(
               {
                  id: false,
                  versionAuthor: true,
                  content: true,
                  _status: true,
               },
               doc.version,
            );

            //Combine final result
            const result = {
               ...versionRow,
               version,
            };

            return result;
         });

      const isChanged =
         JSON.stringify(postContent.content) !=
            JSON.stringify(postData.content.content) ||
         postData.publishedAt == null;

      return {
         post: postData,
         postContent: postContent.content,
         isChanged,
         versions,
      };
   }
   //return for regular type of user
   return {
      post: postData,
      postContent: postData.content.content,
      isChanged: false,
   };
}
