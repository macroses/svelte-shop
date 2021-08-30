<script>
    import SortSelect from "../../Helpers/SortSelect.svelte";
    import Checkbox from "../../Helpers/Checkbox.svelte";

    export let id;
    export let selectedValue;
    export let allData = $$props;
    export let filterCollection = [];

    let temp = [];

    allData.category.forEach(cat => {
        cat.attributes.forEach(attrEl =>  {
            attrEl.attrVal.forEach(attrElVal => {
                const key = attrEl.attrName;
                                
                if(temp[key] == undefined)
                temp[key] = [];
                
                if(!temp[key].includes(attrElVal)) {
                    temp[key].push(attrElVal);
                }
            })
        })
    });

    let attributes = Object.entries(temp);
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
                    <Checkbox spanValue={itemVal} checkBrand={() => checkBrands(itemVal)}/>
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

    .counter {
        color: #ccc;
        margin-left: 5px;
    }
</style>