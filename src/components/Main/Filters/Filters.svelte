<script>
    import SortSelect from "../../Helpers/SortSelect.svelte";
    import Checkbox from "../../Helpers/Checkbox.svelte";
    import Model from '../../../model/data-service';

    export let selectedValue;
    export let allData = $$props;
    export let brandsCollection = [];

    function checkBrands(val) {
        if(brandsCollection.includes(val)) {
            brandsCollection = brandsCollection.filter(el => el !== val);
        }
        else {
            brandsCollection = [...brandsCollection, val];
        }
        return brandsCollection;
    }

    const temp = new Model();
</script>

<div class="filters">
    <SortSelect bind:selected={selectedValue}>
        <option value="" selected disabled slot="s-head">Сортировка</option>
        <option value="2">Сначала дешевле</option>
        <option value="3">Сначала дороже</option>
    </SortSelect>
    <ul class="filters_list">
        {#each temp.getBrandCount(allData.category) as item}
            <li>
                <Checkbox spanValue={item.brand} checkBrand={() => checkBrands(item.brand)}/>
                <span class="counter">{item.count}</span>
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