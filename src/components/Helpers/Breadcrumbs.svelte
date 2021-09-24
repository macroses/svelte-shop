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
        overflow: auto;
    }

    li {
        margin-right: 30px;
        position: relative;
        white-space: nowrap;
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

    @media (max-width: 768px) {
        ul {
            padding: 0 0 1rem;
        }
    }
</style>