<script>
    export let counter;
</script>

{#if counter === 0}
	<button class="to_cart_btn" on:click={() => counter++}>
		в корзину
		<span class="material-icons-outlined">shopping_cart</span>
	</button>
{:else}
	<div class="cart_control">
		<button on:click={() => counter--}>
			<span class="material-icons-outlined">remove</span>
		</button>
		<a href="/cart">
			<span class="items_counter">В корзине {counter} шт</span>
			<span>Перейти</span>
		</a>
		<button on:click={() => counter++}>
			<span class="material-icons-outlined">add</span>
		</button>
	</div>
{/if}

<style>
	.cart_control {
        display: flex;
        border-top: 1px solid var(--main-border-color);
    }

    .cart_control a {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.8rem;
        color: var(--main-text-color);
    }

    .cart_control a:hover {
        background: #f5f5f5;
    }

    .items_counter {
        color: var(--main-theme-color);
    }

    .cart_control button {
        border: 0;
        background: var(--transparent-color);
        font-size: 0.9rem;
        width: 40px;

    }

    .cart_control button:hover {
        background: var(--gray-hover-color);
    }
    
    .to_cart_btn {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: var(--main-theme-color);
        border: 0;
        padding: 0.5rem;
        font-family: var(--font);
        font-size: 1rem;
    }

    .to_cart_btn:hover {
        background: var(--main-hover-color);
    }

    .to_cart_btn span {
        color: accent-color;
        margin-left: 0.5rem;
    }
</style>
