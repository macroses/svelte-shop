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

    async getCategoryItem(id, sortVal, filterCollection, prices) {
        const resolve = await this._getAllItems(id);
        const result = await resolve[id];

        if(sortVal) this._sortByPrice(sortVal, result);
        if(filterCollection !== undefined) this._filterByConditions(result, filterCollection);
        if(prices) this._filterByPriceValue(result, prices);

        return result;
    }

    async getSingleItem(categoryId, itemId) {
        const resolve = await this.getCategoryItem(categoryId);
        return resolve.category[itemId-1];
    }

    async searchResults(inputText) {
        const resolve = await this._getAllItems();
        let goodsNames = [];
        resolve.forEach(cat => {
            cat.category.forEach(el => {
                goodsNames.push(el);
            })
        })

        goodsNames = goodsNames.filter(el => el.name.toLowerCase().includes(inputText.toLowerCase()));
        return goodsNames;
    }

    _filterByPriceValue(categoryItem, pricesArr) {
        categoryItem.category = categoryItem.category.filter(el => {
            return el.price >= pricesArr[0] && el.price <= pricesArr[1];
        });

        return categoryItem;
    }

    getMinPrice(prices) {
        return Math.min(...prices.category.map((a) => a.price));
    }

    getMaxPrice(prices) {
        return Math.max(...prices.category.map((a) => a.price));
    }

    _filterByConditions(categoryItems, filtersArr) {
        if(!filtersArr) return categoryItems;
        function getQuery(filtersArr) {
            let descriptions = [];
            for(let key in filtersArr) {
                if(filtersArr[key] === undefined && filtersArr[key] === []) continue;
                descriptions.push(product => product.attributes.some(a => a.attrName === key && filtersArr[key].every(v => a.attrVal.includes(v))));
            }
            return product => descriptions.every(b => b(product));
        }
        
        let query = getQuery(filtersArr); 

        categoryItems.category = categoryItems.category.filter(b => query(b));
        return categoryItems;
    }

    _sortByPrice(val, categoryItems) {
        if (!val) return categoryItems;
        if (val === "price_desc") categoryItems.category = categoryItems.category.sort((a, b) => a.price - b.price);
        if (val === "price_asc") categoryItems.category = categoryItems.category.sort((a, b) => b.price - a.price);
        return categoryItems;
    }

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

    fillFiltersParameters(arr, val, name) {
        if(arr[name] == undefined) arr[name] = [];       

        if(arr[name].includes(val)) {
            arr[name] = arr[name].filter(el => el != val);
        } 
        else {
            arr[name].push(val);
        }

        return arr;
	}

    getInitialCheckboxesState(filterCollection, attrName, attrValue) {
        return filterCollection[attrName] === undefined 
            ? false 
            : filterCollection[attrName].includes(attrValue);
    }
}

export default Model; 