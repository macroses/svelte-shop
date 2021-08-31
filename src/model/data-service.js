class Model {
    async _getAllItems() {
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
                        price: parseFloat(item.price.replace(/\s/g, '')),
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

    async sortByPrice(val, id, filterCollection) {
        let arr = await this.getCategoryItem(id);

        // if (!val) return arr;
        if (val === "price_desc") arr.category = arr.category.sort((a, b) => a.price - b.price);
        if (val === "price_asc") arr.category = arr.category.sort((a, b) => b.price - a.price);

        return arr;
    }

    // извне приходит коллекция категорий, пробегаясь по которой получаем униклаьные элементы
    getFilterList(outerArr, innerArr) {
        innerArr.forEach(cat => {
            const key = "Бренды";
            if (outerArr[key] == undefined) outerArr[key] = [];
            if (!outerArr[key].includes(cat.brand)) outerArr[key].push(cat.brand);

            cat.attributes.forEach(attrEl => {
                attrEl.attrVal.forEach(attrElVal => {
                    const key = attrEl.attrName;
                    if (outerArr[key] == undefined) outerArr[key] = [];
                    if (!outerArr[key].includes(attrElVal)) outerArr[key].push(attrElVal);
                })
            })
        });

        return Object.entries(outerArr);
    }

    getFiltersCondition(arr, val) {
		arr.includes(val) ? arr = arr.filter(el => el !== val) : arr = [...arr, val];
        return arr;
	}
}

export default Model;