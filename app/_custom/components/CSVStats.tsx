import { Disclosure } from "@headlessui/react";
import { Binary, ChevronDown } from "lucide-react";

// =====================================
// Collapsible CSV Stat Text box
export const CSVStats = ({ statsCSV }: { statsCSV?: string }) =>
   statsCSV ? (
      <Disclosure>
         {({ open }) => (
            <>
               <Disclosure.Button
                  className="border-color bg-2 shadow-1 mb-2 flex w-full items-center
                         gap-3 rounded-lg border px-4 py-3 font-bold shadow-sm"
               >
                  <Binary size={20} className="text-yellow-500" />
                  Raw Stats for all Levels
                  <div
                     className={`${
                        open ? "font-bol rotate-180 transform" : ""
                     } ml-auto inline-block `}
                  >
                     <ChevronDown size={28} />
                  </div>
               </Disclosure.Button>
               <Disclosure.Panel className="">
                  <div
                     contentEditable="true"
                     dangerouslySetInnerHTML={{
                        __html: statsCSV ?? "",
                     }}
                     className="border-color bg-2 h-24 overflow-y-scroll rounded-md border px-4 py-3 font-mono"
                  ></div>
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   ) : (
      <></>
   );
