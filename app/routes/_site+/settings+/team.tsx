import {
   type MetaFunction,
   type LoaderFunctionArgs,
   json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { VariableType, jsonToGraphQLQuery } from "json-to-graphql-query";

import { Avatar } from "~/components/Avatar";
import { Badge } from "~/components/Badge";
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
import { authGQLFetcher } from "~/utils/fetchers.server";

import { getSiteSlug } from "../_utils/getSiteSlug.server";

type TeamMember = {
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
   const { siteSlug } = await getSiteSlug(request, payload, user);

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

   return json({ team });
}

export default function Members() {
   const { team } = useLoaderData<typeof loader>();

   return (
      <div className="border rounded-xl border-color-sub px-4 overflow-hidden pt-1 bg-zinc-50 dark:bg-dark350">
         <Table framed bleed dense className="[--gutter:theme(spacing.4)]">
            <TableHead>
               <TableRow>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader className="relative w-0">
                     <span className="sr-only">Actions</span>
                  </TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {team.map((member) => (
                  <TableRow key={member.id}>
                     <TableCell>
                        <div className="flex items-center gap-3">
                           <Avatar
                              src={member?.avatar?.url}
                              initials={member?.username.charAt(0)}
                              className="size-6"
                           />
                           <div>{member.username}</div>
                        </div>
                     </TableCell>
                     <TableCell className="text-zinc-500">
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
                              <DropdownItem>Demote to Contributor</DropdownItem>
                           </DropdownMenu>
                        </Dropdown>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
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

function RoleBadge({ role }: { role: TeamMember["role"] }) {
   let color = "" as any;
   switch (role) {
      case "Owner":
         color = "purple";
         break;
      case "Admin":
         color = "blue";
         break;
      case "Contributor":
         color = "green";
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
