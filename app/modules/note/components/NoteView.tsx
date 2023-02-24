import { useMDXComponents } from "@mdx-js/react";
import { runSync } from "@mdx-js/mdx";
import { useMemo } from "react";
import type { Note } from "payload/generated-types";
import { runtime } from "../utils";

type NoteViewerProps = {
   note: Note;
   className?: string;
};

export function NoteViewer({
   note,
   className = "mdx-content",
}: NoteViewerProps) {
   if (!note) return null;
   if (note.source) return <NoteView note={note} />;
   if (note.html) return <NoteStatic note={note} />;

   return null;
}

//todo perf comparison with async
export function NoteView({ note, className = "mdx-content" }: NoteViewerProps) {
   const { default: Content } = useMemo(
      () => runSync(note.source as string, { ...runtime(), useMDXComponents }),
      [note.source]
   );

   return <div className={className}>{Content()}</div>;
}

export function NoteStatic({
   note,
   className = "mdx-content",
}: NoteViewerProps) {
   return note?.html ? (
      <div
         className={className}
         dangerouslySetInnerHTML={{ __html: note.html }}
      />
   ) : null;
}
