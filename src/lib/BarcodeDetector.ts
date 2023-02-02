import type { BarcodeDetectorPolyfill } from "@undecaf/barcode-detector-polyfill";

export type BarcodeDetector = BarcodeDetectorPolyfill;
export type BarcodeDetectorConstructor = typeof BarcodeDetectorPolyfill;

export async function initBarcodeDetector(): Promise<BarcodeDetectorConstructor> {
    if ("BarcodeDetector" in window) {
        return window.BarcodeDetector as unknown as BarcodeDetectorConstructor;
    } else {
        const { BarcodeDetectorPolyfill } = await import("@undecaf/barcode-detector-polyfill");

        return BarcodeDetectorPolyfill;
    }
}
