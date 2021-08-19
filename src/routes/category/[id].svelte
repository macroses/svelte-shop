<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: {id}}
    }
</script>

<script>
    export let id;

    import Model from "../../model/data-service";
    import GoodItemView from "../../components/Main/Good/GoodItemView.svelte";

    const temp = new Model();
    const result = temp.getCurrentCategory(id);
</script>

<main>
    <div class="container">
        {#await result}
            <p>load...</p>
        {:then value}
            <a href="/">Главная</a>
            <span>{value.catName}</span>

            <ul class="items_list">
                {#each value.category as item (item.id)}
                    <GoodItemView {...item}/>
                {/each}
            </ul>
        {/await}
    </div>
</main>

<style>
    .items_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 30px 50px;
    }
</style>

