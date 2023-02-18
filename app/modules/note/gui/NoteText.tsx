//This renders an basic textarea editor
export default function NoteText({
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
            className="w-full border-0 bg-transparent p-0"
            defaultValue={defaultValue}
            required
            placeholder="Start typing..."
            onChange={onChange}
            //todo fix cursor position on autofocus
            autoFocus
         />
      </div>
   );
}
