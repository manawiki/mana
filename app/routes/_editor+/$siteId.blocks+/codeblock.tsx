import { useState } from "react";

import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { themes } from "prism-react-renderer";
import { CodeBlock } from "react-code-block";
import TextareaAutosize from "react-textarea-autosize";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { Icon } from "~/components/Icon";
import { delay } from "~/utils";
import { useTheme } from "~/utils/theme-provider";

import type { CodeBlockElement, CustomElement } from "../core/types";

export function BlockCodeBlock({
   children,
   element,
   readOnly,
}: {
   element: CodeBlockElement;
   children: string;
   readOnly: boolean;
}) {
   const editor = useSlate();
   const [theme] = useTheme();

   const path = ReactEditor.findPath(editor, element);

   const [codeBlockValue, setCodeBlockValue] = useState(element?.value ?? "");

   const [copySuccess, setCopySuccess] = useState(
      <Icon name="copy" size={14} />,
   );

   const [editMode, setEditMode] = useState(false);

   async function copyToClipBoard(copyMe: string) {
      try {
         await navigator.clipboard.writeText(copyMe);
         setCopySuccess(
            <Icon name="copy-check" className="text-green-500" size={14} />,
         );
         await delay(2000);
         setCopySuccess(<Icon name="copy" size={14} />);
      } catch (err) {
         setCopySuccess(<Icon name="copy-x" size={14} />);
      }
   }

   function updateLabelValue(event: string) {
      Transforms.setNodes<CustomElement>(
         editor,
         { value: event },
         {
            at: path,
         },
      );
      return setCodeBlockValue(event);
   }
   return (
      <div
         className="bg-2 border mb-3 border-color-sub group px-3 py-4 rounded-lg shadow-sm shadow-1 text-sm relative"
         contentEditable={false}
      >
         {readOnly || !editMode ? (
            <CodeBlock
               code={codeBlockValue}
               language="tsx"
               theme={theme === "light" ? themes.vsLight : themes.vsDark}
            >
               <CodeBlock.Code className="overflow-auto no-scrollbar">
                  <div className="table-row">
                     <CodeBlock.LineNumber className="table-cell pr-4 text-xs text-gray-400 text-right select-none" />
                     <CodeBlock.LineContent className="table-cell">
                        <CodeBlock.Token />
                     </CodeBlock.LineContent>
                  </div>
               </CodeBlock.Code>
               <button
                  className="absolute top-2.5 right-2.5 border border-color-sub hover:border-zinc-200 rounded-mg p-2 text-xs text-1 font-bold 
                  bg-white dark:bg-dark350 shadow-sm shadow-1 rounded-lg dark:hover:border-zinc-600"
                  onClick={() => copyToClipBoard(codeBlockValue)}
               >
                  {copySuccess}
               </button>
            </CodeBlock>
         ) : (
            <TextareaAutosize
               className="w-full resize-none font-mono text-1 focus:ring-0 pl-[31px] overflow-hidden text-sm border-0 bg-transparent p-0"
               defaultValue={codeBlockValue}
               onChange={(event) => updateLabelValue(event.target.value)}
               placeholder="Start typing..."
            />
         )}
         <div className="hidden">{children}</div>
         {!readOnly && (
            <Switch
               checked={editMode}
               onChange={setEditMode}
               className="dark:border-zinc-600/60 group-hover:flex bg-white dark:bg-dark450 flex-none absolute top-3 left-3 hidden h-5 w-[36px] items-center rounded-full border"
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
