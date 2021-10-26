<script>
    import { favoriteCollection } from '../../stores/favoriteStore';
    import { cartCollection } from '../../stores/cart';
    import { createEventDispatcher } from 'svelte';


    let themeIcon = 'light_mode';
    const dispatch = createEventDispatcher();
    
    function handleChange() {
        themeIcon === 'light_mode' ? themeIcon = "dark_mode" : themeIcon = 'light_mode';
        dispatch('changeTheme');
    }

    $: cartCollectionCounter = () => {
        let sum;
        if($cartCollection.length > 0) {
            sum = $cartCollection.reduce((acc, el) => acc + parseFloat(el.cartCounter), 0);
        }
        return sum;
    }
</script>

<div class="options">
    <div class="theme">
        <div class="control">
            <div class="icon_container">
                <span class="material-icons-outlined option_icon"
                    on:click={handleChange}>{themeIcon}</span>
            </div>
        </div>
    </div>
    <div class="profile">
        <a href="/profile" class="control">
            <div class="icon_container">
                <span class="material-icons-outlined option_icon">face</span>
            </div>
        </a>
    </div>
    <div class="favorite">
        <a href="/favorite" class="control">
            <div class="icon_container">
                <span class="material-icons-outlined option_icon">favorite_border</span>
                {#if $favoriteCollection.length}
                    <span class="counter">{$favoriteCollection.length}</span>
                {/if}
            </div>
        </a>
    </div>
    <div class="cart">
        <a href="/cart" class="control">
            <div class="icon_container">
                <span class="material-icons-outlined option_icon">shopping_cart</span>
                {#if $cartCollection.length}
                    <span class="counter">{cartCollectionCounter()}</span>
                {/if}
            </div>
        </a>
    </div>
</div>

<style>

    .option_icon {
        font-size: 26px;
    }

    .icon_container {
        position: relative;
    }
    .counter {
        background: var(--main-theme-color);
        color: var(--main-bg-color);
        font-size: 0.6rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 14px;
        height: 14px;
        padding: 0 3px;

        position: absolute;
        top: 50%;
        right: 0;
    }

    .options {
        display: flex;
        grid-area: controls;
        height: 100%;
    }

    .control {
        display: flex;
        align-items: center;
        color: var(--main-text-color);
        height: 100%;
        position: relative;
        cursor: pointer;
    }

    .favorite, .cart, .profile {
        margin-left: 1.25rem;
    }

    @media (max-width: 992px) {
        .options {
            margin-right: 0.5rem;
        }
    }
    
</style>