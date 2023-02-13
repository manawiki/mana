import { Sites } from "./Sites";
import { Images } from "./Images";
import { Users } from "./Users";
import { Notes } from "./Notes";
import { Posts } from "./Posts";
import { Collections } from "./Collections";
import { Questions } from "./Questions";
import { Entries } from "./Entries";
import { NoteTypes } from "./NoteTypes";
import { CustomCollections } from "../../_custom/collections";

export const collections = [
  Sites,
  Images,
  Users,
  Notes,
  Posts,
  Collections,
  Questions,
  Entries,
  NoteTypes,
  ...CustomCollections,
];
