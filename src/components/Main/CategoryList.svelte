<script>
    import Model from "../../model/data-servie";

    let categoryCollection = new Model();
    let arr = categoryCollection.getUniqueCategories();

</script>

<div class="category_list">
    {#await arr}
        <p>waiting...</p>
    {:then value}
        {#each value as item}
            <a href="/">{item}</a>
        {/each}
    {:catch error}
        {error}
    {/await}
</div>

<style>
    .category_list {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem 1.5rem;
    }
    
    .category_list a {
        background: lightgray;
    }

    .category_list a:nth-child(7n+1) {
        grid-row: auto /span 2;
        grid-column: auto /span 2;
    }
</style>