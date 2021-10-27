<script>
    export let selected;
</script>

<select bind:value={selected}>
    <slot name="s-head"></slot>
    <slot></slot>
</select>

<style>
    select {
        background: var(--main-section-color);
        border: 1px solid var(--main-border-color);
        color: var(--main-text-color);
        font-family: var(--font);
        font-size: 1rem;
        padding: 5px 10px;
        width: 100%;
        cursor: pointer;
    }
</style>