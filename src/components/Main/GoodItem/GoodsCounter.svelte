<script>
    import { cartCollection } from '../../../stores/cart';

    export let categoryId; 
    export let item = $$props;

    $: counter = 0;
    if(counter < 1) counter = 1;

    function pushToCart(operation) {
        const cartElem = {
            categoryId: categoryId,
            elem: item,
            cartCounter: counter+1
        }

        const elemIndex = $cartCollection.findIndex(el => el.elem.name == item.name);
        if(operation === "plus") {
            if(elemIndex >= 0) {
                return ($cartCollection[elemIndex].cartCounter += 1);
            }
            $cartCollection = [...$cartCollection, cartElem];
        }

        if(operation === "minus") {
            $cartCollection[elemIndex].cartCounter -= 1
            if($cartCollection[elemIndex].cartCounter < 1) {
                $cartCollection = $cartCollection.filter(el => el.elem.name !== item.name);
                counter = 0;
            }
        }
    }

    $: $cartCollection.forEach(el => {
        if(el.elem.name == item.name) {
            counter = el.cartCounter;
        }
    });
</script>

{#if counter === 0}
    <button class="to_cart_btn" on:click={() => pushToCart('plus')}>
		<span class="text">в корзину</span>
		<span class="material-icons-outlined">shopping_cart</span>
	</button>
{:else}
	<div class="cart_control">
		<button on:click={() => pushToCart('minus')}>
			<span class="material-icons-outlined">remove</span>
		</button>
		<a href="/cart">
			<span class="items_counter">В корзине {counter} шт</span>
			<span>Перейти</span>
		</a>
		<button on:click={() => pushToCart('plus')}>
			<span class="material-icons-outlined">add</span>
		</button>
	</div>
{/if}

<style>
	.cart_control {
        display: flex;
        border-top: 1px solid var(--main-border-color);
        background: var(--main-section-color);
    }

    .cart_control button {
        color: var(--main-text-color);
        
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
        background: var(--main-bg-color);
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
        background: var(--main-bg-color);
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

    @media (max-width: 768px) {
        .text {
            display: none;   
        }

        .to_cart_btn span {
            margin-left: 0;
        }

        .cart_control a {
            padding: 0 0.5rem;
        }
    }
</style>
