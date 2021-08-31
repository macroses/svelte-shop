<script>
	import SortSelect from '../../Helpers/SortSelect.svelte';
	import Checkbox from '../../Helpers/Checkbox.svelte';
	import Model from '../../../model/data-service';

	export let selectedValue;
	export let allData = $$props;
    export let filterCollection = [];

	let filledArr = [];
	const temp = new Model();
	const attributes = temp.getFilterList(filledArr, allData.category);
</script>

<div class="filters">
	<SortSelect bind:selected={selectedValue}>
		<option value="" selected disabled slot="s-head">Сортировка</option>
		<option value="price_desc">Сначала дешевле</option>
		<option value="price_asc">Сначала дороже</option>
	</SortSelect>
	{#each attributes as itemAttr}
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
	{/each}
</div>

<style>
    .unique_title {
        font-weight: 600;
    }
    .unique_title::first-letter {
        text-transform: uppercase;
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
</style>
