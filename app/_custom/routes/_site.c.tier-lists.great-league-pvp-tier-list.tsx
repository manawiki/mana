import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";

import { Avatar } from "~/components/Avatar";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const graphql_query = jsonToGraphQLQuery(query, { pretty: true });

   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: graphql_query,
      },
   });
   return json({
      entry,
   });
}

const SECTIONS = {
   "tier-1": TierOne,
   "tier-2": TierTwo,
   "tier-3": TierThree,
   "tier-4": TierFour,
   "tier-5": TierFive,
};

export default function TierList() {
   const { entry } = useLoaderData<typeof loader>();

   const tier_list = entry.data;
   return <Entry customComponents={SECTIONS} customData={tier_list}></Entry>;
}

function GridCell({
   icon,
   name,
   href,
}: {
   icon: string;
   name: string;
   href: string;
}) {
   return (
      <Link
         to={href}
         className="flex items-center justify-center flex-col gap-2.5 border border-color-sub shadow-sm shadow-1 bg-2-sub rounded-lg p-3 dark:hover:border-zinc-600/80"
      >
         <Avatar
            src={icon}
            initials={icon ? undefined : name.charAt(0)}
            className="size-14"
            options="aspect_ratio=1:1&height=120&width=120"
         />
         <div className="text-xs tablet:text-sm text-center font-bold">
            {name}
         </div>
      </Link>
   );
}

function TierOne({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-3 gap-3 ">
         {data.tier1.docs.map((row: any) => (
            <GridCell
               key={row.id}
               href={`/c/pokemon/${row.slug}`}
               icon={row?.icon?.url}
               name={row.name}
            />
         ))}
      </div>
   );
}

function TierTwo({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-4 gap-3">
         {data.tier2.docs.map((row: any) => (
            <GridCell
               key={row.id}
               href={`/c/pokemon/${row.slug}`}
               icon={row?.icon?.url}
               name={row.name}
            />
         ))}
      </div>
   );
}

function TierThree({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-4 gap-3">
         {data.tier3.docs.map((row: any) => (
            <GridCell
               key={row.id}
               href={`/c/pokemon/${row.slug}`}
               icon={row?.icon?.url}
               name={row.name}
            />
         ))}
      </div>
   );
}

function TierFour({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-4 gap-3">
         {data.tier4.docs.map((row: any) => (
            <GridCell
               key={row.id}
               href={`/c/pokemon/${row.slug}`}
               icon={row?.icon?.url}
               name={row.name}
            />
         ))}
      </div>
   );
}

function TierFive({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-4 gap-3">
         {data.tier5.docs.map((row: any) => (
            <GridCell
               key={row.id}
               href={`/c/pokemon/${row.slug}`}
               icon={row?.icon?.url}
               name={row.name}
            />
         ))}
      </div>
   );
}

const query = {
   query: {
      tier1: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               ratings__greatLeagueRating: { equals: new EnumType("_5_0") },
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
         },
      },
      tier2: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_4_5"),
                     },
                  },
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_4_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
         },
      },
      tier3: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_3_5"),
                     },
                  },
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_3_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
         },
      },
      tier4: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_2_5"),
                     },
                  },
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_2_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
         },
      },
      tier5: {
         __aliasFor: "allPokemon",
         __args: {
            limit: 200,
            sort: "name",
            where: {
               OR: [
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_1_5"),
                     },
                  },
                  {
                     ratings__greatLeagueRating: {
                        equals: new EnumType("_1_0"),
                     },
                  },
               ],
            },
         },
         docs: {
            id: true,
            slug: true,
            name: true,
            number: true,
            icon: {
               url: true,
            },
         },
      },
   },
};
