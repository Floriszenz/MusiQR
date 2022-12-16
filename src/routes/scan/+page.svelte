<script lang="ts">
    import { goto } from "$app/navigation";
    import { uploadedImage } from "$lib/stores";
    import { onDestroy, onMount } from "svelte";

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

    onMount(() => {
        if (!$uploadedImage) {
            goBack();
        } else {
            contentResizeObserver = new ResizeObserver(([entry]) => {
                const { contentRect } = entry;

                canvas.width = contentRect.width;
                canvas.height = contentRect.height;

                ctx.drawImage($uploadedImage, 0, 0, canvas.width, canvas.height);
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
