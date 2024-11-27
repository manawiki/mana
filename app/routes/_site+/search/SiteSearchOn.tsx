import { InstantSearch } from "react-instantsearch";

import type { Site } from "payload/generated-types";

import { searchClient } from "./_search";
import { Autocomplete } from "./components/Autocomplete";

export function SiteSearchOn({ site }: { site: Site }) {
   return (
      <InstantSearch searchClient={searchClient}>
         <Autocomplete site={site} />
      </InstantSearch>
   );
}
