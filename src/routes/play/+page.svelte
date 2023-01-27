<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { scannedImage } from "$lib/stores";
    import { clearMusic, startMusic, stopMusic } from "$lib/music-generation";
    import PlayButton from "$lib/components/PlayButton.svelte";
    import BackButton from "$lib/components/BackButton.svelte";

    let isPlaying: boolean = false;

    let contentWidth: number;
    let contentHeight: number;

    function goBack() {
        return goto("/", { replaceState: true });
    }

    function onPlayClick() {
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }

        isPlaying = !isPlaying;
    }

    onMount(async () => {
        if (!$scannedImage) {
            goBack();
        }
    });

    onDestroy(() => {
        clearMusic();
    });
</script>

<div
    bind:clientWidth={contentWidth}
    bind:clientHeight={contentHeight}
    class="flex h-screen w-full flex-col items-center justify-between gap-4"
>
    <img
        src={$scannedImage}
        alt=""
        class="absolute -z-10"
        width={contentWidth}
        height={contentHeight}
    />
    <header class="w-full min-h-[2rem] relative text-white">
        <div
            id="bg-top"
            class="[clip-path:url(#clipping-top)] w-full h-full absolute bg-black/50 backdrop-blur-md shadow-md"
        />
        <div class="w-full h-full relative px-1 py-0.5">
            <BackButton on:click={goBack} />
        </div>
    </header>
    <main class="w-full min-h-[4rem] flex flex-row justify-center text-white">
        <div
            id="bg-bottom"
            class="[clip-path:url(#clipping-bottom)] w-full h-full bg-black/50 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]"
        />
        <PlayButton on:click={onPlayClick} {isPlaying} />
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
