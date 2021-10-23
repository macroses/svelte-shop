/** @type {import('@sveltejs/kit').Config} */
import begin from '@architect/sveltekit-adapter';
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: begin()
	}
};

export default config;
