<header>
    <a href="/"><img src="logo.svg" alt=""></a>
    <div class="catalog">Каталог</div>
    <div class="search">
        <input type="text" class="search-input">
    </div>
    <div class="options">
        <div class="profile">
            <a href="/">
                <span class="material-icons-two-tone">face</span>
                Профиль
            </a>
        </div>
        <div class="favorite">
            <a href="/">
                <span class="material-icons-two-tone">favorite_border</span>
                Избранное
            </a>
        </div>
        <div class="cart">
            <a href="/">
                <span class="material-icons-two-tone">shopping_cart</span>
                Корзина
            </a>
        </div>
    </div>
</header>

<style>
    header {
        display: flex;
        align-items: center;
    }

    .options {
        display: flex;
    }

    .search {
        flex-grow: 1;
    }

    .search-input {
        width: 100%;
    }

    .options a {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>