import { useState, useEffect } from "react";

import { useFetcher } from "@remix-run/react";
import TextareaAutosize from "react-textarea-autosize";

import type { Post } from "payload/generated-types";
import { useDebouncedValue, useIsMount } from "~/utils/use-debounce";

import { PostAuthorHeader } from "./PostAuthorHeader";

export function PostHeaderEdit({ post }: { post: Post }) {
   const fetcher = useFetcher();
   const [titleValue, setTitleValue] = useState(post.name);
   const [subtitleValue, setSubtitleValue] = useState(post.subtitle ?? "");

   const debouncedTitle = useDebouncedValue(titleValue, 500);
   const debouncedSubtitle = useDebouncedValue(subtitleValue, 500);

   const isMount = useIsMount();

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            {
               name: debouncedTitle,
               intent: "updateTitle",
               postId: post.id,
            },
            { method: "patch" },
         );
      }
   }, [debouncedTitle]);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            {
               subtitle: debouncedSubtitle,
               intent: "updateSubtitle",
               postId: post.id,
            },
            { method: "patch" },
         );
      }
   }, [debouncedSubtitle]);

   return (
      <div className="max-w-[728px] w-full mx-auto">
         <div className="relative mb-2 flex items-center gap-3">
            <TextareaAutosize
               className="mt-0 min-h-[20px] w-full resize-none overflow-hidden rounded-sm border-0 bg-transparent p-0 
                   font-header text-3xl font-semibold !leading-[3rem] focus:ring-transparent laptop:text-4xl focus:outline-none"
               defaultValue={titleValue}
               onChange={(event) => setTitleValue(event.target.value)}
               placeholder="Add a title..."
            />
         </div>
         {/* @ts-ignore */}
         <PostAuthorHeader post={post} />
         <div className="border-color-secondary relative mb-6 flex items-center gap-3 border-b pb-3">
            <TextareaAutosize
               className="text-1 mt-0 min-h-[20px] w-full resize-none overflow-hidden rounded-sm border-0 bg-transparent 
                  p-0 text-sm font-semibold focus:ring-transparent focus:outline-none"
               defaultValue={subtitleValue}
               onChange={(event) => setSubtitleValue(event.target.value)}
               placeholder="Add a subtitle..."
            />
         </div>
      </div>
   );
}
