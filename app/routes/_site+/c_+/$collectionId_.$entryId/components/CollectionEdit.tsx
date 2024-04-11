import { useEffect, useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";

import { Button } from "~/components/Button";
import { Checkbox, CheckboxField, CheckboxGroup } from "~/components/Checkbox";
import {
   Description,
   Field,
   FieldGroup,
   Fieldset,
   Label,
   Legend,
} from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { ImageUploader } from "~/components/ImageUploader";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";
import { Code, Text, TextLink } from "~/components/Text";
import type { Collection } from "~/db/payload-types";
import { MobileTray, NestedTray } from "~/routes/_site+/_components/MobileTray";
import { isAdding, isProcessing } from "~/utils/form";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { CollectionUpdateSchema } from "../utils/CollectionSchema";

const options = [
   {
      name: "customListTemplate",
      label: "List Template",
      description: "Customize the entry view",
      checked: false,
   },
   {
      name: "customEntryTemplate",
      label: "Entry Template",
      description: "Customize the list view",
      checked: false,
   },
];

export function CollectionEdit({ collection }: { collection: Collection }) {
   const { site } = useSiteLoaderData();

   let [isSettingsOpen, setSettingsOpen] = useState(false);
   let [isSubSettingsOpen, setSubSettingsOpen] = useState(false);

   let [isChanged, setIsChanged] = useState(false);
   let [customDatabaseChecked, setCustomDatabaseChecked] = useState(
      collection.customDatabase ?? false,
   );
   let [selected, setSelected] = useState([
      ...(collection.customListTemplate
         ? [
              {
                 name: "customListTemplate",
                 checked: collection.customListTemplate,
              },
           ]
         : []),
      ...(collection.customEntryTemplate
         ? [
              {
                 name: "customEntryTemplate",
                 checked: collection.customEntryTemplate,
              },
           ]
         : []),
   ]);

   const fetcher = useFetcher();
   const zoCollectionUpdate = useZorm(
      "collectionUpdate",
      CollectionUpdateSchema,
   );

   const disabled =
      isProcessing(fetcher.state) ||
      zoCollectionUpdate.validation?.success === false;

   const saving = isAdding(fetcher, "updateCollection");

   useEffect(() => {
      if (!saving) {
         setIsChanged(false);
      }
   }, [saving]);

   const [isDeleteOpen, setDeleteOpen] = useState(false);

   const deleting = isAdding(fetcher, "deleteCollection");

   const [preparedIconFile, setPreparedIconFile] = useState();
   const [previewIconImage, setPreviewIconImage] = useState("");

   // Append the images to the form data if they exist
   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const $form = event.currentTarget;

      const formData = new FormData($form);

      preparedIconFile && formData.set("collectionIcon", preparedIconFile);

      fetcher.submit(formData, {
         method: "POST",
         encType: "multipart/form-data",
         action: "/collections",
      });
   }

   return (
      <>
         <Button
            color="blue"
            className="size-8 !p-0"
            onClick={() => setSettingsOpen(true)}
         >
            <Icon name="settings" size={16} />
         </Button>
         <MobileTray
            shouldScaleBackground
            direction="right"
            onOpenChange={setSettingsOpen}
            open={isSettingsOpen}
         >
            <fetcher.Form
               onChange={() => setIsChanged(true)}
               ref={zoCollectionUpdate.ref}
               method="POST"
               action="/collections"
               encType="multipart/form-data"
               onSubmit={preparedIconFile && handleSubmit}
               className="max-tablet:pb-20"
            >
               <FieldGroup>
                  <Field disabled={disabled} className="w-full">
                     <Label>Collection Name</Label>
                     <Input
                        required
                        name={zoCollectionUpdate.fields.name()}
                        type="text"
                        defaultValue={collection?.name}
                     />
                  </Field>
                  <ImageUploader
                     inDrawer
                     label="Collection Icon"
                     icon={collection?.icon?.url}
                     previewImage={previewIconImage}
                     setPreparedFile={setPreparedIconFile}
                     setPreviewImage={setPreviewIconImage}
                     type="circle"
                  />
                  <SwitchField disabled={disabled} fullWidth>
                     <Label>Hide Collection</Label>
                     <Description>
                        Hide this collection from the public
                     </Description>
                     <Switch
                        onChange={() => setIsChanged(true)}
                        defaultChecked={Boolean(collection.hiddenCollection)}
                        value="true"
                        color="dark/white"
                        name={zoCollectionUpdate.fields.hiddenCollection()}
                     />
                  </SwitchField>
                  <Fieldset>
                     <Legend>Custom Options</Legend>
                     <Text>Implement a custom data structure with fields</Text>
                     <CheckboxGroup>
                        <CheckboxField>
                           <Checkbox
                              name={zoCollectionUpdate.fields.customDatabase()}
                              checked={customDatabaseChecked}
                              defaultChecked={customDatabaseChecked}
                              onChange={(checked) => {
                                 setCustomDatabaseChecked(
                                    (pending) => !pending,
                                 );
                                 //If unchecked, clear the selected options
                                 !checked && setSelected([]);
                                 setIsChanged(true);
                                 return;
                              }}
                           />
                           <Label>Custom Data Structure</Label>
                           <Description>
                              Utilize structured data for this collection.
                           </Description>
                        </CheckboxField>
                        <CheckboxGroup className="pl-8">
                           {options.map((option) => (
                              <CheckboxField key={option.name}>
                                 <Checkbox
                                    name={option.name}
                                    checked={selected.some(
                                       (e) => e?.name === option.name,
                                    )}
                                    defaultChecked={selected.some(
                                       (e) => e?.name === option.name,
                                    )}
                                    onChange={(checked) => {
                                       //@ts-ignore
                                       setSelected((pending) => {
                                          return checked
                                             ? [...pending, option]
                                             : pending.filter(
                                                  (item) =>
                                                     item?.name !== option.name,
                                               );
                                       });
                                       setCustomDatabaseChecked((pending) =>
                                          checked && !pending ? true : pending,
                                       );
                                       setIsChanged(true);

                                       return;
                                    }}
                                 />
                                 <Label>{option.label}</Label>
                                 <Description>
                                    <div className="space-y-1">
                                       <Text>{option.description}</Text>
                                       <Text>
                                          Ensure the file{" "}
                                          <Code>
                                             _site.c.{collection.slug}
                                             {option.name ==
                                             "customEntryTemplate"
                                                ? ".$entryId.tsx"
                                                : ".tsx"}
                                          </Code>{" "}
                                          exists in the{" "}
                                          <Code>/app/_custom/routes/</Code>{" "}
                                          directory.
                                       </Text>
                                       <Text>
                                          Copy the default{" "}
                                          <TextLink
                                             target="_blank"
                                             href={`https://hq.mana.wiki/p/custom-collection-snippets#${
                                                option.name ==
                                                "customEntryTemplate"
                                                   ? "custom-entry-template "
                                                   : "custom-list-template "
                                             }`}
                                          >
                                             {option.name ==
                                             "customEntryTemplate"
                                                ? "entry "
                                                : "list "}
                                             template
                                          </TextLink>{" "}
                                          to get started.
                                       </Text>
                                    </div>
                                 </Description>
                              </CheckboxField>
                           ))}
                        </CheckboxGroup>
                     </CheckboxGroup>
                  </Fieldset>
               </FieldGroup>
               <input
                  type="hidden"
                  name={zoCollectionUpdate.fields.collectionId()}
                  value={collection.id}
               />
               <input
                  type="hidden"
                  name={zoCollectionUpdate.fields.siteId()}
                  value={site.id}
               />
               <input
                  type="hidden"
                  name={zoCollectionUpdate.fields.collectionIconId()}
                  value={collection.icon?.id}
               />
               <div className="z-50 fixed bottom-0 left-0 w-full">
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
                           Delete this Collection
                        </Button>
                        <NestedTray
                           open={isDeleteOpen}
                           onOpenChange={setDeleteOpen}
                           direction="right"
                        >
                           <div className="text-1 pb-2">
                              Are you sure you want to delete this collection
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
                                          intent: "deleteCollection",
                                          collectionId: collection.id,
                                       },
                                       {
                                          method: "delete",
                                          action: "/collections",
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
                                 zoCollectionUpdate.refObject.current.reset();
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
                           type="hidden"
                           name="intent"
                           value="updateCollection"
                        />
                        <Button
                           type="submit"
                           color="blue"
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
                              "Update Collection"
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
