<script>
    import { favoriteCollection } from '../stores/favoriteStore';
    import Model from '../model/data-service';
    import GoodItemView from '../components/Main/Good/GoodItemView.svelte';

    const temp = new Model();
    let favoriteArray = [];

    $favoriteCollection.forEach(el => {
        favoriteArray = [...favoriteArray, temp.getSingleItem(el.categoryId, el.itemId)];
    });
</script>

<div class="container">
    <div class="title">Избранное</div>
    {#await Promise.all(favoriteArray).then(value => value) then value}
        {#if value.length !== 0}
            <ul class="favorite_list">
                {#each value as item}
                    <GoodItemView {...item}/>
                {/each}
            </ul>
        {:else}
            <p>вы ничего не добавили в избранное</p>
        {/if}
    {/await}
</div>

<style>
    .favorite_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 30px 50px;
        height: min-content;
        grid-area: content;
    }
</style>