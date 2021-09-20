<script>
    import Model from "../../model/data-service";
    import Loader from "../Helpers/Loader.svelte";

    const temp = new Model();
    const categories = temp._getAllItems();
</script>

<div class="category_list">
    {#await categories}
        <Loader />
    {:then value}
        {#each value as item (item.id)}
            <a href="category/{item.id}" sveltekit:prefetch>
                <span class="material-icons-two-tone">{item.catImg}</span>
                <span class="cat_name_text">{item.catName}</span>
            </a>
        {/each}
    {:catch error}
        {error}
    {/await}
</div>

<style>
    .category_list {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: repeat(3, minmax(200px, 1fr));
        gap: 1rem;
        margin: 15px 0;
        font-size: 16px;
    }
    
    .category_list a {
        background: #f6f6f6;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
    }

    .category_list a:hover .material-icons-two-tone {
        filter: invert(46%) sepia(89%) saturate(6094%) hue-rotate(1deg) brightness(104%) contrast(104%);
        transition: .2s;
    }

    .material-icons-two-tone {
        font-size: 48px;
        text-align: right;
        margin-right: 10px; 
        transition: .2s;
    }

    .cat_name_text {
        color: var(--main-text-color);
    }

    @media (max-width: 992px) {
        .material-icons-two-tone {
            font-size: 48px;
        }
        .category_list a {
            flex-direction: column;
        }
    }
    

    @media (max-width: 768px) {
        .category_list {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            margin: 0;
        }

        .category_list a {
            flex-direction: row;
            padding: 0.5rem;
            font-size: 0.8rem;
        }
        .material-icons-two-tone {
            font-size: 1.5rem;
        }
    }
</style>