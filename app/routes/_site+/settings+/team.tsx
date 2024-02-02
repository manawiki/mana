import { Suspense, useState } from "react";

import {
   type MetaFunction,
   type LoaderFunctionArgs,
   defer,
} from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import dt from "date-and-time";
import { VariableType, jsonToGraphQLQuery } from "json-to-graphql-query";
import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import { Avatar } from "~/components/Avatar";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { DotLoader } from "~/components/DotLoader";
import {
   Dropdown,
   DropdownButton,
   DropdownItem,
   DropdownMenu,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { Text } from "~/components/Text";
import type { SiteApplication } from "~/db/payload-types";
import { authGQLFetcher } from "~/utils/fetchers.server";

import { PermissionTable } from "./components/PermissionTable";
import { getSiteSlug } from "../_utils/getSiteSlug.server";

type TeamMember = {
   id: string;
   username: string;
   avatar: {
      url?: string;
   };
   role: "Owner" | "Admin" | "Contributor";
};

async function fetchApplicationData({
   payload,
   siteSlug,
   user,
}: {
   payload: Payload;
   siteSlug: string;
   user: RemixRequestContext["user"];
}) {
   const { docs } = await payload.find({
      collection: "siteApplications",
      where: {
         "site.slug": {
            equals: siteSlug,
         },
      },
      overrideAccess: false,
      user,
      depth: 2,
      sort: "-createdAt",
   });
   const applications = docs.map((doc) => ({
      id: doc.id,
      createdBy: {
         username: doc.createdBy.username,
         avatar: {
            url: doc.createdBy.avatar?.url,
         },
      },
      createdAt: doc.createdBy.createdAt,
      reviewReply: doc.reviewReply,
      status: doc.status,
      primaryDetails: doc.primaryDetails,
      additionalNotes: doc.additionalNotes,
   }));
   return applications;
}

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const applications = fetchApplicationData({
      payload,
      siteSlug,
      user,
   });

   const graphql_query = jsonToGraphQLQuery(query, { pretty: true });
   const data = (await authGQLFetcher({
      variables: {
         siteSlug,
      },
      document: graphql_query,
      request,
   })) as any;

   const { owner, admins, contributors } = data.siteData.docs[0];

   const team = [
      { ...owner, role: "Owner" },
      ...admins.map((admin: TeamMember) => ({ ...admin, role: "Admin" })),
      ...contributors.map((contributor: TeamMember) => ({
         ...contributor,
         role: "Contributor",
      })),
   ] as TeamMember[];

   return defer({
      applications,
      team,
   });
}

export default function Members() {
   const { team, applications } = useLoaderData<typeof loader>();
   return (
      <div className="space-y-3">
         <div className="tablet:px-3 pb-5">
            <h2 className="font-bold font-header pb-2">Team members</h2>
            <Table framed bleed dense className="[--gutter:theme(spacing.3)]">
               <TableBody>
                  {team.map((member) => (
                     <TableRow key={member.id}>
                        <TableCell className="w-full">
                           <div className="flex items-center gap-3">
                              <Avatar
                                 src={member?.avatar?.url}
                                 initials={member?.username.charAt(0)}
                                 className="size-6"
                              />
                              <div>{member.username}</div>
                           </div>
                        </TableCell>
                        <TableCell className="text-zinc-500 text-right">
                           <RoleBadge role={member.role} />
                        </TableCell>
                        <TableCell>
                           <Dropdown>
                              <DropdownButton plain aria-label="More options">
                                 <Icon
                                    name="more-horizontal"
                                    size={16}
                                    className="text-1"
                                 />
                              </DropdownButton>
                              <DropdownMenu anchor="bottom end">
                                 <DropdownItem>Promote to Admin</DropdownItem>
                                 <DropdownItem>
                                    Demote to Contributor
                                 </DropdownItem>
                              </DropdownMenu>
                           </Dropdown>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
         <div className="tablet:px-3 pb-5">
            <h2 className="font-bold font-header pb-2">Applications</h2>
            <Suspense fallback={<DotLoader />}>
               <Await resolve={applications}>
                  {(applications) => (
                     <>
                        {applications ? (
                           <Table
                              framed
                              bleed
                              dense
                              className="[--gutter:theme(spacing.3)]"
                           >
                              <TableHead>
                                 <TableRow>
                                    <TableHeader>User</TableHeader>
                                    <TableHeader>Submitted</TableHeader>

                                    <TableHeader>Status</TableHeader>
                                    <TableHeader className="relative w-0">
                                       <span className="sr-only">View</span>
                                    </TableHeader>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {applications.map((application) => (
                                    <TableRow key={application.id}>
                                       <TableCell className="w-full">
                                          <div className="flex items-center gap-3">
                                             <Avatar
                                                src={
                                                   application.createdBy?.avatar
                                                      ?.url
                                                }
                                                // @ts-ignore
                                                initials={application?.createdBy?.username.charAt(
                                                   0,
                                                )}
                                                className="size-6"
                                             />
                                             <div>
                                                {application.createdBy.username}
                                             </div>
                                          </div>
                                       </TableCell>
                                       <TableCell>
                                          {dt.format(
                                             new Date(
                                                application.createdAt as string,
                                             ),
                                             "MMM D",
                                          )}
                                       </TableCell>
                                       <TableCell>
                                          <ApplicationStatus
                                             status={application.status}
                                          />
                                       </TableCell>
                                       <TableCell>
                                          <ApplicationViewer
                                             application={application}
                                          />
                                       </TableCell>
                                    </TableRow>
                                 ))}
                              </TableBody>
                           </Table>
                        ) : (
                           <div>No applications</div>
                        )}
                     </>
                  )}
               </Await>
            </Suspense>
         </div>
         <PermissionTable />
      </div>
   );
}

export const meta: MetaFunction = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
      //@ts-ignore
   )?.data?.site.name;

   return [
      {
         title: `Team | Settings - ${siteName}`,
      },
   ];
};

//TODO Find a way to infer from the loader
function ApplicationViewer({ application }: { application: any }) {
   const [isOpen, setIsOpen] = useState(false);

   const submitted = dt.format(
      new Date(application.createdAt as string),
      "MMMM DD, YYYY",
   );

   return (
      <>
         <Button className="!text-xs" onClick={() => setIsOpen(true)}>
            View
         </Button>
         <Dialog
            size="4xl"
            onClose={() => {
               setIsOpen(false);
            }}
            open={isOpen}
         >
            <>
               <div className="pb-3 -mt-1 px-5 flex items-center justify-between border-b border-color -mx-5">
                  <div className="flex items-center gap-2">
                     <Avatar
                        src={application.createdBy?.avatar?.url}
                        initials={application?.createdBy?.username.charAt(0)}
                        className="size-6"
                     />
                     <span>{application.createdBy.username}</span>
                  </div>
                  <Text>{submitted}</Text>
               </div>
               <div className="space-y-6 py-6">
                  <div>
                     <div className="text-1 pb-1 font-semibold">
                        In what ways would you like to help?
                     </div>
                     <div>{application.primaryDetails}</div>
                  </div>
                  <div>
                     <div className="text-1 pb-1 font-semibold">
                        Anything else you'd like to share?
                     </div>
                     <div>{application.additionalNotes}</div>
                  </div>
               </div>
               <div className="border-t border-color px-5 -mx-5 pt-3">
                  things
               </div>
            </>
         </Dialog>
      </>
   );
}

function ApplicationStatus({ status }: { status: SiteApplication["status"] }) {
   let color = "" as any;
   let statusLabel = "" as any;
   switch (status) {
      case "under-review":
         color = "cyan";
         statusLabel = "Needs Review";
         break;
      case "approved":
         color = "green";
         statusLabel = "Approved";
         break;
      case "denied":
         color = "red";
         statusLabel = "Denied";
         break;
      default:
         color = "gray";
         break;
   }

   return <Badge color={color}>{statusLabel}</Badge>;
}

function RoleBadge({ role }: { role: TeamMember["role"] }) {
   let color = "" as any;
   switch (role) {
      case "Owner":
         color = "purple";
         break;
      case "Admin":
         color = "amber";
         break;
      case "Contributor":
         color = "emerald";
         break;
      default:
         color = "gray";
         break;
   }

   return <Badge color={color}>{role}</Badge>;
}

const query = {
   query: {
      __variables: {
         siteSlug: "String!",
      },
      siteData: {
         __aliasFor: "Sites",
         __args: {
            where: {
               slug: { equals: new VariableType("siteSlug") },
            },
         },
         docs: {
            owner: {
               id: true,
               username: true,
               avatar: {
                  url: true,
               },
            },
            admins: {
               id: true,
               username: true,
               avatar: {
                  url: true,
               },
            },
            contributors: {
               id: true,
               username: true,
               avatar: {
                  url: true,
               },
            },
         },
      },
   },
};
