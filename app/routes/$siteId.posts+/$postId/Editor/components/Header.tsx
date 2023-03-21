import styles from "./Header.module.css";
import { useOthers } from "~/liveblocks.config";
import Avatar from "./Avatar";
import { USER_COLORS } from "../constants";

export default function Header() {
   const others = useOthers();

   return (
      <header className={styles.header}>
         <div className={styles.right}>
            <div className={styles.avatars}>
               {others.map((user) => {
                  const {
                     info: { imageUrl, name },
                     connectionId,
                  } = user;
                  return (
                     <Avatar
                        key={connectionId}
                        imageUrl={imageUrl}
                        name={name}
                        color={USER_COLORS[connectionId % USER_COLORS.length]}
                     />
                  );
               })}
            </div>
         </div>
      </header>
   );
}
