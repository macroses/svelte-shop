<script context="module">
    export async function load(ctx) {
        let url = ctx.page.params.data.split('/goodItem/');
        return { props: { id: url[1], categoryId: url[0]}}
    }
</script>

<script>
    export let id;
    export let categoryId;
    import Loader from '../../components/Helpers/Loader.svelte';
    import Model from '../../model/data-service';

    const temp = new Model();
    const staticData = temp.getSingleItem(categoryId, id);
</script>

<div class="container">
    {#await staticData}
        <Loader/>
    {:then value}
        <p>{value.name}</p>
    {/await}
</div>