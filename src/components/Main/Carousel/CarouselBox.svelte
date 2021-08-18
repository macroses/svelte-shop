<script>
	import Model from '../../../model/data-service';

	const temp = new Model();

	const allimg = temp.getAllItems()

    allimg.then(val => console.log(val[0].category))
</script>


{#await allimg then value}
    {#each value[0].category as item (item.id)}
        <p>{item.id}</p>
        <p>{item.brand}</p>
        <p>{item.title}</p>
        {item.body}
        {#each item.imgSet as elem}
            <img src="{elem}" alt="">
        {/each}

    {/each}

{/await}