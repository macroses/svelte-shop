<script>
    import SortSelect from "../../Helpers/SortSelect.svelte";
    // import Checkbox from "../../Helpers/Checkbox.svelte";

    export let selectedValue;
    // export let allData = $$props;
    // export let filterCollection = [];

    // function checkBrands(val) {
    //     if(filterCollection.includes(val)) {
    //         filterCollection = filterCollection.filter(el => el !== val);
    //     }
    //     else {
    //         filterCollection = [...filterCollection, val];
    //     }
    //     return filterCollection;
    // }

</script>

<div class="filters">
    <SortSelect bind:selected={selectedValue}>
        <option value="" selected disabled slot="s-head">Сортировка</option>
        <option value="2">Сначала дешевле</option>
        <option value="3">Сначала дороже</option>
    </SortSelect>

    <!-- {#each allData.category as itemCategory (itemCategory.id)}
        {#each itemCategory.attributes as item}
            <h4>{item.attrName}</h4>
        {/each}
    {/each} -->
    <!-- <ul class="filters_list">
        {#each temp.getBrandCount(allData.category) as item}
            <li>
                <Checkbox spanValue={item.brand} checkBrand={() => checkBrands(item.brand)}/>
                <span class="counter">{item.count}</span>
            </li>
        {/each}
    </ul> -->
    <!-- {#each allData.category as item}
        {#each item.attributes as item}
            <p>{item.attrName}</p>
        {/each}
    {/each} -->
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