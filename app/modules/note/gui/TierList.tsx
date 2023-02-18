import { useFetcher } from "@remix-run/react";

export default function NoteTierList({
   defaultValue,
   onChange,
}: {
   defaultValue: string;
   onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
   const fetcher = useFetcher();

   const autoSave = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const mdx = event.target.value;
      onChange(event);
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
