<script>
    import '../app.css'
    import Header from '../components/Header/Header.svelte';
    import Footer from '../components/Footer/Footer.svelte';
</script>

<div class="wrapper">
    <Header/>
    <main><slot></slot></main>
    <Footer/>
</div>

<style>
    .wrapper {
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr auto;
        grid-template-areas: 
            "header"
            "main"
            "footer";

        margin: 0 auto;
    }
</style>