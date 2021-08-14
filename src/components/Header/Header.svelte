<header>
    <a href="/"><img src="logo.svg" alt=""></a>
    <div class="catalog">Каталог</div>
    <div class="search">
        <input type="text" class="search-input">
    </div>
    <div class="options">
        <div class="profile">
            <a href="/"><span class="material-icons">face</span></a>
        </div>
        <div class="favorite">
            <a href="/"><span class="material-icons">favorite_border</span></a>
        </div>
        <div class="cart">
            <a href="/"><span class="material-icons">shopping_cart</span></a>
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
</style>