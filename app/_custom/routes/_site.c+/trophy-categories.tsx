import { useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { List } from "~/routes/_site+/c_+/_components/List";

export { listMeta as meta };

export async function loader({
  request,
  context: { payload },
}: LoaderFunctionArgs) {
  const { list } = await fetchList({
    request,
    gql: {
      query: AchievementQuery,
    },
    payload,
  });

  //@ts-ignore
  return json({ achievements: list?.data?.TrophyCategories?.docs });
}

export default function AchievementList() {
  const { achievements } = useLoaderData<typeof loader>();
  return <TrophyCategoryList chars={achievements} />;
}

type FilterTypes = {
  id: string;
  name: string;
  field: string;
};

type FilterOptionType = {
  name: string;
  id: string;
  icon?: string;
};

const TrophyCategoryList = ({ chars }: any) => {
  return (
    <List>
      {/* List of Characters with applied sorting */}
      <div className="grid grid-cols-3 gap-3 pb-4 text-center laptop:grid-cols-4">
        {chars?.map((char, int) => {
          const cid = char.slug ?? char?.id;
          const cname = char.name;
          const cicon = char.icon?.url;

          return (
            <Link
              key={cid}
              prefetch="intent"
              to={`/c/trophy-categories/${cid}`}
              className="bg-2-sub border-color-sub shadow-1 flex items-center justify-center rounded-md border p-2 shadow-sm"
            >
              {/* Character Icon */}
              <div className="relative w-full">
                {/* Path + Path Name ? */}
                <div className=" absolute bottom-3 z-20 h-7 w-full text-center text-white font-bold">
                  {char.name}
                </div>

                <div className="relative flex w-full items-center justify-center">
                  <div className="border-color shadow-1 overflow-hidden rounded-sm border-2 shadow-sm">
                    <Image
                      width={200}
                      // height={270}
                      options="width=200"
                      url={char.icon?.url}
                      alt={char?.name}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </List>
  );
};

const AchievementQuery = gql`
  query TrophyCategories {
    TrophyCategories {
      docs {
        id
        name
        icon {
          url
        }
      }
    }
  }
`;
