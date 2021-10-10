<script>
    export let items = $$props;
    let {categoryId, elem, cartCounter} = items;

    let counter = cartCounter;
</script>

<li class="cart_item">
    <div class="item_img">
        <img src="{elem.imgSet[0]}" alt="{elem.name}">
    </div>
    <a href="/category/{categoryId}/goodItems/{elem.id}" class="item_title">{elem.name}</a>
    <div class="item_total">{elem.price * cartCounter} руб</div>
    <div class="item_delete">
        <div class="item_delete_option" on:click={() => cartItemRemove(idx)}>
            <span class="material-icons-outlined">delete</span>
            <span class="option_text">удалить</span>
        </div>
    </div>
    <div class="item_counter">
        <button 
            on:click={() => cartCounter <= 1 ? cartCounter = 1 : --cartCounter}
            ><span class="material-icons-outlined">remove</span></button>
        <!-- <input type="text" use:onlyDigits bind:value={counter} > -->
        <button on:click={() => cartCounter++}>
            <span class="material-icons-outlined">add</span>
        </button>
    </div>
</li>

<style>
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