<script>
	import SortSelect from '../../Helpers/SortSelect.svelte';
	import Model from '../../../model/data-service';
	import FilterCollection from './FilterCollection.svelte';
	import FilterByPrice from './FilterByPrice.svelte';

	export let selectedValue;
	export let allData = $$props;
    export let filterCollection;
	export let min
	export let max
	export let values;

	let filledArr = [];
	const temp = new Model();
	const attributes = temp.getFilterList(filledArr, allData.category);

	$: filterCollection = [];

	function handleResetFilters() {
		for(let key in filterCollection) {
			if(filterCollection[key] !== undefined) {
				filterCollection = [];
			}
		}
	}

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
	<button on:click={handleResetFilters}>очистить</button>
</div>

<style>
	button {
		position: sticky;
		bottom: 0;
		width: 100%;
		background: var(--main-bg-color);
		border: 1px solid var(--main-theme-color);
		color: var(--main-theme-color);
		font: 600 0.75rem var(--font);
		text-transform: uppercase;
		padding: 17px;
		cursor: pointer;
		transition: .2s;
	}

	button:hover {
		background: var(--main-theme-color);
		color: var(--main-bg-color);
	}
</style>