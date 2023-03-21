import { useOthers } from "~/liveblocks.config";
import Avatar from "./Avatar";
import { USER_COLORS } from "../constants";

export default function Header() {
   const others = useOthers();
   return (
      <>
         {others.map((user) => {
            const {
               info: { avatar, name },
               connectionId,
            } = user;
            return (
               <Avatar
                  key={connectionId}
                  imageUrl={avatar}
                  name={name}
                  color={USER_COLORS[connectionId % USER_COLORS.length]}
               />
            );
         })}
      </>
   );
}
