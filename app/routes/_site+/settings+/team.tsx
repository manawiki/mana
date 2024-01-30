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
import { TextLink } from "~/components/Text";
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
      <>
         <div className="tablet:px-3 pb-5">
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
         <div className="tablet:px-3">
            <Table
               grid
               bleed
               dense
               framed
               className="[--gutter:theme(spacing.3)]"
            >
               <TableHead>
                  <TableRow>
                     <TableHeader>Permission</TableHeader>
                     <TableHeader>Contributor</TableHeader>
                     <TableHeader>Admin</TableHeader>
                     <TableHeader>Owner</TableHeader>
                  </TableRow>
               </TableHead>
               <TableBody>
                  <TableRow>
                     <TableCell>
                        Edit{" "}
                        <TextLink href="/settings/site">site settings</TextLink>
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>
                        Setup a{" "}
                        <TextLink href="/settings/domain">
                           custom domain
                        </TextLink>
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>
                        Enable{" "}
                        <TextLink href="/settings/payouts">
                           monetization
                        </TextLink>
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableHeader colSpan={4} className="text-1">
                        Homepage
                     </TableHeader>
                  </TableRow>
                  <TableRow>
                     <TableCell>Publish</TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Edit</TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableHeader colSpan={4} className="text-1">
                        Posts
                     </TableHeader>
                  </TableRow>
                  <TableRow>
                     <TableCell>Publish</TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Edit</TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Delete any</TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Delete own</TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableHeader colSpan={4} className="text-1">
                        Collections
                     </TableHeader>
                  </TableRow>
                  <TableRow>
                     <TableCell>Edit</TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Delete</TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableHeader colSpan={4} className="text-1">
                        Entries
                     </TableHeader>
                  </TableRow>
                  <TableRow>
                     <TableCell>Edit</TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>Delete</TableCell>
                     <TableCell>
                        <Icon
                           name="minus"
                           size={20}
                           className="text-zinc-400 dark:text-zinc-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                     <TableCell>
                        <Icon
                           name="check"
                           size={20}
                           className="text-green-500"
                        />
                     </TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </div>
      </>
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
