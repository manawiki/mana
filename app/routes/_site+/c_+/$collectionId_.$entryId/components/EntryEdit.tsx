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
import { ImageUploader } from "~/components/ImageUploader";
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

   const [preparedIconFile, setPreparedIconFile] = useState();
   const [previewIconImage, setPreviewIconImage] = useState("");

   // Append the images to the form data if they exist
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const $form = event.currentTarget;

      const formData = new FormData($form);

      preparedIconFile && formData.set("entryIcon", preparedIconFile);

      fetcher.submit(formData, {
         method: "POST",
         encType: "multipart/form-data",
         action: "/collections/entry",
      });
   }

   return (
      <>
         <Button
            className="size-8 !p-0"
            color="indigo"
            onClick={() => setSettingsOpen(true)}
         >
            <Icon name="settings" size={16} />
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
               onSubmit={preparedIconFile && handleSubmit}
            >
               <input
                  type="hidden"
                  name={zoEntryUpdate.fields.entryId()}
                  value={entry.id}
               />
               <FieldGroup>
                  <ImageUploader
                     label="Entry Icon"
                     icon={entry?.icon?.url}
                     previewImage={previewIconImage}
                     setPreparedFile={setPreparedIconFile}
                     setPreviewImage={setPreviewIconImage}
                     type="circle"
                  />
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
                  <input
                     type="hidden"
                     name={zoEntryUpdate.fields.entryIconId()}
                     value={entry.icon?.id}
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
                     <input
                        readOnly
                        type="hidden"
                        name="intent"
                        value="updateEntry"
                     />
                     <Button
                        type="submit"
                        color="indigo"
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
