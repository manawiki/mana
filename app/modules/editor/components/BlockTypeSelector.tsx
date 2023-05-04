import type { ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { nanoid } from "nanoid";
import type { CustomElement } from "../types";
import { BlockType } from "../types";
import Tooltip from "~/components/Tooltip";
import { useSelf } from "~/liveblocks.config";
import { GROUP_COLORS } from "../blocks/BlockGroup";

type Props = {
   children: ReactNode;
   onSelect: (block: CustomElement) => void;
};

export default function BlockTypeSelector({ children, onSelect }: Props) {
   const self = useSelf();
   const createdBy = self?.connectionId || 0;

   const groups = [
      {
         label: "Widgets",
         items: [
            {
               label: "Group",
               description: "Create a group of collections",
               onSelect: () => {
                  onSelect({
                     createdBy,
                     viewMode: "list",
                     id: nanoid(),
                     color: GROUP_COLORS[0],
                     type: BlockType.Group,
                     groupLabel: "",
                     collection: "",
                     groupItems: [],
                     children: [{ text: "" }],
                  });
               },
            },
         ],
      },
      {
         label: "Text",
         items: [
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
         <Tooltip id="insert-block" content="Insert block below">
            <DropdownMenuPrimitive.Trigger asChild>
               {children}
            </DropdownMenuPrimitive.Trigger>
         </Tooltip>

         <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
               className="shadow-1 border-color bg-2 relative z-10
               h-72 w-60 overflow-scroll rounded-lg border shadow outline-none"
            >
               {groups.map((group, indexGroup) => {
                  return (
                     <DropdownMenuPrimitive.Group key={indexGroup} className="">
                        <DropdownMenuPrimitive.Label
                           className="text-1 sticky top-0 bg-zinc-100 px-2.5 pb-1.5 pt-2.5 text-xs
                        font-bold dark:bg-zinc-700"
                        >
                           {group.label}
                        </DropdownMenuPrimitive.Label>
                        <div className="border-color divide-color divide-y border-y">
                           {groups[indexGroup].items.map((item, indexItem) => {
                              return (
                                 <DropdownMenuPrimitive.DropdownMenuItem
                                    className="bg-3 hover:bg-4 flex cursor-default flex-col space-y-1 px-2.5 py-2 text-xs outline-none"
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
