<script lang="ts">
    import { onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { scannedImage } from "$lib/stores";
    import { clearMusic, startMusic, stopMusic } from "$lib/music-generation";

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
    <header class="bg-black/50 w-full p-2 text-white backdrop-blur-md shadow-md">
        <button on:click={goBack}>Back</button>
    </header>
    <main
        class="bg-black/50 w-full p-2 text-white backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)] flex flex-row justify-center"
    >
        <button on:click={onPlayClick}>{isPlaying ? "Pause" : "Play"}</button>
    </main>
</div>
