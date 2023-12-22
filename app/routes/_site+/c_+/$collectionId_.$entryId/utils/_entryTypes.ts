import type { Params } from "@remix-run/react";
import type { Payload } from "payload";

import type { User } from "payload/generated-types";

export type EntryType = {
   siteId: string;
   id: string;
   name?: string;
   slug?: string;
   icon?: {
      url?: string;
   };
};

export type EntryAllData = EntryType & {
   embeddedContent: JSON;
};

// https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist
type RequireOnlyOneOptional<T, Keys extends keyof T = keyof T> = Pick<
   T,
   Exclude<keyof T, Keys>
> &
   {
      [K in Keys]-?: Pick<T, K> & Partial<Record<Exclude<Keys, K>, undefined>>;
   }[Keys];

export type RestOrGraphql = RequireOnlyOneOptional<
   EntryFetchType,
   "rest" | "gql"
>;

interface EntryFetchType {
   payload: Payload;
   params: Params;
   request: Request;
   user: User | undefined;
   rest?: {
      depth?: number;
   };
   gql?: {
      query: string;
      variables?: {};
   };
}
