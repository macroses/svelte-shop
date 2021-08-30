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
    
    $: categoryItem = temp.sortByPrice(selectedValue, id);
    $: filterCollection = [];

    const staticData = temp.getCategoryItem(id);

    onMount(async() => {
        const resolve = await categoryItem;
        title = resolve.catName;
    });


</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main>
    <div class="container">
        <div class="category_box">
            {#await staticData then value}
                <Breadcrumbs refaddress={value.catName}/>
                <Filters {...value} bind:selectedValue bind:filterCollection id={id}/>
                
            {/await}
            {#await categoryItem}
                    <Loader/>
            {:then value}
                {#if value.category}
                    <ul class="items_list" in:fade>
                        {#each value.category as item (item.id)}
                            <GoodItemView {...item}/>    
                        {/each}
                    </ul>
                {:else}
                    <div class="empty_catalog">По вашему запросу ничего не найдено</div>
                {/if}
            {/await}

        </div>
    </div>
</main>



<style>
    .empty_catalog {
        font-size: 1.5rem;
        font-weight: 500;
        min-width: max-content;
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
</style>

