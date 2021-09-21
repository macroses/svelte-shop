<script>
    export let price;
</script>

<span class="product_price_cur">
    {(price).toLocaleString('ru')}
    <span class="currency">RUB</span>
</span>

<style>
    .currency {
        font-size: 1rem;
    }

    .product_price_cur {
        font-size: 2.3rem;
        font-weight: 500;
        padding: 1rem;
    }
</style>