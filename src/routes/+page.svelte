<script lang="ts">
    import { fileOpen } from "browser-fs-access";

    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import { uploadedImage } from "$lib/stores";

    function onScanClick() {}

    async function onUploadClick() {
        try {
            const image = await fileOpen({
                id: "musiqr-upload",
                description: "Image files",
                excludeAcceptAllOption: true,
                mimeTypes: ["image/*"],
                multiple: false,
                startIn: "pictures",
            });

            $uploadedImage = image;

            await goto("/scan");
        } catch {}
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
