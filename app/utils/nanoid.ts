import { customAlphabet } from "nanoid";
const alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz";
export const safeNanoID = customAlphabet(alphabet, 10);
