<script>
    import HeaderCatalog from "./HeaderСatalog.svelte";
    import HeaderOptions from "./HeaderOptions.svelte";
    import HeaderSearch from "./HeaderSearch.svelte";
    import Modal from "../Modal/Modal.svelte";
    import CategoryList from '../Main/CategoryList.svelte';

    let showModal = false;
    let y;
</script>

<svelte:window bind:scrollY={y}/>

<header>
    <div class="container">
        <div class="header_content">
            <a href="/" class="logo">
                <img src="/logo.svg" alt="">
            </a>
            <HeaderCatalog modalToggle={() => showModal = true}/>
            <HeaderSearch/>
            <HeaderOptions on:changeTheme/>
        </div>
    </div>
</header>

{#if showModal}
    <Modal on:close="{() => showModal = false}">
        <h3 name="header">Каталог категорий</h3>
        <div class="category_container"  on:click={() => showModal = false}>
            <CategoryList/>
        </div>
    </Modal>
{/if}


<style>
    header {
        border-bottom: 1px solid var(--main-border-color);
        box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.1);
        background: var(--main-section-color);
    }

    h3 {
        margin-bottom: 1rem;
        color: var(--main-text-color);
    }


    .header_content {
        display: grid;
        grid-template-areas: 'logo catalog search controls';
        grid-template-columns: 80px max-content 1fr max-content;
        column-gap: 2rem;
        align-items: center;
        padding: 1rem 0;
        transition: .2s;
    }

    .logo {
        grid-area: logo;
        height: 30px;
    }

    .logo img {
        filter: drop-shadow(0px 0px 1px #fff)
    }

    @media (max-width: 992px) {
        .header_content {
            grid-template-columns: 40px max-content 1fr max-content;
            grid-template-areas: 
            'logo logo logo logo logo logo controls' 
            'catalog search search search search search search';
            column-gap: 1rem;
            row-gap: 0.5rem;
        }
    }

    @media (max-width: 768px) {
        .header_content {
            padding: 0.5rem 0;
            
        }

        header {
            box-shadow: none;
            border: 0;
        }
    }
</style>