<script>
    import HeaderCatalog from "./HeaderСatalog.svelte";
    import HeaderOptions from "./HeaderOptions.svelte";
</script>

<header>
    <a href="/" class="logo"><img src="logo.svg" alt=""></a>
    <HeaderCatalog/>
    <div class="search">
        <form action="GET" class="search-form" on:submit|preventDefault>
            <input type="text" class="search-input" placeholder="Поиск">
            <button type="submit" class="btn_submit">
                <span class="material-icons-two-tone">search</span>
            </button>
        </form>
    </div>
    <HeaderOptions/>
</header>

<style>
    header {
        display: grid;
        grid-template-areas: 'logo catalog search controls';
        grid-template-columns: 80px max-content 1fr max-content;
        column-gap: 2rem;
        align-items: center;
        padding: 1rem 0;
    }

    .logo {
        grid-area: logo;
    }

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

    @media (max-width: 992px) {
        header {
            grid-template-columns: 40px max-content 1fr max-content;
            grid-template-areas: 
            'logo logo logo logo logo logo controls' 
            'catalog search search search search search search';
            column-gap: 1rem;
        }
    }
</style>