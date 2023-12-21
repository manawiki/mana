import { useState } from "react";

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AdditionalData } from "~/_custom/components/enemies/AdditionalData";
import { Drops } from "~/_custom/components/enemies/Drops";
import { Resistances } from "~/_custom/components/enemies/Resistances";
import { Selector } from "~/_custom/components/enemies/Selector";
import { Skills } from "~/_custom/components/enemies/Skills";
import { Stats } from "~/_custom/components/enemies/Stats";
import { H2 } from "~/components/Headers";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      rest: {
         depth: 3,
      },
   });

   return json({ entry });
}

export default function CharacterEntry() {
   const { entry } = useLoaderData<typeof loader>();

   const [version, setVersion] = useState(0);

   return (
      <Entry>
         {/* Selector for Enemy Version */}
         <Selector
            pageData={entry.data}
            version={version}
            setVersion={setVersion}
         />

         {/* Image */}
         <Stats pageData={entry.data} version={version} />

         {/* Skill List */}
         <H2 text="Skills" />
         <Skills pageData={entry.data} version={version} />

         {/* Resistances */}
         <H2 text="Resistances" />
         <Resistances pageData={entry.data} version={version} />

         {/* Drop Rewards */}
         <H2 text="Drops" />
         <Drops pageData={entry.data} version={version} />

         {/* Additional Data */}
         <H2 text="Additional Data" />
         <AdditionalData pageData={entry.data} version={version} />
      </Entry>
   );
}
