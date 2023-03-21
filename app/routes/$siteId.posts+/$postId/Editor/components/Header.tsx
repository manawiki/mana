import { useOthers, useSelf } from "~/liveblocks.config";
import Avatar from "./Avatar";
import { USER_COLORS } from "../constants";

export default function Header() {
   const others = useOthers();
   const me = useSelf();
   return (
      <>
         <div className="absolute right-4 laptop:-right-6 z-20 h-full">
            <div className="sticky space-y-2 top-20 w-12 bg-2 py-2 border rounded-full border-color">
               <div className="flex items-center justify-center gap-2">
                  <Avatar
                     key={me.connectionId}
                     imageUrl={me.info.avatar}
                     name={me.info.name}
                     color={USER_COLORS[me.connectionId % USER_COLORS.length]}
                  />
               </div>
               {others.length === 0 ? null : (
                  <div>
                     <div className="w-5 mb-2 h-0.5 dark:bg-zinc-700 bg-zinc-200 rounded-full mx-auto" />
                     {others.map((user) => {
                        const {
                           info: { avatar, name },
                           connectionId,
                        } = user;
                        return (
                           <div
                              key={user.id}
                              className="flex items-center justify-center gap-2"
                           >
                              <Avatar
                                 key={connectionId}
                                 imageUrl={avatar}
                                 name={name}
                                 color={
                                    USER_COLORS[
                                       connectionId % USER_COLORS.length
                                    ]
                                 }
                              />
                           </div>
                        );
                     })}
                  </div>
               )}
            </div>
         </div>
      </>
   );
}
