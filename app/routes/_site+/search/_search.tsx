import { InstantSearch, Hits, SearchBox } from "react-instantsearch";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
   server: {
      apiKey: "9QPWKRfSIdts42aQUyeqyNT1ct0levtm", // Be sure to use an API key that only allows search operations
      nodes: [
         {
            host: "tif2s7d9m8bqwypzp-1.a1.typesense.net",
            port: 443,
            protocol: "https",
         },
      ],
      cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
   },
   // The following parameters are directly passed to Typesense's search API endpoint.
   //  So you can pass any parameters supported by the search endpoint below.
   //  query_by is required.
   additionalSearchParameters: {
      query_by: "name",
   },
});
export const searchClient = typesenseInstantsearchAdapter.searchClient;

export default function SearchList() {
   return (
      <div className="">
         <InstantSearch indexName="posts" searchClient={searchClient}>
            <SearchBox />
            <Hits />
         </InstantSearch>
      </div>
   );
}
