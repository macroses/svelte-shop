<script>
    import { favoriteCollection } from '../../stores/favoriteStore';
    import { cartCollection } from '../../stores/cart';

    $: cartCollectionCounter = () => {
        let sum;
        if($cartCollection.length > 0) {
            sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);
        }
        return sum;
    }
</script>

<div class="options">
    <div class="profile">
        <a href="/profile" class="control">
            <span class="material-icons-outlined">face</span>
            <span class="text">Профиль</span>
        </a>
    </div>
    <div class="favorite">
        <a href="/favorite" class="control">
            <div class="icon_container">
                <span class="material-icons-outlined">favorite_border</span>
                {#if $favoriteCollection.length}
                    <span class="counter">{$favoriteCollection.length}</span>
                {/if}
            </div>
            <span class="text">Избранное</span>
        </a>
    </div>
    <div class="cart">
        <a href="/cart" class="control">
            <div class="icon_container">
                <span class="material-icons-outlined">shopping_cart</span>
                {#if $cartCollection.length}
                    <span class="counter">{cartCollectionCounter()}</span>
                {/if}
            </div>
            <span class="text">Корзина</span>
        </a>
    </div>
</div>

<style>

    .icon_container {
        position: relative;
    }
    .counter {
        background: var(--main-theme-color);
        color: var(--main-bg-color);
        font-size: 0.6rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 14px;
        height: 14px;
        padding: 0 3px;

        position: absolute;
        top: 50%;
        right: 0;
    }

    .options {
        display: flex;
        grid-area: controls;
        height: 100%;
    }

    .control {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: var(--main-text-color);
        height: 100%;
        position: relative;
    }

    .text {
        transition: .2s;
    }

    .favorite, .cart {
        margin-left: 1.25rem;
    }

    @media (max-width: 992px) {
        .text {
            display: none;
        }

        .options {
            margin-right: 0.5rem;
        }
    }
    
</style>