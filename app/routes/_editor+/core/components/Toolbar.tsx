import { Fragment, useEffect, useRef, useState } from "react";

import { FloatingDelayGroup, FloatingPortal } from "@floating-ui/react";
import { Listbox, Popover } from "@headlessui/react";
// import { Float } from "@headlessui-float/react";
import clsx from "clsx";
import { Editor, Range, Transforms, Element as SlateElement } from "slate";
import { useFocused, useSlate } from "slate-react";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import type { LinkElement } from "../types";
import { BlockType } from "../types";
import { toggleMark } from "../utils";

export const COLORS = [
   {
      id: "grayBG",
      type: "bg",
      twClass: "bg-zinc-400 dark:bg-zinc-700 text-white",
   },
   {
      id: "redBG",
      type: "bg",
      twClass: "bg-red-400 dark:bg-red-700/50 text-white",
   },
   {
      id: "orangeBG",
      type: "bg",
      twClass: "bg-orange-400 dark:bg-orange-700/50 text-white",
   },
   {
      id: "yellowBG",
      type: "bg",
      twClass: "bg-yellow-400 dark:bg-yellow-700/50 text-white",
   },
   {
      id: "greenBG",
      type: "bg",
      twClass: "bg-green-400 dark:bg-green-700/50 text-white",
   },
   {
      id: "limeBG",
      type: "bg",
      twClass: "bg-lime-400 dark:bg-lime-700/50 text-white",
   },
   {
      id: "blueBG",
      type: "bg",
      twClass: "bg-blue-400 dark:bg-blue-700/50 text-white",
   },
   {
      id: "violetBG",
      type: "bg",
      twClass: "bg-violet-400 dark:bg-violet-700/50 text-white",
   },
   {
      id: "pinkBG",
      type: "bg",
      twClass: "bg-pink-400 dark:bg-pink-700/50 text-white",
   },
   {
      id: "grayText",
      type: "text",
      twClass: "text-zinc-500",
   },
   {
      id: "redText",
      type: "text",
      twClass: "text-red-500",
   },
   {
      id: "orangeText",
      type: "text",
      twClass: "text-orange-500",
   },
   {
      id: "yellowText",
      type: "text",
      twClass: "text-yellow-500",
   },
   {
      id: "greenText",
      type: "text",
      twClass: "text-green-500",
   },
   {
      id: "limeText",
      type: "text",
      twClass: "text-lime-500",
   },
   {
      id: "blueText",
      type: "text",
      twClass: "text-blue-500",
   },
   {
      id: "violetText",
      type: "text",
      twClass: "text-violet-500",
   },
   {
      id: "pinkText",
      type: "text",
      twClass: "text-pink-500",
   },
];

export function Toolbar() {
   const ref = useRef<HTMLDivElement | null>(null);
   const editor = useSlate();
   const inFocus = useFocused();

   const [colorToggle, setColorToggle] = useState(false);

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
      return (
         <FloatingPortal>
            <div
               ref={ref}
               className="border-zinc-200 dark:border-zinc-600 shadow-1 bg-2-sub -mt-10 z-50
            rounded-xl border p-1 hidden shadow-lg"
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
                              <TooltipTrigger
                                 title="Add Link"
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
                                 } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-6 w-6 items-center justify-center rounded-lg`}
                              >
                                 <Icon name="link-2" size={14} />
                              </TooltipTrigger>
                              <TooltipContent>Add Link</TooltipContent>
                           </Tooltip>
                        )}
                        <Tooltip>
                           <TooltipTrigger
                              title="Toggle Bold"
                              onPointerDown={(e) => e.preventDefault()}
                              onClick={() => toggleMark(editor, "bold")}
                              className={`${
                                 marks && marks["bold"] === true
                                    ? "bg-zinc-200 dark:bg-dark500"
                                    : ""
                              } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-6 w-6 items-center justify-center rounded-lg`}
                           >
                              <Icon name="bold" size={14} />
                           </TooltipTrigger>
                           <TooltipContent>Toggle Bold</TooltipContent>
                        </Tooltip>
                        <Popover>
                           {({ open }) => (
                              <>
                                 {/* <Float
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                    placement="top"
                                    offset={4}
                                 > */}
                                 <Popover.Button as="div">
                                    <Tooltip placement="top">
                                       <TooltipTrigger
                                          title="Change Color"
                                          className="hover:bg-zinc-200 dark:hover:bg-dark500 flex 
                                             h-6 w-6 items-center justify-center rounded-lg"
                                       >
                                          {open ? (
                                             <Icon
                                                name="x"
                                                className="text-1"
                                                size={14}
                                             />
                                          ) : (
                                             <Icon name="palette" size={14} />
                                          )}
                                       </TooltipTrigger>
                                       <TooltipContent>Settings</TooltipContent>
                                    </Tooltip>
                                 </Popover.Button>
                                 <Popover.Panel
                                    className="border-color-sub justify-items-center min-w-[200px] text-1 bg-3-sub shadow-1 
                                       gap-1 z-30 grid grid-cols-9 rounded-lg border p-2 shadow-sm"
                                 >
                                    {COLORS?.map((color, rowIdx: number) => (
                                       <button
                                          key={rowIdx}
                                          type="button"
                                          onPointerDown={(e) =>
                                             e.preventDefault()
                                          }
                                          onClick={() =>
                                             toggleMark(editor, color.id)
                                          }
                                          className={clsx(
                                             color.twClass,
                                             "h-3.5 w-3.5 rounded-full flex items-center justify-center",
                                          )}
                                       >
                                          {color.type == "text" && (
                                             <Icon name="type" size={14} />
                                          )}
                                       </button>
                                    ))}
                                 </Popover.Panel>
                                 {/* </Float> */}
                              </>
                           )}
                        </Popover>
                        <Popover>
                           {({ open }) => (
                              <>
                                 {/* <Float
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                    placement="top"
                                    offset={4}
                                 > */}
                                 <Popover.Button as="div">
                                    <Tooltip placement="right">
                                       <TooltipTrigger
                                          title="More Options"
                                          className="hover:bg-zinc-200 dark:hover:bg-dark500 flex h-6 w-6 
                                             items-center justify-center rounded-lg"
                                       >
                                          {open ? (
                                             <Icon
                                                name="x"
                                                className="text-1"
                                                size={14}
                                             />
                                          ) : (
                                             <Icon
                                                name="more-vertical"
                                                size={16}
                                             />
                                          )}
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          More Options
                                       </TooltipContent>
                                    </Tooltip>
                                 </Popover.Button>
                                 <Popover.Panel
                                    className="border-color-sub justify-items-center text-1 bg-3-sub shadow-1 gap-1 z-30 
                                       flex rounded-lg border p-2 shadow-sm"
                                 >
                                    <Tooltip>
                                       <TooltipTrigger
                                          title="Toggle Small"
                                          onPointerDown={(e) =>
                                             e.preventDefault()
                                          }
                                          onClick={() =>
                                             toggleMark(editor, "small")
                                          }
                                          className={`${
                                             marks && marks["small"] === true
                                                ? "bg-zinc-200 dark:bg-dark500"
                                                : ""
                                          } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-6 w-6 items-center justify-center rounded-lg`}
                                       >
                                          <Icon name="type" size={14} />
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          Toggle Small
                                       </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                       <TooltipTrigger
                                          title="Toggle Italic"
                                          onPointerDown={(e) =>
                                             e.preventDefault()
                                          }
                                          onClick={() =>
                                             toggleMark(editor, "italic")
                                          }
                                          className={`${
                                             marks && marks["italic"] === true
                                                ? "bg-zinc-200 dark:bg-dark500"
                                                : ""
                                          } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-6 w-6 items-center justify-center rounded-lg`}
                                       >
                                          <Icon name="italic" size={14} />
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          Toggle Italic
                                       </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                       <TooltipTrigger
                                          aria-label="Toggle Underline"
                                          onPointerDown={(e) =>
                                             e.preventDefault()
                                          }
                                          onClick={() =>
                                             toggleMark(editor, "underline")
                                          }
                                          className={`${
                                             marks &&
                                             marks["underline"] === true
                                                ? "bg-zinc-200 dark:bg-dark500"
                                                : ""
                                          } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-6 w-6 items-center justify-center rounded-lg`}
                                       >
                                          <Icon name="underline" size={14} />
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          Toggle Underline
                                       </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                       <TooltipTrigger
                                          title="Toggle Strikethrough"
                                          onPointerDown={(e) =>
                                             e.preventDefault()
                                          }
                                          onClick={() =>
                                             toggleMark(editor, "strikeThrough")
                                          }
                                          className={`${
                                             marks &&
                                             marks["strikeThrough"] === true
                                                ? "bg-zinc-200 dark:bg-dark500"
                                                : ""
                                          } hover:bg-zinc-200 dark:hover:bg-dark500 flex h-6 w-6 items-center justify-center rounded-lg`}
                                       >
                                          <Icon
                                             name="strikethrough"
                                             size={14}
                                          />
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          Toggle Strikethrough
                                       </TooltipContent>
                                    </Tooltip>
                                 </Popover.Panel>
                                 {/* </Float> */}
                              </>
                           )}
                        </Popover>
                     </FloatingDelayGroup>
                  </div>
               </section>
               {isLinkActive(editor) ? (
                  <section className="bg-3 mt-1.5 flex items-center gap-3 truncate rounded-md px-2">
                     <span className="text-1 w-32 flex-grow truncate py-2 text-xs">
                        {activeLinkUrl(editor)}
                     </span>
                     <Tooltip>
                        <TooltipTrigger
                           title="Remove Link"
                           className="flex items-center p-1"
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
                        </TooltipTrigger>
                        <TooltipContent>Remove Link</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger
                           title="Update Link"
                           className="flex items-center p-1"
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
                        </TooltipTrigger>
                        <TooltipContent>Update Link</TooltipContent>
                     </Tooltip>
                  </section>
               ) : null}
            </div>
         </FloatingPortal>
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
