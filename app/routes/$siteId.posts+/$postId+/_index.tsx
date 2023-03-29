import { useLoaderData } from "@remix-run/react";
import { useCallback, useMemo } from "react";
import { V2_MetaFunction, type LoaderArgs } from "@remix-run/node";

import { z } from "zod";
import { zx } from "zodix";

import {
   Editable,
   Slate,
   withReact,
   type RenderElementProps,
} from "slate-react";
import { createEditor, type Descendant } from "slate";

import Block from "./edit/Editor/blocks/Block";
import Leaf from "./edit/Editor/blocks/Leaf";
import { PostHeader } from "./PostHeader";

//get notes list from payload
export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { postId } = zx.parseParams(params, {
      postId: z.string(),
   });

   const post = await payload.findByID({
      collection: "posts",
      id: postId,
      overrideAccess: false,
      user,
      depth: 2,
   });
   return { post };
}

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export const meta: V2_MetaFunction = ({ data, parentsData }) => {
   const siteName = parentsData["routes/$siteId"].site.name;
   const postTitle = data.post.title;

   return [
      {
         title: `${postTitle} - ${siteName}`,
      },
   ];
};

export default function PostPage() {
   const editor = useMemo(() => withReact(createEditor()), []);
   const { post } = useLoaderData<typeof loader>();
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);

   return (
      <div className="relative">
         <main className="max-w-[728px] max-laptop:mx-3.5 py-4 mx-auto">
            <h1 className="font-header pt-4 text-3xl laptop:text-4xl">
               {post.title}
            </h1>
            <PostHeader post={post} />
            <Slate editor={editor} value={post.content as Descendant[]}>
               <Editable
                  renderElement={renderElement}
                  renderLeaf={Leaf}
                  readOnly={true}
               />
            </Slate>
         </main>
      </div>
   );
}
