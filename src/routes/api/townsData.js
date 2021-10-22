export async function get(searchVal) {
    const resolve = await fetch(`https://api.hh.ru/areas/113`);
    const result = await resolve.json();

    let data = result.areas.map(areas => {
        return areas.areas.map(town => town.name);
    });

    let searchString = searchVal.toLowerCase();

    data = data.flat(Infinity).map(el => {
        const regexp = (/\(.+\)/);
        return el.replace(regexp, '')
    }); 

    data = data.filter(el => 
        el.toLowerCase().includes(searchString) && searchString !== "" && searchString.length > 1);
    return {
        body: [
            data
        ]
    }
}