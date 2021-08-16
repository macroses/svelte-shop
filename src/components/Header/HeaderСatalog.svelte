<div class="catalog">
    <span class="material-icons-two-tone">menu</span>
    <span class="text">Каталог</span>
</div>

<style>
    .catalog {
        grid-area: catalog;

        background: var(--main-theme-color);
        color: #fff;
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