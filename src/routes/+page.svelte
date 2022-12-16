<script lang="ts">
    import Button from "$lib/components/Button.svelte";

    function onScanClick() {}

    function onUploadClick() {
        console.log("Clicked on upload button");
    }
</script>

<svelte:head>
    <title>MusiQR - Turn QR codes into music 🎶</title>
</svelte:head>

<main
    class="w-full h-screen flex flex-col gap-4 justify-center items-center bg-gradient-to-b from-slate-50 to-slate-400"
>
    <h1 class="text-4xl mb-8">MusiQR</h1>
    <Button on:click={onScanClick}>Scan with camera</Button>
    <Button on:click={onUploadClick}>Upload image</Button>
</main>
