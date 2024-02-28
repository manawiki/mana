import { useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";

import {
   Alert,
   AlertTitle,
   AlertDescription,
   AlertActions,
} from "~/components/Alert";
import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import {
   Dropdown,
   DropdownButton,
   DropdownItem,
   DropdownLabel,
   DropdownMenu,
} from "~/components/Dropdown";
import { Field, FieldGroup, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { isAdding, isProcessing } from "~/utils/form";

import { EntrySchemaUpdateSchema } from "../utils/EntrySchema";

export function EntryEdit({ entry }: { entry: any }) {
   let [isSettingsOpen, setSettingsOpen] = useState(false);
   const fetcher = useFetcher();

   const [isDeleteOpen, setDeleteOpen] = useState(false);
   let [isChanged, setIsChanged] = useState(false);

   const deleting = isAdding(fetcher, "deleteEntry");

   const saving = isAdding(fetcher, "updateEntry");

   const disabled = isProcessing(fetcher.state);

   const zoEntryUpdate = useZorm("entryUpdate", EntrySchemaUpdateSchema);

   return (
      <>
         <Button
            color="dark/white"
            className="max-tablet:!py-1.5"
            onClick={() => setSettingsOpen(true)}
         >
            <Icon name="pencil" size={12} />
            Edit
         </Button>
         <Dialog
            size="md"
            onClose={() => {
               setSettingsOpen(false);
            }}
            open={isSettingsOpen}
         >
            <fetcher.Form
               onChange={() => setIsChanged(true)}
               ref={zoEntryUpdate.ref}
               method="POST"
               action="/collections/entry"
            >
               <input
                  type="hidden"
                  name={zoEntryUpdate.fields.entryId()}
                  value={entry.id}
               />
               <FieldGroup>
                  <Field disabled={disabled}>
                     <Label>Entry Name</Label>
                     <Input
                        required
                        name={zoEntryUpdate.fields.name()}
                        type="text"
                        defaultValue={entry?.name}
                     />
                  </Field>
                  <Field disabled={disabled}>
                     <Label>Entry Slug</Label>
                     <Input
                        required
                        name={zoEntryUpdate.fields.slug()}
                        type="text"
                        defaultValue={entry?.slug}
                     />
                  </Field>
                  <input
                     readOnly
                     type="hidden"
                     name={zoEntryUpdate.fields.existingSlug()}
                     value={entry?.slug}
                  />
                  <input
                     readOnly
                     type="hidden"
                     name={zoEntryUpdate.fields.siteId()}
                     value={entry.siteId}
                  />
                  <input
                     readOnly
                     type="hidden"
                     name={zoEntryUpdate.fields.collectionId()}
                     value={entry.collectionEntity}
                  />
               </FieldGroup>
               <div className="flex items-center justify-between gap-2 pt-6 relative">
                  <Dropdown>
                     <DropdownButton outline aria-label="More options">
                        <Icon
                           name="more-horizontal"
                           size={16}
                           className="text-1"
                        />
                     </DropdownButton>
                     <DropdownMenu className="z-50" anchor="bottom start">
                        <DropdownItem onClick={() => setDeleteOpen(true)}>
                           <Icon
                              className="mr-2 text-red-400"
                              name="trash"
                              size={14}
                           />
                           <DropdownLabel className="font-semibold">
                              Delete
                           </DropdownLabel>
                        </DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
                  <div className="flex items-center gap-3">
                     {isChanged && !disabled && (
                        <Button
                           plain
                           type="button"
                           onClick={() => {
                              //@ts-ignore
                              zoEntryUpdate.refObject.current.reset();
                              setIsChanged(false);
                           }}
                        >
                           <Icon
                              title="Reset"
                              size={14}
                              name="refresh-ccw"
                              className="text-1"
                           />
                        </Button>
                     )}
                     <Button
                        name="intent"
                        value="updateEntry"
                        type="submit"
                        disabled={disabled || isChanged === false}
                     >
                        {saving ? (
                           <>
                              <Icon
                                 name="loader-2"
                                 size={14}
                                 className="animate-spin text-white"
                              />
                              Saving
                           </>
                        ) : (
                           "Update Entry"
                        )}
                     </Button>
                  </div>
               </div>
            </fetcher.Form>
         </Dialog>
         <Alert open={isDeleteOpen} onClose={setDeleteOpen}>
            <AlertTitle>
               Are you sure you want to delete this entry permanently?
            </AlertTitle>
            <AlertDescription>You cannot undo this action.</AlertDescription>
            <AlertActions>
               <Button
                  plain
                  disabled={disabled}
                  type="button"
                  className="text-sm cursor-pointer"
                  onClick={() => setDeleteOpen(false)}
               >
                  Cancel
               </Button>
               <Button
                  disabled={disabled}
                  className="text-sm cursor-pointer"
                  color="red"
                  type="button"
                  onClick={() =>
                     fetcher.submit(
                        {
                           intent: "deleteEntry",
                           entryId: entry.id,
                        },
                        { method: "DELETE", action: "/collections/entry" },
                     )
                  }
               >
                  {deleting && (
                     <Icon
                        name="loader-2"
                        size={16}
                        className="mx-auto animate-spin"
                     />
                  )}
                  Delete
               </Button>
            </AlertActions>
         </Alert>
      </>
   );
}
