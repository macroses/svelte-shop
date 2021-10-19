<script>
    export let item = $$props;
</script>

<li class="order_item">
    <div class="item_img">
        <img src={item.elem.imgSet[0]} alt="">
    </div>
    <div class="item_name">{item.elem.name}</div>
    <div class="item_price">
        <span class="counter">{item.cartCounter}</span>
        x
        <span class="price">{item.elem.price} руб</span>
    </div>
</li>

<style>
     .order_item {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }

    .item_img {
        flex: 0 1 100px;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .item_img img {
        max-width: 100%;
        width: 56%;
        height: auto;
    }

    .item_name {
        padding: 0 1rem;
        flex: 1 1 180px;
    }

    .price {
        font-size: 1.3em;
        font-weight: 600;
    }
</style>