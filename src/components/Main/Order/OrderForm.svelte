<script>
    import { formatByPattern } from '../../../presenter/present-service';
    import { fade } from 'svelte/transition';
    import { get } from '../../../routes/api/townsData';

    let townInputFocus = false;

    let inputValues = {
        townSearch: '',
        nameValue: '',
        phoneValue: ''
    }

    $: townSearchResult = get(inputValues.townSearch);
    let delivery = 0;
</script>

<div class="order_form">
    <div class="title">Оформление заказа</div>
    <form action="post">
        <div class="order_form_item">
            <div class="item_title">Контактные данные</div>
            <div class="item_block">
                <label for="names">
                    ФИО<span class="star">*</span>
                </label>
                <input type="text" id="names" placeholder="введите ФИО контактного лица" value={inputValues.nameValue}>
                {#if inputValues.nameValue}
                    <span class="material-icons-outlined clear" on:click={() => inputValues.nameValue = ""}>clear</span>
                {/if}
            </div>
            <div class="item_block">
                <label for="phone">
                    Телефон<span class="star">*</span>
                </label>
                <div class="phone_wrap">
                    <span>+7</span>
                    <input type="text" id="phone" use:formatByPattern={'(***) ***-**-**'} value={inputValues.phoneValue}>
                </div>
            </div>
            <div class="item_title">Доставка</div>
            <div class="item_block">
                <label for="names">
                    Населенный пункт<span class="star">*</span>
                </label>
                <input type="text" id="names" bind:value={inputValues.townSearch} 
                    on:focus={() => townInputFocus = true}
                    on:blur={() => townInputFocus = false}>
                {#if inputValues.townSearch}
                    <span class="material-icons-outlined clear" on:click={() => inputValues.townSearch = ""}>clear</span>
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

            <div class="item_block delivery">
                <label>
                    <input type="radio" bind:group={delivery} value={0}>
                    <span class="radio_content">
                        <span class="value">Самовывоз (на пункте выдачи)</span>
                        <span class="price">+ 0 руб</span>
                    </span>
                </label>
                <label>
                    <input type="radio" bind:group={delivery} value={300}>
                    <span class="radio_content">
                        <span class="value">Курьером</span>
                        <span class="price">+ 300 руб</span>
                    </span>
                </label>
            </div>
        </div>
    </form>
</div>

<style>
    .delivery input {
        visibility: hidden;
        position: absolute;
    }

    .delivery label {
        cursor: pointer;
        padding: 1rem;
        border: 1px solid var(--main-border-color);
        transition: .2s;
        margin-bottom: 0.5rem;
    }

    .delivery label:hover {
        background: var(--filter-bg-color);
    }

    .delivery .radio_content {
        position: relative;
        padding-left: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.3rem;
    }

    .delivery .radio_content:before {
        content: '';
        position: absolute;
        left: 0;
        top: 6px;
        width: 18px;
        height: 18px;
        border: 1px solid #ccc;
        border-radius: 50%;
        background: #fff;
    }

    .delivery .radio_content:after {
        content: '';
        background: rgba(255,255,255,0);
        position: absolute;
        left: 4px;
        top: 10px;
        width: 11px;
        height: 11px;
        border-radius: 50px;
    }

    .delivery input:checked + .radio_content:after {
        background: var(--main-theme-color);
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