import { writable } from 'svelte/store';
import { browser } from '$app/env';

// const storedTheme = localStorage.getItem('theme');
export const theme = writable(browser && localStorage.getItem('theme'));

theme.subscribe(value => {
    browser && localStorage.setItem('theme', value === "dark" ? "dark" : "light");
});