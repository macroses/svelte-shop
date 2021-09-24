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

<div class="modal-background" on:click={close} transition:fade="{{duration: 100 }}"/>

<div class="modal" role="dialog" aria-modal="true" bind:this={modal} transition:fade="{{duration: 200 }}">
	<slot name="header" />
	<slot />
	<div class="close_btn">
		<Button on:click={close}>Закрыть</Button>
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
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 1200px;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%, -50%);
		padding: 1em;
		border-radius: 0.2em;
		background: white;
        z-index: 1001;
	}
</style>
