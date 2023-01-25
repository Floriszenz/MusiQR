import PianoA4 from "$lib/assets/instruments/piano/A4.ogg";
import PianoB4 from "$lib/assets/instruments/piano/B4.ogg";
import PianoC4 from "$lib/assets/instruments/piano/C4.ogg";
import PianoC5 from "$lib/assets/instruments/piano/C5.ogg";
import PianoD4 from "$lib/assets/instruments/piano/D4.ogg";
import PianoE4 from "$lib/assets/instruments/piano/E4.ogg";
import PianoF4 from "$lib/assets/instruments/piano/F4.ogg";
import PianoG4 from "$lib/assets/instruments/piano/G4.ogg";
import * as Tone from "tone";

const MUSIQR_CODE_REGEX = /^web\+mqr:\/\/(?<bpm>\d{3})-(?<instrument>\d{3})-(?<notes>(?:\d{3})+)$/;

export function isMusiQRCode(text: string): boolean {
    return MUSIQR_CODE_REGEX.test(text);
}

type MusiQRSongOptions = {
    bpm: number;
    instrument: number;
    notes: Note[];
};

export class MusiQRSong {
    public bpm: number;
    public instrument: number;
    public notes: Note[];

    constructor({ bpm, instrument, notes }: MusiQRSongOptions) {
        this.bpm = bpm;
        this.instrument = instrument;
        this.notes = notes;
    }

    static fromMusiQRCode(code: string) {
        const result = code.match(MUSIQR_CODE_REGEX);
        const bpm = parseInt(result?.groups?.bpm ?? "120");
        const instrument = parseInt(result?.groups?.instrument ?? "0");
        const notes =
            result?.groups?.notes.match(/.{3}/g)?.map((note) => Note.parse(parseInt(note, 10))) ??
            [];

        return new MusiQRSong({ bpm, instrument, notes });
    }
}

type NoteOptions = {
    isPause: boolean;
    length: string;
    pitch: string;
};

class Note {
    public isPause: boolean;
    public length: string;
    public pitch: string;

    constructor({ isPause, length, pitch }: NoteOptions) {
        this.isPause = isPause;
        this.length = length;
        this.pitch = pitch;
    }

    static parse(noteValue: number) {
        const isPause = !!((noteValue & 0b10000000) >> 7);
        const isDotted = !!((noteValue & 0b01000000) >> 6);
        const pitchValue = (noteValue & 0b00111000) >> 3;
        const pitch = Note.#parsePitch(isPause ? -1 : pitchValue);
        const lengthValue = (noteValue & 0b00000111) >> 0;
        const length = Note.#parseLength(lengthValue, isDotted);

        return new Note({ isPause, length, pitch });
    }

    static #parsePitch(pitchValue: number): string {
        switch (pitchValue) {
            case 0:
                return "C4";
            case 1:
                return "D4";
            case 2:
                return "E4";
            case 3:
                return "F4";
            case 4:
                return "G4";
            case 5:
                return "A4";
            case 6:
                return "B4";
            case 7:
                return "C5";
            default:
                return "";
        }
    }

    static #parseLength(lengthValue: number, isDotted: boolean): string {
        let length = "";

        switch (lengthValue) {
            case 0:
                length = "1n";
                break;
            case 1:
                length = "2n";
                break;
            case 2:
                length = "4n";
                break;
            case 3:
                length = "8n";
                break;
            case 4:
                length = "16n";
                break;
            case 5:
                length = "32n";
                break;
            default:
                return "";
        }

        if (isDotted) {
            length += ".";
        }

        return length;
    }
}

function chooseInstrument(instrumentId: number) {
    switch (instrumentId) {
        case 0:
            return new Tone.Synth({ volume: -5 }).toDestination();
        case 1:
            return new Tone.Sampler({
                urls: {
                    C4: PianoC4,
                    D4: PianoD4,
                    E4: PianoE4,
                    F4: PianoF4,
                    G4: PianoG4,
                    A4: PianoA4,
                    B4: PianoB4,
                    C5: PianoC5,
                },
                volume: -5,
            }).toDestination();
        default:
            return new Tone.Synth({ volume: -5 }).toDestination();
    }
}

export async function generateMusic(song: MusiQRSong) {
    const instrument = chooseInstrument(song.instrument);
    let time = 0;
    const chords = [];

    await Tone.loaded();

    for (const note of song.notes) {
        chords.push({ note: note.pitch, duration: note.length, time });
        time += Tone.Time(note.length).toSeconds();
    }

    new Tone.Part((time, { note, duration }) => {
        instrument.triggerAttackRelease(note, duration, time);
    }, chords).start(0);

    Tone.Transport.bpm.value = song.bpm;
}

export function startMusic() {
    Tone.Transport.start();
}

export function stopMusic() {
    Tone.Transport.stop();
}
