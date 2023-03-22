import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps, ReactElement, ReactNode } from "react";

type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root> &
   ComponentProps<typeof TooltipPrimitive.Content> & {
      children: ReactElement;
      content: ReactNode;
   };

export default function Tooltip({
   children,
   content,
   open,
   defaultOpen,
   onOpenChange,
   side = "top",
   align = "center",
   delayDuration,
   ...props
}: TooltipProps) {
   return (
      <TooltipPrimitive.Root
         open={open}
         defaultOpen={defaultOpen}
         onOpenChange={onOpenChange}
         delayDuration={delayDuration}
      >
         <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
         <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
               className="max-w-[14rem] shadow-lg shadow-1 text-sm font-bold bg-4 rounded-full px-3 py-1.5 z-30"
               side={side}
               align={align}
               sideOffset={4}
               {...props}
            >
               {content}

               <TooltipPrimitive.Arrow
                  offset={8}
                  width={11}
                  height={5}
                  className="fill-white dark:fill-bg4Dark"
               />
            </TooltipPrimitive.Content>
         </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
   );
}
