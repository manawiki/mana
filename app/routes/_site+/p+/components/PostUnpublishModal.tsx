import { useEffect } from "react";

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

export const PostUnpublishModal = ({
   postId,
   isUnpublishOpen,
   setUnpublishOpen,
}: {
   postId: string;
   isUnpublishOpen: boolean;
   setUnpublishOpen: (open: boolean) => void;
}) => {
   const fetcher = useFetcher();
   const unpublishing = isAdding(fetcher, "unpublish");

   const disabled = isProcessing(fetcher.state);

   useEffect(() => {
      if (!unpublishing) {
         setUnpublishOpen(false);
      }
   }, [unpublishing]);

   return (
      <Alert open={isUnpublishOpen} onClose={setUnpublishOpen}>
         <AlertTitle>Are you sure you want to unpublish this post?</AlertTitle>
         <AlertDescription>
            Your post will no longer be publicly viewable.
         </AlertDescription>
         <AlertActions>
            <Button
               plain
               disabled={disabled}
               className="text-sm cursor-pointer"
               onClick={() => setUnpublishOpen(false)}
            >
               Cancel
            </Button>
            <Button
               disabled={disabled}
               className="text-sm cursor-pointer"
               onClick={() => {
                  fetcher.submit(
                     { intent: "unpublish", postId },
                     { method: "post" },
                  );
               }}
            >
               {unpublishing ? (
                  <Icon
                     name="loader-2"
                     size={16}
                     className="mx-auto animate-spin"
                  />
               ) : (
                  "Unpublish"
               )}
            </Button>
         </AlertActions>
      </Alert>
   );
};
