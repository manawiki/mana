/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import type { User } from "app/payload-types";
import type { Response } from "express";
import type { Payload } from "payload";

export interface RemixRequestContext {
   payload: Payload;
   user?: User;
   token?: string;
   exp?: number;
   res: Response;
}

declare module "@remix-run/node" {
   interface AppLoadContext extends RemixRequestContext {}
}
