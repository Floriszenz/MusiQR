<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { initBarcodeDetector, type BarcodeDetector } from "$lib/BarcodeDetector";
    import { metronome, scannedImage } from "$lib/stores";
    import { generateMusic, isMusiQRCode, MusiQRSong } from "$lib/music-generation";
    import BackButton from "$lib/components/BackButton.svelte";
    import ScanButton from "$lib/components/ScanButton.svelte";

    let detector: BarcodeDetector;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let musiQrCode: string;

    let contentWidth: number;
    let contentHeight: number;
    let video: HTMLVideoElement;
    let animationHandle: number;

    let _boxInfoContainer: HTMLDivElement;

    function goBack() {
        cancelAnimationFrame(animationHandle);
        video.pause();
        video.srcObject = null;

        return goto("/", { replaceState: true });
    }

    async function onScanClick() {
        if (!musiQrCode) {
            return;
        }

        $scannedImage = canvas.toDataURL();

        const song = MusiQRSong.fromMusiQRCode(musiQrCode);

        $metronome = await generateMusic(song);

        cancelAnimationFrame(animationHandle);
        video.pause();
        video.srcObject = null;

        await goto("/play");
    }

    function drawVideoFrame() {
        const scaleFactor = { x: 1, y: 1 };
        const imageAspectRatio = video.videoWidth / video.videoHeight;
        const canvasAspectRatio = canvas.width / canvas.height;
        const aspectRatio = imageAspectRatio / canvasAspectRatio;

        if (aspectRatio > 1) {
            scaleFactor.y /= aspectRatio;
        } else {
            scaleFactor.x *= aspectRatio;
        }

        const size = {
            x: 0.5 * canvas.width * (1 - scaleFactor.x),
            y: 0.5 * canvas.height * (1 - scaleFactor.y),
            width: canvas.width * scaleFactor.x,
            height: canvas.height * scaleFactor.y,
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillRect(10, 10, 20, 20);

        ctx.drawImage(video, size.x, size.y, size.width, size.height);

        ctx.fillRect(canvas.width - 30, 10, 20, 20);

        (async () => {
            // Try to detect QR code
            try {
                const results = await detector.detect(canvas);

                if ("reset" in ctx) {
                    (ctx.reset as () => void)();
                }

                ctx.fillRect(10, 50, 20, 20);

                if (results.length > 0) {
                    // TODO: Handle case of multiple detected codes
                    const result = results[0];
                    const [topLeft, topRight, bottomRight, bottomLeft] = result.cornerPoints;

                    if (isMusiQRCode(result.rawValue)) {
                        musiQrCode = result.rawValue;
                    }

                    _boxInfoContainer.textContent = `
                    { (${topLeft.x},${topLeft.y}), (${topRight.x},${topRight.y}), (${bottomRight.x},${bottomRight.y}), (${bottomLeft.x},${bottomLeft.y}) }
                `.trim();

                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(topLeft.x, topLeft.y);
                    ctx.lineTo(topRight.x, topRight.y);
                    ctx.lineTo(bottomRight.x, bottomRight.y);
                    ctx.lineTo(bottomLeft.x, bottomLeft.y);
                    ctx.closePath();
                    ctx.stroke();

                    // For debug only
                    ctx.strokeRect(10, 10, 20, 20);
                    ctx.fillRect(40, 10, 20, 20);
                    ctx.beginPath();
                    ctx.moveTo(70, 10);
                    ctx.lineTo(90, 10);
                    ctx.lineTo(90, 30);
                    ctx.lineTo(70, 30);
                    ctx.closePath();
                    ctx.stroke();

                    const { x, y } = topLeft;
                    ctx.strokeRect(x + 10, y + 10, 20, 20);
                    ctx.fillRect(x + 40, y + 10, 20, 20);
                    ctx.beginPath();
                    ctx.moveTo(x + 70, y + 10);
                    ctx.lineTo(x + 90, y + 10);
                    ctx.lineTo(x + 90, y + 30);
                    ctx.lineTo(x + 70, y + 30);
                    ctx.closePath();
                    ctx.stroke();
                }
            } catch {
                // TODO: Sensible fallback logic
                alert("Could not detect any QR code");
            }
        })();

        ctx.fillRect(canvas.width - 30, 50, 20, 20);

        animationHandle = requestAnimationFrame(() => drawVideoFrame());
    }

    onMount(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });

            video.srcObject = stream;
            video.play();

            const BarcodeDetector = await initBarcodeDetector();
            detector = new BarcodeDetector();

            ctx = canvas.getContext("2d")!;

            drawVideoFrame();
        } catch {}
    });
</script>

<div
    bind:clientWidth={contentWidth}
    bind:clientHeight={contentHeight}
    class="flex h-[100dvh] w-full flex-col items-center justify-between gap-4 bg-gradient-to-b from-slate-50 to-slate-400"
>
    <header class="w-full min-h-[2rem] relative z-10 text-white">
        <div
            id="bg-top"
            class="[clip-path:url(#clipping-top)] w-full h-full absolute bg-black/50 backdrop-blur-md shadow-md"
        />
        <div class="w-full h-full relative px-1 py-0.5">
            <BackButton on:click={goBack} />
        </div>
        <div bind:this={_boxInfoContainer} class="text-black" />
    </header>
    <canvas bind:this={canvas} class="absolute" width={contentWidth} height={contentHeight} />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video bind:this={video} class="hidden">Video stream not available</video>
    <main class="w-full min-h-[4rem] flex flex-row justify-center text-white">
        <div
            id="bg-bottom"
            class="[clip-path:url(#clipping-bottom)] w-full h-full bg-black/50 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]"
        />
        <ScanButton on:click={onScanClick} />
    </main>
</div>

<svg width="0" height="0">
    <defs>
        <clipPath id="clipping-top" clipPathUnits="objectBoundingBox">
            <path
                d="M 1 0.999 C 0.823 1.002 0.833 0.999 0.777 0.999 C 0.707 0.999 0.6 0.499 0.5 0.499 C 0.4 0.499 0.295 0.999 0.226 0.999 C 0.125 0.999 0 0.999 0 0.999 L 0 0 L 1 0 L 1 0.999 Z"
            />
        </clipPath>
        <clipPath id="clipping-bottom" clipPathUnits="objectBoundingBox">
            <path
                d="M 0 0.4 C 0.1773075 0.39806 0.257 0.4 0.3125 0.4 C 0.3825 0.4 0.4 0 0.5 0 C 0.6 0 0.61875 0.4 0.6875 0.4 C 0.7885 0.4 1 0.4 1 0.4 L 1 1 L 0 1 Z"
            />
        </clipPath>
    </defs>
</svg>
