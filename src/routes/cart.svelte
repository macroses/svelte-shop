<script>
    import { cartCollection } from '../stores/cart';
    import {slide, fly} from 'svelte/transition';
    import { onlyDigits } from '../presenter/present-service';
    import {paginate, LightPaginationNav} from '../components/Main/Pagination';

    let promocode = false;

    let currentPage = 1;
    let pageSize = 3;
    let items = [];
    let promoValue = '';

    $: items = $cartCollection;

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
        return sum;
    };

    function activatePromocode() {
        promocode = false;
    }

    $: paginatedItems = paginate({items, pageSize, currentPage})
</script>


<div class="container">
    <div class="title">Корзина</div>
    <div class="cart">
        <div class="cart_area">
            <ul class="cart_list">
                {#each paginatedItems as {categoryId, elem, cartCounter}, idx (idx)}
                    <li class="cart_item">
                        <div class="item_img">
                            <img src="{elem.imgSet[0]}" alt="{elem.name}">
                        </div>
                        <a href="/{categoryId}/goodItems/{elem.id}" class="item_title">{elem.name}</a>
                        <div class="item_total">{elem.price * cartCounter} руб</div>
                        <div class="item_delete">
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
            {#if items.length > pageSize}
                <LightPaginationNav
                    totalItems="{items.length}"
                    pageSize="{pageSize}"
                    currentPage="{currentPage}"
                    limit="{1}"
                    showStepOptions="{true}"
                    on:setPage="{(e) => currentPage = e.detail.page}"
                />
            {/if}
        </div>
        <div class="cart_controls_box">
            {#if $cartCollection.length > 0}
                <div class="controls_wrap">
                    <div class="cart_controls">
                        <div class="title">В корзине {cartCollectionCounter()} шт.</div>
                        {#if promocode}
                            <form class="promocode_form" on:submit|preventDefault={activatePromocode}>
                                <div transition:slide class="form_container">
                                    <input type="text" class="promo_inp" placeholder="для теста 123" value={promoValue}>
                                    <button class="submit_code_btn">
                                        <span class="material-icons-outlined">upload</span>
                                    </button>
                                </div>
                            </form>
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
    .form_container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .submit_code_btn {
        background: var(--main-theme-color);
        color: var(--main-bg-color);
        border: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.3rem 1rem;
    }
    .promo_inp {
        flex-grow: 1;
        padding: 6px 10px;
        height: 50px;
        border: 1px solid var(--main-border-color);
        border-right: none;
        box-shadow: none;
        font-family: var(--font);
        font-size: 1rem;
        width: auto;
        transition: .2s;
    }
    
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

    @media (max-width: 992px) {
        .cart {
            grid-template-areas: "items" "controls";
        }
        
        .item_title {
            font-size: 1rem;
            font-weight: normal;
        }

        .item_total {
            font-size: 1rem;
        }

        .cart_item {
            grid-auto-columns: 100px min-content auto min-content;
            grid-template-areas: 
                "image title title total"
                "image delete . counter" 
                "image . . .";
        }

        .item_img {
            width: 100px;
            height: 100px;
            grid-area: image;
        }
    }
</style>