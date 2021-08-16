export default class Model {
    apiBase = 'https://fakestoreapi.com';

    async getResource(url) {
        const resolve = await fetch(`${this.apiBase}${url}`);
        return await resolve.json();
    }

    async getAllItems() {
        const resolve = await this.getResource(`/products/`);
        return resolve.map(this.transformData);
    }

    async getSingleItem(id) {
        const item = await this.getResource(`/products/${id}`);
        return this.transformData(item)
    }

    transformData(product) {
        return {
            id: product.id,
            name: product.title,
            about: product.description,
            category: product.category,
            price: product.price,
            img: product.image,
            isActive: false
        }
    }

    // model crud
    addElem() {}

    removeElem() {}

    filterElements() {}

    sortElements() {}
}