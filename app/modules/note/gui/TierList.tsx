import { useFetcher } from "@remix-run/react";

export default function NoteTierList({
   defaultValue,
}: {
   defaultValue: string;
}) {
   const fetcher = useFetcher();

   const autoSave = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const mdx = event.target.value;
      fetcher.submit({ mdx, autosave: "yes" }, { method: "post" });
   };

   return (
      <div>
         <textarea
            name="mdx"
            className="min-h-screen w-full border-0 bg-transparent p-0"
            defaultValue={defaultValue}
            required
            onChange={autoSave}
            //todo fix cursor position on autofocus
            autoFocus
         />
      </div>
   );
}
