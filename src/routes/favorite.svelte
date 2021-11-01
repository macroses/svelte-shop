<script>
    import {flip} from 'svelte/animate';
    import { favoriteCollection } from '../stores/favoriteStore';
    import GoodItemView from '../components/Main/Good/GoodItemView.svelte';
</script>

<svelte:head>
    <title>Избранное</title>
</svelte:head>

<div class="container">
    <div class="title">Избранное</div>
    {#if $favoriteCollection.length > 0}
        <ul class="favorite_list">
            {#each $favoriteCollection as item (item.name)}
                <div animate:flip={{duration: 200}}>
                    <GoodItemView {...item}/>
                </div>
            {/each}
        </ul>
    {:else}
        <div class="exeption">
            Вы еще не добавили избранных товаров
        </div>
    {/if}
</div>

<style>
    .favorite_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 30px 50px;
        height: min-content;
        grid-area: content;
    }

    .title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
        color: var(--main-text-color);
    }

    .exeption {
        color: var(--main-text-color);
    }
</style>