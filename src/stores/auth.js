import { writable } from 'svelte/store';

let cookieData = document.cookie;
let keysCollection = [];

function splitUserData() {
    if(cookieData) {
        keysCollection = [...cookieData.split(';')];
        keysCollection = keysCollection.map(el => {
            return el.split('=')[0];
        })
    }
}

splitUserData();

export const authStore = writable(keysCollection);