<script context="module">
    export async function load(ctx) {
        let query = ctx.page.params.query;
        return { props: { query }}
    }
</script>

<script>
    export let query;
    import Model from '../../model/data-service';
    import { beforeUpdate } from 'svelte';
    import GoodItemView from '../../components/Main/Good/GoodItemView.svelte';
    import {paginate, LightPaginationNav} from '../../components/Main/Pagination';

    const temp = new Model();
    let searchResultsData = temp.searchResults(query);

    let items = [];
    let currentPage = 1;
    let pageSize = 10;

    beforeUpdate(async() => {
        searchResultsData = await temp.searchResults(query);
        items = searchResultsData;
    });

    $: paginatedItems = paginate({items, pageSize, currentPage})
</script>

<div class="container">
    <div class="title">Результаты поиска</div>
    {#await items then _}
        <ul class="result_list">
            {#each paginatedItems as item (item.name)}
                <div>
                    <GoodItemView {...item}/>
                </div>
            {/each}
        </ul>
    {/await}

    {#await searchResultsData then value}
        {#if value.length > 10}
            <LightPaginationNav
                totalItems="{value.length}"
                pageSize="{pageSize}"
                currentPage="{currentPage}"
                limit="{1}"
                showStepOptions="{true}"
                on:setPage="{(e) => currentPage = e.detail.page}"
            />
        {/if}
    {/await}
</div>

<style>
    .result_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 30px 50px;
        height: min-content;
        grid-area: content;
        margin-bottom: 1rem;
    }

    .title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }
</style>