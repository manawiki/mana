import fs from "fs";

import type { Payload } from "payload";
import payload from "payload";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;
const USER_ID = "644069d751c100f909f89e62"; // TODO(dim): Not hardcode this value.

interface IDataEntry {
    collection: string;
    data: IDataEntryData;
    checksum: string;
    path?: string;
}

interface IDataEntryData {
    id: any;
}

function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

async function importEntry(entry: IDataEntry): Promise<void> {
    try {
        await payload.findByID({
            collection: entry.collection,
            id: entry.data.id
        });
    } catch {
        await payload.create({
            collection: entry.collection,
            data: {
                ...entry.data,
                checksum: entry.checksum,
                createdBy: USER_ID,
            },
            filePath: entry.path ? entry.path : undefined,
        });
        return;
    }

    await payload.update({
        collection: entry.collection,
        id: entry.data.id,
        data: {
            ...entry.data,
            checksum: entry.checksum,
            createdBy: USER_ID,
        },
        filePath: entry.path ? entry.path : undefined,
    });
}

async function beginImport(data: IDataEntry[]): Promise<void> {
    const assets = data.filter((entry: IDataEntry) => entry.path);
    for (const entry of assets) {
        try {
            await delay(500);
            await importEntry(entry);
        } catch (e) {
            payload.logger.error(`Failed to add asset: ${entry.path} (${entry.checksum})!`);
            payload.logger.error(e);
        }
    }

    const entries = data.filter((entry: IDataEntry) => !entry.path);
    await Promise.all(entries.map((entry: IDataEntry) => {
        try {
            return importEntry(entry);
        } catch (e) {
            payload.logger.error(`Failed to add entry: ${entry.collection} (${entry.checksum})!`);
            payload.logger.error(e);
        }
    }));

    process.exit(0);
}

async function start(): Promise<void> {
    const data: IDataEntry[] = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

    await payload.init({
        secret: PAYLOADCMS_SECRET as string,
        local: true,
        onInit: (_payload: Payload) => {
            _payload.logger.info("Payload initialized...");
            beginImport(data);
        },
    });
}
start();
