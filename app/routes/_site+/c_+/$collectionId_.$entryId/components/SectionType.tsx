import { Icon } from "~/components/Icon";

export function SectionType({ type }: { type: string }) {
   let icon = "" as any;
   switch (type) {
      case "editor":
         icon = "pen-square";
         break;
      case "customTemplate":
         icon = "layout-grid";
         break;
      case "qna":
         icon = "pencil";
         break;
      case "comments":
         icon = "pencil";
         break;
      default:
         icon = "pencil";
         break;
   }
   return (
      <div className="size-6 dark:bg-dark450 bg-white border dark:border-zinc-600 rounded-full flex items-center justify-center">
         <Icon size={10} name={icon} />
      </div>
   );
}
