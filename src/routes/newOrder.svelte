<script>
    import OrderCart from "../components/Main/Order/OrderCart.svelte";
    import OrderForm from "../components/Main/Order/OrderForm.svelte";
    
    let inputValues = {
        townSearch: '',
        nameValue: '',
        phoneValue: '',
        commentValue: '',
        emailValue: '',
        payChoice: null,
        deliveryChoice: 0
    }
</script>

<svelte:head>
    <title>Оформление заказа</title>    
</svelte:head>


<div class="container">
    <div class="order">
        <OrderForm bind:inputValues={inputValues}/>
        <OrderCart bind:deliveryCost={inputValues.deliveryChoice}/>
    </div>
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