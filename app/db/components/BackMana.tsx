import React from "react";

import { ChevronLeft } from "lucide-react";

export const BackMana: React.FC = () => {
   return (
      <>
         <div className="side-menu">
            <a className="side-menu-nested" href="/">
               <ChevronLeft size={20} />
               <span>Back</span>
            </a>
         </div>
      </>
   );
};
