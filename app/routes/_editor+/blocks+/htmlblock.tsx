import { useState, createElement, useEffect, useRef } from "react";

import { Switch } from "@headlessui/react";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import type { CustomElement, HTMLBlockElement } from "../core/types";

function DangerouslySetHtmlContent({ html }: any, { allowRerender }: any) {
   // We remove 'dangerouslySetInnerHTML' from props passed to the div
   const divRef = useRef(null);
   const isFirstRender = useRef(true);

   useEffect(() => {
      if (!html || !divRef.current) throw new Error("html prop can't be null");
      if (!isFirstRender.current) return;
      isFirstRender.current = Boolean(allowRerender);

      const slotHtml = document.createRange().createContextualFragment(html); // Create a 'tiny' document and parse the html string
      //@ts-ignore
      divRef.current.innerHTML = ""; // Clear the container
      //@ts-ignore
      divRef.current.appendChild(slotHtml); // Append the new content
   }, [html, divRef]);

   return createElement("div", { ref: divRef });
}

export function BlockHTMLBlock({
   children,
   element,
   readOnly,
}: {
   element: HTMLBlockElement;
   children: string;
   readOnly: boolean;
}) {
   const editor = useSlate();

   const path = ReactEditor.findPath(editor, element);

   const [HTMLBlockValue, setHTMLBlockValue] = useState(element?.value ?? "");

   const [editMode, setEditMode] = useState(readOnly ? false : true);

   function updateLabelValue(event: string) {
      Transforms.setNodes<CustomElement>(
         editor,
         { value: event },
         {
            at: path,
         },
      );
      return setHTMLBlockValue(event);
   }
   return (
      <div contentEditable={false} className="relative group mb-3 min-h-[40px]">
         {readOnly || !editMode ? (
            <DangerouslySetHtmlContent html={HTMLBlockValue} />
         ) : (
            <div className="bg-2 border border-color-sub p-3 rounded-lg shadow-sm shadow-1 text-sm relative">
               <TextareaAutosize
                  className="w-full resize-none font-mono text-1 focus:ring-0 overflow-hidden text-sm border-0 bg-transparent p-0 max-h-96 overflow-y-auto"
                  defaultValue={HTMLBlockValue}
                  onChange={(event) => updateLabelValue(event.target.value)}
                  placeholder="Start typing..."
               />
            </div>
         )}
         {!readOnly && (
            <Switch
               checked={editMode}
               onChange={setEditMode}
               className="dark:border-zinc-600/60 z-30 group-hover:flex hidden bg-white dark:bg-dark450 flex-none absolute top-3 right-3  h-5 w-[36px] items-center rounded-full border"
            >
               <div
                  className={clsx(
                     !editMode
                        ? "translate-x-[18px] dark:bg-zinc-300 bg-zinc-400"
                        : "translate-x-1 bg-zinc-300 dark:bg-zinc-500",
                     "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition",
                  )}
               />
            </Switch>
         )}
      </div>
   );
}
