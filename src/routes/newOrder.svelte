<script>
    import OrderForm from "../components/Main/Order/OrderForm.svelte";

    
</script>

<svelte:head>
    <title>Оформление заказа</title>    
</svelte:head>


<div class="container">
    <div class="order">
        <OrderForm />
        <div class="order_cart"></div>
    </div>
</div>

<style>
    .order {
        display: flex;
        gap: 1rem;
    }

    .order_cart {
        flex: 1;
    }
</style>