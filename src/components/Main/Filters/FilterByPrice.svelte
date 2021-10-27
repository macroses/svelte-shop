<script>
    import RangeSlider from "svelte-range-slider-pips";
    import Model from '../../../model/data-service';

    export let allData = $$props;
	export let changePrice = false;
    const temp = new Model();

    let min = temp.getMinPrice(allData);
	let max = temp.getMaxPrice(allData);
	export let values = [
		temp.getMinPrice(allData),
		temp.getMaxPrice(allData)
	];

	$: if(!changePrice) values = [temp.getMinPrice(allData), temp.getMaxPrice(allData)];
</script>

<div class="unique_title">
	<span class="val">Цена</span>
</div>
<div class="filter_price_container">
	<div class="filter_by_price">
		<div class="price_item">от {values[0]}</div>
		<div class="price_item">до {values[1]}</div>
	</div>
	<RangeSlider range bind:min bind:max bind:values on:change={() => changePrice = true}/>
</div>

<style>
	.unique_title {
        font-weight: 600;
        padding: 1rem;
        transition: .2s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }

	.filter_by_price {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.price_item {
		display: inline-block;
		color: var(--main-text-color);
	}

	.val {
		color: var(--main-text-color);
	}

	:global(.rangeSlider) {
		margin: 1rem 0.5rem 3rem;
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