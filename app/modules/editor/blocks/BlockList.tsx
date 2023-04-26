import type { ListElement } from "../types";
import type { ReactNode } from "react";

type Props = {
   element: ListElement;
   children: ReactNode;
};

export default function BlockList({ element, children }: Props) {
   return (
      <ul className="m-0 ml-3 list-none p-0">
         <li
            className="mb-2.5 flex flex-grow items-start before:mr-2 
           before:inline-flex before:w-4 before:flex-shrink-0 before:flex-grow-0 
           before:items-center before:justify-center before:content-['•']"
         >
            {children}
         </li>
      </ul>
   );
}
