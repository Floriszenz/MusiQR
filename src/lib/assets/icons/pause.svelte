<script lang="ts">
    import Icon from "./Icon.svelte";

    export let size: number = 48;
</script>

<Icon {size}>
    <path
        d="M29.25 38q-1.25 0-2.125-.875T26.25 35V13q0-1.25.875-2.125T29.25 10H35q1.25 0 2.125.875T38 13v22q0 1.25-.875 2.125T35 38ZM13 38q-1.25 0-2.125-.875T10 35V13q0-1.25.875-2.125T13 10h5.75q1.25 0 2.125.875T21.75 13v22q0 1.25-.875 2.125T18.75 38Zm16.25-3H35V13h-5.75ZM13 35h5.75V13H13Zm0-22v22Zm16.25 0v22Z"
    />
</Icon>
