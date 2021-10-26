<script>
    export let modalToggle;
</script>

<div class="catalog" on:click={modalToggle}>
    <span class="material-icons-outlined">menu</span>
    <span class="text">Каталог</span>
</div>

<style>
    .catalog {
        grid-area: catalog;

        background: var(--main-theme-color);
        color: var(--main-text-color);
        transition: var(--transition-timing);
        cursor: pointer;
        font-size: 1.125rem;
        padding: 12px 24px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .catalog span {
        margin-right: 1.5rem;
        color: #fff;
    }

    .catalog:hover {
        background: var(--main-hover-color);
    }

    @media (max-width: 992px) {
        .text {
            display: none;
        }
        .catalog span {
            color: #fff;
            margin: 0;
        }
    }
</style>