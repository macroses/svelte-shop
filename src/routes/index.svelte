<script>
    import CategoryList from "../components/Main/CategoryList.svelte";
    import Carousel from '@beyonk/svelte-carousel';
</script>

<svelte:head>
    <title>Shop</title>
</svelte:head>

<div class="container">
    <div class="main_content">
        <CategoryList/>
        <Carousel>
            <div class="slide-content">Slide 1</div>
            <div class="slide-content">Slide 2</div>
            <div class="slide-content">Slide 3</div>
            <div class="slide-content">Slide 4</div>
            <div class="slide-content">Slide 5</div>
            <div class="slide-content">Slide 6</div>
            <div class="slide-content">Slide 7</div>
            <div class="slide-content">Slide 8</div>
            <div class="slide-content">Slide 9</div>
            <div class="slide-content">Slide 10</div>
        </Carousel>
    </div>
</div>

<style>
    
</style>