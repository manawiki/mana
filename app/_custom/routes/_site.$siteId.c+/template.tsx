import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { List } from "~/routes/_site+/$siteId.c_+/components/List";
import {
   customListMeta,
   fetchList,
} from "~/routes/_site+/$siteId.c_+/functions/list";

export { customListMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { list } = await fetchList({
      params,
      gql: {
         query: QUERY,
         variables: {},
      },
   });
   return json({ list });
}

export default function ListPage() {
   const { list } = useLoaderData<typeof loader>();

   return (
      <List>
         <div></div>
      </List>
   );
}

const QUERY = gql`
   query {
      PluralCollectionName(limit: 100, sort: "name") {
         docs {
            id
            name
            slug
            element {
               id
               icon {
                  url
               }
            }
         }
      }
   }
`;
