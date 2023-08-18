import { LRUCache } from "lru-cache";

import { remember } from "./remember.server";

// Setup an in memory lru-cache for api calls, this will be cleared on server restart.
export const lruCache = remember(
   "lruCache",
   new LRUCache({
      max: 250, // maximum number of items to store in the cache
      ttl: 5 * 60 * 1000, // how long to live in ms
   })
);

/**
 * Setup a lru-cache for layout data, so we don't have to fetch it every time. Params are based on browser fetch api.
 * @param url - rest api endpoint `https://${siteId}-db.${settings.domain}/api/${collectionId}/${entryId}?depth=1`
 * @param init - browser fetch api init object for headers, body, etc
 * @returns  the result of the fetch or its cached value
 */
export async function fetchWithCache(url: string, init?: RequestInit) {
   //The key could be graphql, in that case we'll use init.body instead. We should also delete any spacing characters
   const key = init?.body
      ? (init.body as string).replace(/\s/g, "").replace(/\n/g, " ")
      : url;

   const cached = lruCache.get(key);
   if (cached) {
      return cached;
   }
   return fetch(url, init).then((res) => {
      const response = res.json();
      lruCache.set(key, response);

      //log cache size, trim length to terminal width
      console.log(`API Cached ${lruCache.size}: ${key}`.substring(0, 80));
      return response;
   });
}

/**
 * Use this to cache a function return. Use this only for public api calls, not for private api calls.
 * @param func  await cacheThis(func () => payload.find({...}));
 * @returns  the result of the function or its cached value
 */
export async function cacheThis<T>(func: () => Promise<T>) {
   //the key is the function stringified
   let key = func.toString().replace(/\s/g, "").replace(/\n/g, " ");

   // if the function is payload api, we'll use the body instead
   key = key.split("(")?.slice(2)?.join("(") ?? key;

   const cached = lruCache.get(key);
   if (cached) {
      return cached as T;
   }
   const result = await func();
   lruCache.set(key, result);

   //log cache size, trim length to terminal width
   console.log(`API Cached ${lruCache.size}: ${key}`.substring(0, 80));
   return result;
}

export async function cacheWithSelect<T>(
   func: () => Promise<T>,
   selectFunction: Function,
   selectOptions: Partial<Record<keyof any, boolean>>
) {
   //the key is the function stringified
   let key = func.toString().replace(/\s/g, "").replace(/\n/g, " ");

   // if the function is payload api, we'll use the body instead
   key = key.split("(")?.slice(2)?.join("(") ?? key;

   const cached = lruCache.get(key);
   if (cached) {
      return cached as T;
   }
   const result = await func();
   const selectFields = selectFunction(result, selectOptions);
   lruCache.set(key, selectFields);

   //log cache size, trim length to terminal width
   console.log(`API Cached ${lruCache.size}: ${key}`.substring(0, 80));
   return result;
}
