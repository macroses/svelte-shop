<script>
	import Checkbox from '../../Helpers/Checkbox.svelte';
	import Model from '../../../model/data-service';

	export let allData = $$props;
    export let filterCollection = [];

	let filledArr = [];
	const temp = new Model();
	const attributes = temp.getFilterList(filledArr, allData.category);
</script>

<div class="unique_title">{itemAttr[0]}</div>
<ul class="filters_list">
    {#each itemAttr[1] as itemVal}
        <li>
            <Checkbox 
                spanValue={itemVal} 
                checkBrand={() => filterCollection = temp.getFiltersCondition(filterCollection, itemVal)} 
            />
        </li>
    {/each}
</ul>
<style>
    .unique_title {
        font-weight: 600;
    }
    .unique_title::first-letter {
        text-transform: uppercase;
    }

	.filters_list {
		margin: 15px 0;
	}

	.filters_list li {
		padding: 8px 0;
	}
</style>
