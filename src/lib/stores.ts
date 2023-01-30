import { writable } from "svelte/store";

import type { Metronome } from "./music-generation";

export const uploadedImage = writable<ImageBitmap>();

export const scannedImage = writable<string>();

export const metronome = writable<Metronome>();
