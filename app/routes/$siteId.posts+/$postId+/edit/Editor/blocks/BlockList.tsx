import type { ListElement } from "../types";
import type { ReactNode } from "react";

type Props = {
   element: ListElement;
   children: ReactNode;
};

export default function BlockList({ element, children }: Props) {
   return (
      <ul className="list-none ml-3 m-0 p-0">
         <li
            className="flex mb-2.5 items-start flex-grow before:content-['•'] 
           before:w-4 before:mr-2 before:flex-grow-0 before:flex-shrink-0 
           before:inline-flex before:items-center before:justify-center"
         >
            {children}
         </li>
      </ul>
   );
}
