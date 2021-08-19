<script>
    import Model from "../../model/data-service";

    const categoryCollection = new Model();
    const categories = categoryCollection.getAllItems();

</script>

<div class="category_list">
    {#await categories}
        <p>waiting...</p>
    {:then value}
        {#each value as item}
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
        grid-template-columns: repeat(5, minmax(140px, 1fr));
        gap: 1rem 1.5rem;
        margin: 15px 0;
        font-size: 16px;
    }
    
    .category_list a {
        background: #f6f6f6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15%;
    }

    .category_list a:nth-child(7n+1) {
        grid-row: auto /span 2;
        grid-column: auto /span 2;
        
    }

    .category_list a:hover .material-icons-two-tone {
        filter: invert(46%) sepia(89%) saturate(6094%) hue-rotate(1deg) brightness(104%) contrast(104%);
        transition: .2s;
    }

    .material-icons-two-tone {
        font-size: 48px;
        flex: 1;
        text-align: right;
        margin-right: 10px; 
        transition: .2s;
    }

    .cat_name_text {
        flex: 3;
        color: var(--main-text-color);
    }

    @media (max-width: 768px) {}
    
</style>