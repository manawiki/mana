import type { ReactNode } from "react";
import { Fragment, useState } from "react";

import { Disclosure, Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import clsx from "clsx";
import { CalendarPlus, ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { nanoid } from "nanoid";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import DatePicker from "~/components/datepicker/date-picker";

import { BlockType } from "../../functions/types";
import type {
   CustomElement,
   EventItemElement,
   EventsElement,
} from "../../functions/types";
import TimePicker from "~/components/datepicker/time-picker";
import { getCurrentTime } from "~/components/datepicker/util";

export function BlockEvents({
   element,
   children,
   ...attributes
}: {
   element: EventsElement;
   children: ReactNode;
}) {
   const editor = useSlate();

   return (
      <>
         <div className="divide-color shadow-1 border-color divide-y rounded-lg border bg-zinc-50 shadow-sm dark:bg-bg2Dark">
            {children}
         </div>
         <div contentEditable={false} className="pt-3">
            <button
               className="shadow-1 border-color rounded-lg border bg-blue-50 px-3 py-2 text-xs font-bold shadow-sm"
               onClick={() => {
                  const path = [
                     ReactEditor.findPath(editor, element),
                     element.children.length,
                  ];
                  Transforms.insertNodes(
                     editor,
                     {
                        id: nanoid(),
                        type: BlockType.EventItem,
                        children: [{ text: "" }],
                     },
                     //@ts-ignore
                     { at: path }
                  );
               }}
            >
               Add
            </button>
         </div>
      </>
   );
}

export function BlockEventItem({
   element,
   children,
}: {
   element: EventItemElement;
   children: ReactNode;
}) {
   const today = new Date();
   const currentTime = getCurrentTime();

   const editor = useSlate();
   const [labelValue, setLabelValue] = useState(element?.label ?? "");
   const [startDate, setStartDate] = useState(today);
   const [endDate, setEndDate] = useState(today);
   const [startTime, setStartTime] = useState(currentTime);
   const [endTime, setEndTime] = useState(currentTime);

   const updateLabelValue = (event: any) => {
      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<CustomElement> = {
         ...element,
         label: event,
      };
      setLabelValue(event);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };

   return (
      <Disclosure key={element.id}>
         {({ open, close }) => (
            <>
               <div
                  contentEditable={false}
                  className="flex w-full items-center gap-3 p-2.5 pl-4"
               >
                  <input
                     placeholder="Start typing..."
                     onChange={(event) => updateLabelValue(event.target.value)}
                     value={labelValue}
                     type="text"
                     className="flex-grow border-0 bg-transparent p-0 text-sm font-bold focus:ring-0"
                  />
                  <Popover>
                     {({ open }) => (
                        <>
                           <Float
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                              placement="left-start"
                              offset={8}
                           >
                              <Popover.Button
                                 className="shadow-1 border-color flex h-8 items-center justify-center gap-2 rounded-lg 
                                 border bg-white px-2 shadow-sm focus:outline-none dark:bg-bg3Dark"
                                 aria-label="Insert block below"
                              >
                                 {open ? (
                                    <X className="text-red-400" size={16} />
                                 ) : (
                                    <>
                                       <CalendarPlus
                                          className={`${
                                             open
                                                ? "rotate-45 text-red-400"
                                                : ""
                                          } transform transition duration-300 ease-in-out`}
                                          size={16}
                                       />
                                    </>
                                 )}
                                 <span className="text-xs">
                                    {startDate.toDateString()}
                                 </span>
                              </Popover.Button>
                              <Popover.Panel
                                 className="border-color min-h-[200px] w-screen max-w-[270px] transform
                               rounded-lg border bg-zinc-50 shadow dark:bg-neutral-800 dark:shadow-zinc-900"
                              >
                                 <DatePicker
                                    value={startDate}
                                    onChange={setStartDate}
                                    minDate={today}
                                    weekStartsFrom="Monday"
                                    className="!w-full !border-0 text-xs !shadow-none"
                                 />
                              </Popover.Panel>
                           </Float>
                        </>
                     )}
                  </Popover>
                  <TimePicker
                     onChange={setStartTime}
                     value={startTime}
                     minutesInterval={1}
                  />
                  <Disclosure.Button>
                     <div
                        contentEditable={false}
                        className={clsx(
                           open ? "rotate-180" : "",
                           "bg-3 shadow-1 border-color flex h-8 w-8 flex-none transform items-center justify-center rounded-full border pt-0.5 shadow-sm transition duration-300 ease-in-out"
                        )}
                     >
                        <ChevronDown size={18} />
                     </div>
                  </Disclosure.Button>
               </div>
               <Disclosure.Panel className="px-4 py-3" unmount={false}>
                  {children}
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
}
