<script context="module">
    export async function load(ctx) {
        let id = ctx.page.params.id;
        return { props: {id}}
    }
</script>

<script>
    export let id;

    import Model from "../../model/data-service";

    const temp = new Model();
    const result = temp.getCurrentCategory(id);
</script>

<main>
    <div class="container">

        {#await result}
            <p>load...</p>
        {:then value}
            <a href="/">Главная</a>
            <span>{value.catName}</span>

            <ul class="items_list">
                {#each value.category as item (item.id)}
                    <li>
                        <a href="/" class="item_link_img">
                            <div class="picture">
                                <img src="{item.imgSet[0]}" alt="">
                            </div>
                            <span class="item_name">{item.name}</span>
                        </a>
                        <div class="bottom">
                            <div class="price">{item.price} руб</div>
                            <button>
                                <span class="material-icons-two-tone">shopping_cart</span>
                            </button>
                        </div>
                    </li>
                {/each}
            </ul>
        {/await}
    </div>
</main>

<style>
    .items_list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 30px 20px;
    }

    .items_list li {
        
    }

    .picture {
        display: flex;
        width: 100%;
        margin-bottom: 1.2rem;
    }

    .picture img {
        max-width: 80%;
    }

    .price {
        font-size: 1.3rem;
        font-weight: normal;
        font-weight: 500;
    }

    .item_link_img {
        grid-area: photo;
    }

    .item_link {
        grid-area: title;
        font-size: 1rem;
        color: var(--main-text-color);
        transition: .2s;
    }

    .item_link:hover {
        color: var(--main-theme-color);
    }
</style>

