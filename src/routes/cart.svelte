<script>
    import { cartCollection } from '../stores/cart';
    import { onlyDigits } from '../presenter/present-service';

    let promocode = false;

    function cartItemRemove(idx) {
        $cartCollection.splice(idx, 1);
        $cartCollection = $cartCollection;
    };

    $: cartCollectionCounter = () => {
        let sum;
        if($cartCollection.length > 0) {
            sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);
        }
        return sum;
    };

    $: sumAllItemsPrice = () => {
        let sum = 0;
        $cartCollection.forEach(el => {
            sum += el.elem.price * el.cartCounter;
        });
        return sum
    };
</script>


<div class="container">
    <div class="title">Корзина</div>
    <div class="cart">
        <div class="cart_area">
            <ul class="cart_list">
                {#each $cartCollection as {categoryId, elem, cartCounter}, idx (idx)}
                    <li class="cart_item">
                        <div class="item_img">
                            <img src="{elem.imgSet[0]}" alt="{elem.name}">
                        </div>
                        <a href="/category/{categoryId}/goodItems/{elem.id}" class="item_title">{elem.name}</a>
                        <div class="item_total">{elem.price * cartCounter} руб</div>
                        <div class="item_delete">
                            <div class="item_delete_option">
                                <span class="material-icons-outlined">
                                    {elem.favorite ? "favorite" : "favorite_border"}
                                </span>
                                <span class="option_text">в избранное</span>
                            </div>
                            <div class="item_delete_option" on:click={() => cartItemRemove(idx)}>
                                <span class="material-icons-outlined">delete</span>
                                <span class="option_text">удалить</span>
                            </div>
                        </div>
                        <div class="item_counter">
                            <button 
                                on:click={() => cartCounter <= 1 ? cartCounter = 1 : --cartCounter}
                                ><span class="material-icons-outlined">remove</span></button>
                            <input type="text" use:onlyDigits bind:value={cartCounter} >
                            <button on:click={() => cartCounter++}>
                                <span class="material-icons-outlined">add</span>
                            </button>
                        </div>
                    </li>
                {:else}
                    <li class="empty">Корзина пуста.
                        <a href="/">Выберите товар</a>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="cart_controls_box">
            {#if $cartCollection.length > 0}
                <div class="controls_wrap">
                    <div class="cart_controls">
                        <div class="title">В корзине</div>
                        <div class="static_counter">товаров: {cartCollectionCounter()}</div>
                        {#if promocode}
                            <input type="text">
                        {/if}
                        <button class="same_as_link"
                            on:click={() => promocode = !promocode}
                            >{promocode ? "активировать промокод" : "введите промокод"}
                        </button>
                        
                        <div class="sum_all_items">
                            <span>итого:</span>
                            <span class="val">{ sumAllItemsPrice() } руб</span>
                        </div>
                    </div>
                    <div class="make_order">
                        <button>Оформить заказ</button>
                    </div>
                </div>
            {/if}
            
        </div>
    </div>
</div>

<style>
    .make_order {
        display: flex;
    }
    .make_order button{
        background: var(--main-theme-color);
        color: var(--main-bg-color);
        width: 100%;
        border: 0;
        display: inline-block;
        font: 500 1rem var(--font);
        padding: 1rem;
    }

    .cart_controls_box {
        position: relative;
    }

    .sum_all_items {
        margin-top: 1rem;
    }

    .sum_all_items .val{
        font-size: 1.5rem;
        font-weight: 500;
    }

    .static_counter {
        margin-bottom: 1rem;
    }
    .same_as_link {
        background: transparent;
        border: 0;
        color: var(--main-theme-color);
        font-size: 0.9rem;
    }

    .cart_controls {
        background: var(--gray-hover-color);
        padding: 1.5rem;
        font-family: var(--font);
    }

    .cart_controls .title {
        margin-top: 0;
    }

    .controls_wrap {
        position: sticky;
        top: 0;
    }
    
    .empty a {
        color: var(--main-theme-color);
    }

    .item_delete_option {
        display: flex;
        white-space: nowrap;
        color: var(--main-descr-color);
        cursor: pointer;
        gap: 0.5rem
    }

    .item_delete_option:hover {
        color: var(--main-theme-color);
    }

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
        grid-auto-columns: 150px min-content auto min-content;
        grid-template-areas: 
            "image title title total"
            "image delete . counter" 
            "image . . .";
        gap: 1rem;
        padding: 1rem 0;
    }

    .cart_item:not(:last-child) {
        border-bottom: 1px solid var(--main-border-color);
    }

    .item_img {
        width: 150px;
        height: 150px;
        grid-area: image;
    }

    .item_title {
        grid-area: title;
        font-size: 1.5rem;
        color: var(--main-text-color);
        font-weight: 500;
    }

    .item_total {
        grid-area: total;
        white-space: nowrap;
        font-size: 1.5rem;
        font-weight: 500;
    }

    .item_delete {
        display: flex;
        grid-area: delete;
        gap: 1rem;
    }

    .item_counter {
        grid-area: counter;
        display: flex;
        justify-self: end;
        border: 1px solid var(--main-border-color);
    }

    .item_counter button {
        border: 0;
        background: var(--transparent-color);
        font-size: 0.9rem;
        width: 40px;
        color: var(--main-text-color);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .item_counter button:hover {
        background: var(--gray-hover-color);
    }
    .item_counter input {
        width: 3rem;
        padding: 0.5rem;
        border: 0;
        text-align: center;
        font-size: 1rem;
    }

    .item_img img {
        object-fit: contain;
        width: 100%;
        height: auto;
    }
</style>