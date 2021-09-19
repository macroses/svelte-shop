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

    const temp = new Model();
    const staticData = temp.getSingleItem(categoryId, id);
    let title = "";
    let favoriteString = "в избранное";
    let favoriteState = false;

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
            <div class='item_body'>
                <div class="title">{value.title}</div>
                <div class="title_content">{value.body}</div>
                <a href="." class="characteristics_link">Характеристики</a>
            </div>
            <div class="item_price">
                {(value.price).toLocaleString('ru')}
                <button>в корзину</button>
            </div>
        </div>

<!--        <div class="item_attrs">-->
<!--            <ul class="attrs_list">-->
<!--                {#each value.attributes as attr}-->
<!--                    <li class="attr_item">-->
<!--                        {#if attr.attrVal.length <= 1}-->
<!--                            <span class="name">{attr.attrName}:</span>-->
<!--                            <span class="value">{attr.attrVal}</span>-->
<!--                        {:else}-->
<!--                            {#each attr.attrVal as valueItem}-->
<!--                                <span class="value_item">{valueItem}</span>-->
<!--                            {/each}-->
<!--                        {/if}-->
<!--                    </li>-->
<!--                {/each}-->
<!--            </ul>-->
<!--        </div>-->
    {/await}
</div>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<style>
    .characteristics_link {
        color: var(--main-theme-color);
        margin-top: 1rem;
        display: inline-block;
    }

    .item_price {
        border: 1px solid var(--main-border-color);
        padding: 1rem;
    }

    .img_preview img{
        max-width: 100%;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }
    
    .item_container {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr minmax(300px, 500px) 1fr;
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