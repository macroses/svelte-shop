<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: {id}}
    }
</script>

<script>
    export let id;

    import { onMount } from "svelte";
    import Model from "../../model/data-service";
    import GoodItemView from "../../components/Main/Good/GoodItemView.svelte";
    import Breadcrumbs from '../../components/Helpers/Breadcrumbs.svelte';
    import Loader from '../../components/Helpers/Loader.svelte';

    const temp = new Model();
    let result = []
    result = temp.getCurrentCategory(id);
    let title = '';
    let selectedValue;

    onMount(async() => {
        const resolve = await temp.getCurrentCategory(id);
        title = resolve.catName;
    });

    // ну почти почти
    function sortItems(arr) {
        // return arr.sort((a,b) => parseFloat(a.price) - parseFloat(b.price))
        console.log( arr.sort((a,b) => parseFloat(a.price) - parseFloat(b.price)))
    }
    
    
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main>
    <div class="container">
        
        <div class="category_box">

            {#await result}
                <Loader/>
            {:then value}
                <Breadcrumbs refaddress={value.catName}/>
                {#if value.category}
                    <div class="filters">
                        <select bind:value={selectedValue} on:change={() => sortItems(value.category)}>
                            <option value="1" selected disabled>Сортировка</option>
                            <option value="2" >Сначала дешевле</option>
                            <option value="3">Сначала дороже</option>
                        </select>
                        {selectedValue}
                    </div>
                    <ul class="items_list">
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

    .filters {
        grid-area: filter;
    }
</style>

