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
            <div class="promo_content">
                <div class="promo_item">
                    <img src="https://static-sl.insales.ru/r/WXPD9U3YGS8/fit/469/0/ce/1/plain/files/1/6778/16366202/original/Group_179_44a64edc4aaac4a857f6cf68909a657f.jpg" alt="">
                </div>
                <div class="promo_item">
                    <img src="https://static-sl.insales.ru/r/hUxFJtxck9w/fit/469/0/ce/1/plain/files/1/6780/16366204/original/Group_180.jpg" alt="">
                </div>
                <div class="promo_item">
                    <img src="https://static-sl.insales.ru/r/oljm6gYQ3gc/fit/469/0/ce/1/plain/files/1/6782/16366206/original/Group_181.jpg" alt="">
                </div>
            </div>
        </div>
        <CarouselComponent categoryId={1}/>
    </div>
</div>

<style>
    .promo_block {
        max-width: 100%;
        overflow: auto;
    }

    .promo_title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 4rem 0 1rem;
    }

    .promo_content {
        display: flex;
        gap: 1rem;
        min-width: 800px;
    }

    .promo_item {
        flex: 1;
    }

    .promo_item img {
        max-width: 100%;
    }

    @media (max-width: 768px) {
        .promo_title {
            margin: 1rem 0;
        }
    }
</style>