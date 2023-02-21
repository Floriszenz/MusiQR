import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QrCode from "qrcode";

const sum = (arr) => arr.reduce((val, agg) => (agg += val));
const isInRange = (value, start, end) => value >= start && value <= end;
const DIR_NAME = fileURLToPath(new URL(".", import.meta.url));
const INSTRUMENTS = {
    synthesizer: 0,
    piano: 1,
    acousticGuitar: 2,
};

// --- Adjust these constants to adapt the output ---

const BPM = 120; // Beats per minute
const INSTRUMENT = INSTRUMENTS.piano; // Instrument
const NUMBER_OF_NOTES = 32; // How many notes the song should have
const REST_PROBABILITY = 0.05; // Probability to control how many rests should be chosen
const DOTTED_PROBABILITY = 0.2; // Probability to control how many notes/rests should be dotted
const PITCH_PROBABILITIES = [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]; // Probabilities for each pitch on a C major scale (C, D, E, F, G, A, B, C)
const LENGTH_PROBABILITIES = [0.05, 0.1, 0.35, 0.35, 0.1, 0.05]; // Probabilities for each length of notes/rests (1, 1/2, 1/4, 1/8, 1/16, 1/32)

// ---

// --- Assure that all values are valid

assert(isInRange(BPM, 1, 999), "BPM must be between 1 and 999");
assert(
    Object.values(INSTRUMENTS).includes(INSTRUMENT),
    "Instrument must be selected from list of available instruments"
);
assert(NUMBER_OF_NOTES > 0, "Song must have at least one note");
assert(isInRange(REST_PROBABILITY, 0, 1), "Rest probability must be between 0 and 1");
assert(isInRange(DOTTED_PROBABILITY, 0, 1), "Dotted probability must be between 0 and 1");
assert(PITCH_PROBABILITIES.length === 8, "Pitch probabilities must have eight values");
assert(sum(PITCH_PROBABILITIES) === 1, "Pitch probabilities must add up to 1");
assert(LENGTH_PROBABILITIES.length === 6, "Length probabilities must have six values");
assert(sum(LENGTH_PROBABILITIES) === 1, "Length probabilities must add up to 1");

// ---

let bpm = BPM.toString(10).padStart(3, "0");
let instrument = INSTRUMENT.toString(10).padStart(3, "0");
let notes = "";

function chooseRandom(arr) {
    let num = Math.random();

    for (let idx = 0; idx < arr.length; idx++) {
        num -= arr[idx];

        if (num <= 0) {
            return idx;
        }
    }

    return arr.length - 1;
}

function generateNote() {
    const isRest = Math.random() <= REST_PROBABILITY;
    const isDotted = (+(Math.random() <= DOTTED_PROBABILITY)).toString(2);
    const pitch = isRest ? "000" : chooseRandom(PITCH_PROBABILITIES).toString(2).padStart(3, "0");
    const length = chooseRandom(LENGTH_PROBABILITIES).toString(2).padStart(3, "0");

    return parseInt((+isRest).toString(2) + isDotted + pitch + length, 2)
        .toString(10)
        .padStart(3, "0");
}

for (let it = 0; it < NUMBER_OF_NOTES; it++) {
    notes += generateNote();
}

const song = `web+mqr://${bpm}-${instrument}-${notes}`;

await QrCode.toFile(path.join(DIR_NAME, "code.png"), song);
