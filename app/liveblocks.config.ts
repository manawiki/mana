import type { LiveList } from "@liveblocks/client";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
   authEndpoint: "/action/authorize-liveblocks",
});

export type Presence = {
   selectedBlockId: string | null;
};

type Storage = {
   blocks: LiveList<{}>;
};

type UserMeta = {
   id: string;
   info: {
      name: string;
      avatar: string;
   };
};

export const {
   suspense: {
      RoomProvider,
      useMutation,
      useOthers,
      useOthersMapped,
      useSelf,
      useStorage,
      useUpdateMyPresence,
      useList,
      useRoom,
   },
} = createRoomContext<Presence, Storage, UserMeta /* RoomEvent */>(client);
