import type { Note } from "payload-types";
import { NoteText } from "./NoteText";
import NoteTierList from "./TierList";

/** Set the default note type to text
 * @param note - The note to render
 * @param onChange - The onChange handler
 * @returns The ui editor for the note
 */
export function NoteSelector({
   note,
   onChange,
}: {
   note: Note;
   onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
   const noteType = typeof note.ui === "string" ? note.ui : note?.ui?.id;
   switch (noteType) {
      case "textarea":
         return <NoteText defaultValue={note.mdx} onChange={onChange} />;
      case "tierlist":
         return <NoteTierList defaultValue={note.mdx} onChange={onChange} />;
      default:
         return <NoteText defaultValue={note.mdx} onChange={onChange} />;
   }
}
