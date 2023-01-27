import { writable } from "svelte/store";

export const uploadedImage = writable<ImageBitmap>();

export const scannedImage = writable<string>();
