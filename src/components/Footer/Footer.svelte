<footer>
    <div class="container">
        <div class="footer_layout">
            <div class="footer_aside">
                <div class="footer_logo">
                    <a href="."><img src="/logo.svg" alt=""></a>
                </div>
                <div class="footer_contacts">
                    <a href="tel:+78008008080" class="phone_value">+7(800)800-80-80</a>
                    <div class="phone_info">справочная служба</div>
                </div>
                <div class="footer_contacts">
                    <a href="tel:+78008008080" class="phone_value">+7(800)800-80-80</a>
                    <div class="phone_info">интернет-магазин</div>
                </div>
                <div class="footer_social">
                    <span class="material-icons-two-tone">whatsapp</span>
                    <span class="material-icons-two-tone">catching_pokemon</span>
                    <span class="material-icons-two-tone">reddit</span>
                    <span class="material-icons-two-tone">shopify</span>
                    <span class="material-icons-two-tone">cast</span>
                </div>
            </div>
            <div class="footer_menu">
                <div class='menu_item'>
                    <div class='menu_title'>О магазине</div>
                    <a href='.'>Условия обмена и возврата</a>
                    <a href='.'>Каталог</a>
                    <a href='.'>О компании</a>
                    <a href='.'>Контакты</a>
                    <a href='.'>Доставка</a>
                    <a href='.'>Оплата</a>
                </div>
            </div>
        </div>
    </div>
    <div class='footer_about'>
        <div class='container'>Создано мучительно долго, но увлекательно.</div>
    </div>
</footer>


<style>
    footer {
        background: var(--footer-bg-color);
        padding: 2rem 0 0;
    }

    .menu_item {
        display: grid;
        grid-auto-rows: max-content;
        gap: 0.75rem;
        font-size: 0.9rem;
    }

    .menu_title {
        margin-bottom: 0.5rem;
        font-weight: 500;
        font-size: 0.9rem;
    }

    .footer_about {
        font-size: 11px;
        background: var(--main-descr-color);
        padding: 0.5rem 0;
        margin-top: 1rem;
    }

    .footer_layout {
        display: grid;
        grid-template-columns: 400px auto;
    }

    .footer_logo {
        max-width: 150px;
        margin-bottom: 2rem;
    }

    .footer_logo img {
        width: 100%;
    }

    .phone_value {
        color: var(--main-text-color);
        font-size: 1.3rem;
        font-weight: 500;
    }

    .phone_info {
        font-size: 0.9rem;
        font-weight: 300;
    }

    .footer_contacts {
        margin-bottom: 1rem;
    }

    .footer_social span{
        font-size: 30px;
        margin-right: 0.5rem;
        margin-top: 2rem;
    }
</style>