export const Navigation = ({
   links,
}: {
   links: { name: string; link: string }[];
}) => {
   return (
      <>
         <div className="mb-3 grid grid-cols-2 items-center justify-between gap-2 laptop:grid-cols-6">
            {links?.map((l: any) => (
               <a
                  key={l.name}
                  href={`#${l.link}`}
                  className="border-color-sub text-1 shadow-1 overflow-hidden
                  rounded-full border  p-2 text-center
                  text-sm font-bold shadow-sm transition bg-2-sub"
               >
                  {l.name}
               </a>
            ))}
         </div>
      </>
   );
};
