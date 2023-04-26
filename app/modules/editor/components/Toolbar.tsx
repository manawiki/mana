import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Editor, Path, Range, Transforms } from "slate";
import { useSlate } from "slate-react";
import Select from "./Select";
import Tooltip from "../../../components/Tooltip";

import {
   hasActiveLinkAtSelection,
   toggleLinkAtSelection,
   toggleMark,
   topLevelPath,
} from "../utils";
import type { CustomElement, TextBlock } from "../types";
import { BlockType } from "../types";
import { Bold, Italic, Link, Strikethrough, Underline } from "lucide-react";
import Button from "./Button";

export default function Toolbar() {
   const ref = useRef<HTMLDivElement | null>(null);
   const editor = useSlate();

   useEffect(() => {
      const el = ref.current;
      const { selection } = editor;

      if (!el) {
         return;
      }

      if (
         !selection ||
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

   return createPortal(
      <div
         ref={ref}
         className="border-color shadow-1 bg-1 pointer-events-auto -mt-16 flex items-center gap-2
         rounded-xl border px-3 py-2.5 opacity-0 shadow-lg transition-opacity duration-200 ease-in-out"
         onMouseDown={(e) => {
            // prevent toolbar from taking focus away from editor
            e.preventDefault();
         }}
      >
         {type && (
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
         )}

         <div className="flex items-center gap-1">
            <Tooltip id="link" content="Toggle Link">
               <Button
                  ariaLabel="Toggle Link"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => toggleLinkAtSelection(editor)}
                  className={`${
                     hasActiveLinkAtSelection(editor) === true
                        ? "bg-3 border-color border"
                        : ""
                  } hover:bg-2 flex h-8 w-8 items-center justify-center rounded-lg`}
               >
                  <Link size={16} />
               </Button>
            </Tooltip>

            <Tooltip id="bold" content="Toggle Bold">
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
            </Tooltip>
            <Tooltip id="italic" content="Toggle Italic">
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
            </Tooltip>
            <Tooltip id="underline" content="Toggle Underline">
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
            </Tooltip>
            <Tooltip id="strikethrough" content="Toggle Strikethrough">
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
            </Tooltip>
         </div>
      </div>,
      document.body
   );
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
