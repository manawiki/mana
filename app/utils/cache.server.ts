import { LRUCache } from "lru-cache";
import { remember } from "./remember.server";
// import NProgress from "nprogress";
// import nProgressStyles from "~/styles/nprogress.css";

export const lruCache = remember(
   "lruCache",
   new LRUCache({
      max: 500, // maximum number of items to store in the cache
      ttl: 5 * 60 * 1000, // how long to live in ms
   })
);

// Setup a lru-cache for layout data, so we don't have to fetch it every time
export async function fetchWithCache(url: string, init?: RequestInit) {
     //The key could be graphql, in that case we'll use init.body instead. We should also delete any spacing characters
     const key = init?.body ? (init.body as string).replace(/\s/g, "").replace(/\n/g, " ")
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

//Write a function that take a async function and check if we have the return cached, if not, return the result of the function and cache it
export async function cacheThis<T>(func: () => Promise<T>) {

    //the key is the function stringified
    const key = func.toString().replace(/\s/g, "").replace(/\n/g, " ");

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
