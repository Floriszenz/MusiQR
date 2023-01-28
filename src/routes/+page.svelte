<script lang="ts">
    import { fileOpen } from "browser-fs-access";

    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import { uploadedImage } from "$lib/stores";

    async function onScanClick() {
        await goto("/video");
    }

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

            $uploadedImage = await createImageBitmap(image);

            await goto("/scan");
        } catch {}
    }
</script>

<svelte:head>
    <title>MusiQR - Turn QR codes into music 🎶</title>
</svelte:head>

<main
    class="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-50 to-slate-400"
>
    <img
        src="/logo-black.svg"
        alt="Logo of MusiQR; A sixteenth note combined with a QR code"
        class="w-1/2"
    />
    <h1 class="mb-12 text-5xl">MusiQR</h1>
    <Button on:click={onScanClick}>Scan with camera</Button>
    <Button on:click={onUploadClick}>Upload image</Button>
</main>
