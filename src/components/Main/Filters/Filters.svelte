<script>
    import SortSelect from "../../Helpers/SortSelect.svelte";
    import Checkbox from "../../Helpers/Checkbox.svelte";
    import Model from '../../../model/data-service';

    export let selectedValue;
    export let allData = $$props;
    export let filterCollection = [];

    let uniq = [];
    allData.category.forEach((el) => uniq.push(el.brand));
    

    function checkBrands(val) {
        if(filterCollection.includes(val)) {
            filterCollection = filterCollection.filter(el => el !== val);
        }
        else {
            filterCollection = [...filterCollection, val];
        }
        return filterCollection;
    }

</script>

<div class="filters">
    <SortSelect bind:selected={selectedValue}>
        <option value="" selected disabled slot="s-head">Сортировка</option>
        <option value="price_desc">Сначала дешевле</option>
        <option value="price_asc">Сначала дороже</option>
    </SortSelect>
    <ul class="filters_list">
        {#each Array.from(new Set(uniq)) as item}
            <li>
                <Checkbox spanValue={item} checkBrand={() => checkBrands(item)}/>
            </li>
        {/each}
    </ul>

</div>

<style>
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