import type { FC, PropsWithChildren } from "react";
import { useCallback } from "react";
import jsx from "refractor/lang/jsx.js";
import typescript from "refractor/lang/typescript.js";
import { ExtensionPriority } from "remirror";
import {
   BlockquoteExtension,
   BoldExtension,
   BulletListExtension,
   CodeBlockExtension,
   CodeExtension,
   HardBreakExtension,
   HeadingExtension,
   ItalicExtension,
   LinkExtension,
   ListItemExtension,
   MarkdownExtension,
   OrderedListExtension,
   PlaceholderExtension,
   StrikeExtension,
   TableExtension,
   TrailingNodeExtension,
} from "remirror/extensions";
import {
   EditorComponent,
   Remirror,
   useRemirror,
   useChainedCommands,
   FloatingToolbar,
   useActive,
} from "@remirror/react";

import type { CreateEditorStateProps } from "remirror";
import type { RemirrorProps } from "@remirror/react";
import {
   Bold,
   Code,
   CurlyBraces,
   Heading2,
   Heading3,
   Italic,
   List,
   ListOrdered,
   Quote,
   Strikethrough,
} from "lucide-react";

interface ReactEditorProps
   extends Pick<CreateEditorStateProps, "stringHandler">,
      Pick<
         RemirrorProps,
         "initialContent" | "editable" | "autoFocus" | "hooks"
      > {
   placeholder?: string;
}

export default { title: "Editors / Markdown" };

export interface MarkdownEditorProps
   extends Partial<Omit<ReactEditorProps, "stringHandler">> {
   theme: "yellow" | "emerald" | "purple";
}

export const Menu = ({ theme }: { theme: "yellow" | "emerald" | "purple" }) => {
   // Using command chaining
   const chain = useChainedCommands();

   const active = useActive();
   const groupDefaultStyle = `bg-4 h-8 w-8 flex items-center justify-center`;
   const activeStyle = `bg-3 text-${theme}-500`;
   const groupParentStyle = `divide-x divide-color overflow-hidden flex-none
   rounded-lg shadow-1 shadow-sm border border-color flex items-center shadow-1`;

   return (
      <div className="overflow-auto max-laptop:mr-32 top-36 sticky laptop:top-20 z-20 pb-0.5">
         <div className="flex items-center gap-3 flex-nowrap ">
            <div className={`${groupParentStyle}`}>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleBold()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.bold() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <Bold size={18} />
               </button>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleItalic()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.italic() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <Italic size={18} />
               </button>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleStrike()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.strike() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <Strikethrough size={18} />
               </button>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleBlockquote()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.blockquote() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <Quote size={16} />
               </button>
            </div>
            <div className={`${groupParentStyle}`}>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleBulletList()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.bulletList() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <List size={18} />
               </button>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleOrderedList()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.orderedList() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <ListOrdered size={18} />
               </button>
            </div>
            <div className={`${groupParentStyle}`}>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleHeading({ level: 2 })
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.heading({ level: 2 }) ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <Heading2 size={18} />
               </button>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleHeading({ level: 3 })
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.heading({ level: 3 }) ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <Heading3 size={18} />
               </button>
            </div>
            <div className={`${groupParentStyle}`}>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleCode()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.code() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <Code size={18} />
               </button>
               <button
                  onClick={() => {
                     chain // Begin a chain
                        .toggleCodeBlock()
                        .focus()
                        .run(); // A chain must always be terminated with `.run()`
                  }}
                  className={`${
                     active.codeBlock() ? `${activeStyle}` : ""
                  } ${groupDefaultStyle}`}
               >
                  <CurlyBraces size={16} />
               </button>
            </div>
         </div>
      </div>
   );
};

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const MarkdownEditorCustom: FC<
   PropsWithChildren<MarkdownEditorProps>
> = ({ placeholder, theme, children, ...rest }) => {
   const extensions = useCallback(
      () => [
         new PlaceholderExtension({ placeholder }),
         new LinkExtension({ autoLink: true }),
         new BoldExtension(),
         new StrikeExtension(),
         new ItalicExtension(),
         new HeadingExtension(),
         new LinkExtension(),
         new BlockquoteExtension(),
         new BulletListExtension({ enableSpine: true }),
         new OrderedListExtension(),
         new ListItemExtension({
            priority: ExtensionPriority.High,
            enableCollapsible: true,
         }),
         new CodeExtension(),
         new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
         new TrailingNodeExtension(),
         new TableExtension(),
         new MarkdownExtension({ copyAsMarkdown: false }),
         /**
          * `HardBreakExtension` allows us to create a newline inside paragraphs.
          * e.g. in a list item
          */
         new HardBreakExtension(),
      ],
      [placeholder]
   );

   const { manager } = useRemirror({
      extensions,
      stringHandler: "markdown",
   });

   return (
      <div className="remirror-theme">
         <Remirror manager={manager} {...rest}>
            <Menu theme={theme} />
            <EditorComponent />
            {/* <FloatingToolbar>
               <Menu />
            </FloatingToolbar> */}
            {children}
         </Remirror>
      </div>
   );
};
