import { writable } from 'svelte/store';

export const cartCollection = writable([]);

export const promocodeState = writable(false);