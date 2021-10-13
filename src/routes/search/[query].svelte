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

    const temp = new Model();
    let searchResultsData = temp.searchResults(query);

    beforeUpdate(() => {
        searchResultsData = temp.searchResults(query);
    });
</script>

<div class="container">
    <div class="title">Результаты поиска</div>
    {#await searchResultsData then value}
        <ul class="result_list">
            {#each value as item (item.name)}
                <div>
                    <GoodItemView {...item}/>
                </div>
            {/each}
        </ul>
    {/await}
</div>

<style>
    .result_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 30px 50px;
        height: min-content;
        grid-area: content;
    }

    .title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }
</style>