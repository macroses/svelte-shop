<script>
    import HeaderCatalog from "./HeaderСatalog.svelte";
    import HeaderOptions from "./HeaderOptions.svelte";
    import HeaderSearch from "./HeaderSearch.svelte";
</script>

<header>
    <div class="container">
        <div class="header_content">
            <a href="/" class="logo"><img src="logo.svg" alt=""></a>
            <HeaderCatalog/>
            <HeaderSearch/>
            <HeaderOptions/>
        </div>
    </div>
</header>

<style>
    header {
        border-bottom: 1px solid var(--main-border-color);
        box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.1);
    }

    .header_content {
        display: grid;
        grid-template-areas: 'logo catalog search controls';
        grid-template-columns: 80px max-content 1fr max-content;
        column-gap: 2rem;
        align-items: center;
        padding: 1rem 0;
    }

    .logo {
        grid-area: logo;
    }

    @media (max-width: 992px) {
        .header_content {
            grid-template-columns: 40px max-content 1fr max-content;
            grid-template-areas: 
            'logo logo logo logo logo logo controls' 
            'catalog search search search search search search';
            column-gap: 1rem;
        }
    }
</style>