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

    const temp = new Model();
    const staticData = temp.getSingleItem(categoryId, id);
    let title = "";
    let favoriteString = "в избранное";
    let favoriteState = false;
    let toggleTab = false;
    let cartCounter = 0;

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
                <span class="material-icons-two-tone">favorite_border</span>
                <span class="text">{favoriteString}</span>
            </div>
        </div>
        <div class="item_container">
            <div class="item_img_box">
                <div class="img_preview">
                    <img src={value.imgSet[0]} alt="">
                </div>
            </div>
            <div class="item_feature">
                <ul class="feature_list">
                    {#each value.attributes as attrItem}
                        <li class="feature_list_item">
                            {#if attrItem.attrVal.length > 1}
                                <div class="collection_vals">
                                    <div class="title_val">{attrItem.attrName}</div>
                                    {#each attrItem.attrVal as item}
                                        <span class="val_item">{item}</span>
                                    {/each}
                                </div>
                            {:else}
                                <span class="attr_name">{attrItem.attrName}</span>
                                <span class="attr_value">{attrItem.attrVal}</span>
                            {/if}
                        </li>
                    {/each}
                </ul>
                <a class='to_about_item' href='#'>к описанию</a>
            </div>
            <div class="item_price">
                <span class="product_price_cur">
                    {(value.price).toLocaleString('ru')}
                    <span class="currency">RUB</span>
                </span>
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
    .feature_list {
        margin-bottom: 1rem;
    }

    .attr_name {
        color: var(--main-descr-color);
        background: var(--main-bg-color);
        display: inline-block;
        padding: 5px 0;
    }

    .to_about_item {
        color: var(--main-theme-color);
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
        padding: 0 0.5rem;
        border: 2px solid var(--main-theme-color);
    }

    .currency {
        font-size: 1rem;
    }

    .product_price_cur {
        font-size: 2.3rem;
        font-weight: 500;
        padding: 1rem;
    }

    .item_price {
        display: flex;
        flex-direction: column;
    }

    .item_price {
        border: 1px solid var(--main-border-color);
    }

    .img_preview img{
        max-width: 100%;
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

    .favorite.favoriteState .material-icons-two-tone {
        color: red;
    }

    .text {
        margin-left: 5px;
    }
</style>