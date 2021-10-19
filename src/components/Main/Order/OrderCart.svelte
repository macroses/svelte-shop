<script>
    import { cartCollection, promocodeState } from '../../../stores/cart';
    import OrderItem from './OrderItem.svelte';

    export let deliveryCost;

    $: sumAllItemsPrice = () => {
        let sum = 0;
        $cartCollection.forEach(el => {
            sum += el.elem.price * el.cartCounter;
        });

        if($promocodeState) {
            return Math.ceil(sum * 0.9);
        }

        return sum;
    };
</script>


<div class="order_cart">
    <ul class="order_list">
        {#each $cartCollection as item}
            <OrderItem {...item} />
        {/each}
    </ul>
    <div class="subtotal">
        <div class="sum">
            <span class="title">Сумма по товарам</span>
            <span class="sum_val">100 руб</span>
        </div>
        <div class="sum">
            <span class="title">Стоимость доставки</span>
            <span class="sum_val">{deliveryCost} руб</span>
        </div>
        {#if $promocodeState}
            <div class="sum">
                <span class="title">Промокод</span>
                <span class="promo">-10 %</span>
            </div>
        {/if}
    </div>
    <div class="total">
        <div class="sum">
            <span class="title">Итого:</span>
            <span class="sum_val">{sumAllItemsPrice()} руб</span>
        </div>
    </div>
</div>

<style>
    .order_cart {
        flex: 1;
        color: var(--main-text-color);
    }

    .order_list {
        margin-top: 1rem;
    }

    .subtotal {
        padding: 1rem 0;
        border-top: 1px solid var(--main-border-color);
        border-bottom: 1px solid var(--main-border-color);
        margin-bottom: 1rem;
    }

    .sum {
        display: flex;
        justify-content: space-between;
    }

    .sum_val {
        font-size: 1.2em;
        font-weight: 600;
    }

    .promo {
        font-size: 1.2em;
        font-weight: 600;
        color: var(--positive-color);
    }

    .total .title {
       font-size: 1.3em;
    }

    .total .sum_val {
        font-size: 1.5em;
    }
</style>