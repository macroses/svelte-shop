<script>
	import SortSelect from '../../Helpers/SortSelect.svelte';
	import Model from '../../../model/data-service';
	import FilterCollection from './FilterCollection.svelte';
	import FilterByPrice from './FilterByPrice.svelte';

	export let selectedValue;
	export let allData = $$props;
    export let filterCollection = [];
	export let min
	export let max
	export let values;

	let filledArr = [];
	const temp = new Model();
	const attributes = temp.getFilterList(filledArr, allData.category);

	$: console.log(filterCollection)
</script>

<div class="filters">
	<SortSelect bind:selected={selectedValue}>
		<option value="" selected disabled slot="s-head">Сортировка</option>
		<option value="price_desc">Сначала дешевле</option>
		<option value="price_asc">Сначала дороже</option>
	</SortSelect>
	<FilterByPrice bind:values bind:min bind:max {...allData}/>
	{#each attributes as itemAttr}
		<FilterCollection {...itemAttr} bind:filterCollection/>
	{/each}
</div>