<script>
    import {cartCollection} from '../stores/cart';
    import { formatByPattern } from '../presenter/present-service';
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { get } from './api/townsData';

    let townSearch = '';
    let townInputFocus = false;
    let townValue = "";
    $: townSearchResult = get(townSearch);

    let input;

    
</script>

<svelte:head>
    <title>Оформление заказа</title>    
</svelte:head>


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
                    <div class="item_title">Доставка</div>
                    <div class="item_block">
                        <label for="names">
                            Населенный пункт<span class="star">*</span>
                        </label>
                        <input type="text" id="names" bind:value={townSearch} 
                            bind:this={input}
                            on:focus={() => townInputFocus = true}
                            on:blur={() => townInputFocus = false}>
                        {#if townSearch}
                            <span class="material-icons-outlined clear" on:click={() => townSearch = ""}>clear</span>
                        {/if}
                        {#await townSearchResult then value}
                            <ul class="towns_list">
                                {#each value.body as item}
                                    {#each item as town, i (i)}
                                        {#if townSearch !== "" && townSearchResult.length === 0}
                                            <li>ничего не найдено</li>
                                        {:else}
                                            <li transition:fade on:click={() => townSearch = town}>{town}</li>
                                        {/if}
                                    {/each}
                                {/each}
                            </ul>
                        {/await}
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