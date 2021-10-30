<script>
	import { createEventDispatcher} from 'svelte';
    import { fade } from 'svelte/transition';
	import Button from '../Helpers/Button.svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal;

	const handle_keydown = (e) => {
		if (e.key === 'Escape') {
			close();
			return;
		}
	};

</script>

<svelte:window on:keydown={handle_keydown} />

<div class="modal-background" on:click={close} transition:fade="{{duration: 100 }}">
	<div class="modal" role="dialog" aria-modal="true" bind:this={modal} transition:fade="{{duration: 200 }}">
		<slot name="header" />
		<slot />
		<div class="close_btn">
			<Button on:click={close}>Закрыть</Button>
		</div>
	</div>
</div>



<style>
	.close_btn {
		margin-top: 0.5rem;
	}
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
        z-index: 1000;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal {
		padding: 1em;
		border-radius: 0.2em;
		background: var(--main-bg-color);
        z-index: 1001;
	}
</style>
