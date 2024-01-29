import { serve } from "inngest/remix";

import { inngest } from "~/routes/inngest+/utils/inngest-client";

import { loadAnalyticsCron } from "./utils/loadAnalyticsCron.server";
import { updateSiteAnalytics } from "./utils/updateSiteAnalytics.server";

const handler = serve({
   client: inngest,
   serveHost: "https://mana.wiki",
   servePath: "/inngest/api",
   functions: [loadAnalyticsCron, updateSiteAnalytics],
});

export { handler as action, handler as loader };
