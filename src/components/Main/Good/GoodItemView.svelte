<script>
    import { fade } from "svelte/transition";
    import Button from "../../Helpers/Button.svelte";
    import { favoriteCollection } from '../../../stores/favoriteStore';
    import { cartCollection } from '../../../stores/cart';

    export let {...item} = $$props;
    export let categoryId;

    let currentIndex = 0;
    let defaultInfo = false;
    $: cartElemCounter = 0;

    $:  if(currentIndex > item.imgSet.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = item.imgSet.length-1;
    }
    
    function getImgSetIndex(i, imgs) {
        currentIndex >= imgs.length ? currentIndex = 0 : currentIndex = i;
    }
    
    function pushToFavorite() {
        item.favorite = !item.favorite;
        item.favorite 
        ? $favoriteCollection = [...$favoriteCollection, {...item}]
        : $favoriteCollection = $favoriteCollection.filter(el => !el.name.includes(item.name))
    }

    $favoriteCollection.forEach(el => {
        if(el.name === item.name) {
            item.favorite = true;
        }
    });

    $: $cartCollection.forEach(el => {
        if(el.elem.name == item.name) {
            cartElemCounter = el.cartCounter;
        }
    })
    

    function pushToCart() {
        const cartElem = {
            categoryId: categoryId,
            elem: {...item},
            cartCounter: cartElemCounter+1
        }
        const elemIndex = $cartCollection.findIndex(el => el.elem.name == item.name);
        if(elemIndex >= 0) {
            return ($cartCollection[elemIndex].cartCounter += 1);
        }
        $cartCollection = [...$cartCollection, cartElem];
    }
</script>

<li>
    <div class="item_container">
        <a href="/{categoryId}/goodItems/{item.id}" class="item_link_img">
            <div class="picture">
                {#if !defaultInfo}
                    {#key currentIndex}
                        <img in:fade src="{item.imgSet[currentIndex]}" alt={item.name} loading="lazy">
                    {/key}
                {:else}
                    {#if currentIndex}
                        <img src="default_img.svg" alt="" loading="lazy" transition:fade>
                    {/if}
                {/if}
                <div class="preview_list">    
                    {#each item.imgSet as _, index}
                        {#if item.imgSet.length > 1}
                            <span class="preview" on:mouseenter={() => getImgSetIndex(index, item.imgSet)} ></span>
                        {/if}
                    {/each}
                </div>
            </div>
            <span class="item_name">{item.name}</span>
        </a>
        <div class="bottom">
            <div class="price">{(item.price).toLocaleString('ru')} руб</div>
            <Button titleProp={"в корзину"} on:click={pushToCart}>
                <span class="cart_val_wrap">
                    {#if cartElemCounter > 0}
                        <span class="cart_counter">{cartElemCounter}</span>
                        <span>+1</span>
                    {:else}
                        <span class="material-icons-outlined cart">shopping_cart</span>
                    {/if}
                </span>
            </Button>
        </div>

        <div class="favorite_item">
            <span class="material-icons-outlined"
                class:favorite={item.favorite}
                on:click={pushToFavorite}
                >{item.favorite ? "favorite" : "favorite_border"}</span>
        </div>
    </div>
</li>

<style>
    .item_container {
        max-width: 300px;
        margin: 0 auto;
        position: relative;
    }
    .cart_counter {
        position: absolute;
        min-width: 1rem;
        height: 1rem;
        top: -12px;
        right: -12px;
        background: var(--main-hover-color);
        color: #fff;
        border: 1px solid var(--main-bg-color);
        font-size: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    li {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .favorite_item {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 20;
        cursor: pointer;
        color: var(--main-text-color);
        background: var(--main-bg-color);
    }

    .favorite_item:hover {
        color: red;
    }

    .favorite_item .favorite {
        color: red;
    }

    .item_name {
        color: var(--main-text-color);
        transition: .2s;
        overflow: hidden;
        height: 70px;
        display: inline-block;
        position: relative;
    }

    .item_name:after {
        content: '';
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        height: 20px;
        background: linear-gradient(to bottom, rgba(0,0,0,0), #fff);
    }

    .picture {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 1.2rem;
        position: relative;
        z-index: 1;
    }

    .preview_list {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2;
        display: flex;
    }

    .preview {
        height: 100%;
        flex: 1;
        position: relative;
    }

    .preview:after {
        content: '';
        position: absolute;
        width: calc(100% - 5px);
        padding: 0 1px;
        height: 3px;
        background: rgba(0,0,0,.2);
        bottom: -10px;
    }

    .preview:hover:after {
        background: var(--main-theme-color);
    }

    .picture {
        position: relative;
    }
    .picture img {
        max-width: 100%;
        height: 150px;
    }

    .price {
        font-size: 1.3rem;
        font-weight: normal;
        font-weight: 500;
    }

    .item_link_img {
        flex-grow: 1;
        position: relative;
        z-index: 2;
    }

    .item_link_img:hover .item_name {
        color: var(--main-theme-color);
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .cart {
        color: #fff;
        font-size: 1rem;
    }


    .cart_val_wrap {
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 1.5rem;
        height: 1.5rem;
        position: relative;
        font: 400 1rem var(--font);
    }

    @media (max-width: 768px) {
        .preview_list {
            display: none;
        }
    }
</style>