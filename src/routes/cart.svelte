<script>
    import { cartCollection } from '../stores/cart';
    import { onMount } from 'svelte';
    import { onlyDigits } from '../presenter/present-service';
    import Model from '../model/data-service';

    const temp = new Model();
    const staticData = temp.getCartCollection($cartCollection);


    // function cartItemRemove(idx) {
    //     $cartCollection.splice(idx, 1);
    //     $cartCollection = $cartCollection;
    // }

    

    $: console.log(staticData)
</script>


<div class="container">
    <div class="title">Корзина</div>
    <div class="cart">
        <div class="cart_area">
            <ul class="cart_list">
                <!-- {#await staticData then value}
                    {#each value as item, idx (item) }
                        {#await item[0] then cartElem}
                            <li class="cart_item">
                                <div class="item_img">
                                    <img src="{cartElem.imgSet[0]}" alt="{cartElem.name}">
                                </div>
                                <a href="/category/{item[1]}/goodItems/{cartElem.id}" class="item_title">{cartElem.name}</a>
                                <div class="item_total">{cartElem.price * item[2]} руб</div>
                                <div class="item_delete">
                                    <div class="item_delete_option">
                                        <span class="material-icons-outlined">
                                            {cartElem.favorite ? "favorite" : "favorite_border"}
                                        </span>
                                        <span class="option_text">в избранное</span>
                                    </div>
                                    <div class="item_delete_option" on:click={() => cartItemRemove(idx)}>
                                        <span class="material-icons-outlined">
                                            delete
                                        </span>
                                        <span class="option_text">удалить</span>
                                    </div>
                                </div>
                                <div class="item_counter">
                                    <button on:click={() => item[2]--}>
                                        <span class="material-icons-outlined">remove</span>
                                    </button>
                                    <input type="text" use:onlyDigits value={item[2] < 1 ? item[2] = 1 : item[2]} >
                                    <button on:click={() => item[2]++}>
                                        <span class="material-icons-outlined">add</span>
                                    </button>
                                </div>
                            </li>
                        {/await}
                    {/each}
                {/await} -->
                <!-- {#each $cartCollection as {categoryId, elem, cartCounter}, idx}
                    <li class="cart_item">
                        <div class="item_img">
                            <img src="{elem.imgSet[0]}" alt="{elem.name}">
                        </div>
                        <a href="/category/{categoryId}/goodItems/{elem.id}" class="item_title">{elem.name}</a>
                        <div class="item_total">{elem.price * cartCounter} руб</div>
                        <div class="item_delete">
                            <div class="item_delete_option">
                                <span class="material-icons-outlined">
                                    {elem.favorite ? "favorite" : "favorite_border"}
                                </span>
                                <span class="option_text">в избранное</span>
                            </div>
                            <div class="item_delete_option" on:click={() => cartItemRemove(idx)}>
                                <span class="material-icons-outlined">
                                    delete
                                </span>
                                <span class="option_text">удалить</span>
                            </div>
                        </div>
                        <div class="item_counter">
                            <button on:click={() => cartCounter--}>
                                <span class="material-icons-outlined">remove</span>
                            </button>
                            <input type="text" use:onlyDigits value={cartCounter < 1 ? cartCounter = 1 : cartCounter} >
                            <button on:click={() => cartCounter++}>
                                <span class="material-icons-outlined">add</span>
                            </button>
                        </div>
                    </li>
                {:else}
                    <li class="empty">Ваша корзина пуста. Перейдите на <a href="/">главную страницу и выберите товар</a>.</li>
                {/each} -->
            </ul>
        </div>
        <div class="cart_controls">2</div>
    </div>
</div>

<style>
    .empty a {
        color: var(--main-theme-color);
    }
    .item_delete_option {
        display: flex;
        white-space: nowrap;
        color: var(--main-descr-color);
        cursor: pointer;
        gap: 0.5rem
    }

    .item_delete_option:hover {
        color: var(--main-theme-color);
    }

    .title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }

    .cart {
        display: grid;
        grid-auto-columns: 6fr 2fr;
        grid-auto-rows: max-content auto;
        grid-template-areas: "items controls" "items controls";
        gap: 2rem 2.5rem;
    }

    .cart_item {
        display: grid;
        grid-auto-columns: 150px min-content auto min-content;
        grid-template-areas: 
            "image title title total"
            "image delete . counter" 
            "image . . .";
        gap: 1rem;
        padding: 1rem 0;
    }

    .cart_item:not(:last-child) {
        border-bottom: 1px solid var(--main-border-color);
    }

    .item_img {
        width: 150px;
        height: 150px;
        grid-area: image;
    }

    .item_title {
        grid-area: title;
        font-size: 1.5rem;
        color: var(--main-text-color);
        font-weight: 500;
    }

    .item_total {
        grid-area: total;
        white-space: nowrap;
        font-size: 1.5rem;
        font-weight: 500;
    }

    .item_delete {
        display: flex;
        grid-area: delete;
        gap: 1rem;
    }

    .item_counter {
        grid-area: counter;

        display: flex;
        justify-self: end;
        border: 1px solid var(--main-border-color);
    }

    .item_counter button {
        border: 0;
        background: var(--transparent-color);
        font-size: 0.9rem;
        width: 40px;
        color: var(--main-text-color);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .item_counter button:hover {
        background: var(--gray-hover-color);
    }
    .item_counter input {
        width: 3rem;
        padding: 0.5rem;
        border: 0;
        text-align: center;
        font-size: 1rem;
    }

    .item_img img {
        object-fit: contain;
        width: 100%;
        height: auto;
    }
</style>