import type { GetEvents } from "inngest";

import { inngest } from "./client";

export const updateSiteAnalytics = inngest.createFunction(
   { id: "hello-world" },
   { event: "test/hello.world" },
   async ({ event, step }) => {
      return {
         message: `Hello ${event.name}!`,
      };
   },
);

// type Events = GetEvents<typeof inngest>;

// export const loadCron = inngest.createFunction(
//    { id: "hourly-site-analytics-load-sites" },
//    { cron: "0 12 * * 5" },
//    async ({ event, step }) => {
//       // Fetch all users
//       const sites = await step.run("fetch-sites", async () => {
//          return fetchSites();
//       });

//       // For each user, send us an event.  Inngest supports batches of events
//       // as long as the entire payload is less than 512KB.
//       const events = sites.map<Events["app/hourly-site-analytics.send"]>(
//          (user) => {
//             return {
//                name: "app/hourly-site-analytics.send",
//                data: {
//                   ...user,
//                },
//                user,
//             };
//          },
//       );

//       // Send all events to Inngest, which triggers any functions listening to
//       // the given event names.
//       await step.sendEvent("fan-out-weekly-emails", events);

//       // Return the number of users triggered.
//       return { count: users.length };
//    },
// );

// const sendReminder = inngest.createFunction(
//    { id: "hourly-site-analytics" },
//    { event: "app/hourly-site-analytics.send" },
//    async ({ event, step }) => {
//       const data = await step.run("load-user-data", async () => {
//          return loadUserData(event.data.user.id);
//       });

//       await step.run("email-user", async () => {
//          return sendEmail(event.data.user, data);
//       });
//    },
// );
