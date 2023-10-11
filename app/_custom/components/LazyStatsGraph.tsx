import { Suspense } from "react";

import { Disclosure } from "@headlessui/react";
import { BarChart2, ChevronDown } from "lucide-react";
import { lazily } from "react-lazily";

import type { StatsType } from "./StatsGraph";

// We'll lazy load StatGraph to improve performance
// import { StatGraph } from "./StatsGraph";
const { StatsGraph } = lazily(() => import("./StatsGraph.tsx"));

export { StatsType };

//Since the graph is hidden by default, we can lazy load it and reduce bundle size
export const LazyStatsGraph = ({
   stats,
   statsList,
}: {
   stats: StatsType;
   statsList?: string[];
}) => (
   <div className="my-1">
      <Disclosure>
         {({ open }) => (
            <>
               <Disclosure.Button
                  className="border-color-sub bg-2-sub shadow-1 mb-2 flex w-full items-center
                         gap-3 rounded-lg border px-4 py-3 font-bold shadow-sm"
               >
                  <BarChart2 size={20} className="text-zinc-500" />
                  Stat Graph
                  <div
                     className={`${
                        open ? "font-bol rotate-180 transform" : ""
                     } ml-auto inline-block `}
                  >
                     <ChevronDown size={28} />
                  </div>
               </Disclosure.Button>
               <Disclosure.Panel className="mb-5 border-color-sub bg-2-sub">
                  <Suspense fallback={<div>Loading Stats Graph...</div>}>
                     <StatsGraph stats={stats} statsList={statsList} />
                  </Suspense>
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   </div>
);
