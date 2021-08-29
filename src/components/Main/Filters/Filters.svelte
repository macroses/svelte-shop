<script>
    import SortSelect from "../../Helpers/SortSelect.svelte";
    import Checkbox from "../../Helpers/Checkbox.svelte";

    export let selectedValue;
    export let allData = $$props;
    export let filterCollection = [];


    // из категории забираем бренды, имена атрибутов и их значения
    // создаем массив объектов
    // в каждом объекте будет поле с уникальным именем и поле с коллекцией 
    // уникальных значений атрибутов
//
    let brands = [];
    let prices = [];
    let attrNames = [];
    let attrArray = [];
    let titles = ['Бренды', "Цены", "Прочее"];
    
    allData.category.forEach(el => {
        // prices.push(el.price);
        brands.push(el.brand);
        
        el.attributes.forEach(attr => {
            attrNames.push(attr.attrName)
        })
    })

    let collectData = [[...brands], [...prices], [...attrNames]];
    
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
        <option value="price_desc">Сначала дешевле</option>
        <option value="price_asc">Сначала дороже</option>
    </SortSelect>
    
    {#each collectData as collectDataItem}
        <ul class="filters_list">
            {#each Array.from(new Set(collectDataItem)) as item}
                <li>
                    <!-- <Checkbox spanValue={item} checkBrand={() => checkBrands(item)}/> -->
                    {item}
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