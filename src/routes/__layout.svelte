<script>
    import '../app.css'
    import Header from '../components/Header/Header.svelte';
    import Footer from '../components/Footer/Footer.svelte';
    import { theme } from '../stores/theme';

    function handleCHangeTheme() {
        $theme === 'dark' ? theme.set('light') : theme.set('dark');
    }
</script>

<div class="wrapper {$theme === "dark" ? "dark" : "light"}" >
    <Header on:changeTheme={handleCHangeTheme}/>
    <main>
        <slot></slot>
    </main>
    <Footer/>
</div>

<style>
    .wrapper {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: auto 1fr auto;
        grid-template-areas: 
            "header"
            "main"
            "footer";

        margin: 0 auto;
    }

    main {
        background: var(--main-bg-color);
        padding-bottom: 2rem;
    }
</style>