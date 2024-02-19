import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState } from "react";

import { RadioGroup, Tab } from "@headlessui/react";
import { useFetcher, useMatches } from "@remix-run/react";
import clsx from "clsx";

import type { Config } from "payload/generated-types";
import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { isAdding } from "~/utils/form";

import { EditorView } from "./EditorView";

export function EditorVersionModal({
   pageId,
   isVersionModalOpen,
   setVersionModal,
   collectionSlug,
}: {
   pageId?: string;
   isVersionModalOpen: boolean;
   setVersionModal: Dispatch<SetStateAction<boolean>>;
   collectionSlug: keyof Config["collections"];
}) {
   const { data } = useMatches()?.[2] as any;

   const versions =
      collectionSlug == "contentEmbeds"
         ? data.entry.embeddedContent.find((item: any) => item?.id === pageId)
              ?.versions ?? []
         : data?.versions ?? [];

   const fetcher = useFetcher();
   const adding = isAdding(fetcher, "versionUpdate");

   const [selectedVersion, setSelectedVersion] = useState(versions[0]);

   return (
      <Dialog size="5xl" open={isVersionModalOpen} onClose={setVersionModal}>
         <section className="laptop:flex items-start relative gap-5">
            <Tab.Group>
               <Tab.Panels className="laptop:min-w-[728px]">
                  {versions?.map(
                     (version: any) =>
                        version?.version?.content && (
                           <Tab.Panel key={version?.id}>
                              <h1 className="font-header text-3xl font-bold">
                                 {version?.version?.name}
                              </h1>
                              <EditorView data={version?.version?.content} />
                           </Tab.Panel>
                        ),
                  )}
               </Tab.Panels>
               <Tab.List className="w-full flex-col overflow-auto max-laptop:border-t-2 max-laptop:border-color max-laptop:pt-5 max-laptop:mt-5">
                  <div className="border-color grid flex-none grid-cols-2 gap-4 mb-3.5">
                     <Button
                        outline
                        onClick={() => {
                           setVersionModal(false);
                        }}
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={() => {
                           fetcher.submit(
                              {
                                 intent: "versionUpdate",
                                 collectionSlug: collectionSlug,
                                 //@ts-ignore
                                 versionId: selectedVersion.id,
                              },
                              {
                                 method: "patch",
                                 action: "/editor",
                              },
                           );
                           setVersionModal(false);
                           // Not ideal, but theres no good way to update slate state externally
                           // https://stackoverflow.com/questions/74101405/how-to-clear-all-text-in-slate-js-editor
                           location.reload();
                        }}
                     >
                        {adding ? (
                           <Icon
                              name="loader-2"
                              className="mx-auto h-5 w-5 animate-spin"
                           />
                        ) : (
                           "Restore"
                        )}
                     </Button>
                  </div>
                  <RadioGroup
                     className="overflow-auto border border-color-sub rounded-lg divide-y divide-color-sub"
                     value={selectedVersion}
                     onChange={setSelectedVersion}
                     by="id"
                  >
                     {versions?.map(
                        (row: any, index: any) =>
                           row.version?.content && (
                              <Tab as={Fragment} key={row.id}>
                                 <RadioGroup.Option key={row.id} value={row}>
                                    {({ checked }) => (
                                       <Label
                                          className={clsx(
                                             checked
                                                ? "bg-zinc-100 font-semibold dark:bg-dark400"
                                                : "text-1",
                                             "group truncate relative justify-between flex w-full cursor-pointer items-center gap-2 px-3 py-2",
                                          )}
                                       >
                                          <time
                                             suppressHydrationWarning
                                             className="flex items-center gap-1.5 text-xs group-hover:underline"
                                             dateTime={row?.updatedAt}
                                          >
                                             {new Date(
                                                row?.updatedAt as string,
                                             ).toLocaleTimeString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                timeZone: "America/Los_Angeles",
                                             })}
                                          </time>
                                          <Avatar
                                             className="size-6 flex-none"
                                             initials={selectedVersion?.version?.author?.username.charAt(
                                                0,
                                             )}
                                             src={
                                                selectedVersion?.version?.author
                                                   ?.avatar?.url
                                             }
                                          />
                                       </Label>
                                    )}
                                 </RadioGroup.Option>
                              </Tab>
                           ),
                     )}
                  </RadioGroup>
               </Tab.List>
            </Tab.Group>
         </section>
      </Dialog>
   );
}
