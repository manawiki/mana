// THis renders a tier list editor
export default function NoteTierList({
   defaultValue,
   onChange,
}: {
   defaultValue: string;
   onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
   return (
      <div>
         <textarea
            name="mdx"
            className="min-h-screen w-full border-0 bg-transparent p-0"
            defaultValue={defaultValue}
            required
            onChange={onChange}
            //todo fix cursor position on autofocus
            autoFocus
         />
      </div>
   );
}
