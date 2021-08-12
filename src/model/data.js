class MainData {
    constructor() {
        this.collections = [];
        this.getSource();
    }

    async getSource() {
        const url = 'http://jsonplaceholder.typicode.com/posts';
        const resolve = await fetch(url);
        this.collections = await resolve.json();
    }
}


export default MainData;