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

export const PostDeleteModal = ({
   postId,
   isDeleteOpen,
   setDeleteOpen,
}: {
   postId: string;
   isDeleteOpen: boolean;
   setDeleteOpen: (open: boolean) => void;
}) => {
   const fetcher = useFetcher();
   const deleting = isAdding(fetcher, "deletePost");
   const disabled = isProcessing(fetcher.state);

   return (
      <Alert open={isDeleteOpen} onClose={setDeleteOpen}>
         <AlertTitle>
            Are you sure you want to delete this post permanently?
         </AlertTitle>
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
                     { intent: "deletePost", postId },
                     { method: "delete" },
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
   );
};
