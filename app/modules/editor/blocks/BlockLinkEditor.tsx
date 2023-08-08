import { useCallback, useEffect, useRef, useState } from "react";

import isUrl from "is-url";
import { Editor, Transforms } from "slate";
import { ReactEditor, useEditor } from "slate-react";


export default function LinkEditor({ editorOffsets, selectionForLink }) {
   const linkEditorRef = useRef(null);
   const editor = useEditor();
   const [node, path] = Editor.above(editor, {
      at: selectionForLink,
      match: (n) => n.type === "link",
   });

   const [linkURL, setLinkURL] = useState(node.url);

   useEffect(() => {
      setLinkURL(node.url);
   }, [node]);

   const onLinkURLChange = useCallback(
      (event) => setLinkURL(event.target.value),
      [setLinkURL]
   );

   const onApply = useCallback(
      (event) => {
         Transforms.setNodes(editor, { url: linkURL }, { at: path });
      },
      [editor, linkURL, path]
   );

   useEffect(() => {
      const editorEl = linkEditorRef.current;
      if (editorEl == null) {
         return;
      }

      const linkDOMNode = ReactEditor.toDOMNode(editor, node);
      const {
         x: nodeX,
         height: nodeHeight,
         y: nodeY,
      } = linkDOMNode.getBoundingClientRect();

      editorEl.style.display = "block";
      editorEl.style.top = `${nodeY + nodeHeight - editorOffsets.y}px`;
      editorEl.style.left = `${nodeX - editorOffsets.x}px`;
   }, [editor, editorOffsets.x, editorOffsets.y, node]);

   if (editorOffsets == null) {
      return null;
   }

   return (
      <div ref={linkEditorRef} className={"link-editor"}>
         <div>
            <form>
               <input type="text" value={linkURL} onChange={onLinkURLChange} />
               <button
                  className={"link-editor-btn"}
                  disabled={!isUrl(linkURL)}
                  onClick={onApply}
               >
                  Apply
               </button>
            </form>
         </div>
      </div>
   );
}
