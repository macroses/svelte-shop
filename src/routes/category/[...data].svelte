<script context="module">
    export async function load(ctx) {
        let url = ctx.page.params.data.split('/goodItems/');
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
        import { cartCollection } from '../../stores/cart';
        import { favoriteCollection } from '../../stores/favoriteStore';

    const temp         = new Model();
    const staticData   = temp.getSingleItem(categoryId, id);
    let title          = "";
    let favoriteString = "в избранное";
    let cartCounter    = 0;

    onMount(async() => {
        const resolve = await staticData;
        title = resolve.name;
    })

    // $favoriteCollection.forEach(el => {
    //     if(el.id == id) {
    //             val.favorite = true;
    //         }
    // });

    // $: $cartCollection.forEach(el => {
    //     if(el.elem.name == item.name) {
    //         cartElemCounter = el.cartCounter;
    //     }
    // })

    // доделать стейт избранного
    function pushToFavorite() {
        val.favorite = !val.favorite;
        val.favorite 
        ? $favoriteCollection = [...$favoriteCollection, {...val, categoryId: categoryId}]
        : $favoriteCollection = $favoriteCollection.filter(el => !el.name.includes(val.name))
    }

    function pushToCart(val) {
        const cartElem = {
            categoryId: categoryId,
            elem: val,
            cartCounter: cartCounter+1
        }

        const elemIndex = $cartCollection.findIndex(el => el.elem.name == val.name);
        if(elemIndex >= 0) {
            return ($cartCollection[elemIndex].cartCounter += 1);
        }

        $cartCollection = [...$cartCollection, cartElem];
    }
</script>

<div class="container">
    {#await staticData}
        <Loader/>
    {:then value}
        <Breadcrumbs refaddress={value.name}/>
        <h1>{value.name}</h1>
        <div class="item_funcs">
            <div class="favorite" on:click={() => pushToFavorite(value)}>
                <span class="material-icons-outlined">favorite_border</span>
                <span class="text">{favoriteString}</span>
                <span class="text">{value.favorite}</span>
            </div>
        </div>
        <div class="item_container">
            <GoodItemImgs imgs={value.imgSet}/>
            <FeatureList attrs={value.attributes}/>
            <div class="item_price">
                <GoodItemPrice price={value.price}/>
                <GoodsCounter counter={cartCounter} on:click={() => pushToCart(value)}/>
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
        grid-area: price
    }

    .item_price {
        border: 1px solid var(--main-border-color);
    }

    
    
    .item_container {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr minmax(auto, 400px) 1fr;
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

    @media (max-width: 992px) {
        .item_container {
            grid-template-columns: 1fr minmax(auto, 400px);
            grid-template-areas: "img about" "price price"
        }
    }

    @media (max-width: 768px) {
        .item_container {
            grid-template-columns: 1fr;
            grid-template-areas: "img" "price" "about"

        }

        .item_price {
            z-index: 2;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: var(--main-bg-color);
            text-align: center;
        }

        .item_price :global(.product_price_cur) {
            font-size: 1rem;
            padding: 0.5rem;
        }
    }
</style>