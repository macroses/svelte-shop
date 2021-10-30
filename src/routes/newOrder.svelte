<script>
    import OrderCart from "../components/Main/Order/OrderCart.svelte";
    import OrderForm from "../components/Main/Order/OrderForm.svelte";
    import { cartCollection, promocodeState } from '../stores/cart';
    
    let inputValues = {
        townSearch: '',
        nameValue: '',
        phoneValue: '',
        commentValue: '',
        emailValue: '',
        payChoice: 1,
        deliveryChoice: 0,
        sum: 0,
        promo: $promocodeState
    }

</script>

<svelte:head>
    <title>Оформление заказа</title>    
</svelte:head>

<div class="container">
    {#if $cartCollection.length > 0}
        <div class="order">
            <OrderForm bind:inputValues={inputValues}/>
            <OrderCart bind:deliveryCost={inputValues.deliveryChoice}/>
        </div>
    {:else}
        <div class="title">Нечего оформлять, сначала необходимо наполнить корзину товарами.</div>
    {/if}
</div>

<style>
    .order {
        display: flex;
        gap: 1rem;
    }

    @media (max-width: 768px) {
        .order {
            flex-direction: column;
        }
    }
</style>