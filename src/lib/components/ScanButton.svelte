<script lang="ts">
    import MainActionButton from "./MainActionButton.svelte";
    import ScanIcon from "$lib/assets/icons/qr_code_scanner.svelte";
</script>

<MainActionButton on:click>
    <ScanIcon size={40} />
</MainActionButton>
