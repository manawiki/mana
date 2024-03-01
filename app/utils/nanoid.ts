import { customAlphabet } from "nanoid";
const alphabet = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz";
const lowercase = "123456789abcdefghijklmnpqrstuvwxyz";

export const safeNanoID = customAlphabet(alphabet, 10);

export const siteNanoID = customAlphabet(lowercase, 10);
