import begin from '@architect/sveltekit-adapter';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: begin()
	}
};

export default config;
