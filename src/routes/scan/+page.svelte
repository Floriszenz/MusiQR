<script lang="ts">
    import { goto } from "$app/navigation";
    import { uploadedImage } from "$lib/stores";
    import { onMount } from "svelte";

    function goBack() {
        return goto("/", { replaceState: true });
    }

    onMount(() => {
        if (!$uploadedImage) {
            goBack();
        }
    });
</script>

<button on:click={goBack}>Back</button>

<div>Test</div>

<div>{$uploadedImage?.name}</div>
