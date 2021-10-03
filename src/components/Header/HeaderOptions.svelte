<script>
    import { favoriteCollection } from '../../stores/favoriteStore';
    import { cartCollection } from '../../stores/cart';
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
            <span class="material-icons-outlined">favorite_border</span>
            {#if $favoriteCollection.length}
                <span class="counter">{$favoriteCollection.length}</span>
            {/if}
            <span class="text">Избранное</span>
        </a>
    </div>
    <div class="cart">
        <a href="/cart" class="control">
            <span class="material-icons-outlined">shopping_cart</span>
            {#if $cartCollection.length}
                <span class="counter">{$cartCollection.length}</span>
            {/if}
            <span class="text">Корзина</span>
        </a>
    </div>
</div>

<style>
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

        position: absolute;
        top: calc(50% - 7px);
        left: calc(50% + 7px);
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
    }
    
</style>