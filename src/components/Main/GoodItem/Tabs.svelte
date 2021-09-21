<script>
    import {slide} from 'svelte/transition';
    
    export let title;
    export let body;
    let active = '1';   
</script>

<div class="tabs">
    <div class="tab_item" class:active={active === "1"} on:click="{() => active = "1"}">
        <span class="material-icons-two-tone">source</span>
        <span class="tab_name">Описание</span>
    </div>
    <div class="tab_item" class:active={active === "2"} on:click="{() => active = "2"}">
        <span class="material-icons-two-tone">chat_bubble_outline</span>
        <span class="tab_name">Отзывы</span>
    </div>
</div>

<div class="tab_content">
    {#if active === "1"}
        <div id="about1" class="tab_content_body" transition:slide|local>
            <div class="title">{title}</div>
            <div class="content">{body}</div>
        </div>
    {:else}
        <div class="tab_content_body" transition:slide>
            отзывы какие то
        </div>
    {/if}
</div>


<style>
    .tabs {
        display: flex;
        align-items: center;
        margin: 3rem 0 1rem;
    }

    .tab_item {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-right: 1.5rem;
        opacity: .5;
    }

    .tab_item.active {
        opacity: 1;
    }

    .tab_name {
        font-size: 1.5rem;
        margin-left: 0.5rem;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .tab_content {
        padding: 1rem;
        border: 1px solid var(--main-border-color);
    }
</style>