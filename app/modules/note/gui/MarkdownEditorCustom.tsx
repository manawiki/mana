import type { FC, PropsWithChildren } from "react";
import { useCallback } from "react";
import jsx from "refractor/lang/jsx.js";
import typescript from "refractor/lang/typescript.js";
import { ExtensionPriority } from "remirror";
import { AllStyledComponent } from "@remirror/styles/emotion";
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
   MarkdownToolbar,
   Remirror,
   useRemirror,
   ThemeProvider,
} from "@remirror/react";

import type { CreateEditorStateProps } from "remirror";
import type { RemirrorProps } from "@remirror/react";

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
   extends Partial<Omit<ReactEditorProps, "stringHandler">> {}

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const MarkdownEditorCustom: FC<
   PropsWithChildren<MarkdownEditorProps>
> = ({ placeholder, children, ...rest }) => {
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
      <AllStyledComponent>
         <ThemeProvider>
            <Remirror manager={manager} autoFocus {...rest}>
               <MarkdownToolbar />
               <EditorComponent />
               {children}
            </Remirror>
         </ThemeProvider>
      </AllStyledComponent>
   );
};
