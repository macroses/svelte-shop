<script>
    import { favoriteCollection } from '../../../stores/favoriteStore';

    export let item = $$props;
    export let categoryId


    function pushToFavorite() {
        item.favorite = !item.favorite;
        item.favorite
        ? $favoriteCollection = [...$favoriteCollection, {...item, categoryId: categoryId}]
        : $favoriteCollection = $favoriteCollection.filter(el => !el.name.includes(item.name));
    }

    $: $favoriteCollection.forEach(el => {
        if(el.name === item.name) {
            item.favorite = el.favorite;
        }
    });
</script>

<div class="favorite" on:click={pushToFavorite} class:favState={item.favorite}>
    <span class="material-icons-outlined">{ item.favorite ? "favorite" : "favorite_border" }</span>
    <span class="text">{item.favorite ? "В избранном" : "Добавить в избранное"}</span>
</div>

<style>
    .favorite {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .favorite span {
        transition: .2s;
    }

    .favorite:hover span{
        color: var(--main-theme-color);
    }

    .favorite.favState .material-icons-outlined {
        color: red;
    }

    .text {
        margin-left: 5px;
    }
</style>