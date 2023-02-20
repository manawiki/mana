import { useDocChanged, useHelpers } from "@remirror/react";
import { MarkdownEditorCustom } from "./MarkdownEditorCustom";
import { useCallback } from "react";

interface OnChangeHTMLProps {
   onChange: (e: string) => void;
}

const OnChangeMD = ({ onChange }: OnChangeHTMLProps): null => {
   const { getMarkdown } = useHelpers();

   useDocChanged(
      useCallback(
         ({ state }) => {
            const md = getMarkdown(state);
            onChange(md);
         },
         [onChange, getMarkdown]
      )
   );
   return null;
};

function SaveButton() {
   const { getMarkdown } = useHelpers();
   return <input type="hidden" name="mdx" value={getMarkdown()}></input>;
}

//This renders an basic textarea editor
export default function NoteText({
   defaultValue,
   onChange,
}: {
   defaultValue: string;
   onChange: (e: React.ChangeEvent<HTMLTextAreaElement> | string) => void;
}) {
   return (
      <div>
         <MarkdownEditorCustom
            initialContent={defaultValue}
            placeholder="Enter text..."
         >
            <OnChangeMD onChange={onChange} />
            <SaveButton />
         </MarkdownEditorCustom>
      </div>
   );
}
