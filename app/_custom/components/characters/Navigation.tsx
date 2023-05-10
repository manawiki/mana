export const Navigation = ({ links }: any) => {
   return (
      <>
         <div className="flex justify-between gap-x-1 mb-2 items-center">
            {links?.map((l: any) => (
               <a
                  href={`#${l.link}`}
                  className="border-color flex items-center self-stretch shadow-1 rounded-md border shadow-sm p-2 py-3 w-full text-center justify-center font-bold hover:bg-gray-500 hover:bg-opacity-10"
               >
                  <div className="inline-flex leading-none">{l.name}</div>
               </a>
            ))}
         </div>
      </>
   );
};
