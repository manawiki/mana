export const Header = ({ pageData }: any) => {
   return (
      <>
         <div>
            {" "}
            <div className="relative inline-block w-full mx-1">
               <div className="h-6 w-6 bg-gray-800 inline-block align-middle mr-2">
                  <img
                     className="object-contain"
                     src={pageData?.icon_small?.url}
                  />
               </div>
               <div className="inline-block align-middle">
                  Track Achievement Progress using the Checkboxes below!
               </div>
               <div className="text-sm text-gray-400 dark:text-gray-600 italic">
                  * Requires LocalStorage to be enabled.
               </div>
            </div>
         </div>
      </>
   );
};
