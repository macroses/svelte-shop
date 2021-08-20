<script>
    import Button from "../../Helpers/Button.svelte";

    export let {...item} = $$props;
</script>

<li>
    <span class="material-icons-two-tone favorite">favorite_border</span>
    <a href="/category/{item.id}" class="item_link_img">
        <div class="picture">
            <img src="{item.imgSet[0]}" alt="">
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
    }

    .picture img {
        max-width: 80%;
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