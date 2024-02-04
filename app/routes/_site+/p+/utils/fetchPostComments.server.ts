import { request as gqlRequest } from "graphql-request";
import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import type { Payload } from "payload";

import type { Comment } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { gqlRequestWithCache } from "~/utils/cache.server";
import { gqlEndpoint } from "~/utils/fetchers.server";

import { fetchPostWithSlug } from "./fetchPostWithSlug.server";

export async function fetchPostComments({
   p,
   payload,
   siteSlug,
   user,
}: {
   p: string;
   payload: Payload;
   siteSlug: string;
   user?: RemixRequestContext["user"];
}) {
   const { postData } = await fetchPostWithSlug({
      p,
      payload,
      siteSlug,
      user,
   });
   if (!postData) return null;

   const postDataId = postData?.id;

   const commentDepth = postData?.maxCommentDepth ?? 1;

   function depthAndDeletionDecorator(array: any, depth = 1) {
      return array.map((child: any) =>
         Object.assign(child, {
            depth,
            //Remove content if deleted
            // ...(child.isDeleted == true && { comment: undefined }),
            replies: depthAndDeletionDecorator(child.replies || [], depth + 1),
         }),
      );
   }

   //Recursively generated nested query to get all replies
   function generateNestedJsonObject(depth: number) {
      if (depth === 0) {
         return {};
      } else {
         let object = {
            id: true,
            createdAt: true,
            isDeleted: true,
            comment: true,
            upVotesStatic: true,
            author: {
               username: true,
               avatar: {
                  url: true,
               },
            },
         };
         for (let i = 0; i < depth; i++) {
            //@ts-ignore
            object["replies"] = generateNestedJsonObject(depth - 1);
         }
         return object;
      }
   }

   const nestedJsonObject = generateNestedJsonObject(commentDepth);

   //Construct the query in JSON to then parse to graphql format
   const query = {
      query: {
         __variables: {
            postParentId: "JSON!",
         },
         comments: {
            __aliasFor: "Comments",
            __args: {
               where: {
                  isTopLevel: { equals: true },
                  postParent: { equals: new VariableType("postParentId") },
               },
               sort: "-upVotesStatic",
            },
            docs: {
               id: true,
               createdAt: true,
               isDeleted: true,
               comment: true,
               upVotesStatic: true,
               isTopLevel: true,
               isPinned: true,
               author: {
                  username: true,
                  avatar: {
                     url: true,
                  },
               },
               ...nestedJsonObject,
            },
         },
      },
   };
   const graphql_query = jsonToGraphQLQuery(query, { pretty: true });

   //Cache comments if non
   const fetchComments = !user
      ? await gqlRequestWithCache(gqlEndpoint({}), graphql_query, {
           postParentId: postDataId,
        })
      : await gqlRequest(gqlEndpoint({}), graphql_query, {
           postParentId: postDataId,
        });

   const comments = depthAndDeletionDecorator(
      //@ts-ignore
      fetchComments?.comments?.docs,
   ) as Comment[];

   return comments ?? null;
}
