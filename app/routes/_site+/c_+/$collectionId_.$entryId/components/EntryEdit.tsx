import { useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";

import { Button } from "~/components/Button";
import { Field, FieldGroup, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { ImageUploader } from "~/components/ImageUploader";
import { Input } from "~/components/Input";
import { MobileTray, NestedTray } from "~/routes/_site+/_components/MobileTray";
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
   let [isSubSettingsOpen, setSubSettingsOpen] = useState(false);

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
         <MobileTray
            direction="right"
            onOpenChange={setSettingsOpen}
            open={isSettingsOpen}
         >
            <fetcher.Form
               onChange={() => setIsChanged(true)}
               ref={zoEntryUpdate.ref}
               method="POST"
               action="/collections/entry"
               className="max-tablet:pb-16"
               onSubmit={preparedIconFile && handleSubmit}
            >
               <input
                  type="hidden"
                  name={zoEntryUpdate.fields.entryId()}
                  value={entry.id}
               />
               <FieldGroup>
                  <ImageUploader
                     inDrawer
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
               <div className="z-50 fixed left-0 bottom-0 tablet:bottom-3 tablet:left-3 w-full tablet:w-[376px] tablet:rounded-b-lg overflow-hidden">
                  <div className="flex gap-2 items-center justify-between bg-2-sub p-4 border-t border-color-sub">
                     <Button
                        color="light/zinc"
                        onClick={() => setSubSettingsOpen(true)}
                     >
                        <Icon name="more-horizontal" size={16} />
                     </Button>
                     <NestedTray
                        open={isSubSettingsOpen}
                        onOpenChange={setSubSettingsOpen}
                        direction="right"
                     >
                        <Button
                           className="w-full"
                           color="red"
                           onClick={() => setDeleteOpen(true)}
                        >
                           <Icon
                              name="trash-2"
                              className="pb-[1px] text-red-200"
                              size={14}
                           />
                           Delete this Entry
                        </Button>
                        <NestedTray
                           open={isDeleteOpen}
                           onOpenChange={setDeleteOpen}
                           direction="right"
                        >
                           <div className="text-1 pb-2">
                              Are you sure you want to delete this entry
                              permanently?
                           </div>
                           <div>You cannot undo this action.</div>
                           <div className="flex items-center gap-3 pt-5">
                              <Button
                                 disabled={disabled}
                                 className="text-sm cursor-pointer"
                                 color="red"
                                 onClick={() =>
                                    fetcher.submit(
                                       {
                                          intent: "deleteEntry",
                                          entryId: entry.id,
                                       },
                                       {
                                          method: "DELETE",
                                          action: "/collections/entry",
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
                                    <Icon name="trash-2" size={16} />
                                 )}
                                 Delete
                              </Button>
                              <Button
                                 plain
                                 disabled={disabled}
                                 className="text-sm cursor-pointer"
                                 onClick={() => setDeleteOpen(false)}
                              >
                                 Cancel
                              </Button>
                           </div>
                        </NestedTray>
                     </NestedTray>
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
               </div>
            </fetcher.Form>
         </MobileTray>
      </>
   );
}
