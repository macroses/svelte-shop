<script>
    export let name;
    export let val;
</script>

<li class="feature_list_item">
    {#if val.length > 1}
        <div class="collection_vals">
            <div class="title_val">{name}</div>
            {#each val as item}
                <span class="val_item">{item}</span>
            {/each}
        </div>
    {:else}
        <span class="attr_name">{name}</span>
        <span class="attr_value">{val}</span>
    {/if}
</li>

<style>
    .attr_name {
        color: var(--main-descr-color);
        background: var(--main-bg-color);
        display: inline-block;
        padding: 5px 0;
    }

    .attr_name:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        border-bottom: 1px dotted var(--main-descr-color);
        left: 0;
        bottom: 10px;
        z-index: -1;
    }

    .attr_value {
        background: var(--main-bg-color);
        display: inline-block;
        padding: 5px;
    }

    .feature_list_item {
        display: flex;
        justify-content: space-between;
        position: relative;
    }

    .collection_vals {
        margin-bottom: 1rem;
    }

    .title_val {
        font-size: 1rem;
        text-transform: uppercase;
        margin-bottom: 0.3rem;
    }

    .val_item {
        display: inline-block;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        padding: 0 0.5rem;
        border: 2px solid var(--main-theme-color);
    }
</style>