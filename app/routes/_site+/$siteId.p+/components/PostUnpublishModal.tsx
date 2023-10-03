import { useFetcher } from "@remix-run/react";
import { Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Modal } from "~/components/Modal";
import { isAdding } from "~/utils";

export const PostUnpublishModal = ({
   isUnpublishOpen,
   setUnpublishOpen,
}: {
   isUnpublishOpen: boolean;
   setUnpublishOpen: any;
}) => {
   const fetcher = useFetcher();
   const unpublishing = isAdding(fetcher, "unpublish");
   const { t } = useTranslation("post");

   return (
      <Modal
         onClose={() => {
            setUnpublishOpen(false);
         }}
         show={isUnpublishOpen}
      >
         <div
            className="border-color bg-1 mx-5 max-w-md transform rounded-2xl
                              border-2 py-6 px-8 text-left align-middle shadow-xl transition-all"
         >
            <div className="pb-6">
               <div className="pb-2 text-center text-lg font-bold">
                  Are you sure you want to unpublish this post?
               </div>
               <div className="text-1 text-center">
                  Your post will no longer be publically viewable.
               </div>
            </div>
            <button
               className="absolute -right-4 -top-4 flex h-8 w-8
            items-center justify-center rounded-full border-2 border-red-300 bg-1
         hover:bg-red-50 dark:border-zinc-600 dark:hover:bg-zinc-700"
               onClick={() => setUnpublishOpen(false)}
            >
               <X className="h-5 w-5 text-red-400" />
            </button>
            <div className="grid grid-cols-2 gap-4">
               <button
                  className="h-10 rounded-md bg-zinc-200 text-sm 
               font-bold focus:bg-zinc-100 dark:bg-zinc-700 dark:focus:bg-zinc-600"
                  onClick={() => setUnpublishOpen(false)}
               >
                  Cancel
               </button>
               <button
                  onClick={() => {
                     fetcher.submit(
                        { intent: "unpublish" },
                        { method: "post" },
                     );
                     setUnpublishOpen(false);
                  }}
                  className="h-10 w-full rounded-md bg-zinc-500 text-sm font-bold text-white
                                        focus:bg-zinc-400 dark:bg-zinc-600 dark:focus:bg-zinc-500"
               >
                  {unpublishing ? (
                     <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                  ) : (
                     t("actions.unpublish")
                  )}
               </button>
            </div>
         </div>
      </Modal>
   );
};
