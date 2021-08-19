<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: {id}}
    }
</script>

<script>
    export let id;

    import Model from "../../model/data-service";

    const temp = new Model();
    const result = temp.getAllItems().then(val => {
        return val[id-1];
    });

</script>

<main>
    <div class="container">
        {#await result then value}
            <p>{value.catName}</p>
        {/await}
    </div>
</main>

