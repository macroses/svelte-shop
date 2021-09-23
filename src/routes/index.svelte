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
        <CarouselComponent categoryId={1}/>
    </div>
</div>

<style>

</style>