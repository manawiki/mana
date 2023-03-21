import styles from "./Avatar.module.css";
import Tooltip from "./Tooltip";

type Props = {
   imageUrl: string;
   name: string;
   size?: "sm" | "md";
   color?: string;
};

export default function Avatar({ imageUrl, name, size = "md", color }: Props) {
   console.log(name);
   return (
      <Tooltip content={name}>
         <button className="h-8 w-8 rounded-full overflow-hidden">
            <img src={imageUrl} alt="" />
            {color && (
               <span
                  className={styles.avatar_color}
                  style={{
                     boxShadow: `0 0 0 2px ${color}, 0 0 0 4px rgb(var(--color-surface))`,
                  }}
               />
            )}
         </button>
      </Tooltip>
   );
}
