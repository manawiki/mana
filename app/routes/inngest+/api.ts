import { serve } from "inngest/remix";

import { inngest } from "~/routes/inngest+/utils/client";

import { loadAnalyticsCron } from "./utils/loadAnalyticsCron";
import { updateSiteAnalytics } from "./utils/updateSiteAnalytics";

const handler = serve({
   client: inngest,
   functions: [loadAnalyticsCron, updateSiteAnalytics],
});

export { handler as action, handler as loader };
