<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        let categoryId = ctx.page.params.category;
        return { props: { id: id, categoryId: categoryId}}
    }
</script>

<script>
    export let id;
    export let categoryId;

    import Loader from '../../../components/Helpers/Loader.svelte';
        import Model from '../../../model/data-service';
        import { beforeUpdate, onMount } from 'svelte';
        import Breadcrumbs from '../../../components/Helpers/Breadcrumbs.svelte';
        import GoodsCounter from '../../../components/Main/GoodItem/GoodsCounter.svelte';
        import Tabs from '../../../components/Main/GoodItem/Tabs.svelte';
        import FeatureList from '../../../components/Main/GoodItem/FeatureList.svelte';
        import GoodItemPrice from '../../../components/Main/GoodItem/GoodItemPrice.svelte';
        import GoodItemImgs from '../../../components/Main/GoodItem/GoodItemImgs.svelte';
        import DataFavorite from '../../../components/Main/GoodItem/DataFavorite.svelte';

    const temp         = new Model();
    
    let staticData;
    let title          = "";

    function updateData() {
        staticData   = temp.getSingleItem(categoryId, id);
    }

    

    onMount(async() => {
        const resolve = await staticData;
        title = resolve.name;
    });

    beforeUpdate(updateData);
</script>

<div class="container">
    {#await staticData}
        <Loader/>
    {:then value}
        <Breadcrumbs refaddress={value.name}/>
        <h1>{value.name}</h1>
        <div class="item_funcs">
            <DataFavorite {...value} categoryId={categoryId}/>
        </div>
        <div class="item_container">
            <GoodItemImgs imgs={value.imgSet}/>
            <FeatureList attrs={value.attributes}/>
            <div class="item_price">
                <GoodItemPrice price={value.price}/>
                <GoodsCounter {...value} categoryId={categoryId}/>
            </div>
        </div>
        <Tabs title={value.title} body={value.body}/>
    {/await}
</div>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<style>
    .item_price {
        display: flex;
        flex-direction: column;
        grid-area: price;
        position: sticky;
        top: 0;
    }

    .item_price {
        border: 1px solid var(--main-border-color);
    }

    .item_container {
        position: relative;
        display: grid;
        gap: 2rem;
        grid-template-columns: 32% minmax(auto, 400px) 340px;
        grid-template-areas: "img about price";
        padding-top: 2rem;
        align-items: flex-start;
    }
    h1 {
        font-size: 1.5rem;
        font-weight: 500;
    }

    .item_funcs {
        border-bottom: 1px solid var(--main-border-color);
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
    }


    @media (max-width: 992px) {
        .item_container {
            grid-template-columns: 32% 1fr;
            grid-template-areas: "img about" "img price";
        }
    }

    @media (max-width: 768px) {
        .item_price {
            flex-direction: row;
            justify-content: space-between;
        }

        .item_container {
            grid-template-columns: 1fr;
            grid-template-areas: "img" "about" "price";
        }
    }
</style>