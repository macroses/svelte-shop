<script>
    import { fly } from 'svelte/transition';
    import Carousel from '@beyonk/svelte-carousel';

    export let imgs;
    let currentIndx = 0;

    $: if(currentIndx >= imgs.length) currentIndx = 0;
        else if(currentIndx < 0) currentIndx = (imgs.length - 1);
</script>

<div class="item_img_box">
    <div class="img_preview">
        {#key currentIndx}
            <img in:fly={{y: 100}} src={imgs[currentIndx]} alt="">
        {/key}
    </div>
    <div class="slider_for_item">
        {#if imgs.length > 3}
            <Carousel dots={false} perPage={3} draggable={false}>
                <span class="control" slot="left-control" on:click={() => currentIndx--}>
                    <span class="material-icons-outlined">arrow_back</span>
                </span>
                {#each imgs as imgItem}
                    <div class="slide_container">
                        <img src={imgItem} alt="">
                    </div>
                {/each}
                <span class="control" slot="right-control" on:click={() => currentIndx++}>
                    <span class="material-icons-outlined">arrow_forward</span>
                </span>
            </Carousel>
        {:else}
            <div class="short_gallery">
                {#each imgs as imgItem}
                    <div class="slide_container">
                        <img src={imgItem} alt="">
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    
</div>

<style>
    .short_gallery {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slider_for_item {
        width: 200px;
        margin: 0 auto;
    }

    .item_img_box .slider_for_item :global(.left) {
        left: -40px;
        color: var(--main-text-color);
    }

    .item_img_box .slider_for_item :global(.right) {
        right: -40px;
        color: var(--main-text-color);
    }

    .slide_container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border: 1px solid var(--main-border-color);
    }
    .slide_container img {
        max-width: 50px;
        height: 50px;
    }
    .item_img_box {
        grid-area: img;
    }

    .img_preview {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .img_preview img{
        max-width: 100%;
        max-height: 400px;
        height: auto;
    }

    @media (max-width: 768px) {
        .img_preview {
            display: flex;
            justify-content: center;
        }

        .img_preview img{
            max-width: 400px;
            max-height: 280px;
        }
    }
</style>