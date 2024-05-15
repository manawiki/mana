import fs from "fs";
import { exists } from "i18next";

import type { Payload } from "payload";
import payload from "payload";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;
const USER_ID = "644069d751c100f909f89e62"; // TODO(dim): Not hardcode this value.
const IGNORED_COLLECTIONS = ["payload-migrations", "payload-preferences", "users"];

async function beginWipe(): Promise<void> {
    const collections = await payload.collections;
    for (const [key, value] of Object.entries(collections)) {
        if (IGNORED_COLLECTIONS.includes(key)) {
            console.log(`[!] Ignoring collection: ${key}`);
            continue;
        }

        console.log(`[!] Wiping collection: ${key}`);

        await payload.delete({
            collection: key,
            where: { id: { exists: true } }
        });
    };

    process.exit(0);
}

async function start(): Promise<void> {
    await payload.init({
        secret: PAYLOADCMS_SECRET as string,
        local: true,
        onInit: (_payload: Payload) => {
            _payload.logger.info("Payload initialized...");
            beginWipe();
        },
    });
}
start();
