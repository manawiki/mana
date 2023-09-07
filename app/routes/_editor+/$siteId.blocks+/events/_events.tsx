import type { ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";

import { Disclosure, Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import clsx from "clsx";
import dt from "date-and-time";
import {
   Calendar,
   ChevronDown,
   MoreVertical,
   MoveRight,
   X,
} from "lucide-react";
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
         <div className="divide-color shadow-1 border-color bg-3 divide-y rounded-lg border shadow-sm [&>*:nth-last-child(2)]:rounded-b-lg">
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

      const { startTime, endTime } = element;

      return Transforms.setNodes<CustomElement>(
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
   }
   const path = ReactEditor.findPath(editor, element);
   const updatedParent = Node.parent(editor, path);

   useEffect(() => {
      const { startTimestamp, endTimestamp } = element;
      if (!startTimestamp || !endTimestamp) return;
      const currentChildren = updatedParent.children;
      const today = new Date();
      // We separate active events so we can show them on top
      const activeEvents = currentChildren
         .filter(
            (row) =>
               new Date(row?.startTimestamp) <= today &&
               new Date(row?.endTimestamp)! > today
         )
         .sort(
            //@ts-ignore
            (a, b) => new Date(a.endTimestamp) - new Date(b.endTimestamp)
         );

      const upcomingEvents = currentChildren
         .filter((row) => new Date(row?.startTimestamp) > today)
         .sort(
            //@ts-ignore
            (a, b) => new Date(a.startTimestamp) - new Date(b.startTimestamp)
         );

      const resultArray = [...activeEvents, ...upcomingEvents];
      return resultArray.forEach((row: any) => {
         Transforms.moveNodes<CustomElement>(editor, {
            at: [path[0]],
            match: (node: Node) =>
               //@ts-ignore
               Editor.isBlock(editor, node) && node.id === row?.id,
            to: [
               path[0],
               resultArray.findIndex((item: any) => item.id == row.id),
            ],
         });
      });
   }, [element]);

   return (
      <Disclosure key={element.id}>
         {({ open, close }) => (
            <>
               <div
                  contentEditable={false}
                  className="flex w-full items-center gap-3 bg-zinc-50 p-2.5 pl-4 shadow-sm first:rounded-t-lg dark:bg-bg2Dark"
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
                                    autoUpdate
                                    offset={6}
                                 >
                                    <Popover.Button
                                       className="rounded-full border border-zinc-100 bg-white p-2.5 focus:outline-none dark:border-zinc-700/50 dark:bg-zinc-800"
                                       aria-label="Insert block below"
                                    >
                                       {open ? (
                                          <X className="text-1" size={14} />
                                       ) : (
                                          <>
                                             <Calendar
                                                className={`${
                                                   open
                                                      ? "rotate-45 text-red-400"
                                                      : ""
                                                } transform transition duration-300 ease-in-out`}
                                                size={14}
                                             />
                                          </>
                                       )}
                                    </Popover.Button>
                                    <Popover.Panel
                                       className="border-color min-h-[200px] transform
                               rounded-lg border bg-zinc-50 shadow-lg dark:bg-bg3Dark dark:shadow-zinc-800"
                                    >
                                       <section className="border-color flex items-center justify-between border-b">
                                          <div className="flex w-full items-center justify-between gap-2 p-3">
                                             <span className="text-1 text-xs font-bold underline decoration-zinc-200 underline-offset-2 dark:decoration-zinc-600">
                                                Start Time
                                             </span>
                                             <TimePicker
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
                                          </div>
                                          <div className="w-10">
                                             <MoveRight size={16} />
                                          </div>
                                          <div className="flex w-full items-center justify-between gap-2 p-3">
                                             <span className="text-1 text-xs font-bold underline decoration-zinc-200 underline-offset-2 dark:decoration-zinc-600">
                                                End Time
                                             </span>
                                             <TimePicker
                                                onChange={(e) => {
                                                   setEndTime(e);
                                                   updateEditorValue(
                                                      e,
                                                      "endTime"
                                                   );
                                                }}
                                                value={endTime}
                                                minutesInterval={1}
                                             />
                                          </div>
                                       </section>
                                       <section className="divide-color flex items-stretch divide-x">
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
                                          />
                                          <DatePicker
                                             value={endDate}
                                             onChange={(e) => {
                                                setEndDate(e);
                                                updateEditorValue(e, "endDate");
                                             }}
                                             minDate={startDate}
                                             weekStartsFrom="Monday"
                                          />
                                       </section>
                                    </Popover.Panel>
                                 </Float>
                              </>
                           )}
                        </Popover>
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
                        className="bg-3 shadow-1 border-color flex h-8 w-8 flex-none items-center 
                        justify-center rounded-full border pt-0.5 shadow-sm"
                     >
                        <ChevronDown
                           className={clsx(
                              open ? "rotate-180" : "",
                              "transform transition duration-300 ease-in-out"
                           )}
                           size={18}
                        />
                     </div>
                  </Disclosure.Button>
                  <button
                     onClick={() => {
                        Transforms.delete(editor, {
                           at: path,
                        });
                     }}
                     className="border-color bg-3 -mr-2.5 rounded-md rounded-r-none border border-r-0 py-1"
                  >
                     <MoreVertical size={16} />
                  </button>
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

   const label = isActiveEvent ? "Ends In" : "Starts In";

   return (
      <div className="flex items-center gap-4">
         {hasAllFields && (
            <>
               <section>
                  <div className="text-right text-[10px] font-bold text-sky-500">
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
               {displayEndDate && !isActiveEvent && (
                  <section>
                     <div className="text-right text-[10px] font-bold text-sky-500">
                        Ends On
                     </div>
                     <div className="flex items-center justify-end">
                        <time
                           className="text-1 flex items-center gap-2 text-xs font-bold"
                           dateTime={`${displayEndDate}`}
                        >
                           {dt.format(displayEndDate, "MMM D, hh:mm A")}
                        </time>
                     </div>
                  </section>
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
