<script>
	import SortSelect from '../../Helpers/SortSelect.svelte';
	import Model from '../../../model/data-service';
	import FilterCollection from './FilterCollection.svelte';
	import RangeSlider from "svelte-range-slider-pips";

	export let selectedValue;
	export let allData = $$props;
    export let filterCollection = [];

	let filledArr = [];
	const temp = new Model();
	// prices
	let min = temp.getMinPrice(allData)
	let max = temp.getMaxPrice(allData)
	const attributes = temp.getFilterList(filledArr, allData.category);


	export let values = [
		temp.getMinPrice(allData),
		temp.getMaxPrice(allData)
	];
</script>

<div class="filters">
	<SortSelect bind:selected={selectedValue}>
		<option value="" selected disabled slot="s-head">Сортировка</option>
		<option value="price_desc">Сначала дешевле</option>
		<option value="price_asc">Сначала дороже</option>
	</SortSelect>
	<div class="filter_by_price">
		<div class="price_item">
			<input type="text" class="inp_price" bind:value={values[0]}>
		</div>
		<div class="price_item">
			<input type="text" class="inp_price" bind:value={values[1]}>
		</div>
	</div>
	<RangeSlider float range bind:min bind:max bind:values/>
	{#each attributes as itemAttr}
		<FilterCollection {...itemAttr} bind:filterCollection/>
	{/each}
</div>

<style>
	.filter_by_price {
		display: flex;
		width: 100%;
	}

	.price_item {
		width: 50%;
		display: inline-block;
	}

	.inp_price {
		padding: 5px 10px;
		border: 1px solid var(--main-border-color);
		font-family: var(--font);
		max-width: 100%;
	}

	:global(.rangeSlider) {
		margin: 2rem 0.5rem 1rem;
		height: 0.3em;
	}
	:global(.rangeSlider .rangeHandle) {
		width: 1em;
		height: 1em;
		top: 0.13em;
	}

	:global(.rangeSlider.focus .rangeBar) {
		background-color: var(--main-theme-color);
		height: 0.3em;
	}

	:global(.rangeSlider .rangeBar) {
		background-color: var(--main-theme-color);
		height: 0.3em;
	}

	:global(.rangeSlider .rangeHandle.active .rangeNub,
			.rangeSlider .rangeHandle .rangeNub) {
		background-color: var(--main-theme-color);
	}

	:global(.rangeSlider.focus .rangeFloat,
			.rangeSlider .rangeFloat) {
		background: var(--main-theme-color);
		color: #fff;
	}
</style>