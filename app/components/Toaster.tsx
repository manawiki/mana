import { Check, X } from "lucide-react";
import { toast as customToast } from "react-hot-toast";

const success = (message: string) => {
   customToast.custom((t) => (
      <div
         className={`${
            t.visible ? "animate-enter" : "animate-leave"
         } border-color pointer-events-auto flex max-w-sm items-center gap-3 rounded-lg
              border-2 bg-white p-3 font-semibold shadow-lg dark:bg-zinc-800`}
      >
         <div
            className="flex h-6 w-6 items-center justify-center
                           rounded-full bg-green-500 text-white"
         >
            <Check size={18} />
         </div>
         <div>{message}</div>
      </div>
   ));
};

const error = (message: string) => {
   customToast.custom((t) => (
      <div
         className={`${
            t.visible ? "animate-enter" : "animate-leave"
         } border-color pointer-events-auto flex max-w-sm items-center gap-3 rounded-lg
             border-2 bg-white p-3 font-semibold shadow-lg dark:bg-zinc-800`}
      >
         <div
            className="flex h-6 w-6 items-center justify-center
                      rounded-full bg-red-500 text-white"
         >
            <X size={18} />
         </div>
         <div>{message}</div>
      </div>
   ));
};

export const toast = { success, error };
