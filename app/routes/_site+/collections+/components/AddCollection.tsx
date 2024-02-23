import { useEffect, useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { toast } from "sonner";
import urlSlug from "url-slug";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Site } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { isAdding, isProcessing } from "~/utils/form";

import { CollectionSchema } from "../../c_+/$collectionId_.$entryId/utils/CollectionSchema";

export function AddCollection({
   site,
   setDnDCollections,
}: {
   site: Site;
   setDnDCollections: (collections: any) => void;
}) {
   const fetcher = useFetcher();
   const adding = isAdding(fetcher, "addCollection");

   const zoCollection = useZorm("newCollection", CollectionSchema);

   const disabled =
      isProcessing(fetcher.state) || zoCollection.validation?.success === false;

   // Reset the form after submission
   useEffect(() => {
      if (!adding) {
         setCollectionName("");
         setCollectionSlug("");
         setDnDCollections(site.collections);
      }
   }, [adding, site.collections]);

   const [collectionName, setCollectionName] = useState("");
   const [collectionSlug, setCollectionSlug] = useState("");

   return (
      <AdminOrStaffOrOwner>
         <fetcher.Form
            onSubmit={(e) => {
               const validation = zoCollection.validate();
               if (!validation.success) {
                  zoCollection.errors.name((err) => toast.error(err.message));
                  zoCollection.errors.slug((err) => toast.error(err.message));
                  e.preventDefault();
               }
            }}
            ref={zoCollection.ref}
            className="dark:bg-dark400 border  focus-within:border-zinc-300 border-zinc-200
                 dark:focus-within:border-zinc-500/70 dark:border-zinc-600 rounded-xl gap-4
                 shadow-sm shadow-1 mb-3 bg-zinc-50 flex items-center justify-between pr-2.5"
            method="POST"
            action="/collections"
         >
            <input
               disabled={disabled}
               placeholder="Type a collection name..."
               name={zoCollection.fields.name()}
               type="text"
               value={collectionName}
               onChange={(e) => {
                  setCollectionName(e.target.value);
                  setCollectionSlug(urlSlug(e.target.value));
               }}
               className="flex-grow focus:outline-none bg-transparent pl-4 text-sm h-12 focus:border-0 focus:ring-0 border-0"
            />
            <div className="flex items-center gap-1">
               {collectionName && (
                  <span className="text-xs text-1 font-bold">Slug</span>
               )}
               <input
                  disabled={disabled}
                  className="flex-none bg-transparent text-xs focus:outline-none"
                  name={zoCollection.fields.slug()}
                  value={collectionSlug}
                  onChange={(e) => {
                     setCollectionSlug(e.target.value);
                  }}
                  type="text"
               />
            </div>
            <input
               value={site.id}
               name={zoCollection.fields.siteId()}
               type="hidden"
            />
            <Button
               className="text-xs !py-1.5 !pl-2 !font-bold flex-none rounded-full"
               name="intent"
               value="addCollection"
               type="submit"
               color="dark/white"
               disabled={disabled}
            >
               {adding ? (
                  <Icon name="loader-2" size={15} className="animate-spin " />
               ) : (
                  <Icon name="plus" size={15} />
               )}
               Add
            </Button>
         </fetcher.Form>
      </AdminOrStaffOrOwner>
   );
}
