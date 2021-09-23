<script>
    import Model from '../../model/data-service';
    import GoodItemView from '../../components/Main/Good/GoodItemView.svelte';
    import Carousel from '@beyonk/svelte-carousel';

    export let categoryId;

    const temp = new Model();
    const staticData = temp.getCategoryItem(categoryId);
</script>

{#await staticData then value}
    <div class="carousel_title">
        {value.catName}
    </div>
    <Carousel perPage={{1200: 6, 992: 4, 768: 3, 500: 2, 400: 1}} loop={false} dots={false}>
        <span class="control" slot="left-control">
            prev
        </span>
        {#each value.category as item}
            <GoodItemView {...item} {categoryId}/>
        {/each}
        <span class="control" slot="right-control">
            next
        </span>
    </Carousel>
{/await}

<style>
    .carousel_title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 4rem 0 1rem;
    }

    :global(.carousel li) {
        padding: 0 1rem;
    }

    :global(.carousel button.left) {
        top: -2rem;
        left: calc(100% - 10rem)!important;
    }

    :global(.carousel button.right) {
        top: -2rem;
        left: none;
        right: 0;
    }
</style>