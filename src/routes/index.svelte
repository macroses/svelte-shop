<script>
    import CategoryList from "../components/Main/CategoryList.svelte";
    import Model from '../model/data-service';
    import GoodItemView from '../components/Main/Good/GoodItemView.svelte';

    let steps;
    const temp = new Model();
    const staticData = temp.getCategoryItem(0);

    let slideWidth = 0;
	
	function step(val) {
        switch (val) {
            case 'next':
                slideWidth = slideWidth - steps.children[0].offsetWidth;
                if(slideWidth <= -(steps.offsetWidth)) slideWidth = -(steps.offsetWidth);
                break;
            case "prev":
                slideWidth = slideWidth + steps.children[0].offsetWidth;
                if(slideWidth > 0) slideWidth = 0;
                break;
            default:
                break;
        }

        steps.style.transform = `translateX(${slideWidth}px)`;
	}
</script>

<svelte:head>
    <title>Shop</title>
</svelte:head>

<div class="container">
    <div class="main_content">
        <CategoryList/>
        <div class="steps">
            <ul class="track" bind:this="{steps}">
                {#await staticData then value}
                    {#each value.category as item}
                        <GoodItemView {...item} categoryId={0}/>
                    {/each}
                {/await}
            </ul>
        </div>
        
        <div class="controls">
            <button class="control" on:click="{() => step("prev")}">Prev</button>
            <button class="control" on:click="{() => step("next")}">Next</button>

        </div>
    </div>
</div>

<style>
    .steps { 
		overflow: hidden;
	}

	.track {
		display: flex;
        transform: translate(0);
        transition: .2s;
	}

    .track :global(li) {
        flex: 0 0 20%;
        padding: 0 2rem;
    }
	
	.controls {
		display: flex;
	}

    @media (max-width: 1200px) {
        .track :global(li) {
            flex: 0 0 25%;
            padding: 0 3rem;
        }
    }

    @media (max-width: 768px) {
        .track :global(li) {
            flex: 0 0 50%;
            padding: 0;
        }
    }
</style>