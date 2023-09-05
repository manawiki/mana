import type { ReactNode } from "react";
import { Fragment, useState } from "react";

import { Disclosure, Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import clsx from "clsx";
import { CalendarPlus, ChevronDown, Timer, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useTimer } from "react-timer-hook";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import DatePicker from "~/components/datepicker/date-picker";
import TimePicker from "~/components/datepicker/time-picker";
import {
   convertTimeToDate,
   getCurrentTime,
} from "~/components/datepicker/util";

import { BlockType } from "../../functions/types";
import type {
   CustomElement,
   EventItemElement,
   EventsElement,
} from "../../functions/types";

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
         <div className="divide-color shadow-1 border-color bg-3 divide-y rounded-lg border shadow-sm">
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
   const [startDate, setStartDate] = useState(
      element?.startDate ? new Date(element?.startDate) : today
   );
   const [endDate, setEndDate] = useState(
      element?.endDate ? new Date(element?.endDate) : today
   );
   const initStartTime = element?.startTime ? element?.startTime : currentTime;
   const initEndTime = element?.endTime ? element?.endTime : currentTime;

   const [startTime, setStartTime] = useState(initStartTime);
   const [endTime, setEndTime] = useState(initEndTime);

   const updateEditorValue = (
      event: any,
      key: "startDate" | "startTime" | "endDate" | "endTime" | "label"
   ) => {
      //If time field, we need to convert it to the right format

      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<CustomElement> = {
         ...element,
         [key]: event,
      };

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };

   //Combine date with time field
   const displayStartDate =
      element?.startTime &&
      element?.startDate &&
      convertTimeToDate(element?.startTime, element?.startDate);

   const displayEndDate =
      element?.endTime &&
      element?.endDate &&
      convertTimeToDate(element?.endTime, element?.endDate);

   const isActiveEvent = displayStartDate && displayStartDate > today;
   const isEventOver = displayEndDate && displayEndDate > today;

   return (
      <Disclosure key={element.id}>
         {({ open, close }) => (
            <>
               <div
                  contentEditable={false}
                  className="flex w-full items-center gap-3 bg-zinc-50 p-2.5 pl-4 shadow-sm dark:bg-bg2Dark"
               >
                  <input
                     placeholder="Start typing..."
                     onChange={(event) => {
                        setLabelValue(event.target.value);
                        updateEditorValue(event.target.value, "label");
                     }}
                     value={labelValue}
                     type="text"
                     className="flex-grow border-0 bg-transparent p-0 text-sm font-bold focus:ring-0"
                  />
                  <CountdownTimer expiryTimestamp={displayEndDate} />
                  <div className="flex items-center">
                     <section className="relative">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 transform rounded-full bg-zinc-200 px-1.5 text-[8px] font-bold dark:bg-zinc-700">
                           Start
                        </div>
                        <div className="shadow-1 divide-color border-color flex items-center divide-x rounded-lg border bg-white shadow-sm dark:bg-bg3Dark">
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
                                       placement="bottom-end"
                                       offset={6}
                                    >
                                       <Popover.Button
                                          className="p-2 focus:outline-none"
                                          aria-label="Insert block below"
                                       >
                                          {open ? (
                                             <X className="text-1" size={16} />
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
                                       </Popover.Button>
                                       <Popover.Panel
                                          className="border-color min-h-[200px] max-w-[270px] transform
                               rounded-lg border bg-zinc-50 shadow dark:bg-neutral-800 dark:shadow-zinc-900"
                                       >
                                          <DatePicker
                                             value={startDate}
                                             onChange={(e: any) => {
                                                setStartDate(e);
                                                updateEditorValue(
                                                   e,
                                                   "startDate"
                                                );
                                             }}
                                             minDate={today}
                                             weekStartsFrom="Monday"
                                             className="!w-full !border-0 text-xs !shadow-none"
                                          />
                                       </Popover.Panel>
                                    </Float>
                                 </>
                              )}
                           </Popover>
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
                                       placement="bottom-end"
                                       offset={6}
                                    >
                                       <Popover.Button
                                          className="p-2 focus:outline-none"
                                          aria-label="Insert block below"
                                       >
                                          {open ? (
                                             <X className="text-1" size={16} />
                                          ) : (
                                             <>
                                                <Timer
                                                   className={`${
                                                      open
                                                         ? "rotate-45 text-red-400"
                                                         : ""
                                                   } transform transition duration-300 ease-in-out`}
                                                   size={16}
                                                />
                                             </>
                                          )}
                                       </Popover.Button>
                                       <Popover.Panel
                                          className="border-color transform
                               rounded-lg border bg-zinc-50 shadow dark:bg-neutral-800 dark:shadow-zinc-900"
                                       >
                                          <TimePicker
                                             className="!w-full !border-0 !py-2 text-xs !shadow-none"
                                             onChange={(e: any) => {
                                                setStartTime(e);
                                                updateEditorValue(
                                                   e,
                                                   "startTime"
                                                );
                                             }}
                                             value={startTime}
                                             minutesInterval={1}
                                          />
                                       </Popover.Panel>
                                    </Float>
                                 </>
                              )}
                           </Popover>
                        </div>
                     </section>
                     <div className="h-0.5 w-2 bg-zinc-200 dark:bg-zinc-700"></div>
                     <section className="relative">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 transform rounded-full bg-zinc-200 px-1.5 text-[8px] font-bold dark:bg-zinc-700">
                           End
                        </div>
                        <div className="shadow-1 divide-color border-color flex items-center divide-x rounded-lg border bg-white shadow-sm dark:bg-bg3Dark">
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
                                       placement="bottom-end"
                                       offset={6}
                                    >
                                       <Popover.Button
                                          className="p-2 focus:outline-none"
                                          aria-label="Insert block below"
                                       >
                                          {open ? (
                                             <X className="text-1" size={16} />
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
                                       </Popover.Button>
                                       <Popover.Panel
                                          className="border-color min-h-[200px] max-w-[270px] transform
                               rounded-lg border bg-zinc-50 shadow dark:bg-neutral-800 dark:shadow-zinc-900"
                                       >
                                          <DatePicker
                                             value={endDate}
                                             onChange={(e: any) => {
                                                setEndDate(e);
                                                updateEditorValue(e, "endDate");
                                             }}
                                             minDate={startDate}
                                             weekStartsFrom="Monday"
                                             className="!w-full !border-0 text-xs !shadow-none"
                                          />
                                       </Popover.Panel>
                                    </Float>
                                 </>
                              )}
                           </Popover>
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
                                       placement="bottom-end"
                                       offset={6}
                                    >
                                       <Popover.Button
                                          className="p-2 focus:outline-none"
                                          aria-label="Insert block below"
                                       >
                                          {open ? (
                                             <X className="text-1" size={16} />
                                          ) : (
                                             <>
                                                <Timer
                                                   className={`${
                                                      open
                                                         ? "rotate-45 text-red-400"
                                                         : ""
                                                   } transform transition duration-300 ease-in-out`}
                                                   size={16}
                                                />
                                             </>
                                          )}
                                       </Popover.Button>
                                       <Popover.Panel
                                          className="border-color transform
                               rounded-lg border bg-zinc-50 shadow dark:bg-neutral-800 dark:shadow-zinc-900"
                                       >
                                          <TimePicker
                                             className="!w-full !border-0 !py-2 text-xs !shadow-none"
                                             onChange={(e: any) => {
                                                setEndTime(e);
                                                updateEditorValue(e, "endTime");
                                             }}
                                             value={endTime}
                                             minutesInterval={1}
                                          />
                                       </Popover.Panel>
                                    </Float>
                                 </>
                              )}
                           </Popover>
                        </div>
                     </section>
                  </div>
                  {/* <div className="rounded-full bg-zinc-500 px-2.5 py-1 text-[10px] font-bold text-white">
                     Live
                  </div>
                  <div className="rounded-full bg-zinc-300 px-2.5 py-1 text-[10px] font-bold text-white dark:bg-zinc-700 dark:text-zinc-500">
                     Live
                  </div> */}
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
               <Disclosure.Panel className="px-4 py-3 text-sm" unmount={false}>
                  {children}
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
}

function CountdownTimer({ expiryTimestamp }: { expiryTimestamp: Date }) {
   const { seconds, minutes, hours, days } = useTimer({
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
   });

   return (
      <div className="flex items-center gap-2 text-xs font-bold">
         {days ? (
            <div className="flex items-center gap-0.5">
               <span>{days}</span>
               <span className="font-semibold text-zinc-400">d</span>
            </div>
         ) : null}
         {hours ? (
            <div className="flex items-center gap-0.5">
               <span>{hours}</span>
               <span className="font-semibold text-zinc-400">h</span>
            </div>
         ) : null}
         {minutes ? (
            <div className="flex items-center gap-0.5">
               <span>{minutes}</span>
               <span className="font-semibold text-zinc-400">m</span>
            </div>
         ) : null}
      </div>
   );
}
