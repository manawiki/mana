import { H2 } from "../custom";

export const Description = ({ pageData }: any) => {
   const description = pageData.description;
   const bgdescription = pageData.bg_description;

   return (
      <>
         <H2 text="Description" />
         {/* Description */}
         <div className="rounded-md bg-1 border-color rounded-b-lg border p-3 text-base"> 
            <div
               className=""
               dangerouslySetInnerHTML={{ __html: description }}
            ></div>
         </div>

         {/* Background Description */}
         <div className="rounded-md border bg-2 border-color my-3 p-3 text-gray-600 dark:text-gray-400">
            <div
               className=""
               dangerouslySetInnerHTML={{ __html: bgdescription }}
            ></div>
         </div>
      </>
   );
};
