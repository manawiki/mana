import { useEffect, useRef } from "react";

import { FloatingDelayGroup } from "@floating-ui/react";
import { Listbox, Transition } from "@headlessui/react";
import { createPortal } from "react-dom";
import { Editor, Range, Transforms, Element as SlateElement } from "slate";
import { useFocused, useSlate } from "slate-react";

import Button from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import type { LinkElement } from "../types";
import { BlockType } from "../types";
import { toggleMark } from "../utils";

export const COLORS = [
   "text-zinc-500",
   "text-red-500",
   "text-orange-500",
   "text-yellow-500",
   "text-green-500",
   "text-blue-500",
   "text-violet-500",
   "text-pink-500",
];

export function Toolbar() {
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
      //@ts-ignore
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
            //@ts-ignore
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
      el.style.display = "block";
      el.style.top = `${rect.top + window.scrollY}px`;
      el.style.left = `${rect.left + window.scrollX}px`;
   });

   // const type = getSelectedElementType(editor);

   const marks = Editor.marks(editor);

   if (typeof document !== "undefined") {
      return createPortal(
         <div
            ref={ref}
            className="border-color-sub shadow-1 bg-2-sub -mt-12 z-50
            rounded-xl border px-2 py-1.5 hidden shadow-lg"
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
                  <FloatingDelayGroup delay={{ open: 1000 }}>
                     {!isLinkActive(editor) && (
                        <Tooltip>
                           <TooltipTrigger>
                              <Button
                                 ariaLabel="Add Link"
                                 onPointerDown={(e) => e.preventDefault()}
                                 onClick={(e) => {
                                    e.preventDefault();
                                    const url = window.prompt(
                                       "Enter the URL of the link:",
                                    );
                                    if (!url) return;
                                    wrapLink(editor, url);
                                 }}
                                 className={`${
                                    isLinkActive(editor) === true
                                       ? "bg-zinc-200 dark:bg-dark500"
                                       : ""
                                 } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-7 w-7 items-center justify-center rounded-lg`}
                              >
                                 <Icon name="link-2" size={14} />
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
                                    ? "bg-zinc-200 dark:bg-dark500"
                                    : ""
                              } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-7 w-7 items-center justify-center rounded-lg`}
                           >
                              <Icon name="bold" size={14} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Bold</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger>
                           <Button
                              ariaLabel="Toggle Bold"
                              onPointerDown={(e) => e.preventDefault()}
                              onClick={() => toggleMark(editor, "small")}
                              className={`${
                                 marks && marks["small"] === true
                                    ? "bg-zinc-200 dark:bg-dark500"
                                    : ""
                              } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-7 w-7 items-center justify-center rounded-lg`}
                           >
                              <Icon name="type" size={14} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Small</TooltipContent>
                     </Tooltip>
                     {/* <Listbox value={marks && marks["color"]}>
                        <Listbox.Button className="hidden h-3 w-3 items-center justify-center rounded-full focus:outline-none group-hover:flex absolute right-1 top-1">
                           <div
                              style={{
                                 backgroundColor: marks["color"] ?? "",
                              }}
                              className="h-3 w-3 rounded-full"
                           />
                        </Listbox.Button>
                        <Transition
                           enter="transition duration-100 ease-out"
                           enterFrom="transform scale-95 opacity-0"
                           enterTo="transform scale-100 opacity-100"
                           leave="transition duration-75 ease-out"
                           leaveFrom="transform scale-100 opacity-100"
                           leaveTo="transform scale-95 opacity-0"
                        >
                           <Listbox.Options
                              className="border-color-sub text-1 bg-3-sub shadow-1 absolute -top-4 right-7 z-30 flex min-w-[100px]
                           items-center justify-center gap-2 rounded-full border p-2 shadow-sm"
                           >
                              {COLORS?.map((color: string, rowIdx: number) => (
                                 <Listbox.Option
                                    className="flex items-center justify-center"
                                    key={rowIdx}
                                    value={color}
                                 >
                                    <button
                                       type="button"
                                       onClick={() => toggleMark(editor, color)}
                                       className="h-3.5 w-3.5 rounded-full"
                                       key={color}
                                       style={{
                                          backgroundColor: color,
                                       }}
                                    ></button>
                                 </Listbox.Option>
                              ))}
                           </Listbox.Options>
                        </Transition>
                     </Listbox> */}
                     <Tooltip>
                        <TooltipTrigger>
                           <Button
                              ariaLabel="Toggle Italic"
                              onPointerDown={(e) => e.preventDefault()}
                              onClick={() => toggleMark(editor, "italic")}
                              className={`${
                                 marks && marks["italic"] === true
                                    ? "bg-zinc-200 dark:bg-dark500"
                                    : ""
                              } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-7 w-7 items-center justify-center rounded-lg`}
                           >
                              <Icon name="italic" size={14} />
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
                                    ? "bg-zinc-200 dark:bg-dark500"
                                    : ""
                              } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-7 w-7 items-center justify-center rounded-lg`}
                           >
                              <Icon name="underline" size={14} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Underline</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger>
                           <Button
                              ariaLabel="Toggle Strikethrough"
                              onPointerDown={(e) => e.preventDefault()}
                              onClick={() =>
                                 toggleMark(editor, "strikeThrough")
                              }
                              className={`${
                                 marks && marks["strikeThrough"] === true
                                    ? "bg-zinc-200 dark:bg-dark500"
                                    : ""
                              } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-7 w-7 items-center justify-center rounded-lg`}
                           >
                              <Icon name="strikethrough" size={14} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Strikethrough</TooltipContent>
                     </Tooltip>
                  </FloatingDelayGroup>
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
                           <Icon
                              name="link-2-off"
                              className="text-red-400"
                              size={16}
                           />
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
                                 "Enter the URL of the link:",
                              );
                              if (!url) return;
                              wrapLink(editor, url);
                           }}
                        >
                           <Icon
                              name="link-2"
                              className="text-blue-400"
                              size={14}
                           />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Update Link</TooltipContent>
                  </Tooltip>
               </section>
            ) : null}
         </div>,
         document.body,
      );
   }
}

// function getSelectedElementType(editor: Editor): TextBlock | null {
//    if (editor.selection == null) {
//       return null;
//    }

//    // If selection overlap on multiple top element, return null
//    if (
//       Path.compare(
//          topLevelPath(editor.selection.anchor.path),
//          topLevelPath(editor.selection.focus.path)
//       ) !== 0
//    ) {
//       return null;
//    }

//    const element = editor.children[
//       editor.selection.anchor.path[0]
//    ] as CustomElement;

//    if (!isTextElementType(element.type)) {
//       return null;
//    }

//    return element.type;
// }

// function isTextElementType(type: string): type is TextBlock {
//    return (
//       type === BlockType.H2 ||
//       type === BlockType.H3 ||
//       type === BlockType.Paragraph ||
//       type === BlockType.BulletedList ||
//       type === BlockType.ToDo ||
//       type === BlockType.Link
//    );
// }
