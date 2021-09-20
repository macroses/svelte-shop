<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: {id}}
    }
</script>
<script>
    export let id;
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Model from "../../model/data-service";
    import GoodItemView from "../../components/Main/Good/GoodItemView.svelte";
    import Breadcrumbs from '../../components/Helpers/Breadcrumbs.svelte';
    import Loader from '../../components/Helpers/Loader.svelte';
    import Filters from "../../components/Main/Filters/Filters.svelte";

    const temp = new Model();
    let title = '';
    let selectedValue;
    let values;
    let toggleFilters = false;

    $: filterCollection = [];
    $: categoryItem = temp.getCategoryItem(id, selectedValue, filterCollection, values);
    const staticData = temp.getCategoryItem(id);

    onMount(async() => {
        const resolve = await categoryItem;
        title = resolve.catName;
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="container">
    <div class="category_box">
        {#await staticData then value}
            {#if value.category.length > 0}
                <Breadcrumbs refaddress={value.catName}/>
                <Filters {...value} 
                    bind:selectedValue 
                    bind:filterCollection
                    bind:values
                    bind:toggleFilters
                    />
                <button class="toggle_filters" on:click={() => toggleFilters = true}>фильтры</button>
            {/if}
        {/await}
        {#await categoryItem}
                <Loader/>
        {:then value}
            {#if value.category.length > 0}
                <ul class="items_list" in:fade>
                    {#each value.category as item (item.id)}
                        <GoodItemView {...item} categoryId={id}/>    
                    {/each}
                </ul>
            {:else}
                <div class="empty_catalog">По вашему запросу ничего не найдено</div>
            {/if}
        {/await}
    </div>
</div>

<style>
    .toggle_filters {
		width: 100%;
		background: var(--main-theme-color);
		border: 1px solid var(--main-theme-color);
		color: var(--main-bg-color);
		font: 600 0.75rem var(--font);
		text-transform: uppercase; 
        grid-area: filter;
        padding: 0.5rem 0;
        margin: 1rem 0;
    }

    .empty_catalog {
        font-size: 1.5rem;
        font-weight: 500;
        min-width: max-content;
        width: 100%;
    }
    .items_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 30px 50px;
        height: min-content;
        grid-area: content;
    }

    .category_box {
        display: grid;
        grid-template-columns: minmax(200px, 300px) 1fr;
        grid-template-rows: auto 1fr;
        column-gap: 1rem;
        grid-template-areas: 
            'crumbs crumbs'
            'filter content';
    }

    .toggle_filters {
        display: none;
    }
    @media (max-width: 768px) {
        .category_box {
            grid-template-columns: 1fr 1fr;
            grid-template-areas: 
            'crumbs crumbs'
            'filter filter'
            'content content';
        }

        .toggle_filters {
            display: initial;
        }
    }
</style>

