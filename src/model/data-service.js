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

    async getCategoryItem(id, sortVal, filterCollection, minPrice, maxPrice) {
        const resolve = await this._getAllItems(id);
        const result = await resolve[id];

        if(sortVal) this._sortByPrice(sortVal, result);
        if(filterCollection !== undefined) this._filterByConditions(result, filterCollection);
        // if(minPrice && maxPrice) this._filterByPriceValue(result, minPrice, maxPrice);

        return result;
    }

    _filterByConditions(categoryItems, filtersArr) {
        if(!filtersArr) return categoryItems;

        if(filtersArr.length > 0) {
            categoryItems.category = categoryItems.category.filter(el => 
                el.attributes.some(sub => {
                    return sub.attrVal.some(el => filtersArr.includes(el));
                }));
        }   
        return categoryItems;
    }


    _sortByPrice(val, categoryItems) {
        if (!val) return categoryItems;
        if (val === "price_desc") categoryItems.category = categoryItems.category.sort((a, b) => a.price - b.price);
        if (val === "price_asc") categoryItems.category = categoryItems.category.sort((a, b) => b.price - a.price);
        return categoryItems;
    }

    // _filterByPriceValue(categoryItems, min, max) {
    //     let items = categoryItems.category;
    //     items = items.sort((a, b) => a.price - b.price);
    //     items = items.filter(el => (min <= el.price && el.price <= max));
    //     return items;
    // }

    // извне приходит коллекция категорий, пробегаясь по которой получаем униклаьные элементы
    getFilterList(outerArr, innerArr) {
        innerArr.forEach(cat => {
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