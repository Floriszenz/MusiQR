<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { initBarcodeDetector, type BarcodeDetector } from "$lib/BarcodeDetector";
    import { scannedImage, uploadedImage } from "$lib/stores";
    import { generateMusic, isMusiQRCode, MusiQRSong } from "$lib/music-generation";

    let detector: BarcodeDetector;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let musiQrCode: string;

    let contentWidth: number;
    let contentHeight: number;

    function goBack() {
        return goto("/", { replaceState: true });
    }

    async function onScanClick() {
        const song = MusiQRSong.fromMusiQRCode(musiQrCode);

        await generateMusic(song);

        $scannedImage = canvas.toDataURL();

        await goto("/play");
    }

    onMount(async () => {
        if (!$uploadedImage) {
            goBack();
        } else {
            const BarcodeDetector = await initBarcodeDetector();
            detector = new BarcodeDetector();

            ctx = canvas.getContext("2d")!;

            ctx.drawImage($uploadedImage, 0, 0, canvas.width, canvas.height);

            // Try to detect QR code
            try {
                const results = await detector.detect(canvas);

                if (results.length === 0) throw new Error("No QR code detected");

                // TODO: Handle case of multiple detected codes
                const result = results[0];
                const [topLeft, topRight, bottomRight, bottomLeft] = result.cornerPoints;

                if (isMusiQRCode(result.rawValue)) {
                    musiQrCode = result.rawValue;
                }

                ctx.strokeStyle = "red";
                ctx.lineWidth = 4;

                ctx.beginPath();
                ctx.moveTo(topLeft.x, topLeft.y);
                ctx.lineTo(topRight.x, topRight.y);
                ctx.lineTo(bottomRight.x, bottomRight.y);
                ctx.lineTo(bottomLeft.x, bottomLeft.y);
                ctx.closePath();
                ctx.stroke();
            } catch {
                // TODO: Sensible fallback logic
                alert("Could not detect any QR code");
            }
        }
    });
</script>

<div
    bind:clientWidth={contentWidth}
    bind:clientHeight={contentHeight}
    class="flex h-screen w-full flex-col items-center justify-between gap-4"
>
    <canvas bind:this={canvas} class="absolute -z-10" width={contentWidth} height={contentHeight} />
    <header class="bg-black/50 w-full p-2 text-white backdrop-blur-md shadow-md">
        <button on:click={goBack}>Back</button>
    </header>
    <main
        class="bg-black/50 w-full p-2 text-white backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)] flex flex-row justify-center"
    >
        <button on:click={onScanClick}>Scan</button>
    </main>
</div>
