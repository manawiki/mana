import type { Note } from "payload-types";
import NoteText from "./NoteText";
import NoteTierList from "./TierList";

export function NoteSelector({
   note,
   onChange,
}: {
   note: Note;
   onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
   //@ts-ignore
   const noteType = note?.ui?.id;
   switch (noteType) {
      case "textarea":
         return <NoteText defaultValue={note.mdx} onChange={onChange} />;
      case "tierlist":
         return <NoteTierList defaultValue={note.mdx} onChange={onChange} />;
      default:
         return <NoteText defaultValue={note.mdx} onChange={onChange} />;
   }
}
