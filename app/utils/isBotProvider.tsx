import type { ReactNode } from "react";

import { createContext, useContext } from "react";

type Props = { isBot: boolean; children: ReactNode };

const context = createContext(false);

export function useIsBot() {
   return useContext(context) ?? false;
}

export function IsBotProvider({ isBot, children }: Props) {
   return <context.Provider value={isBot}>{children}</context.Provider>;
}
