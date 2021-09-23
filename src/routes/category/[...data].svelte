<script context="module">
    export async function load(ctx) {
        let url = ctx.page.params.data.split('/goodItem/');
        return { props: { id: url[1], categoryId: url[0]}}
    }
</script>

<script>
    export let id;
    export let categoryId;

    import Loader from '../../components/Helpers/Loader.svelte';
    import Model from '../../model/data-service';
    import { onMount } from 'svelte';
    import Breadcrumbs from '../../components/Helpers/Breadcrumbs.svelte';
    import GoodsCounter from '../../components/Main/GoodItem/GoodsCounter.svelte';
    import Tabs from '../../components/Main/GoodItem/Tabs.svelte';
    import FeatureList from '../../components/Main/GoodItem/FeatureList.svelte';
    import GoodItemPrice from '../../components/Main/GoodItem/GoodItemPrice.svelte';
    import GoodItemImgs from '../../components/Main/GoodItem/GoodItemImgs.svelte';

    const temp         = new Model();
    const staticData   = temp.getSingleItem(categoryId, id);
    let title          = "";
    let favoriteString = "в избранное";
    let favoriteState  = false;
    let cartCounter    = 0;

    function handleFavorite() {
        favoriteState ? favoriteString = "в избранное" : favoriteString = "в избранном";
        favoriteState = !favoriteState;
    }

    onMount(async() => {
        const resolve = await staticData;
        title = resolve.name;
    })
</script>

<div class="container">
    {#await staticData}
        <Loader/>
    {:then value}
        <Breadcrumbs refaddress={value.name}/>
        <h1>{value.name}</h1>
        <div class="item_funcs">
            <div class="favorite" on:click={handleFavorite} class:favoriteState>
                <span class="material-icons-outlined">favorite_border</span>
                <span class="text">{favoriteString}</span>
            </div>
        </div>
        <div class="item_container">
            <GoodItemImgs imgs={value.imgSet}/>
            <FeatureList attrs={value.attributes}/>
            <div class="item_price">
                <GoodItemPrice price={value.price}/>
                <GoodsCounter counter={cartCounter}/>
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
    }

    .item_price {
        border: 1px solid var(--main-border-color);
    }

    
    
    .item_container {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr minmax(auto, 400px) 1fr;
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
    
    .favorite {
        display: flex;
        align-items: center;
        user-select: none;
        cursor: pointer;
    }

    .favorite span {
        transition: .2s;
    }

    .favorite:hover span{
        color: var(--main-theme-color);
    }

    .favorite.favoriteState .material-icons-outlined {
        color: red;
    }

    .text {
        margin-left: 5px;
    }
</style>