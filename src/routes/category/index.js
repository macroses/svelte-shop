import * as collection from '../../data/data.json';

export async function get({params}) {
    // const {index} = params;
    // const result = await collection.get(index);

    const resolve = await fetch('./static/data.json')
    const result = await resolve.json();

    return {
        body: result
    }
}