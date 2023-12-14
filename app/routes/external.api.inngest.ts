import { serve } from "inngest/remix";

import { inngest } from "~/inngest/client";
import { updateSiteAnalytics } from "~/inngest/functions";

const handler = serve({
   client: inngest,
   functions: [updateSiteAnalytics],
});

export { handler as action, handler as loader };
