class Model {
    async _getAllItems () {
        const resolve = await fetch('http://localhost:3000/api/jsondata');
        const result = await resolve.json();
        const data = result.map((cat) => {
            return {
                id: cat.id,
                catName: cat.catName,
                catImg: cat.catImg,
                category: cat.category ? cat.category.map(item => {
                    return {
                        id: item.id,
                        brand: item.brand,
                        name: item.name,
                        title: item.title,
                        body: item.body,
                        price: parseFloat(item.price.replace(/\s/g,'')),
                        imgSet: item.imgSet,
                        favorite: item.favorite,
                        isActive: item.isActive,
                        attributes: item.attributes
                    }
                }) : []
            }
        });
        return data;
    }

    async getCategoryItem(id) {
        const resolve = await this._getAllItems(id);
        const result = await resolve[id];
        return result;
    }

    async sortByPrice(val, id) {
        let arr = await this.getCategoryItem(id);

        if(!val) return arr;
        if(val === "price_desc") arr.category = arr.category.sort((a, b) => a.price - b.price);
        if(val === "price_asc") arr.category = arr.category.sort((a, b) => b.price - a.price);
        return arr;
    }

    async filterByBrands(id, arr) {
        let temp = await this.getCategoryItem(id);
        let sortableArray = temp.category.filter(el => !arr.indexOf(el.brand))

        return sortableArray;
    }

    getUniqueNames(arr) {
        return Array.from(new Set(arr));
    }

}

export default Model;