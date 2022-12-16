<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { initBarcodeDetector, type BarcodeDetector } from "$lib/BarcodeDetector";
    import { uploadedImage } from "$lib/stores";

    let detector: BarcodeDetector;
    let contentContainer: HTMLElement;
    let contentResizeObserver: ResizeObserver;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    function goBack() {
        return goto("/", { replaceState: true });
    }

    function onScanClick() {
        console.log("Clicked scan button");
    }

    onMount(async () => {
        if (!$uploadedImage) {
            goBack();
        } else {
            const BarcodeDetector = await initBarcodeDetector();
            detector = new BarcodeDetector();

            contentResizeObserver = new ResizeObserver(async ([entry]) => {
                const { contentRect } = entry;

                canvas.width = contentRect.width;
                canvas.height = contentRect.height;

                ctx.drawImage($uploadedImage, 0, 0, canvas.width, canvas.height);

                // Try to detect QR code
                try {
                    const results = await detector.detect(canvas);

                    if (results.length === 0) throw new Error("No QR code detected");

                    // TODO: Handle case of multiple detected codes
                    const result = results[0];
                    const { x, y, width, height } = result.boundingBox;

                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x, y, width, height);
                } catch {
                    // TODO: Sensible fallback logic
                    alert("Could not detect any QR code");
                }
            });

            contentResizeObserver.observe(contentContainer);

            ctx = canvas.getContext("2d")!;
        }
    });

    onDestroy(() => {
        if (contentResizeObserver) {
            contentResizeObserver.disconnect();
        }
    });
</script>

<div
    bind:this={contentContainer}
    class="flex h-screen w-full flex-col items-center justify-between gap-4"
>
    <canvas bind:this={canvas} class="absolute -z-10" />
    <header class="bg-black/50 w-full p-2 text-white">
        <button on:click={goBack}>Back</button>
    </header>
    <main class="bg-black/50 w-full p-2 text-white flex flex-row justify-center">
        <button on:click={onScanClick}>Scan</button>
    </main>
</div>
