<script>
    export let refaddress;
</script>

<ul>
    <li><a href="/">Главная</a></li>
    <li>{refaddress}</li>
</ul>

<style>
    ul {
        display: flex;
        padding: 1.5rem 0;
        grid-area: crumbs;
    }

    li {
        margin-right: 30px;
        position: relative;
    }

    li:not(:last-child):after {
        position: absolute;
        right: -20px;
        content: '/';
        color: #ccc;
    }

    a {
        color: var(--main-theme-color);
    }
</style>