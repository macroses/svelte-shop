<script>
    import FeatureItem from "./FeatureItem.svelte";

    export let attrs;
</script>

<div class="item_feature">
    <ul class="feature_list">
        {#each attrs as attrItem}
            <FeatureItem name={attrItem.attrName} val={attrItem.attrVal}/>
        {/each}
    </ul>
    <a href="#about1" class="to_about_item">к описанию</a>
</div>

<style>
    .item_feature {
        grid-area: about;
    }
    .to_about_item {
        color: var(--main-theme-color);
    }

    @media (max-width: 992px) {

    }

    @media (max-width: 768px) {
        .item_feature {
            padding-right: 0;
        }
    }
</style>