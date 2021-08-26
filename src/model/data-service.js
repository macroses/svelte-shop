class Model {
    async getAllItems () {
        const resolve = await fetch('http://localhost:3000/api/jsondata');
        const result = await resolve.json();
        return result;
    }
    async getCurrentCategory(id, costRange, attributesCollection) {
        const resolve = await this.getAllItems();
        const result = await resolve;

        this._sortByPrice(result, costRange, id);
        this._sortByBrand(result, attributesCollection, id);

        return result[id];
    }

    _sortByPrice(arr, val, id) {
        const sortableArray = arr[id];

        if(!val) return sortableArray;
        
        if(val === "2") sortableArray.category = sortableArray.category.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        
        if(val === "3") sortableArray.category = sortableArray.category.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

        return sortableArray;
    }

    _sortByBrand(arr, attributesFromView, id) {
        let sortableArray = arr[id];
        if(!attributesFromView) return sortableArray;

        if(attributesFromView.length > 0) {
            sortableArray.category = sortableArray.category.filter(el => attributesFromView.includes(el.brand));
        }   
        
        return sortableArray;
    }
    
    // вывод уникальных брендов и их количества
    getBrandCount(array) {
        const res = [];
        array.forEach(el => {
            const index = res.findIndex(item => {
                return item['brand'] === el.brand;
            });

            index === -1 ? res.push({'brand': el.brand, 'count': 1}) : res[index]['count']++;
        });
        return res;
    }
}

export default Model;