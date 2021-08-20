<div class="loader-box">
    <div class="loader loader-8" />
</div>


<style>
    .loader-box {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        left: 0;
        top: 0;
    }

	.loader {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin: 3em;
		display: inline-block;
		position: relative;
		vertical-align: middle;
	}
	.loader,
	.loader:before,
	.loader:after {
		animation: 1s infinite ease-in-out;
	}
	.loader:before,
	.loader:after {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.loader-8:before,
	.loader-8:after {
		content: '';
		background-color: var(--main-theme-color);
		transform: scale(0);
		animation: loader8 1.5s infinite ease-in-out;
	}
	.loader-8:after {
		animation-delay: 0.75s;
	}

	@keyframes loader8 {
		0% {
			transform: translateX(-100%) scale(0);
		}
		50% {
			transform: translateX(0%) scale(1);
		}
		100% {
			transform: translateX(100%) scale(0);
		}
	}
</style>
