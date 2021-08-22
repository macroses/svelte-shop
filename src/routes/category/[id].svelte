<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: {id}}
    }
</script>

<script>
    export let id;

    import Model from "../../model/data-service";
    import GoodItemView from "../../components/Main/Good/GoodItemView.svelte";
    import Breadcrumbs from '../../components/Helpers/Breadcrumbs.svelte';
    import Loader from '../../components/Helpers/Loader.svelte';

    const temp = new Model();
    const result = temp.getCurrentCategory(id);
    let active = false;

    function handleToggle() {
        active = !active;
    }

</script>

<svelte:head>
    <title></title>
</svelte:head>

<main>
    <div class="container">
        
        <div class="category_box">

            {#await result}
                <Loader/>
            {:then value}
                <Breadcrumbs refaddress={value.catName}/>
                {#if value.category}
                    <div class="filters">
                        <div class="sort" on:click={handleToggle} >
                            сортировка
                            <span class="material-icons-two-tone">import_export</span>
                            {#if active}
                                <ul class="sort_positions">
                                    <li>сначала дешевле</li>
                                    <li>сначала дороже</li>
                                </ul>
                            {/if}
                        </div>
                    </div>
                    <ul class="items_list">
                        {#each value.category as item (item.id)}
                            <GoodItemView {...item}/>    
                        {/each}
                    </ul>
                {:else}
                    <div class="empty_catalog">По вашему запросу ничего не найдено</div>
                {/if}
            {/await}

        </div>
    </div>
</main>


<style>
    .empty_catalog {
        font-size: 1.5rem;
        font-weight: 500;
        min-width: max-content;
    }
    .items_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 30px 50px;
        grid-area: content;
    }

    .category_box {
        display: grid;
        grid-template-columns: minmax(200px, 300px) 1fr;
        grid-template-rows: auto 1fr;
        grid-template-areas: 
            'crumbs crumbs'
            'filter content';
    }

    .filters {
        grid-area: filter;
    }

    .sort {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
    }

    .sort_positions {
        position: absolute;
        left: 0;
        top: 100%;
        background: #fff;
        box-shadow: 4px 4px 11px 2px rgba(0,0,0,.1);
    }

    .sort_positions li{
        padding: 3px 10px;
        transition: .2s;
    }

    .sort_positions li:hover {
        background: var(--main-theme-color);
        color: #fff;
    }
</style>

