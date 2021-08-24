<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: {id}}
    }
</script>

<script>
    export let id;

    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Model from "../../model/data-service";
    import GoodItemView from "../../components/Main/Good/GoodItemView.svelte";
    import Breadcrumbs from '../../components/Helpers/Breadcrumbs.svelte';
    import Loader from '../../components/Helpers/Loader.svelte';
    import SortSelect from "../../components/Helpers/SortSelect.svelte";
    import Checkbox from "../../components/Helpers/Checkbox.svelte";

    const temp = new Model();
    let title = '';
    let selectedValue;
    let checkBrand = [];

    let staticData = temp.getCurrentCategory(id);

    onMount(async() => {
        const resolve = await temp.getCurrentCategory(id);
        title = resolve.catName;
    });

    $: result = [];
    $: result = temp.getCurrentCategory(id, selectedValue);
    
    // взяли название бренда из чекбокса
    // положили в переменую
    // взяли весь массив элементов
    // отфильтровали соответствено бренду в переменной

    function getBrandsByCheck(val) {
        if(checkBrand.includes(val)) {
            checkBrand = checkBrand.filter(el => el !== val);
        }
        else {
            checkBrand = [...checkBrand, val];
        }

        console.log(checkBrand);
        // перенести в сервис
    }
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main>
    <div class="container">
        
        <div class="category_box">

            {#await staticData then value}
                <Breadcrumbs refaddress={value.catName}/>
                <div class="filters">
                    <SortSelect bind:selected={selectedValue}>
                        <option value="" selected disabled slot="s-head">Сортировка</option>
                        <option value="2">Сначала дешевле</option>
                        <option value="3">Сначала дороже</option>
                    </SortSelect>
                    <ul class="filters_list">
                        {#each temp.getBrandCount(value.category) as item}
                            <li>
                                <Checkbox spanValue={item.brand} checkBrand={() => getBrandsByCheck(item.brand)}/>
                                <span class="counter">{item.count}</span>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/await}
                
            {#await result}
                    <Loader/>
            {:then value}
                {#if value.category}
                    <ul class="items_list" transition:fade>
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
        column-gap: 1rem;
        grid-template-areas: 
            'crumbs crumbs'
            'filter content';
    }

    .filters {
        grid-area: filter;
    }

    .filters_list {
        margin: 15px 0;
    }

    .filters_list li {
        padding: 8px 0;
    }

    .counter {
        color: #ccc;
        margin-left: 5px;
    }
</style>

