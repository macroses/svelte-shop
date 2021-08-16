<script>
    import '../app.css'
    import Header from '../components/Header/Header.svelte'
</script>

<div class="wrapper">
    <Header/>
    <main>
        <slot></slot>
    </main>
    <footer>footer</footer>
</div>

<style>
    .wrapper {
        max-width: 1220px;
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr auto;
        grid-template-areas: 
            "header"
            "main"
            "footer";

        margin: 0 auto;
        padding: 0 10px;
    }
</style>