<script>
    import Model from "../model/data-servie";

    let obj = new Model();
    let elem = obj.getAllItems();
</script>


<!-- {#await elem}
    <p>loading...</p>
{:then value}
    <ul>
        {#each value as item}
            <li>
                <div class="name">{item.name}</div>
                <img src="{item.img}" alt="">
            </li>
        {/each}
    </ul>
    
{:catch}
    <p>Это ашыпка</p>
{/await} -->


<main>
    this is main
</main>

