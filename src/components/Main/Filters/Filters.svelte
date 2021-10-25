<script>
	import { fade } from "svelte/transition";
	import SortSelect from '../../Helpers/SortSelect.svelte';
	import Model from '../../../model/data-service';
	import FilterCollection from './FilterCollection.svelte';
	import FilterByPrice from './FilterByPrice.svelte';

	export let selectedValue;
	export let allData = $$props;
    export let filterCollection;
	export let toggleFilters = false;
	export let values;

	export let exportedActive;
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

<div class="filters" class:toggleFilters={toggleFilters === true}>
	<span class="close material-icons-outlined" on:click={() => toggleFilters = !toggleFilters}>close</span>
	<SortSelect bind:selected={selectedValue}>
		<option value="" selected disabled slot="s-head">Сортировка</option>
		<option value="price_desc">Сначала дешевле</option>
		<option value="price_asc">Сначала дороже</option>
	</SortSelect>
	<FilterByPrice {...allData} bind:changePrice bind:values/>
	{#each attributes as itemAttr}
		<FilterCollection {...itemAttr} bind:filterCollection bind:exportedActive/>
	{/each}
	{#if showResetButton}
		<button class="clear" on:click={handleResetFilters} transition:fade={{duration: 200}}>очистить</button>
		<button class="show_results" on:click={() => toggleFilters = !toggleFilters}>Показать результаты </button>
	{/if}
</div>

<style>
	.clear {
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

	:hover {
		background: var(--main-hover-color);
	}

	.filters {
		background: var(--main-bg-color);
	}

	.close {
		display: none;
	}

	.show_results {
		display: none;;
	}

	@media (max-width: 768px) {
		.filters {
			position: fixed;
			z-index: 100;
			width: 400px;
			max-width: 100%;
			bottom: 0;
			top: 0;
			left: 0;
			padding: 3rem 1.25rem 1.5rem 1.25rem;
			transform: translate(-200%);
			overflow-y: auto;
			box-shadow: 5px 0px 20px 1px rgba(0,0,0,.3);
			transition: .2s;
		}

		.toggleFilters {
			transform: translate(0);
		}

		.close {
			display: initial;
			position: absolute;
			right: 1.25rem;
			top: 0.5rem;
			font-size: 2rem;
		}

		.clear {
			position: absolute;
			top: 1rem;
			bottom: unset;
			padding: 0;
			width: auto;
			background: var(--main-bg-color);
			color: var(--main-theme-color);
			border: 0;
		}

		.show_results {
			display: initial;
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
		}
	}
</style>