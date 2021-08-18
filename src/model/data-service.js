export default class Model {

    async getAllItems() {
        const resolve = await fetch(`./static/data.json`);
        const result = await resolve.json();
        return result;
    }

}