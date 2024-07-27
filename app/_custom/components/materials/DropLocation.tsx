import type { Material as MaterialType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

const tdformat = "py-2 px-3 leading-none border border-color-sub";

export function DropLocation({ data }: { data: any }) {
   const material = data?.entry?.data?.Material;
   const droplocs = material?.best_drop_locations;

   return (
      <>
         {droplocs?.length > 0 ? (
            <>
               <H2 text="Best Drop Locations" />
               <DropLocationList data={droplocs} />
               <DropNotes />
            </>
         ) : null}
      </>
   );
}

const DropNotes = () => {
   const linkcss =
      "border border-blue-800 px-1 text-blue-800 dark:border-blue-200 dark:text-blue-200 hover:bg-blue-500 hover:bg-opacity-30";
   return (
      <>
         <div className="py-2 mb-3 border-b border-color-sub text-center ">
            <div>
               <span className="font-bold">APD</span> = Avg AP Per Drop
            </div>
            <div>
               The most efficient quests to farm for the item. Lower is better.
            </div>
         </div>

         <div className="text-xs text-center mb-3">
            Drop rate estimates based on data collected by{" "}
            <a
               className={`${linkcss}`}
               href="https://www.reddit.com/user/Rathus"
            >
               /u/Rathus
            </a>{" "}
            and the{" "}
            <a
               className={`${linkcss}`}
               href="https://www.reddit.com/r/grandorder"
            >
               Grand Order Subreddit
            </a>
         </div>
      </>
   );
};

const DropLocationList = ({ data }: any) => {
   // Sort drops first!
   var sorted = [...data];
   sorted.sort((a, b) =>
      a.ap_per_drop > b.ap_per_drop
         ? 1
         : b.ap_per_drop > a.ap_per_drop
         ? -1
         : 0,
   );

   return (
      <>
         <Table grid framed>
            <TableHead>
               <TableRow>
                  <TableHeader center>
                     <span className="font-bold text-base cursor-default">
                        Quest
                     </span>
                  </TableHeader>
                  <TableHeader center>
                     <span className="font-bold text-base cursor-default">
                        APD ▴
                     </span>
                  </TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {sorted?.map((loc, index) => (
                  <TableRow key={index}>
                     <td className={`text-left ${tdformat}`}>
                        <div>{loc.quest_dropped_from.name}</div>
                        <div className="text-xs">
                           {loc.quest_dropped_from.main_quest?.name} -{" "}
                           {loc.quest_dropped_from.main_quest_chapter?.name}
                        </div>
                     </td>
                     <td className={`text-center ${tdformat}`}>
                        {loc?.ap_per_drop}
                     </td>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};
