class Model {

    async getAllItems () {
        const resolve = await fetch('http://localhost:3000/api/jsondata');
        const result = await resolve.json();
        return result;
    }

    async getCurrentCategory(id) {
        const resolve = await this.getAllItems();
        const result = await resolve;
        return result[id - 1];
    }

    async sortItems(id) {
        const resolve = await this.getAllItems();
        const result = await resolve;
        // console.log(result[id - 1].category.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
        return result[id - 1].category.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
}

export default Model;