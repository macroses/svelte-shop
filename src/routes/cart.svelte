<script>
    import { flip } from 'svelte/animate';
    import { onlyDigits } from '../presenter/present-service';
    import { cartCollection, promocodeState } from '../stores/cart';

    function cartItemRemove(idx) {
        $cartCollection.splice(idx, 1);
        $cartCollection = $cartCollection;
    };

    let promoObj = {
        promocode: false,
        promoCodeValidate: false,
        promoValue: ''
    }

    $: cartCollectionCounter = () => {
        let sum;
        if($cartCollection.length > 0) {
            sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);
        }
        return sum;
    };

    function approveCode() {
        promoObj.promoValue === "123" ? $promocodeState = true : $promocodeState = false;

        if(promoObj.promoValue === "123") {
            $promocodeState = true;
        } else {
            $promocodeState = false;
            promoObj.promoCodeValidate = true;
        }
    }

    $: sumAllItemsPrice = () => {
        let sum = 0;
        $cartCollection.forEach(el => {
            sum += el.elem.price * el.cartCounter;
        });

        if($promocodeState) {
            promoObj.promocode = false;
            return Math.ceil(sum * 0.9);
        }

        return sum;
    };

    $: oldSumAllItemsPrice = () => {
        let sum = 0;
        $cartCollection.forEach(el => {
            sum += el.elem.price * el.cartCounter;
        });
        return (sum);
    }
</script>


<div class="container">
    <div class="title">Корзина</div>
    <div class="cart">

        <div class="cart_area">
            <ul class="cart_list">
                {#each $cartCollection as item, idx (item.elem.name)}
                    <li class="cart_item" animate:flip={{duration: 200}}>
                        <div class="item_img">
                            <img src="{item.elem.imgSet[0]}" alt="{item.elem.name}">
                        </div>
                        <a href="/{item.categoryId}/goodItems/{item.elem.id}" class="item_title">{item.elem.name}</a>
                        <div class="item_total">{item.elem.price * item.cartCounter} руб</div>
                        <div class="item_delete">
                            <div class="item_delete_option" on:click={() => cartItemRemove(idx)}>
                                <span class="material-icons-outlined">delete</span>
                                <span class="option_text">удалить</span>
                            </div>
                        </div>
                        <div class="item_counter">
                            <button 
                                on:click={() => item.cartCounter <= 1 ? item.cartCounter = 1 : --item.cartCounter}
                                ><span class="material-icons-outlined">remove</span></button>
                            <input type="text" use:onlyDigits bind:value={item.cartCounter} >
                            <button on:click={() => item.cartCounter++}>
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
                        <div class="title">В корзине {cartCollectionCounter()} шт.</div>
                        {#if promoObj.promocode}
                            <form class="promocode_form" on:submit|preventDefault={approveCode(promoObj.promoValue)}>
                                <div class="form_container">
                                    <input type="text" class="promo_inp" placeholder="для теста 123" bind:value={promoObj.promoValue}>
                                    {#if promoObj.promoCodeValidate}
                                        <span class="err">Такого купона не существует</span>
                                    {/if}
                                    <button class="submit_code_btn">
                                        <span class="material-icons-outlined">upload</span>
                                    </button>
                                </div>
                            </form>
                        {/if}
                        {#if !promoObj.promocode && !$promocodeState}
                            <button class="same_as_link"
                                on:click={() => promoObj.promocode = !promoObj.promocode}
                                >{promoObj.promocode ? "активировать промокод" : "введите промокод"}
                            </button>
                        {/if}
                        {#if $promocodeState}
                            <div class="approved">Промокод активирован
                                <span class="material-icons-outlined">done</span>
                            </div>
                            <span class="old_price">
                                <span class="material-icons-outlined">local_offer</span>
                                (10%): 
                                <span class="val">
                                    { oldSumAllItemsPrice() }
                                </span>
                            </span>
                        {/if}
                        <div class="sum_all_items">
                            <span>итого:</span>
                            <span class="val">{ sumAllItemsPrice() } руб</span>
                        </div>
                    </div>
                    <div class="make_order">
                        <a href="/newOrder">Оформить заказ</a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .old_price {
        color: var(--main-descr-color);
        display: flex;
        align-items: center;
    }
    .old_price .val {
        text-decoration: line-through;
        margin-left: 0.5rem;
    }

    .old_price .material-icons-outlined {
        font-size: 1rem;
        margin-right: 0.5rem;
        color: var(--main-theme-color);
    }

    .approved {
        display: flex;
        align-items: center;
        color: var(--positive-color)
    }

    .form_container {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
    }

    .err {
        position: absolute;
        bottom: 100%;
        left: 0;
        color: red;
        font-size: 0.8rem;
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
    .make_order a{
        background: var(--main-theme-color);
        color: var(--main-bg-color);
        width: 100%;
        border: 0;
        text-align: center;
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
            /* font-size: 1rem; */
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

    @media (max-width: 768px) {
        .cart_item {
            grid-auto-columns: 100px min-content auto min-content;
            grid-template-areas: 
                "image title title title"
                "image delete delete delete" 
                "counter counter total total";
        }
    }
</style>