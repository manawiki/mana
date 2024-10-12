import {
   cachified,
   type Cache,
   type CreateReporter,
   type CacheEntry,
   totalTtl,
} from "@epic-web/cachified";
import { request as gqlRequest } from "graphql-request";
import { LRUCache } from "lru-cache";

import { remember } from "./remember.server";

export { gql } from "graphql-request";

// Setup an in memory lru-cache for api calls, this will be cleared on server restart.
export const lruCache = remember(
   "lruCache",
   new LRUCache<string, CacheEntry>({
      max: 1000, // maximum number of items to store in the cache
      // sizeCalculation: (value) => JSON.stringify(value).length,
      // maxSize: 80 * 1024 * 1024, // 200MB
      // ttl: 5 * 60 * 1000, // how long to live in ms
   }),
);

export const cache: Cache = {
   set(key, value) {
      const ttl = totalTtl(value?.metadata);
      return lruCache.set(key, value, {
         ttl: ttl === Infinity ? undefined : ttl,
         start: value?.metadata?.createdTime,
      });
   },
   get(key) {
      return lruCache.get(key);
   },
   delete(key) {
      return lruCache.delete(key);
   },
};

/**
 * Setup a lru-cache for layout data, so we don't have to fetch it every time. Params are based on browser fetch api.
 * @param url - rest api endpoint
 * @param init - browser fetch api init object for headers, body, etc
 * @param ttl - time to live in ms
 * @returns  the result of the fetch or its cached value
 */
export async function fetchWithCache<T>(
   url: string,
   init?: RequestInit,
   ttl?: number,
) {
   //The key could be graphql, in that case we'll use init.body instead. We should also delete any spacing characters
   const key = init?.body
      ? (init.body as string).replace(/\s/g, "").replace(/\n/g, " ")
      : url;

   return cachified<T>(
      {
         cache,
         key,
         async getFreshValue() {
            try {
               const response = await fetch(url, init);
               return (await response.json()) as T;
            } catch (error) {
               console.error(error);
               // return the error as a response
               return undefined as T;
            }
         },
         checkValue<T>(value: T) {
            return value && typeof value === "object" && !Array.isArray(value);
         },
         ttl: ttl ?? 300_000, // how long to live in ms
         swr: Infinity, // allow stale items to be returned until they are removed
         fallbackToCache: true,
      },
      verboseReporter(),
   );
}

//Instead of native fetch, we'll use gqlRequest from "graphql-request" to make the request.
export async function gqlRequestWithCache<T>(
   url: string,
   query: string,
   variables?: any,
   ttl?: number,
   request?: Request,
) {
   const key = `${url}${query}${JSON.stringify(variables)}`;

   return cachified<T>(
      {
         cache,
         key,
         async getFreshValue() {
            try {
               // We need to catch this to avoid graphql throwing crashing the server
               const response = await gqlRequest(url, query, variables, {
                  cookie: request?.headers.get("cookie") ?? "",
               });
               // console.log("cached: ", key);
               return response as T;
            } catch (error) {
               console.error(error);
               // return the error as a response
               return undefined as T;
            }
         },
         checkValue<T>(value: T) {
            return value && typeof value === "object" && !Array.isArray(value);
         },
         ttl: ttl ?? 300_000, // how long to live in ms
         swr: Infinity, // allow stale items to be returned until they are removed
         fallbackToCache: true,
      },
      verboseReporter(),
   );
}

/**
 * Use this to cache a function return. Use this only for public api calls, not for private api calls.
 * @param func  await cacheThis(func (params) => payload.find(params));
 * @param params - optional params to pass to the function, also used as a key
 * @returns  the result of the function or its cached value
 */
export async function cacheThis<T>(
   func: (params?: any) => Promise<T>,
   params?: any,
   ttl?: number,
) {
   //the key is the function name and params stringified
   let key = params
      ? func.name
         ? `${func.name}(${JSON.stringify(params)})`
         : typeof params === "string"
           ? params
           : params.toString()
      : func.toString();

   return cachified<T>(
      {
         cache,
         key,
         async getFreshValue() {
            try {
               // console.log("cached: ", key);
               return (await func(params)) as T;
            } catch (error) {
               console.error(error);
               // return the error as a response
               return undefined as T;
            }
         },
         checkValue<T>(value: T) {
            return value === null || Boolean(value);
         },
         ttl: ttl ?? 300_000, // how long to live in ms
         swr: Infinity, // allow stale items to be returned until they are removed
         fallbackToCache: true,
      },
      verboseReporter(),
   );
}

/**
 * Use this to cache a function return. Use this only for public api calls, not for private api calls.
 * @param func  await cacheThis(func () => payload.find({...}));
 * @param selectFunction - a function that selects the data you want to cache
 * @param selectOptions - options for the select function
 * @param ttl - time to live in ms
 * @returns  the result of the function or its cached value
 */
export async function cacheWithSelect<T>(
   func: () => Promise<T>,
   selectFunction: Function,
   selectOptions: Partial<Record<keyof any, boolean>>,
   ttl?: number,
) {
   //the key is the function stringified
   let key = func.toString().replace(/\s/g, "").replace(/\n/g, " ");

   // if the function is payload api, we'll use the body instead
   key = key.split("(")?.slice(2)?.join("(") ?? key;

   // if selectOptions is passed, we'll add it to the key
   if (selectOptions) {
      key += JSON.stringify(selectOptions);
   }

   return cachified<T>(
      {
         cache,
         key,
         async getFreshValue() {
            try {
               const result = await func();
               return selectFunction(result, selectOptions) as T;
            } catch (error) {
               console.error(error);
               // return the error as a response
               return undefined as T;
            }
         },
         checkValue<T>(value: T) {
            return value && typeof value === "object" && !Array.isArray(value);
         },
         ttl: ttl ?? 300_000, // how long to live in ms
         swr: Infinity, // allow stale items to be returned until they are removed
         fallbackToCache: true,
      },
      verboseReporter(),
   );
}

interface ReporterOpts {
   formatDuration?: (ms: number) => string;
   logger?: Pick<typeof console, "log" | "warn" | "error">;
   performance?: Pick<typeof Date, "now">;
}

//This reports the cache status, simplified from https://github.com/Xiphe/cachified/blob/main/src/reporter.ts
export function verboseReporter<Value>({
   formatDuration = defaultFormatDuration,
   logger = console,
   performance = globalThis.performance || Date,
}: ReporterOpts = {}): CreateReporter<Value> {
   return ({ key, fallbackToCache, forceFresh, metadata, cache }) => {
      let cached: unknown;
      let freshValue: unknown;
      let getFreshValueStartTs: number;
      let refreshValueStartTS: number;

      // Abbreviate the key to make it easier to read, make multiple spaces and newlines into a single space
      let abbrevatedKey = key.replace(/\s+/g, " ").replace(/\n+/g, " ");

      //let abbrevated key be 50 characters long that takes the first 20 characters and the last 20 characters
      abbrevatedKey =
         abbrevatedKey.length > 100
            ? abbrevatedKey.slice(0, 50) + "..." + abbrevatedKey.slice(-50)
            : abbrevatedKey;

      return (event) => {
         switch (event.name) {
            case "getCachedValueRead":
               cached = event.entry;
               break;
            case "checkCachedValueError":
               console.warn(
                  `check failed for cached value of ${abbrevatedKey}, Reason: ${event.reason}.\nDeleting the cache key and trying to get a fresh value.`,
                  cached,
               );
               break;
            case "getCachedValueError":
               console.error(
                  `error with cache at ${abbrevatedKey}. Deleting the cache key and trying to get a fresh value.`,
                  event.error,
               );
               break;
            case "getFreshValueError":
               console.error(
                  `getting a fresh value for ${abbrevatedKey} failed`,
                  { fallbackToCache, forceFresh },
                  event.error,
               );
               break;
            case "getFreshValueStart":
               getFreshValueStartTs = performance.now();
               break;
            case "writeFreshValueSuccess": {
               const totalTime = performance.now() - getFreshValueStartTs;
               if (event.written) {
                  console.log(
                     `Fresh cache took ${abbrevatedKey} ${formatDuration(
                        totalTime,
                     )}, `,
                     `${lruCache.size} cached total.`,
                  );
               } else {
                  console.log(
                     `Not updating the cache value for ${abbrevatedKey}.`,
                     `Getting a fresh value for this took ${formatDuration(
                        totalTime,
                     )}.`,
                  );
               }
               break;
            }
            case "writeFreshValueError":
               console.error(
                  `error setting cache: ${abbrevatedKey}`,
                  event.error,
               );
               break;
            case "getFreshValueSuccess":
               freshValue = event.value;
               break;
            case "checkFreshValueError":
               console.error(
                  `check failed for fresh value of ${abbrevatedKey} Reason: ${event.reason}.`,
                  freshValue,
               );
               break;
            case "refreshValueStart":
               refreshValueStartTS = performance.now();
               break;
            case "refreshValueSuccess":
               console.log(
                  `Stale cache ${abbrevatedKey} took ${formatDuration(
                     performance.now() - refreshValueStartTS,
                  )}, `,
                  `${lruCache.size} cached total.`,
               );
               break;
            case "refreshValueError":
               console.log(
                  `Background refresh for ${abbrevatedKey} failed.`,
                  event.error,
               );
               break;
         }
      };
   };
}
const defaultFormatDuration = (ms: number) => `${Math.round(ms)}ms`;
