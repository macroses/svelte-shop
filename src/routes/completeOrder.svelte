<script>
	import { orderStore, cartCollection, promocodeState } from '../stores/cart';
	import { afterUpdate } from 'svelte';

	let orderCollection = $cartCollection;

	afterUpdate(() => {
		$cartCollection = [];
		$promocodeState = false;
	});

	let orderNum = randomOrderNum();
	function randomOrderNum() {
		const min = 1;
		const max = 1000;
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}
</script>

<svelte:head>
	<title>Сведения о заказе</title>
</svelte:head>

<div class="container">
	<div class="order_title">Заказ № {orderNum}</div>
	<div class="descript">Информация о заказе</div>
	<div class="order_info">
		<div class="order_info_item">
			<div class="order_info_title">Сумма и статус</div>
			<div class="order_info_value sum">{$orderStore.sum} руб</div>
			<div class="order_info_status">Принят</div>
			<div class="order_info_status">Не оплачен</div>
		</div>
		<div class="order_info_item">
			<div class="order_info_title">Способ оплаты</div>
			<div class="order_info_value">
				{$orderStore.payChoice === 1 ? 'Наличными курьеру' : 'Банковский перевод'}
			</div>
		</div>
		<div class="order_info_item">
			<div class="order_info_title">Способ доставки</div>
			<div class="order_info_value">
				{$orderStore.deliveryChoice === 0 ? 'Самовывоз (на пункте выдачи)' : 'Курьером'}
			</div>
		</div>
		<div class="order_info_item">
			<div class="order_info_title">Адрес доставки</div>
			<div class="order_info_value">{$orderStore.townSearch}</div>
		</div>
		<div class="order_info_item">
			<div class="order_info_title">Получатель</div>
			<div class="order_info_value">{$orderStore.nameValue + ' ' + $orderStore.phoneValue}</div>
		</div>
		{#if $orderStore.commentValue}
			<div class="order_info_item">
				<div class="order_info_title">Комментарий к заказу</div>
				<div class="order_info_value">{$orderStore.commentValue}</div>
			</div>
		{/if}
	</div>

	<div class="order_title">Состав заказа</div>
	<table class="order_table">
		<thead>
			<tr>
				<td>Наименование</td>
				<td>Кол-во</td>
				<td>Стоимость</td>
			</tr>
		</thead>
		<tbody>
			{#each orderCollection as item}
				<tr>
					<td data-label="Наименование">{item.elem.name}</td>
					<td data-label="Кол-во">{item.cartCounter}</td>
					<td data-label="Стоимость">{item.cartCounter * item.elem.price} руб</td>
				</tr>
			{/each}
			{#if $orderStore.promo}
				<tr>
					<td>Скидка (промокод)</td>
					<td colspan="2">-10%</td>
				</tr>
			{/if}
			<tr>
				<td colspan="3" class="order_sum">Итого: <span class="sum">{$orderStore.sum} руб</span></td
				>
			</tr>
		</tbody>
	</table>
</div>

<style>
	.sum {
		font-weight: bold;
		color: var(--main-text-color)
	}

	.order_sum {
		background: var(--main-bg-color);
	}

	.order_info {
		border-bottom: 1px solid var(--main-border-color);
		border-top: 1px solid var(--main-border-color);
		padding: 1rem 0;
	}

	.order_info_status {
		display: inline-block;
		padding: 0.5rem 1rem;
		border: 1px solid var(--main-border-color);
		margin-left: 1rem;
		color: var(--main-text-color)
	}

	.order_title {
		font-size: 1.5rem;
		font-weight: 500;
		margin: 1rem 0;
		color: var(--main-text-color);
	}

	.descript {
		font-size: 1.2rem;
		font-weight: 500;
		margin: 0.5rem 0;
		padding-bottom: 1rem;
		color: var(--main-text-color)
	}

	.order_info_item {
		display: flex;
		align-items: center;
		padding: 1rem 0;
	}

	.order_info_title {
		color: var(--main-descr-color);
		flex-basis: 200px;
		min-width: 200px;
	}

	.order_table {
		width: 100%;
		border: 1px solid var(--main-border-color);
		border-spacing: 0;
		color: var(--main-text-color);
	}

	.order_table td {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--main-border-color);
	}

	tbody tr:nth-child(odd) {
		background: var(--footer-bg-color);
	}

	thead tr {
		color: var(--main-descr-color);
	}

	td:last-child {
		text-align: right;
	}

	.order_info_value {
		color: var(--main-text-color);
	}

	@media screen and (max-width: 768px) {
		table {
			border: 0;
		}

		table thead {
			border: none;
			clip: rect(0 0 0 0);
			height: 1px;
			margin: -1px;
			overflow: hidden;
			padding: 0;
			position: absolute;
			width: 1px;
		}

		table tr {
			display: block;
			margin-bottom: 0.625em;
		}

		table tr:not(:last-child) {
			border-bottom: 1px solid var(--main-border-color);
		}

		table td {
			border-bottom: 1px solid #ddd;
			display: block;
			font-size: 0.8em;
			text-align: right;
		}

		table td::before {
            content: attr(data-label);
			float: left;
			font-weight: 500;
		}

		table td:last-child {
			border-bottom: 0;
		}

		.order_info_item {
			flex-wrap: wrap;
			padding: 1rem 0.5rem;
		}

		.order_info_item:not(:last-child) {
			border-bottom: 1px solid var(--main-border-color);
		}

		.order_info_item:nth-child(odd) {
			background: var(--main-section-color);
		}

		.order_info_title {
			flex-basis: auto;
			width: 100%;
			text-align: center;
		}

		.order_title {
			margin: 0;
		}

		.descript {
			margin: 0;
			padding-bottom: 0.5rem;
		}

		.order_info_status {
			padding: 0 0.2rem;
		}

		
	}
</style>
