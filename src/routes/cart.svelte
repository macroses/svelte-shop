<script>
    import { cartCollection } from '../stores/cart';
    import { onlyDigits } from '../presenter/present-service';
</script>


<div class="container">
    <div class="title">Корзина</div>
    <div class="cart">
        <div class="cart_area">
            <ul class="cart_list">
                {#each $cartCollection as {categoryId, elem, cartCounter}, idx}
                    <li class="cart_item">
                        <div class="item_img">
                            <img src="{elem.imgSet[0]}" alt="{elem.name}">
                        </div>
                        <a href="/category/{categoryId}/goodItems/{elem.id}" class="item_title">{elem.name}</a>
                        <div class="item_total">{elem.price * cartCounter} руб</div>
                        <div class="item_delete">
                            <span class="material-icons-outlined">
                                {elem.favorite ? "favorite" : "favorite_border"}
                            </span>
                            <span class="material-icons-outlined">
                                delete
                            </span>
                        </div>
                        <div class="item_counter">
                            <button on:click={() => cartCounter--}>-</button>
                            <input type="text" use:onlyDigits bind:value={cartCounter} >
                            <button on:click={() => cartCounter++}>+</button>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="cart_controls">2</div>
    </div>
</div>

<style>
    .title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }

    .cart {
        display: grid;
        grid-auto-columns: 6fr 2fr;
        grid-auto-rows: max-content auto;
        grid-template-areas: "items controls" "items controls";
        gap: 2rem 2.5rem;
    }

    .cart_item {
        display: grid;
        grid-auto-columns: 200px min-content auto min-content;
        grid-template-areas: 
            "image title title total"
            "image delete . counter" 
            "image . . .";
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid var(--main-border-color);
    }

    .item_img {
        width: 200px;
        height: 200px;
        grid-area: image;
    }

    .item_title {
        grid-area: title;
    }

    .item_total {
        grid-area: total;
        white-space: nowrap;
    }

    .item_delete {
        display: flex;
        grid-area: delete;
    }

    .item_counter {
        grid-area: counter;
    }

    .item_img img {
        object-fit: contain;
        width: 100%;
        height: auto;
    }
</style>