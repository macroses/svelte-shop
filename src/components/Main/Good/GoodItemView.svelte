<script>
    import Button from "../../Helpers/Button.svelte";
    export let {...item} = $$props;

    let currentIndex = 0;
    $: defaultInfo = false;
    function getIndex(i) {
        currentIndex = i;
        defaultInfo = false;
    }

    function handleErr() {
        defaultInfo = true;
    }
</script>

<li>
    <span class="material-icons-two-tone favorite">favorite_border</span>
    <a href="/" class="item_link_img">
        <div class="picture">
            
            {#if !defaultInfo}
                <img src="{item.imgSet[currentIndex]}" alt={item.name} on:error={handleErr}>
            {:else}
                <img src="default_img.svg" alt="">
            {/if}
            <div class="preview_list">    
                {#each item.imgSet as itemImg, index}
                    {#if item.imgSet.length > 1}
                        <span class="preview" on:mouseenter={() => getIndex(index)} ></span>
                    {/if}
                {/each}
            </div>
        </div>
        <span class="item_name">{item.name}</span>
    </a>
    <div class="bottom">
        <div class="price">{item.price} руб</div>
        <Button titleProp={"в корзину"}>
            <span class="material-icons-two-tone cart">shopping_cart</span>
        </Button>
    </div>
</li>

<style>
    li {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .favorite {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        z-index: 2;
        user-select: none;
    }

    .item_name {
        color: var(--main-text-color);
        transition: .2s;
    }

    .picture {
        display: flex;
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
        width: 80%;
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

    .picture img {
        max-width: 80%;
        height: 150px;
    }

    .price {
        font-size: 1.3rem;
        font-weight: normal;
        font-weight: 500;
    }

    .item_link_img {
        flex-grow: 1;
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
        filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(23deg) brightness(118%) contrast(118%);
    }
</style>