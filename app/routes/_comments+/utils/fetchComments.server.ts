import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";

import type { Comment } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { gqlFetch } from "~/utils/fetchers.server";

export async function fetchComments({
   user,
   parentId,
   maxCommentDepth,
}: {
   user?: RemixRequestContext["user"];
   parentId: string;
   maxCommentDepth: number;
}) {
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

   const nestedJsonObject = generateNestedJsonObject(maxCommentDepth);

   //Construct the query in JSON to then parse to graphql format
   const query = {
      query: {
         __variables: {
            parentId: "String!",
         },
         comments: {
            __aliasFor: "Comments",
            __args: {
               where: {
                  isTopLevel: { equals: true },
                  parentId: { equals: new VariableType("parentId") },
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
   const fetchComments = await gqlFetch({
      isCached: user ? false : true,
      query: graphql_query,
      variables: { parentId: parentId },
   });

   const comments = depthAndDeletionDecorator(
      //@ts-ignore
      fetchComments?.comments?.docs,
   ) as Comment[];

   return comments ?? null;
}
