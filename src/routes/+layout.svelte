<script lang="ts">
    import { onMount, type ComponentType } from "svelte";
    import { pwaInfo } from "virtual:pwa-info";
    import "../app.css";

    let ReloadPrompt: ComponentType | undefined;

    onMount(async () => {
        pwaInfo && (ReloadPrompt = (await import("$lib/components/ReloadPrompt.svelte")).default);
    });

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<slot />

{#if ReloadPrompt}
    <svelte:component this={ReloadPrompt} />
{/if}
