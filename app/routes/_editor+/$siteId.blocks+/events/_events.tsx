import type { ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";

import { Disclosure, Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import clsx from "clsx";
import { CalendarPlus, ChevronDown, Timer, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useTimer } from "react-timer-hook";
import { Transforms, Node, Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import DatePicker from "~/components/datepicker/date-picker";
import TimePicker from "~/components/datepicker/time-picker";
import type { Time } from "~/components/datepicker/time-picker/types";
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
}: {
   element: EventsElement;
   children: ReactNode;
}) {
   const editor = useSlate();

   return (
      <section className="pb-4">
         <div className="divide-color shadow-1 border-color bg-3 divide-y rounded-lg border shadow-sm">
            {children}
         </div>
         <div contentEditable={false} className="pt-3">
            <button
               className="shadow-1 border-color rounded-lg border bg-zinc-800 px-3 py-2 text-xs font-bold text-white shadow-sm"
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
      </section>
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

   const [startTime, setStartTime] = useState(
      element?.startTime ? element?.startTime : currentTime
   );
   const [endTime, setEndTime] = useState(
      element?.endTime ? element?.endTime : currentTime
   );

   function updateEditorValue(
      event: Time | Date | string | any,
      key: "startDate" | "startTime" | "endDate" | "endTime" | "label"
   ) {
      const path = ReactEditor.findPath(editor, element);
      if (key == "label") {
         return Transforms.setNodes<CustomElement>(
            editor,
            { [key]: event },
            {
               at: path,
            }
         );
      }

      const { startTime, endTime, startTimestamp, endTimestamp } = element;

      Transforms.setNodes<CustomElement>(
         editor,
         {
            ...(key == "startDate" && {
               startDate: event,
               startTimestamp: convertTimeToDate(
                  startTime ?? {
                     hours: 0,
                     minutes: 0,
                  },
                  event
               ),
            }),
            ...(key == "endDate" && {
               endDate: event,
               endTimestamp: convertTimeToDate(
                  endTime ?? {
                     hours: 0,
                     minutes: 0,
                  },
                  event
               ),
            }),
            ...(key == "startTime" && {
               startTime: event,
               startTimestamp: convertTimeToDate(event, startDate),
            }),
            ...(key == "endTime" && {
               endTime: event,
               endTimestamp: convertTimeToDate(event, endDate),
            }),
         },
         {
            at: path,
         }
      );

      if (!startTimestamp || !endTimestamp) return;
      const updatedParent = Node.parent(editor, path);
      const currentChildren = updatedParent.children;
      const sortedUpdated = [...currentChildren].sort(
         //@ts-ignore
         (a, b) => new Date(a.startTimestamp) - new Date(b.startTimestamp)
      );
      return sortedUpdated.forEach((row: any) => {
         Transforms.moveNodes<CustomElement>(editor, {
            at: [path[0]],
            match: (node: Node) =>
               //@ts-ignore
               Editor.isBlock(editor, node) && node.id === row?.id,
            to: [
               path[0],
               sortedUpdated.findIndex((item: any) => item.id == row.id),
            ],
         });
      });
   }

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
                  <CountdownTimer element={element} />
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
                                             onChange={(e) => {
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
                                             onChange={(e) => {
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
                                             onChange={(e) => {
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

function CountdownTimer({ element }: { element: EventItemElement }) {
   const today = new Date();

   const { startTime, endTime, startDate, endDate } = element;

   const hasStartFields = startTime && startDate;
   const hasEndFields = endTime && endDate;

   const hasAllFields = hasStartFields && hasEndFields;

   //Combine date with time field
   const displayStartDate =
      hasStartFields && convertTimeToDate(startTime, startDate);

   const displayEndDate = hasEndFields && convertTimeToDate(endTime, endDate);

   const isActiveEvent = displayStartDate && today >= displayStartDate;

   //If the event is active, show countdown before event ends, otherwise show countdown before event starts
   const expirationDate = isActiveEvent ? displayEndDate : displayStartDate;

   const [expiryTime, setExpiryTimestamp] = useState(expirationDate);

   const { minutes, hours, days, restart } = useTimer({
      expiryTimestamp: expiryTime ?? new Date(),
   });

   useEffect(() => {
      if (expirationDate) {
         setExpiryTimestamp(expirationDate);
         restart(expirationDate);
      }
   }, [element]);

   const label = isActiveEvent ? "End Date" : "Start Date";

   return (
      <div className="flex items-center gap-4">
         {hasAllFields && (
            <>
               <section>
                  <div
                     className={clsx(
                        isActiveEvent ? "text-sky-500" : "text-blue-500",
                        "text-right text-[10px] font-bold"
                     )}
                  >
                     {label}
                  </div>
                  <div className="flex items-center justify-end">
                     <div className="text-1 flex items-center gap-2 text-xs font-bold">
                        {days ? (
                           <div className="flex items-center gap-0.5">
                              <span>{days}</span>
                              <span className="font-semibold text-zinc-400">
                                 d
                              </span>
                           </div>
                        ) : null}
                        {hours ? (
                           <div className="flex items-center gap-0.5">
                              <span>{hours}</span>
                              <span className="font-semibold text-zinc-400">
                                 h
                              </span>
                           </div>
                        ) : null}
                        {minutes ? (
                           <div className="flex items-center gap-0.5">
                              <span>{minutes}</span>
                              <span className="font-semibold text-zinc-400">
                                 m
                              </span>
                           </div>
                        ) : null}
                     </div>
                  </div>
               </section>
               {!isActiveEvent && (
                  <CountdownTimerEnd expiryTimestamp={displayEndDate} />
               )}
            </>
         )}
      </div>
   );
}

function CountdownTimerEnd({ expiryTimestamp }: { expiryTimestamp: any }) {
   const [expiryTime, setExpiryTimestamp] = useState(expiryTimestamp);

   const { minutes, hours, days, restart } = useTimer({
      expiryTimestamp: expiryTime,
   });

   useEffect(() => {
      if (expiryTimestamp) {
         setExpiryTimestamp(expiryTimestamp);
         restart(expiryTimestamp);
      }
   }, [expiryTimestamp, restart]);

   return (
      <section className="w-24">
         <div className="text-right text-[10px] font-bold text-purple-400">
            Duration
         </div>
         <div className="flex items-center justify-end">
            <div className="text-1 flex items-center gap-2 text-xs font-bold">
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
         </div>
      </section>
   );
}
