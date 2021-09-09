<script>
	import { fade } from "svelte/transition";
	import SortSelect from '../../Helpers/SortSelect.svelte';
	import Model from '../../../model/data-service';
	import FilterCollection from './FilterCollection.svelte';
	import FilterByPrice from './FilterByPrice.svelte';

	export let selectedValue;
	export let allData = $$props;
    export let filterCollection;

	let exportedActive;
	let showResetButton = false;
	let changePrice;

	let filledArr = [];
	const temp = new Model();
	let attributes = temp.getFilterList(filledArr, allData.category);

	function handleResetFilters() {
		for(let key in filterCollection) {
			if(filterCollection[key] !== undefined) {
				filterCollection = [];
			}
		}
		selectedValue = "";
		exportedActive = false;
		changePrice = false;
	}

	$: selectedValue 
		|| Object.keys(filterCollection).length !== 0 
		|| changePrice
			? showResetButton = true
			: showResetButton = false;
</script>

<div class="filters">
	<SortSelect bind:selected={selectedValue}>
		<option value="" selected disabled slot="s-head">Сортировка</option>
		<option value="price_desc">Сначала дешевле</option>
		<option value="price_asc">Сначала дороже</option>
	</SortSelect>
	<FilterByPrice {...allData} bind:changePrice/>
	{#each attributes as itemAttr}
		<FilterCollection {...itemAttr} bind:filterCollection bind:exportedActive/>
	{/each}
	{#if showResetButton}
		<button on:click={handleResetFilters} transition:fade={{duration: 200}}>очистить</button>
	{/if}
</div>

<style>
	button {
		position: sticky;
		bottom: 0;
		width: 100%;
		background: var(--main-theme-color);
		border: 1px solid var(--main-theme-color);
		color: var(--main-bg-color);
		font: 600 0.75rem var(--font);
		text-transform: uppercase;
		padding: 17px;
		cursor: pointer;
		transition: .2s;
	}

	button:hover {
		background: var(--main-hover-color);
	}

	@media (max-width: 768px) {
		.filters {
			display: none;
		}
	}
</style>