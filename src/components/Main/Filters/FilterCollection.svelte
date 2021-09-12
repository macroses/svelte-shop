<script>
    import { afterUpdate } from 'svelte';
    import Checkbox from '../../Helpers/Checkbox.svelte';
    import Model from '../../../model/data-service';
    import { slide } from 'svelte/transition';

    export let filterCollection;
    export let itemAttr = $$props;
    export let exportedActive;

    $: if(exportedActive == false) {
        active = false;
        exportedActive = undefined;
    }

    $: active = false;
    const temp = new Model();
    let showMarker = false;

    afterUpdate(() => {
        return filterCollection[itemAttr[0]] === undefined 
                || filterCollection[itemAttr[0]].length === 0
                    ? showMarker = false
                    : showMarker = true;
    });
</script>

<div class="filterlist_item">
    <div class="unique_title"  class:active on:click={() => active = !active}>
        <span class="val" class:marker={showMarker}>{itemAttr[0]}</span>
        <span class="material-icons-two-tone arrow">expand_more</span>
    </div>
    {#if active}
        <ul class="filters_list" transition:slide={{duration: 200}}>
            {#each itemAttr[1] as itemVal}
                <li>
                    <Checkbox 
                        spanValue={itemVal}
                        checkBrand={() => filterCollection = temp.fillFiltersParameters(filterCollection, itemVal, itemAttr[0])}
                        allCheckedFilters={temp.getInitialCheckboxesState(filterCollection, itemAttr[0], itemVal)}
                    />
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .unique_title {
        font-weight: 600;
        padding: 1rem;
        transition: .2s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }

    .marker:after {
        content: '';
        width: 6px;
        height: 6px;
        display: inline-block;
        border-radius: 50%;
        margin-left: 10px;
        background: var(--main-theme-color);
    }

    .unique_title.active .marker:after {
        background: var(--main-bg-color);
    }

    .unique_title.active .arrow {
        transform: rotate(180deg);
        color: #fff;
    }

    .unique_title .val::first-letter {
        text-transform: uppercase;
    }

    .arrow {
        font-size: 1rem;
        transition: .2s;
    }

    .filterlist_item {
        border-bottom: 1px solid var(--main-border-color);
        user-select: none;
    }
    .unique_title::first-letter {
        text-transform: uppercase;
    }

	.filters_list {
        background: var(--filter-bg-color);
	}

    .filters_list li:hover {
        background: #ececec;
    }

    .active {
        background: var(--main-theme-color);
        color: var(--main-bg-color);
    }
</style>
