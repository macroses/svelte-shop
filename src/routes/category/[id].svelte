<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: { id } }
    }
</script>

<script>
    import Model from "../../model/data-servie";

    export let id;

    const temp = new Model();

    
    const categories = temp.getAllItems().then(val => {
        const filtered = val.filter(el => el.id == id)[0];
        return filtered;
    });

</script>

<div class="container">
    <p>this category id is: {id}</p>
    
    {#await categories}
        ...
    {:then value}
        {#each value as item (item.id)}
            {item.title}
        {/each}
    {:catch error}
        {error}
    {/await}
</div>

