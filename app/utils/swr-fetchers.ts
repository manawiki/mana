import type { Variables } from "graphql-request";
import { GraphQLClient } from "graphql-request";

import { settings } from "mana-config";

type Props = {
   query: string;
   variables?: Variables;
};

export function swrRestFetcher(...args: any) {
   return fetch(args).then((res) => res.json());
}

export function swrGqlFetcher<T>(props: Props) {
   const { query, variables } = props;
   const endpoint = `${settings.domainFull}/api/graphql`;
   const graphQLClient = new GraphQLClient(endpoint);
   return graphQLClient.request<T>(query, variables);
}
