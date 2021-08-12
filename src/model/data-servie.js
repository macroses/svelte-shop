export default class Model {
    apiBase = 'http://jsonplaceholder.typicode.com';

    async getResource(url) {
        const resolve = await fetch(`${this.apiBase}${url}`);
        return await resolve.json();
    }

    static async getAllItems() {
        const resolve = await this.getResource(`/posts/`);
        return resolve.map(this.transformData);
    }

    static async getSingleItem(id) {
        const item = await this.getResource(`/posts/${id}`);
        return this.transformData(item)
    }

    transformData(post) {
        return {
            id: post.id,
            name: post.title,
            about: post.body
        }
    }

    // model crud
    addElem() {}

    removeElem() {}

    filterElements() {}

    sortElements() {}
}