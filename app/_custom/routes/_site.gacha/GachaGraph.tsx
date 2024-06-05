export function GachaGraph() {
   return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
         <h3 className="text-lg font-bold">Gacha Graph</h3>
         <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">Gacha Name:</span>
                  <span>Warp History</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Gacha Type:</span>
                  <span>Standard</span>
               </div>
            </div>
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">Total Pulls:</span>
                  <span>100</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Total 5* Pulls:</span>
                  <span>10</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Total 4* Pulls:</span>
                  <span>20</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">Total 3* Pulls:</span>
                  <span>70</span>
               </div>
            </div>
            <div className="flex flex-col gap-y-1">
               <div className="flex gap-x-2">
                  <span className="font-bold">5* Rate:</span>
                  <span>10%</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">4* Rate:</span>
                  <span>20%</span>
               </div>
               <div className="flex gap-x-2">
                  <span className="font-bold">3* Rate:</span>
                  <span>70%</span>
               </div>
            </div>
         </div>
      </div>
   );
}
