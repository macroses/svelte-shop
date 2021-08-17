<div class="search">
    <form action="GET" class="search-form" on:submit|preventDefault>
        <input type="text" class="search-input" placeholder="Поиск">
        <button type="submit" class="btn_submit">
            <span class="material-icons-two-tone">search</span>
        </button>
    </form>
</div>

<style>
    .search {
        grid-area: search;
        max-width: 100%;
    }

    .search form {
        display: flex;
    }

    .search-input {
        flex-grow: 1;
        padding: 6px 10px;
        height: 50px;
        border: 1px solid var(--main-border-color);
        border-right: none;
        box-shadow: none;
        font-family: var(--font);
        font-size: 1rem;
    }

    .btn_submit {
        background: rgba(255,255,255,0);
        border: 1px solid var(--main-border-color);
        border-left: none;
        border-radius: 0;
        width: 50px;
        color: var(--main-text-color);
        cursor: pointer;
    }
</style>