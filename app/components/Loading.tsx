import { Icon } from "./Icon";

export const Loading = () => (
   <div className="flex items-center justify-center py-10">
      <Icon
         name="loader-2"
         size={20}
         className="animate-spin dark:text-zinc-500 text-zinc-400"
      />
   </div>
);
