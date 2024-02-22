import { useEffect, useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";

import { Button } from "~/components/Button";
import { Checkbox, CheckboxField, CheckboxGroup } from "~/components/Checkbox";
import { Dialog } from "~/components/Dialog";
import {
   Description,
   Field,
   FieldGroup,
   Fieldset,
   Label,
   Legend,
} from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { Switch, SwitchField } from "~/components/Switch";
import { Code, Text, TextLink } from "~/components/Text";
import type { Collection } from "~/db/payload-types";
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

   return (
      <>
         <button
            className="size-7 !p-0 bg-white shadow shadow-1 hover:bg-zinc-100 dark:hover:border-zinc-400/50
            border border-zinc-200 rounded-lg flex items-center justify-center dark:bg-dark450 dark:border-zinc-500/60"
            onClick={() => setSettingsOpen(true)}
         >
            <Icon name="settings" size={14} />
         </button>
         <Dialog
            size="2xl"
            onClose={() => {
               setSettingsOpen(false);
            }}
            open={isSettingsOpen}
         >
            <fetcher.Form
               onChange={() => setIsChanged(true)}
               ref={zoCollectionUpdate.ref}
               method="post"
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
                  <Fieldset className="border-y border-color-sub -mx-5 p-5">
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
                           <Label>Custom data structure</Label>
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
               <div className="flex items-center justify-end gap-2 pt-6">
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
                  <Button
                     name="intent"
                     value="updateCollection"
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
                        "Update Collection"
                     )}
                  </Button>
               </div>
            </fetcher.Form>
         </Dialog>
      </>
   );
}
