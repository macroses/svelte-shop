<div class="options">
    <div class="profile">
        <a href="/" class="control">
            <span class="material-icons-two-tone">face</span>
            <span class="text">Профиль</span>
        </a>
    </div>
    <div class="favorite">
        <a href="/" class="control">
            <span class="material-icons-two-tone">favorite_border</span>
            <span class="text">Избранное</span>
        </a>
    </div>
    <div class="cart">
        <a href="/" class="control">
            <span class="material-icons-two-tone">shopping_cart</span>
            <span class="text">Корзина</span>
        </a>
    </div>
</div>

<style>
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