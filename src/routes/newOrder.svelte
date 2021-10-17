<script>
    import {cartCollection} from '../stores/cart';
    import { formatByPattern, getTowns } from '../presenter/present-service';

    const towns = getTowns();

    $: console.log(towns);
</script>

<div class="container">
    <div class="order">
        <div class="order_form">
            <div class="title">Оформление заказа</div>

            <form action="post">
                <div class="order_form_item">
                    <div class="item_title">Контактные данные</div>
                    <div class="item_block">
                        <label for="names">
                            ФИО<span class="star">*</span>
                        </label>
                        <input type="text" id="names" placeholder="введите ФИО контактного лица">
                    </div>
                    <div class="item_block">
                        <label for="phone">
                            Телефон<span class="star">*</span>
                        </label>
                        <div class="phone_wrap">
                            <span>+7</span>
                            <input type="text" id="phone" use:formatByPattern={'(***) ***-**-**'}>
                        </div>
                        
                    </div>
                </div>
            </form>
        </div>
        <div class="order_cart"></div>
    </div>
</div>

<style>
    .title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }

    .item_title {
        font-size: 1.2rem;
        font-weight: 500;
        margin: 0.5rem 0;
    }

    .order {
        display: flex;
        gap: 1rem;
    }

    .order_form {
        flex: 1;
    }

    .order_cart {
        flex: 1;
    }

    .item_block {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
    }

    .item_block input {
        padding: 6px 10px;
        height: 50px;
        border: 1px solid var(--main-border-color);
        font-family: var(--font);
        font-size: 1rem;
        transition: .2s;
    }

    .phone_wrap {
        display: flex;
        align-items: center;
    }

    .phone_wrap span {
        margin-right: 5px;
    }

    .phone_wrap input {
        flex: 1;
    }

    .star {
        color: red;
    }

    
</style>