import { H2Plain } from "~/components/Headers";
import { Icon } from "~/components/Icon";
import {
   Table,
   TableHead,
   TableRow,
   TableHeader,
   TableBody,
   TableCell,
} from "~/components/Table";
import { TextLink } from "~/components/Text";

export function PermissionTable() {
   return (
      <>
         <H2Plain text="Permissions" className="!text-lg pl-0.5 !mt-6" />
         <Table grid framed>
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>Remove contributor from team</TableCell>
                  <TableCell>
                     <Icon
                        name="minus"
                        size={20}
                        className="text-zinc-400 dark:text-zinc-500"
                     />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>Promote contributor to admin</TableCell>
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
                     />{" "}
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>Demote admin to contributor</TableCell>
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>
                     Setup a{" "}
                     <TextLink href="/settings/domain">custom domain</TextLink>
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>
                     Enable{" "}
                     <TextLink href="/settings/payouts">monetization</TextLink>
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
                     <Icon name="check" size={20} className="text-green-500" />
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>Edit</TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>Edit</TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>Delete own</TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
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
                     <Icon name="check" size={20} className="text-green-500" />
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
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
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
                  <TableCell>
                     <Icon name="check" size={20} className="text-green-500" />
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table>
      </>
   );
}
