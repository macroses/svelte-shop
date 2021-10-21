<script>
    import { orderStore, cartCollection } from '../stores/cart';
    import { afterUpdate } from 'svelte';

    let orderCollection = $cartCollection;

    afterUpdate(() => {
        $cartCollection = [];
    })

    let orderNum = randomOrderNum();
    function randomOrderNum() {
        const min = 1;
        const max = 1000;
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }



    $: console.log(orderCollection);
</script>

<div class="container">
    <div class="order_title">Заказ № {orderNum}</div>
    <div class="descript">Информация о заказе</div>
    <div class="order_info">
        <div class="order_info_item">
            <div class="order_info_title">Сумма и статус</div>
            <div class="order_info_value sum">{$orderStore.sum} руб</div>
            <div class="order_info_status">Принят</div>
            <div class="order_info_status">Не оплачен</div>
        </div>
        <div class="order_info_item">
            <div class="order_info_title">Получать уведомления в мессенджерах</div>
            <div class="order_info_value">
                <span class="material-icons-outlined soc">whatsapp</span>
                <span class="material-icons-outlined soc">send</span>
            </div>
        </div>
        <div class="order_info_item">
            <div class="order_info_title">Способ оплаты</div>
            <div class="order_info_value">
                {$orderStore.payChoice === 1 ? "Наличными курьеру" : "Банковский перевод"}
            </div>
        </div>
        <div class="order_info_item">
            <div class="order_info_title">Способ доставки</div>
            <div class="order_info_value">
                {$orderStore.deliveryChoice === 0 ? "Самовывоз (на пункте выдачи)" : "Курьером"}
            </div>
        </div>
        <div class="order_info_item">
            <div class="order_info_title">Адрес доставки</div>
            <div class="order_info_value">{$orderStore.townSearch}</div>
        </div>
        <div class="order_info_item">
            <div class="order_info_title">Получатель</div>
            <div class="order_info_value">{$orderStore.nameValue + "" + $orderStore.phoneValue}</div>
        </div>
        <div class="order_info_item">
            <div class="order_info_title">Комментарий к заказу</div>
            <div class="order_info_value">{$orderStore.commentValue}</div>
        </div>
    </div>

    <table class="order_table">
        <thead>
            <tr>
                <td>Наименование</td>
                <td>Кол-во</td>
                <td>Стоимость</td>
            </tr>
        </thead>
        <tbody>
            {#each orderCollection as item}
                <tr>
                    <td>{item.elem.name}</td>
                    <td>{item.cartCounter}</td>
                    <td>{item.cartCounter * item.elem.price}</td>
                </tr>
            {/each}
            <tr>
                <td colspan="3">Итого:</td>
            </tr>
        </tbody>
    </table>
</div>

<style>
    .sum {
        font-weight: bold;
    }

    .order_info {
        border-bottom: 1px solid var(--main-border-color);
        border-top: 1px solid var(--main-border-color);
        padding: 1rem 0;
    }

    .order_info_status {
        display: inline-block;
        padding: 0.5rem 1rem;
        border: 1px solid var(--main-border-color);
        margin-left: 1rem;
    }

    .order_title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }

    .descript {
        font-size: 1.2rem;
        font-weight: 500;
        margin: 0.5rem 0;
        padding-bottom: 1rem;
        
    }

    .order_info_item {
        display: flex;
        align-items: center;
        padding: 1rem 0;
    }

    .order_info_title {
        color: var(--main-descr-color);
        flex-basis: 200px;
    }

    .soc {
        font-size: 40px;
    }
</style>