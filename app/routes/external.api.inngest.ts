import { serve } from "inngest/remix";

import { inngest } from "~/inngest/client";
import { loadAnalyticsCron, updateSiteAnalytics } from "~/inngest/functions";

const handler = serve({
   client: inngest,
   functions: [loadAnalyticsCron, updateSiteAnalytics],
});

export { handler as action, handler as loader };
