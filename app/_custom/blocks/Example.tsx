import type { ReactNode } from "react";
import type { ListElement } from "~/modules/editor/types";

type Props = {
   element: ListElement;
   children: ReactNode;
};

export const ExampleBlock = ({ element, children }: Props) => {
   return <div className="">{children}</div>;
};
