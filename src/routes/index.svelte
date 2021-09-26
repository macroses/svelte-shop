<script>
    import CategoryList from "../components/Main/CategoryList.svelte";
    import CarouselComponent from "../components/Main/CarouselComponent.svelte";
</script>

<svelte:head>
    <title>Shop</title>
</svelte:head>

<div class="container">
    <div class="main_content">
        <CategoryList/>
        <CarouselComponent categoryId={0}/>
        <div class="promo_block">
            <div class="promo_title">Акции</div>
        </div>
        <CarouselComponent categoryId={1}/>
    </div>
</div>

<style>
    .promo_title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 4rem 0 1rem;
    }
</style>