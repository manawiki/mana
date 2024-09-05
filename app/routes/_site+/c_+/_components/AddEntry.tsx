import { useEffect } from "react";

import { useFetcher, useParams } from "@remix-run/react";
import { useZorm } from "react-zorm";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { isAdding } from "~/utils/form";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { EntrySchema } from "../../collections+/sections";

export function AddEntry() {
   //Form/fetcher
   const fetcher = useFetcher();
   const addingUpdate = isAdding(fetcher, "addEntry");
   const zoEntry = useZorm("newEntry", EntrySchema);

   const { site } = useSiteLoaderData();

   const { collectionId } = useParams();

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   );

   //Reset form after submission
   useEffect(() => {
      if (!addingUpdate) {
         zoEntry.refObject.current && zoEntry.refObject.current.reset();
      }
   }, [addingUpdate, zoEntry.refObject]);

   //Get root domain from full domain url
   return (
      <section className="relative">
         {!collection?.customDatabase && (
            <AdminOrStaffOrOwner>
               <div className="flex items-center gap-4 w-full">
                  <fetcher.Form
                     ref={zoEntry.ref}
                     method="post"
                     action="/collections/entry"
                     className="flex items-center justify-between gap-4 flex-grow"
                  >
                     <Input
                        required
                        placeholder="Type an entry name..."
                        name={zoEntry.fields.name()}
                        type="text"
                        className="w-full focus:outline-none !bg-transparent text-sm focus:border-0 focus:ring-0 border-0"
                     />
                     <input
                        value={collection?.id}
                        name={zoEntry.fields.collectionId()}
                        type="hidden"
                     />
                     <input
                        value={site?.id}
                        name={zoEntry.fields.siteId()}
                        type="hidden"
                     />
                     <Button
                        className="h-11 tablet:h-9 w-24"
                        name="intent"
                        value="addEntry"
                        type="submit"
                        color="blue"
                     >
                        {addingUpdate ? (
                           <Icon
                              name="loader-2"
                              size={14}
                              className="animate-spin "
                           />
                        ) : (
                           <Icon
                              className="text-blue-200"
                              name="plus"
                              size={14}
                           />
                        )}
                        Add
                     </Button>
                  </fetcher.Form>
               </div>
            </AdminOrStaffOrOwner>
         )}
      </section>
   );
}
