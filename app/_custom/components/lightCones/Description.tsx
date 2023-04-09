export const Description = ({ pageData }: any) => {
   const description = pageData.description;
   const bgdescription = pageData.bg_description;

   return (
      <>
         {/* Description */}
         <div className="rounded-md border bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 my-3 p-3">
            <div
               className=""
               dangerouslySetInnerHTML={{ __html: description }}
            ></div>
         </div>

         {/* Background Description */}
         <div className="rounded-md border bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 my-3 p-3 text-gray-600 dark:text-gray-400">
            <div
               className=""
               dangerouslySetInnerHTML={{ __html: bgdescription }}
            ></div>
         </div>
      </>
   );
};
