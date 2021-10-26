<script>
    import Model from '../../model/data-service';
    import GoodItemView from '../../components/Main/Good/GoodItemView.svelte';
    import Carousel from '@beyonk/svelte-carousel';

    export let categoryId;

    const temp = new Model();
    const staticData = temp.getCategoryItem(categoryId);
</script>

<div class="carousel_container">
    {#await staticData then value}
        <div class="carousel_title">
            {value.catName}
        </div>
        <Carousel perPage={{1200: 6, 992: 4, 768: 3, 500: 2}} dots={false}>
            <span class="control" slot="left-control">
                <span class="material-icons-outlined">arrow_back</span>
            </span>
            {#each value.category as item}
                <GoodItemView {...item} {categoryId}/>
            {/each}
            <span class="control" slot="right-control">
                <span class="material-icons-outlined">arrow_forward</span>
            </span>
        </Carousel>
    {/await}
</div>

<style>
    .control {
        color: var(--main-text-color);
    }
    .control:hover {
        color: var(--main-theme-color);
    }

    .carousel_title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 4rem 0 1rem;
        color: var(--main-text-color);
    }

    .carousel_container :global(.carousel li) {
        padding: 0 1rem;
    }

    .carousel_container :global(.carousel button.left) {
        top: -2rem;
        left: calc(100% - 120px)!important;
    }

    .carousel_container :global(.carousel button.right) {
        top: -2rem;
        left: none;
        right: 0;
    }

    @media (max-width: 768px) {
        .control {
            display: none;
        }

        .carousel_title {
            margin: 1rem 0;
        }
    }
</style>