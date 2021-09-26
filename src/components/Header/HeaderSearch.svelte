<script>
    import Model from '../../model/data-service';
    import Loader from '../Helpers/Loader.svelte';

    const temp = new Model();

    let searchTerm = "";
    $: searchResultsData = temp.searchResults(searchTerm);

    
</script>

<div class="search">
    <form action="GET" class="search-form" on:submit|preventDefault>
        <input type="text" class="search-input" placeholder="Поиск" bind:value={searchTerm}>
        <button type="submit" class="btn_submit">
            <span class="material-icons-outlined">search</span>
        </button>

        <ul class="search_res">
            {#await searchResultsData}
                <Loader />
            {:then value}
                {#each value as item}
                    <li>
                        <a href="#" title={item.name}>
                            <img src={item.imgSet[0]} alt="">
                            <div class="item_name">{item.name}</div>
                        </a>
                    </li>
                    
                {/each}
            {:catch error}
                lolo
            {/await}
        </ul>
    </form>
</div>

<style>
    .search_res {
        width: 100%;
        position: absolute;
        top: 100%;
        left: 0;
        background: #fff;
        box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.1);
        max-height: 300px;
        overflow: auto;
        border: 1px solid var(--main-border-color);
    }

    .search_res li a{
        display: flex;
        padding: 0.5rem 1rem;
        align-items: center;
        color: var(--main-text-color);
        transition: .2s;
    }

    .search_res li a:hover {
        color: var(--main-theme-color);
    }

    .search_res li a img {
        height: 30px;
        margin-right: 1rem;
    }

    .item_name {
        display: inline-block;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .search {
        grid-area: search;
        max-width: 100%;
        position: relative;
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
        width: auto;
        transition: .2s;
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