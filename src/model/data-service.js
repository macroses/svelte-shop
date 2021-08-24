class Model {

    async getAllItems () {
        const resolve = await fetch('http://localhost:3000/api/jsondata');
        const result = await resolve.json();
        return result;
    }

    async getCurrentCategory(id, costRange) {
        const resolve = await this.getAllItems();
        const result = await resolve;

        this._getSortedItems(result, costRange, id);

        return result[id - 1];
    }

    _getSortedItems(arr, val, id) {
        if(!val) {
            return arr[id - 1];
        }
        if(val === "2") {
            arr[id-1].category = arr[id-1].category.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
        if(val === "3") {
            arr[id-1].category = arr[id-1].category.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        return arr[id-1];
    }

    getBrandCount(array) {
        const res = [];
        array.forEach(el => {
            const index = res.findIndex(item => {
                return item['brand'] === el.brand;
            });

            if(index === -1) {
                res.push({
                    'brand': el.brand,
                    "count": 1
                })
            }
            else {
                res[index]["count"]++;
            }
        });
        return res;
    }
}

export default Model;