<script>
    import { fade } from "svelte/transition";
    import Button from "../../Helpers/Button.svelte";

    export let {...item} = $$props;
    export let categoryId;

    let currentIndex = 0;
    let defaultInfo = false;

    $:  if(currentIndex > item.imgSet.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = item.imgSet.length-1;
    }
    
    function getImgSetIndex(i, imgs) {
        if(currentIndex >= imgs.length) {
            currentIndex = 0;
        } else {
            currentIndex = i;
        }
    }
</script>

<li>
    <a href="/category/{categoryId}/goodItem/{item.id}" class="item_link_img">
        <div class="picture">
            {#if !defaultInfo}
                <img src="{item.imgSet[currentIndex]}" alt={item.name}>
            {:else}
                {#if currentIndex}
                    <img src="default_img.svg" alt="" transition:fade>
                {/if}
            {/if}
            <div class="preview_list">    
                {#each item.imgSet as itemImg, index}
                    {#if item.imgSet.length > 1}
                        <span class="preview" on:mouseenter={() => getImgSetIndex(index, item.imgSet)} ></span>
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

    {#if item.imgSet.length > 1}
        <div class="controls">
            <span on:click={() => currentIndex = ++currentIndex} class="material-icons-two-tone">navigate_before</span>
            <span on:click={() => currentIndex = --currentIndex} class="material-icons-two-tone">navigate_next</span>
        </div>
    {/if}
    
</li>

<style>
    li {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .item_name {
        color: var(--main-text-color);
        transition: .2s;
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
        filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(23deg) brightness(118%) contrast(118%);
    }

    .controls {
        display: none;
    }

    @media (max-width: 768px) {
        .preview_list {
            display: none;
        }

        .controls {
            width: 100%;
            display: flex;
            justify-content: space-between;
            position: absolute;
            top: 25%;
            z-index: 2;

            font-size: 2rem;
        }

        .controls span {
            border: 1px solid var(--main-border-color);
            color: var(--main-theme-color);
            border-radius: 50%;
            padding: 5px;
            user-select: none;
            transition: .1s;
        }
    }
</style>