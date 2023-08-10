import { useFetcher } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Modal } from "~/components/Modal";
import { isAdding } from "~/utils";

export const PostDeleteModal = ({
   isDeleteOpen,
   setDeleteOpen,
}: {
   isDeleteOpen: any;
   setDeleteOpen: any;
}) => {
   const fetcher = useFetcher();
   const deleting = isAdding(fetcher, "delete");
   const { t } = useTranslation("post");

   return (
      <Modal
         onClose={() => {
            setDeleteOpen(false);
         }}
         show={isDeleteOpen}
      >
         <div
            className="bg-2 mx-5 max-w-sm transform rounded-2xl
               p-6 text-left align-middle shadow-xl transition-all"
         >
            <div className="pb-6">
               <div className="pb-2 text-center text-lg font-bold">
                  Are you sure you want to delete this post permanently?
               </div>
               <div className="text-1 text-center">
                  You cannot undo this action.
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button
                  className="h-10 rounded-md bg-zinc-200 text-sm 
                     font-bold focus:bg-zinc-100 dark:bg-zinc-700 dark:focus:bg-zinc-600"
                  onClick={() => setDeleteOpen(false)}
               >
                  Cancel
               </button>
               <button
                  onClick={() =>
                     fetcher.submit({ intent: "delete" }, { method: "delete" })
                  }
                  className="h-10 w-full rounded-md bg-red-500 text-sm font-bold text-white
                                              focus:bg-red-400 dark:bg-red-600 dark:focus:bg-red-500"
               >
                  {deleting ? (
                     <Loader2 className="mx-auto h-5 w-5 animate-spin text-red-200" />
                  ) : (
                     t("actions.delete")
                  )}
               </button>
            </div>
         </div>
      </Modal>
   );
};
