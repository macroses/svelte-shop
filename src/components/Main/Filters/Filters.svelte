<script>
    import SortSelect from "../../Helpers/SortSelect.svelte";
    import Checkbox from "../../Helpers/Checkbox.svelte";
    import Model from '../../../model/data-service';

    export let selectedValue;
    export let allData = $$props;

    let filledArr = [];
    const temp = new Model();
    const attributes = temp.getFilterList(filledArr, allData.category)

    
</script>

<div class="filters">
    <SortSelect bind:selected={selectedValue}>
        <option value="" selected disabled slot="s-head">Сортировка</option>
        <option value="price_desc">Сначала дешевле</option>
        <option value="price_asc">Сначала дороже</option>
    </SortSelect>

    {#each attributes as itemAttr}
        <h4>{itemAttr[0]}</h4>
        <ul class=filters_list>
            {#each itemAttr[1] as itemVal}
                <li>
                    <Checkbox spanValue={itemVal} />
                </li>
            {/each}
        </ul>
    {/each}

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
</style>