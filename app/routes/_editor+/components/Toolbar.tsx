import { useEffect, useRef, useState } from "react";

import {
   Bold,
   Edit,
   Italic,
   Link2,
   Link2Off,
   Strikethrough,
   Underline,
} from "lucide-react";
import { createPortal } from "react-dom";
import {
   Editor,
   Path,
   Range,
   Transforms,
   Node,
   Element as SlateElement,
} from "slate";
import { useFocused, useSlate } from "slate-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import Button from "./Button";
import Select from "./Select";
import { toggleMark, topLevelPath } from "../functions/utils";
import type { CustomElement, LinkElement, TextBlock } from "../types";
import { BlockType } from "../types";

export default function Toolbar() {
   const ref = useRef<HTMLDivElement | null>(null);
   const editor = useSlate();
   const inFocus = useFocused();

   const isLinkActive = (editor: Editor) => {
      const [link] = Editor.nodes(editor, {
         match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "link",
      });
      return !!link;
   };

   const activeLinkUrl = (editor: Editor) => {
      const [link] = Editor.nodes(editor, {
         match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "link",
      });
      const data = link && link[0]?.url;
      return data;
   };

   const unwrapLink = (editor: Editor) => {
      Transforms.unwrapNodes(editor, {
         match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "link",
      });
   };

   const wrapLink = (editor: Editor, url: string) => {
      if (editor.selection) {
         if (isLinkActive(editor)) {
            unwrapLink(editor);
         }
         const { selection } = editor;
         const isCollapsed = selection && Range.isCollapsed(selection);
         const link: LinkElement = {
            type: BlockType.Link,
            url,
            children: isCollapsed ? [{ text: url }] : [],
         };

         if (isCollapsed) {
            Transforms.insertNodes(editor, link);
         } else {
            Transforms.wrapNodes(editor, link, { split: true });
            Transforms.collapse(editor, { edge: "end" });
         }
      }
   };

   useEffect(() => {
      const el = ref.current;
      const { selection } = editor;

      if (!el) {
         return;
      }

      if (
         !selection ||
         !inFocus ||
         Range.isCollapsed(selection) ||
         Editor.string(editor, selection) === ""
      ) {
         el.removeAttribute("style");
         return;
      }

      const domSelection = window.getSelection();
      if (domSelection == null || domSelection.rangeCount === 0) {
         return;
      }

      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();

      el.style.position = "absolute";
      el.style.opacity = "1";
      el.style.top = `${rect.top + window.scrollY}px`;
      el.style.left = `${rect.left + window.scrollX}px`;
   });

   const type = getSelectedElementType(editor);

   const marks = Editor.marks(editor);

   if (typeof document !== "undefined") {
      return createPortal(
         <div
            ref={ref}
            className="border-color shadow-1 bg-1 pointer-events-auto -mt-16
            rounded-xl border px-3 py-2.5 opacity-0 shadow-lg transition-opacity duration-200 ease-in-out"
            onMouseDown={(e) => {
               // prevent toolbar from taking focus away from editor
               e.preventDefault();
            }}
         >
            <section className="flex items-center gap-2">
               {/* {type && (
                  <>
                     <div>
                        <Select
                           defaultValue={BlockType.Paragraph}
                           value={type}
                           items={[
                              { label: "Normal text", value: BlockType.Paragraph },
                              { label: "Heading 2", value: BlockType.H2 },
                              { label: "Heading 3", value: BlockType.H3 },
                              {
                                 label: "Bulleted list",
                                 value: BlockType.BulletedList,
                              },
                              { label: "To-do list", value: BlockType.ToDo },
                           ]}
                           onValueChange={(value: string) => {
                              if (editor.selection == null) {
                                 return;
                              }
   
                              // TODO: Update Select typings to infer value type from items
                              const type = value as TextBlock;
                              Transforms.setNodes<CustomElement>(
                                 editor,
                                 {
                                    type,
                                 },
                                 {
                                    at: [editor.selection.anchor.path[0]],
                                 }
                              );
                           }}
                        />
                     </div>
                  </>
               )} */}
               <div className="flex items-center gap-1">
                  {!isLinkActive(editor) && (
                     <Tooltip>
                        <TooltipTrigger>
                           <Button
                              ariaLabel="Add Link"
                              onPointerDown={(e) => e.preventDefault()}
                              onClick={(e) => {
                                 e.preventDefault();
                                 const url = window.prompt(
                                    "Enter the URL of the link:"
                                 );
                                 if (!url) return;
                                 wrapLink(editor, url);
                              }}
                              className={`${
                                 isLinkActive(editor) === true
                                    ? "bg-3 border-color border"
                                    : ""
                              } hover:bg-2 flex h-8 w-8 items-center justify-center rounded-lg`}
                           >
                              <Link2 size={16} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Link</TooltipContent>
                     </Tooltip>
                  )}
                  <Tooltip>
                     <TooltipTrigger>
                        <Button
                           ariaLabel="Toggle Bold"
                           onPointerDown={(e) => e.preventDefault()}
                           onClick={() => toggleMark(editor, "bold")}
                           className={`${
                              marks && marks["bold"] === true
                                 ? "bg-3 border-color border"
                                 : ""
                           } hover:bg-2 flex h-8 w-8 items-center justify-center rounded-lg`}
                        >
                           <Bold size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Toggle Bold</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger>
                        <Button
                           ariaLabel="Toggle Italic"
                           onPointerDown={(e) => e.preventDefault()}
                           onClick={() => toggleMark(editor, "italic")}
                           className={`${
                              marks && marks["italic"] === true
                                 ? "bg-3 border-color border"
                                 : ""
                           } hover:bg-2 flex h-8 w-8 items-center justify-center rounded-lg`}
                        >
                           <Italic size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Toggle Italic</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger>
                        <Button
                           ariaLabel="Toggle Underline"
                           onPointerDown={(e) => e.preventDefault()}
                           onClick={() => toggleMark(editor, "underline")}
                           className={`${
                              marks && marks["underline"] === true
                                 ? "bg-3 border-color border"
                                 : ""
                           } hover:bg-2 flex h-8 w-8 items-center justify-center rounded-lg`}
                        >
                           <Underline size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Toggle Underline</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger>
                        <Button
                           ariaLabel="Toggle Strikethrough"
                           onPointerDown={(e) => e.preventDefault()}
                           onClick={() => toggleMark(editor, "strikeThrough")}
                           className={`${
                              marks && marks["strikeThrough"] === true
                                 ? "bg-3 border-color border"
                                 : ""
                           } hover:bg-2 flex h-8 w-8 items-center justify-center rounded-lg`}
                        >
                           <Strikethrough size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Toggle Strikethrough</TooltipContent>
                  </Tooltip>
               </div>
            </section>
            {isLinkActive(editor) ? (
               <section className="bg-3 mt-1.5 flex items-center gap-3 truncate rounded-md px-2">
                  <span className="text-1 w-32 flex-grow truncate py-2 text-xs">
                     {activeLinkUrl(editor)}
                  </span>
                  <Tooltip>
                     <TooltipTrigger>
                        <Button
                           className="flex items-center p-1"
                           ariaLabel="Remove Link"
                           onPointerDown={(e) => e.preventDefault()}
                           onClick={(e) => {
                              if (isLinkActive(editor)) {
                                 unwrapLink(editor);
                              }
                           }}
                        >
                           <Link2Off className="text-red-400" size={16} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Remove Link</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger>
                        <Button
                           className="flex items-center p-1"
                           ariaLabel="Update Link"
                           onPointerDown={(e) => e.preventDefault()}
                           onClick={(e) => {
                              e.preventDefault();
                              const url = window.prompt(
                                 "Enter the URL of the link:"
                              );
                              if (!url) return;
                              wrapLink(editor, url);
                           }}
                        >
                           <Edit className="text-blue-400" size={14} />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Update Link</TooltipContent>
                  </Tooltip>
               </section>
            ) : null}
         </div>,
         document.body
      );
   }
}

function getSelectedElementType(editor: Editor): TextBlock | null {
   if (editor.selection == null) {
      return null;
   }

   // If selection overlap on multiple top element, return null
   if (
      Path.compare(
         topLevelPath(editor.selection.anchor.path),
         topLevelPath(editor.selection.focus.path)
      ) !== 0
   ) {
      return null;
   }

   const element = editor.children[
      editor.selection.anchor.path[0]
   ] as CustomElement;

   if (!isTextElementType(element.type)) {
      return null;
   }

   return element.type;
}

function isTextElementType(type: string): type is TextBlock {
   return (
      type === BlockType.H2 ||
      type === BlockType.H3 ||
      type === BlockType.Paragraph ||
      type === BlockType.BulletedList ||
      type === BlockType.ToDo ||
      type === BlockType.Link
   );
}
