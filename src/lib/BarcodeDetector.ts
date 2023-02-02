import type { BarcodeDetectorPolyfill } from "@undecaf/barcode-detector-polyfill";

export type BarcodeDetector = BarcodeDetectorPolyfill;
export type BarcodeDetectorConstructor = typeof BarcodeDetectorPolyfill;

export async function initBarcodeDetector(): Promise<BarcodeDetectorConstructor> {
    if (false && "BarcodeDetector" in window) {
        // THIS BRANCH IS DEACTIVATED BECAUSE THERE IS A BUG THAT PREVENTS THE BOUNDING BOX TO BE
        // DRAWN TO THE CANVAS WHEN USING THE NATIVE BARCODE DETECTION API.
        // (TESTED ON CHROME & EDGE ON MOBILE)
        //
        // return window.BarcodeDetector as unknown as BarcodeDetectorConstructor;
    } else {
        const { BarcodeDetectorPolyfill } = await import("@undecaf/barcode-detector-polyfill");

        return BarcodeDetectorPolyfill;
    }
}
