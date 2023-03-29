import type { ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { nanoid } from "nanoid";
import type { CustomElement } from "../types";
import { BlockType } from "../types";
import Tooltip from "../../../../../../components/Tooltip";
import { useSelf } from "~/liveblocks.config";

type Props = {
   children: ReactNode;
   onSelect: (block: CustomElement) => void;
};

export default function BlockTypeSelector({ children, onSelect }: Props) {
   const self = useSelf();
   const createdBy = self?.connectionId || 0;

   const groups = [
      {
         label: "Text",
         items: [
            {
               label: "Heading 1",
               description: "Large section heading",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.H1,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Heading 2",
               description: "Large section heading",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.H2,
                     children: [{ text: "" }],
                  });
               },
            },

            {
               label: "Heading 3",
               description: "Large section heading",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.H3,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Normal text",
               description: "Plain text",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.Paragraph,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Bulleted list",
               description: "Create a simple bulleted list",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.BulletedList,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "To-do list",
               description: "Track tasks with a to-do list",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.ToDo,
                     checked: false,
                     children: [{ text: "" }],
                  });
               },
            },
         ],
      },
      {
         label: "Media",
         items: [
            {
               label: "Image",
               description: "Embed from URL",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.Image,
                     url: null,
                     alt: null,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Video",
               description: "Embed YouTube video",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.Video,
                     url: null,
                     children: [{ text: "" }],
                  });
               },
            },
         ],
      },
      {
         label: "Embeds",
         items: [
            {
               label: "CodeSandbox",
               description: "Embed CodeSandbox project",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     id: nanoid(),
                     type: BlockType.CodeSandbox,
                     url: null,
                     children: [{ text: "" }],
                  });
               },
            },
         ],
      },
   ];

   return (
      <DropdownMenuPrimitive.Root>
         <Tooltip content="Insert block below">
            <DropdownMenuPrimitive.Trigger asChild>
               {children}
            </DropdownMenuPrimitive.Trigger>
         </Tooltip>

         <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
               className="overflow-scroll shadow shadow-1
               h-60 w-52 border border-color outline-none z-10 rounded-lg bg-2"
            >
               {groups.map((group, indexGroup) => {
                  return (
                     <DropdownMenuPrimitive.Group key={indexGroup} className="">
                        <DropdownMenuPrimitive.Label
                           className="sticky pt-2.5 pb-1.5 px-2.5 text-1 text-xs font-bold bg-zinc-100/70
                        dark:bg-zinc-700/70 top-0"
                        >
                           {group.label}
                        </DropdownMenuPrimitive.Label>
                        <div className="divide-y border-y border-color divide-color">
                           {groups[indexGroup].items.map((item, indexItem) => {
                              return (
                                 <DropdownMenuPrimitive.DropdownMenuItem
                                    className="outline-none space-y-1 text-xs bg-3 flex flex-col hover:bg-4 px-2.5 py-2 cursor-default"
                                    key={indexItem}
                                    onSelect={item.onSelect}
                                 >
                                    <span className="font-bold text-emerald-500">
                                       {item.label}
                                    </span>
                                    <span className="">{item.description}</span>
                                 </DropdownMenuPrimitive.DropdownMenuItem>
                              );
                           })}
                        </div>
                     </DropdownMenuPrimitive.Group>
                  );
               })}
            </DropdownMenuPrimitive.Content>
         </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
   );
}
