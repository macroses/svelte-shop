<script>
    export let selected;

    console.log(selected)
</script>

<select bind:value={selected}>
    <slot name="s-head"></slot>
    <slot></slot>
</select>

<style>
    select {
        background: #fff;
        border: 1px solid var(--main-border-color);
        font-family: var(--font);
        font-size: 1rem;
        padding: 5px 10px;
        width: 100%;
        cursor: pointer;
    }
</style>