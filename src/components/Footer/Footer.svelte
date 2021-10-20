<footer>
    <div class="container">
        <div class="footer_layout">
            <div class="footer_aside">
                <div class="footer_logo">
                    <a href="."><img src="/logo.svg" alt=""></a>
                </div>
                <div class="contacts">
                    <div class="footer_contacts">
                        <a href="tel:+78008008080" class="phone_value">+7(800)800-80-80</a>
                        <div class="phone_info">справочная служба</div>
                    </div>
                    <div class="footer_contacts">
                        <a href="tel:+78008008080" class="phone_value">+7(800)800-80-80</a>
                        <div class="phone_info">интернет-магазин</div>
                    </div>
                </div>
                <div class="footer_social">
                    <span class="material-icons-outlined">whatsapp</span>
                    <span class="material-icons-outlined">catching_pokemon</span>
                    <span class="material-icons-outlined">reddit</span>
                    <span class="material-icons-outlined">shopify</span>
                    <span class="material-icons-outlined">cast</span>
                </div>
            </div>
            <div class="footer_menu">
                <div class='menu_item'>
                    <div class='menu_title'>О магазине</div>
                    <a class="menu_link" href='.'>Условия обмена и возврата</a>
                    <a class="menu_link" href='.'>Каталог</a>
                    <a class="menu_link" href='.'>О компании</a>
                    <a class="menu_link" href='.'>Контакты</a>
                    <a class="menu_link" href='.'>Доставка</a>
                    <a class="menu_link" href='.'>Оплата</a>
                </div>
                <div class="menu_item">
                    <div class="menu_title">Клиентам</div>
                    <a class="menu_link" href=".">Личный кабинет</a>
                    <a class="menu_link" href=".">Блог</a>
                    <a class="menu_link" href=".">Обратная связь</a>
                </div>
                <div class="menu_item">
                    <div class="menu_title">Информация</div>
                    <a class="menu_link" href=".">Пользовательское соглашение</a>
                    <a class="menu_link" href=".">Политика конфиденциальности и оферта</a>
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
        margin-top: 2rem;
        background: var(--footer-bg-color);
        padding: 2rem 0 0;
    }

    .footer_menu {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
    }

    .menu_item {
        display: grid;
        grid-auto-rows: max-content;
        gap: 0.75rem;
        font-size: 0.9rem;
    }

    .menu_link {
        color: var(--main-text-color);
        transition: .2s;
    }
    
    .menu_link:hover {
        color: var(--main-theme-color);
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

    @media (max-width: 768px) {
        .footer_layout {
            grid-template-columns: auto;
        }

        .footer_aside {
            display: flex;
            flex-wrap: wrap;
            column-gap: 1rem;
        }

        .footer_social {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
        }

        .footer_social span {
            margin-top: 1rem;
        }

        .footer_contacts {
            margin-bottom: 0;
        }

        .footer_logo {
            margin: 0 auto;
        }

        .phone_value {
            font-size: 1rem;
        }

        .contacts {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-left: auto;
        }

        .footer_menu {
            display: none;
        }

        .menu_item {
            gap: 0;
            font-size: 0.7rem;
            width: 26%;
        }
    }
</style>