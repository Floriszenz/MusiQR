<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { scannedImage } from "$lib/stores";
    import {
        clearMusic,
        generateMusic,
        isMusiQRCode,
        MusiQRSong,
        startMusic,
        stopMusic,
    } from "$lib/music-generation";
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
            const songParam = $page.url.searchParams.get("song");

            if (songParam && isMusiQRCode(songParam)) {
                const song = MusiQRSong.fromMusiQRCode(songParam);

                await generateMusic(song);
            } else {
                goBack();
            }
        }
    });

    onDestroy(() => {
        clearMusic();
    });
</script>

<div
    bind:clientWidth={contentWidth}
    bind:clientHeight={contentHeight}
    class="flex h-screen w-full flex-col items-center justify-between gap-4 bg-gradient-to-b from-slate-50 to-slate-400"
>
    <header class="w-full min-h-[2rem] relative z-10 text-white">
        <div
            id="bg-top"
            class="[clip-path:url(#clipping-top)] w-full h-full absolute bg-black/50 backdrop-blur-md shadow-md"
        />
        <div class="w-full h-full relative px-1 py-0.5">
            <BackButton on:click={goBack} />
        </div>
    </header>
    {#if $scannedImage}
        <img
            src={$scannedImage}
            alt=""
            class="absolute"
            width={contentWidth}
            height={contentHeight}
        />
    {:else}
        <img
            src="/logo-black.svg"
            alt="Logo of MusiQR; A sixteenth note combined with a QR code"
            class="w-1/2 max-w-xs invert drop-shadow-[0px_0px_1px_#AAA]"
            width={contentWidth}
            height={contentHeight}
        />
    {/if}
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
