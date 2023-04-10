import { useOthers } from "~/liveblocks.config";
import Avatar from "./Avatar";
import { USER_COLORS } from "../forge/constants";

export default function ActiveEditors() {
   const others = useOthers();
   return (
      <>
         <div className="flex items-center gap-3">
            {others.length === 0 ? null : (
               <div className="flex items-center">
                  {others.map((user) => {
                     const {
                        info: { avatar, name },
                        connectionId,
                     } = user;
                     return (
                        <div
                           key={user.id}
                           className="flex -ml-2 first:ml-0 z-10 items-center justify-center gap-2"
                        >
                           <Avatar
                              key={connectionId}
                              imageUrl={avatar}
                              name={name}
                              color={
                                 USER_COLORS[connectionId % USER_COLORS.length]
                              }
                           />
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
      </>
   );
}
