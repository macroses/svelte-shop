<script>
    export let titleProp;
</script>

<button title={titleProp} on:click>
    <slot></slot>
</button>

<style>
    button {
        padding: 5px;
        background: var(--main-theme-color);
        color: #fff;
        border-radius: 0;
        border: 0;
        cursor: pointer;
    }
</style>