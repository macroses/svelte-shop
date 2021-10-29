<script>
    import { fade } from 'svelte/transition';
    import { get } from '../../../routes/api/townsData';
    import OrderRadio from './OrderRadio.svelte';
    import OrderInputText from './OrderInputText.svelte';
    import { goto } from '$app/navigation';
    import { orderStore } from '../../../stores/cart';

    export let inputValues = {
        townSearch: '',
        nameValue: '',
        phoneValue: '',
        commentValue: '',
        emailValue: '',
        payChoice: null,
        deliveryChoice: 0,
        sum: 0
    }

    $: $orderStore = inputValues;

    let townInputFocus = false;
    let input;

    $: townSearchResult = get(inputValues.townSearch);

    function clearAndFocus() {
        inputValues.townSearch = "";
        input.focus();
    }

    const handleSubmit = () => {
        goto(`/completeOrder`);
    }
</script>

<div class="order_form">
    <div class="title">Оформление заказа</div>
    <form on:submit|preventDefault={handleSubmit}>
        <div class="order_form_item">
            <div class="item_title">Контактные данные</div>
            <div class="item_block">
                <OrderInputText 
                    idVal="names" 
                    pholder="введите ФИО контактного лица" 
                    bind:inpVal={inputValues.nameValue}>
                        <span slot=label>ФИО<span class="star">*</span></span>
                </OrderInputText>
            </div>
            <div class="item_block">
                <OrderInputText 
                    pattern={true}
                    idVal="phone"
                    bind:inpVal={inputValues.phoneValue}>
                        <span slot=label>Телефон<span class="star">*</span></span>
                </OrderInputText>
            </div>
            <div class="item_title">Доставка</div>
            <div class="item_block">
                <label for="names">
                    Населенный пункт<span class="star">*</span>
                </label>
                <input type="text" id="names" bind:value={inputValues.townSearch}
                    bind:this={input} 
                    on:focus={() => townInputFocus = true}
                    on:blur={() => townInputFocus = false}
                    required>
                {#if inputValues.townSearch}
                    <span class="material-icons-outlined clear" on:click={() => clearAndFocus()}>clear</span>
                {/if}
                {#await townSearchResult then value}
                    <ul class="towns_list">
                        {#each value.body as item}
                            {#each item as town, i (i)}
                                {#if townInputFocus }
                                    <li transition:fade on:click={() => inputValues.townSearch = town}>{town}</li>
                                {/if}
                            {/each}
                        {/each}
                    </ul>
                {/await}
            </div>

            <div class="item_block">
                <OrderRadio bind:flag={inputValues.deliveryChoice} radioValue={0}>
                    <span slot="value">Самовывоз (на пункте выдачи)</span>
                    <span slot="price">+ 0 руб</span>
                </OrderRadio>
                <OrderRadio bind:flag={inputValues.deliveryChoice} radioValue={300}>
                    <span slot="value">Курьером</span>
                    <span slot="price">+ 300 руб</span>
                </OrderRadio>
            </div>
            <div class="item_block">
                <label for="comment">Комментарии к заказу</label>
                <textarea id="comment" bind:value={inputValues.commentValue}></textarea>
            </div>

            <div class="item_title">Покупатель</div>
            <div class="item_block">
                <OrderInputText 
                    idVal="mail"
                    pholder="email адрес"
                    bind:inpVal={ inputValues.emailValue }>
                        <span slot=label>Email<span class="star">*</span></span>
                </OrderInputText>
            </div>

            <div class="item_title">Способ оплаты<span class="star">*</span></div>
            <div class="item_block">
                <OrderRadio bind:flag={inputValues.payChoice} radioValue={1}>
                    <span slot="value">Наличными курьеру</span>
                </OrderRadio>
                <OrderRadio bind:flag={inputValues.payChoice} radioValue={2}>
                    <span slot="value">Банковский перевод</span>
                </OrderRadio>
            </div>
        </div>
        <button class="confirm_order">Подтвердить заказ</button>
    </form>
</div>

<style>
    .confirm_order {
        background: var(--main-theme-color);
        color: var(--main-bg-color);
        width: 100%;
        border: 0;
        text-align: center;
        font: 500 1rem var(--font);
        padding: 1rem;
    }

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

    .order_form {
        flex: 1;
        border-right: 1px solid var(--main-border-color);
        padding-right: 1rem;
        color: var(--main-text-color);
    }

    .item_block {
        display: flex;
        flex-direction: column;
        margin-bottom: 2rem;
        position: relative;
    }

    .item_block .clear {
        position: absolute;
        cursor: pointer;
        bottom: 12px;
        right: 10px;
        color: var(--main-text-color);
    }

    .item_block textarea {
        height: 100px;
        resize: vertical;
        border: 1px solid var(--main-border-color);
        padding: 0.5rem;
    }

    .towns_list {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        max-height: 300px;
        overflow: auto;
        background:var(--main-bg-color);
        box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.1);
        border: 1px solid var(--main-border-color);
        border-top: 0;
        z-index: 10;
    }

    .towns_list li {
        padding: 5px 20px;
        cursor: pointer;
        transition: .1s;
    }

    .towns_list li:hover {
        background: var(--main-theme-color);
        color: var(--main-bg-color);
    }

    .item_block input {
        padding: 6px 10px;
        height: 50px;
        border: 1px solid var(--main-border-color);
        font-family: var(--font);
        font-size: 1rem;
        transition: .2s;
    }

    .star {
        color: red;
    }

    @media (max-width: 768px) {
        .order_form {
            padding: 0;
            border-right: 0;
        }
    }
</style>