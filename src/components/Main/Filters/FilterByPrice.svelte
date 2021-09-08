<script>
    import RangeSlider from "svelte-range-slider-pips";
    import Model from '../../../model/data-service';

    export let allData = $$props;
    const temp = new Model();

    let min = temp.getMinPrice(allData);
	let max = temp.getMaxPrice(allData);

	export let values = [
		temp.getMinPrice(allData),
		temp.getMaxPrice(allData)
	];
</script>

<div class="unique_title">
	<span class="val">Цена</span>
</div>
<div class="filter_price_container">
	<div class="filter_by_price">
		<div class="price_item">
			<input type="text" class="inp_price" bind:value={values[0]} placeholder={`от ${min}`}>
		</div>
		<div class="price_item">
			<input type="text" class="inp_price" bind:value={values[1]} placeholder={`до ${max}`}>
		</div>
	</div>
	<RangeSlider float range bind:min bind:max bind:values/>
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