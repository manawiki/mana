/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import type { ServerBuild } from "@remix-run/node";
import type { Payload } from "payload";

import type { User } from "payload/generated-types";

export interface RemixRequestContext {
   payload: Payload;
   user?: {
      id: string;
      roles: ["staff" | "user"];
      username: string;
      avatar?: {
         id: string;
         url: string;
      };
   };
   token?: string;
   exp?: number;
   res: Response;
}

declare module "@remix-run/node" {
   interface AppLoadContext extends RemixRequestContext {}
}

//overload the request handler to include the payload and user objects
interface PayloadRequest extends Request {
   payload: Payload;
   user?: User;
}

type GetLoadContextFunction = (
   req: PayloadRequest,
   res: Response,
) => Promise<AppLoadContext> | AppLoadContext;
type RequestHandler = (
   req: Request,
   res: Response,
   next: NextFunction,
) => Promise<void>;

declare module "@remix-run/express" {
   export declare function createRequestHandler({
      build,
      getLoadContext,
      mode,
   }: {
      build: ServerBuild;
      getLoadContext?: GetLoadContextFunction;
      mode?: string;
   }): RequestHandler;
}
