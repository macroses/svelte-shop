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
}

export default Model;