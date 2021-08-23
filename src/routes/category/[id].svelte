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
    let title = '';
    let selectedValue;

    onMount(async() => {
        const resolve = await temp.getCurrentCategory(id);
        title = resolve.catName;
    });

    $: result = [];
    $: if(selectedValue == undefined) {
        result = temp.getCurrentCategory(id);
    } else if(selectedValue === "2") {
        result = temp.sortItems(id);
        // придумать как обновлять в доме result
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
                        <select bind:value={selectedValue}>
                            <option value="" selected disabled>Сортировка</option>
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

