import type { Note } from "~/payload-types";
import NoteText from "./NoteText";
import NoteTierList from "./TierList";

export function NoteSelector({ note }: { note: Note }) {
    //@ts-ignore
    const noteType = note?.ui?.id;
    switch (noteType) {
        case "textarea":
            return <NoteText defaultValue={note.mdx} />;
        case "tierlist":
            return <NoteTierList defaultValue={note.mdx} />;
        default:
            return <NoteText defaultValue={note.mdx} />;
    }
}
