import { useState } from "react";

import { useFetcher } from "@remix-run/react";
import { useZorm } from "react-zorm";

import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { Field, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Text } from "~/components/Text";
import { Textarea } from "~/components/Textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { SiteApplication } from "~/db/payload-types";
import { isProcessing } from "~/utils/form";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { ApplicationStatus } from "./ApplicationStatus";
import { ApplicationReviewSchema } from "../utils/ApplicationReviewSchema";

export function ApplicationViewer({
   application,
}: {
   application: SiteApplication;
}) {
   const [isOpen, setIsOpen] = useState(false);

   const submitted = new Date(
      application.createdAt as string,
   ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Los_Angeles",
   });

   const { site } = useSiteLoaderData();

   const fetcher = useFetcher();
   const zo = useZorm("applicationReview", ApplicationReviewSchema);

   const isReviewed = application.status !== "under-review";

   const disabled = isReviewed || isProcessing(fetcher.state);

   return (
      <>
         <Button className="!text-xs" onClick={() => setIsOpen(true)}>
            View
         </Button>
         <Dialog
            size="3xl"
            onClose={() => {
               setIsOpen(false);
            }}
            open={isOpen}
         >
            <>
               <div className="pb-4 -mt-1 px-5 flex items-center justify-between border-b border-color -mx-5 gap-4">
                  <div className="flex items-center gap-2 truncate">
                     <Avatar
                        src={application.createdBy?.avatar?.url}
                        //@ts-ignore
                        initials={application?.createdBy?.username.charAt(0)}
                        className="size-6 flex-none"
                     />
                     <span className="truncate">
                        {application.createdBy.username}
                     </span>
                  </div>
                  <div className="flex items-center gap-3 flex-none">
                     <Text>{submitted}</Text>
                     <ApplicationStatus status={application.status} />
                  </div>
               </div>
               <div className="space-y-6 max-tablet:pb-6 py-6">
                  <div>
                     <div className="text-1 text-sm pb-1 font-semibold">
                        Discord Username
                     </div>
                     <div>{application.discordUsername ?? "-"}</div>
                  </div>
                  <div>
                     <div className="text-1 text-sm pb-1 font-semibold">
                        In what ways would you like to help?
                     </div>
                     <div>{application.primaryDetails ?? "-"}</div>
                  </div>
                  <div>
                     <div className="text-1 text-sm pb-1 font-semibold">
                        Anything else you'd like to share?
                     </div>
                     <div>{application.additionalNotes ?? "-"}</div>
                  </div>
               </div>
               <div className="border-t border-color -mx-5 px-5 pt-5">
                  {isReviewed ? (
                     <div>
                        <div className="text-1 pb-1 text-sm font-semibold">
                           Review Notes
                        </div>
                        <div>{application.reviewMessage ?? "-"}</div>
                     </div>
                  ) : (
                     <fetcher.Form method="post" ref={zo.ref}>
                        <input
                           name={zo.fields.siteId()}
                           value={site?.id}
                           type="hidden"
                        />
                        <input
                           name={zo.fields.applicantUserId()}
                           value={application?.createdBy.id}
                           type="hidden"
                        />
                        <div className="tablet:flex tablet:items-end gap-6">
                           <div className="tablet:w-4/5">
                              <Field disabled={disabled} className="w-full">
                                 <Label>
                                    Include an optional message to{" "}
                                    <span className="italic text-1">
                                       {application.createdBy.username}
                                    </span>
                                 </Label>
                                 <Textarea
                                    rows={3}
                                    name={zo.fields.reviewMessage()}
                                 />
                              </Field>
                           </div>
                           <div className="space-y-1">
                              <div className="max-tablet:justify-end max-tablet:py-4 flex items-center gap-3">
                                 <Button
                                    disabled={disabled}
                                    type="submit"
                                    name="intent"
                                    value="declineApplication"
                                 >
                                    <Icon name="x" size={16} />
                                    Decline
                                 </Button>
                                 <Tooltip>
                                    <TooltipTrigger title="Approve" asChild>
                                       <Button
                                          disabled={disabled}
                                          type="submit"
                                          color="green"
                                          name="intent"
                                          value="approveApplication"
                                       >
                                          <Icon name="check" size={16} />
                                          Approve
                                       </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                       <div className="w-28 text-center">
                                          Approval grants the{" "}
                                          <span className="italic">
                                             contributor
                                          </span>{" "}
                                          role
                                       </div>
                                    </TooltipContent>
                                 </Tooltip>
                              </div>
                           </div>
                        </div>
                     </fetcher.Form>
                  )}
               </div>
            </>
         </Dialog>
      </>
   );
}
