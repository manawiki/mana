import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
   Alert,
   AlertActions,
   AlertDescription,
   AlertTitle,
} from "~/components/Alert";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { isAdding, isProcessing } from "~/utils/form";

function UserDeleteSection() {
   const fetcher = useFetcher();
   const deleting = isAdding(fetcher, "deleteUserAccount");
   const [isDeleteOpen, setDeleteOpen] = useState(false);

   const disabled = isProcessing(fetcher.state);

   return (
      <div className="relative z-50 w-full">
         <div className="flex h-full flex-grow flex-col border-b pb-4 self-end border-color justify-end">
            <div className="items-center justify-between gap-8 laptop:flex">
               <div className="max-laptop:pb-4">
                  <div className="pb-0.5 font-bold">Delete your account</div>
                  <div className="text-1 text-xs">
                     Permanently delete your account information
                  </div>
               </div>
               <button
                  className="h-10 rounded-md border border-red-400 px-4 text-sm font-bold 
               text-red-500 hover:bg-red-50 dark:border-red-500 dark:hover:bg-zinc-800"
                  onClick={() => setDeleteOpen(true)}
               >
                  Delete Account
               </button>
            </div>
         </div>
         <Alert onClose={setDeleteOpen} open={isDeleteOpen}>
            <AlertTitle>This will permanently delete your account</AlertTitle>
            <AlertDescription>You cannot undo this action.</AlertDescription>
            <AlertActions>
               <Button
                  plain
                  disabled={disabled}
                  className="text-sm cursor-pointer"
                  onClick={() => setDeleteOpen(false)}
               >
                  Cancel
               </Button>
               <Button
                  disabled={disabled}
                  className="text-sm cursor-pointer"
                  color="red"
                  onClick={() =>
                     fetcher.submit(
                        { intent: "deleteUserAccount" },
                        {
                           method: "delete",
                           action: "/auth-actions",
                        },
                     )
                  }
               >
                  {deleting ? (
                     <Icon
                        name="loader-2"
                        size={16}
                        className="mx-auto animate-spin"
                     />
                  ) : (
                     "Delete"
                  )}
               </Button>
            </AlertActions>
         </Alert>
      </div>
   );
}
