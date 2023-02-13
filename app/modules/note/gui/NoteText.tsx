import { useFetcher } from "@remix-run/react";

//This renders an autosave textarea
export default function NoteText({ defaultValue }: { defaultValue: string }) {
   const fetcher = useFetcher();

   const autoSave = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const mdx = event.target.value;
      fetcher.submit({ mdx, autosave: "yes" }, { method: "post" });
   };

   return (
      <div>
         <textarea
            name="mdx"
            className="w-full border-0 bg-transparent p-0"
            defaultValue={defaultValue}
            required
            placeholder="Start typing..."
            onChange={autoSave}
            //todo fix cursor position on autofocus
            autoFocus
         />
      </div>
   );
}
