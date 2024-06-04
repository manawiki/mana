import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export default function GachaHistory() {
   const { gacha } = useLoaderData<typeof loader>();

   //gacha type data: {
   //     cardPoolType: string;
   //     resourceId: number;
   //     qualityLevel: number;
   //     resourceType: string;
   //     name: string;
   //     count: number;
   //     time: string;
   // }[];

   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <h3 className="text-lg font-bold">Gacha History</h3>
         {gacha?.data.map((roll, int) => (
            <div className="flex flex-col gap-y-2" key={int}>
               <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-2">
                     <span className="font-bold">Gacha Name:</span>
                     <span>{roll.name}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Gacha Type:</span>
                     <span>{roll.cardPoolType}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-2">
                     <span className="font-bold">Total Pulls:</span>
                     <span>{roll.count}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Total 5* Pulls:</span>
                     <span>{roll.qualityLevel}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Total 4* Pulls:</span>
                     <span>{roll.resourceId}</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">Total 3* Pulls:</span>
                     <span>{roll.resourceType}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-2">
                     <span className="font-bold">5* Rate:</span>
                     <span>{roll.qualityLevel}%</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">4* Rate:</span>
                     <span>{roll.resourceId}%</span>
                  </div>
                  <div className="flex gap-x-2">
                     <span className="font-bold">3* Rate:</span>
                     <span>{roll.resourceType}%</span>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
