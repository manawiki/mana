import { Suspense } from "react";

import { defer, redirect } from "@remix-run/node";
import type {
   MetaFunction,
   LoaderFunctionArgs,
   ActionFunctionArgs,
} from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { VariableType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { Avatar } from "~/components/Avatar";
import { DotLoader } from "~/components/DotLoader";
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

import { ApplicationStatus } from "./components/ApplicationStatus";
import { ApplicationViewer } from "./components/ApplicationViewer";
import { PermissionTable } from "./components/PermissionTable";
import { RoleActions } from "./components/RoleActions";
import { RoleBadge } from "./components/RoleBadge";
import { ApplicationReviewSchema } from "./utils/ApplicationReviewSchema";
import { fetchApplicationData } from "./utils/fetchApplicationData";
import { RoleActionSchema } from "./utils/RoleActionSchema";
import { getSiteSlug } from "../_utils/getSiteSlug.server";

export type TeamMember = {
   id: string;
   username: string;
   avatar: {
      url?: string;
   };
   role: "Owner" | "Admin" | "Contributor";
};

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   if (!user) throw redirect("/login?redirectTo=/settings/team");

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
      user,
   });
}

export default function Members() {
   const { team, applications, user } = useLoaderData<typeof loader>();
   return (
      <div>
         <h3 className="pb-2 mt-0">Team Members</h3>
         <Table framed dense>
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
                     <RoleActions currentUser={user} member={member} />
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <h3 className="pb-2 pt-3">Applications</h3>
         <Suspense fallback={<DotLoader />}>
            <Await resolve={applications} errorElement={<DotLoader />}>
               {(applications) => (
                  <>
                     {applications.length > 0 ? (
                        <Table framed dense>
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
                                       {new Date(
                                          application.createdAt as string,
                                       ).toLocaleTimeString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          timeZone: "America/Los_Angeles",
                                       })}
                                    </TableCell>
                                    <TableCell>
                                       <ApplicationStatus
                                          status={application.status}
                                       />
                                    </TableCell>
                                    <TableCell>
                                       <ApplicationViewer
                                          application={
                                             application as SiteApplication
                                          }
                                       />
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     ) : (
                        <Text className="border-y tablet:border border-color-sub p-4 tablet:rounded-lg -mx-3 shadow-1 shadow-sm">
                           No applications to review...
                        </Text>
                     )}
                  </>
               )}
            </Await>
         </Suspense>
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

export async function action({
   context: { payload, user },
   request,
}: ActionFunctionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });
   if (!user) throw redirect("/login?redirectTo=/settings/team");

   switch (intent) {
      case "approveApplication": {
         try {
            const { siteId, applicantUserId, reviewMessage } =
               await zx.parseForm(request, ApplicationReviewSchema);

            const site = await payload.findByID({
               collection: "sites",
               id: siteId,
               depth: 0,
            });

            if (
               site?.contributors &&
               //@ts-ignore
               site?.contributors?.includes(applicantUserId)
            )
               return jsonWithError(
                  null,
                  "User is already a contributor to this site",
               );

            const updatedContributors = site?.contributors
               ? [...site?.contributors, applicantUserId]
               : [applicantUserId];

            await payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  //@ts-ignore
                  contributors: updatedContributors,
               },
               depth: 0,
               overrideAccess: false,
               user,
            });

            return await payload.update({
               collection: "siteApplications",
               id: `${siteId}-${applicantUserId}`,
               data: {
                  status: "approved",
                  reviewMessage: reviewMessage as any,
               },
               depth: 0,
               overrideAccess: false,
               user,
            });
         } catch (err: unknown) {
            payload.logger.error(`${err}`);
         }
      }
      case "declineApplication": {
         try {
            const { siteId, applicantUserId, reviewMessage } =
               await zx.parseForm(request, ApplicationReviewSchema);
            return await payload.update({
               collection: "siteApplications",
               id: `${siteId}-${applicantUserId}`,
               data: {
                  status: "denied",
                  reviewMessage: reviewMessage as any,
               },
               depth: 0,
               overrideAccess: false,
               user,
            });
         } catch (err: unknown) {
            payload.logger.error(`${err}`);
         }
      }
      case "demoteToContributorFromAdmin": {
         try {
            const { siteId, userId } = await zx.parseForm(
               request,
               RoleActionSchema,
            );
            const site = await payload.findByID({
               collection: "sites",
               id: siteId,
               depth: 0,
               overrideAccess: false,
               user,
            });

            //Check to make sure user is not already a contributor
            if (
               site?.contributors &&
               site?.contributors.includes(userId as any)
            )
               return jsonWithError(null, "User is already a contributor");

            //Remove user from admins
            const updatedAdmins = site?.admins
               ? site?.admins?.filter((admin: any) => admin !== userId)
               : null;

            const updatedContributors = site?.contributors
               ? [...site?.contributors, userId]
               : [userId];

            await payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  admins: updatedAdmins as any[],
                  contributors: updatedContributors as any[],
               },
               depth: 0,
               overrideAccess: false,
               user,
            });
            return jsonWithSuccess(null, "User demoted to contributor");
         } catch (err: unknown) {
            payload.logger.error(`${err}`);
         }
      }
      case "promoteToAdmin": {
         try {
            const { siteId, userId } = await zx.parseForm(
               request,
               RoleActionSchema,
            );
            const site = await payload.findByID({
               collection: "sites",
               id: siteId,
               depth: 0,
               overrideAccess: false,
               user,
            });
            //Check to make sure user is not already an admin
            if (site?.admins && site?.admins.includes(userId as any))
               return jsonWithError(null, "User is already an admin");

            //Remove user from contributors
            const updatedContributors = site?.contributors
               ? site?.contributors?.filter(
                    (contributor: any) => contributor !== userId,
                 )
               : null;

            const updatedAdmins = site?.admins
               ? [...site?.admins, userId]
               : [userId];

            await payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  contributors: updatedContributors as any[],
                  admins: updatedAdmins as any[],
               },
               depth: 0,
               overrideAccess: false,
               user,
            });
            return jsonWithSuccess(null, "User promoted to admin");
         } catch (err: unknown) {
            payload.logger.error(`${err}`);
         }
      }
      case "removeContributor": {
         try {
            const { siteId, userId } = await zx.parseForm(
               request,
               RoleActionSchema,
            );
            const site = await payload.findByID({
               collection: "sites",
               id: siteId,
               depth: 0,
               overrideAccess: false,
               user,
            });
            //Check to make sure user is not an admin
            if (site?.admins && site?.admins.includes(userId as any))
               return jsonWithError(null, "User is already an admin");

            //Remove user from contributors
            const updatedContributors = site?.contributors
               ? site?.contributors?.filter(
                    (contributor: any) => contributor !== userId,
                 )
               : null;

            await payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  contributors: updatedContributors as any[],
               },
               depth: 0,
               overrideAccess: false,
               user,
            });
            return jsonWithSuccess(null, "User removed from contributors");
         } catch (err: unknown) {
            payload.logger.error(`${err}`);
         }
      }
   }
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
