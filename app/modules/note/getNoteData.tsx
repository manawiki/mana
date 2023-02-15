import type { Note } from "~/payload-types";

/**
 * This function gets a notes[] array and return a promise[] with defer data
 */
export function getNoteData(notes: Note[]) {
    //flatten notes.data into a single string[];
    const dataArray = notes.map((note) => note.data).flat();

    //generate object of promises base on dataArray
    let promises = {} as Record<string, Promise<any>>;

    dataArray.forEach((data) => {
        //if data.endpoints is a string, we can assume it's a url
        if (typeof data.endpoints === "string") {
            promises[data.endpoints] = fetch(data.endpoints).then((res) =>
                res.json()
            );
        }
    });

    //the returned data shoud be an object map of promises
    return promises;
}
