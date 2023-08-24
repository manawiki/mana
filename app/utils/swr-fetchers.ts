import type { Variables } from "graphql-request";
import { GraphQLClient } from "graphql-request";

import { settings } from "mana-config";

type Props = {
   query: string;
   variables?: Variables;
};

export const swrRestFetcher = (...args: any) =>
   fetch(args).then((res) => res.json());

export const swrGqlFetcher = <T>(props: Props) => {
   const { query, variables } = props;
   const endpoint = `${settings.domainFull}/api/graphql`;
   const graphQLClient = new GraphQLClient(endpoint);
   return graphQLClient.request<T>(query, variables);
};
