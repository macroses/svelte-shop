<!-- <script>
    import Model from "../model/data-servie";

    let obj = new Model();
    let elem = obj.getAllItems();
</script>


{#await elem}
    <p>loading...</p>
{:then value}
    {#each value as item}
        <p>{item.about}</p>
    {/each}
{:catch}
    <p>Это ашыпка</p>
{/await} -->


<h1>Welcome to SvelteKit</h1>

