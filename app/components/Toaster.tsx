import clsx from "clsx";
import { toast as customToast } from "react-hot-toast";

import { Icon } from "./Icon";

const success = (message: string) => {
   customToast.custom((t) => (
      <div
         className={clsx(
            t.visible ? "animate-enter" : "animate-leave",
            "pointer-events-auto max-w-sm mt-6 items-center border border-color-sub relative gap-3 rounded-xl bg-3-sub p-4 font-semibold shadow-2xl shadow-1",
         )}
      >
         <div className="flex items-center justify-center absolute left-1/2 -top-3 transform -translate-x-1/2">
            <div className="flex h-6 w-6 mx-auto items-center justify-center rounded-full bg-green-100 border dark:bg-green-950 dark:border-green-800 border-green-200 text-green-500">
               <Icon name="check" size={16} />
            </div>
         </div>
         <div className="text-sm">{message}</div>
      </div>
   ));
};

const error = (message: string) => {
   customToast.custom((t) => (
      <div
         className={clsx(
            t.visible ? "animate-enter" : "animate-leave",
            "pointer-events-auto max-w-sm mt-6 items-center border border-color-sub relative gap-3 rounded-xl bg-3-sub p-4 font-semibold shadow-2xl shadow-1",
         )}
      >
         <div className="flex items-center justify-center absolute left-1/2 -top-3 transform -translate-x-1/2">
            <div className="flex h-6 w-6 mx-auto items-center justify-center rounded-full bg-red-100 border dark:bg-red-950 dark:border-red-800 border-red-200 text-red-500">
               <Icon name="x" size={16} />
            </div>
         </div>
         <div className="text-sm">{message}</div>
      </div>
   ));
};

export const toast = { success, error };
