<script>
	import { authStore } from '../stores/auth';

	let username = '';
	let password = '';
	let email = '';
	function handleSubmit() {
		$authStore = { username };
	}
</script>

<div>
	<h1>Sign In</h1>
	<pre>{JSON.stringify($authStore, null, 2)}</pre>
	<form on:submit|preventDefault={handleSubmit}>
		<label>
			Username:
			<input type="text" bind:value={username} placeholder="your username" />
		</label>
		<label>
			Password:
			<input type="password" bind:value={password} />
		</label>
		<label>
			Email:
			<input type="email" bind:value={email} />
		</label>
		<button type="submit">Submit</button>
	</form>
</div>
