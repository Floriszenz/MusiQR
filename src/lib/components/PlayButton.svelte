<script lang="ts">
    import MainActionButton from "./MainActionButton.svelte";
    import PlayIcon from "$lib/assets/icons/play_arrow.svelte";
    import PauseIcon from "$lib/assets/icons/pause.svelte";

    export let isPlaying: boolean = false;
</script>

<MainActionButton on:click>
    {#if isPlaying}
        <PauseIcon size={40} />
    {:else}
        <PlayIcon size={40} />
    {/if}
</MainActionButton>
