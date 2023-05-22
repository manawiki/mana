import { useOthers } from "~/liveblocks.config";
import Avatar from "~/modules/editor/components/Avatar";
import { USER_COLORS } from "~/modules/editor/constants";

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
                           className="z-10 -ml-2 flex items-center justify-center gap-2 first:ml-0"
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
