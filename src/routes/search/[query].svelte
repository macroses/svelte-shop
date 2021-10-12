<script context="module">
    export async function load(ctx) {
        let query = ctx.page.params.query;
        return { props: { query }}
    }
</script>

<script>
    export let query;
    import Model from '../../model/data-service';

    const temp = new Model();
    let searchResultsData = temp.getDataBySearchQuery(query);
    console.log(searchResultsData)
</script>

{#await searchResultsData then value}
    {#each value as item}
        {item.name}
    {/each}
{/await}