<script>
    import CategoryList from "../components/Main/CategoryList.svelte";
    import Model from '../model/data-service';
    import GoodItemView from '../components/Main/Good/GoodItemView.svelte';

    let steps;
    const temp = new Model();
    const staticData = temp.getCategoryItem(0);
	
	function step() {
        const itemWidth = steps.children[0].offsetWidth;

        Array.from(steps.children).forEach((el,i, array) => {
            // array.push(array.splice(i, 1)[0]);
            el.style.transform = `translate(${-itemWidth}px)`;
        })


        // steps.children[idxCounter].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // if(idxCounter >= steps.children.length) return; 
        // if(idxCounter <= 4) idxCounter = 4; 
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
            <button class="control" on:click="{() => step()}">Next</button>

        </div>
    </div>
</div>

<style>
    .steps {
		margin-bottom: 1rem;
		overflow: hidden;
	}

    .step {
        padding: 2rem;
    }
	
	.track {
		display: flex;
	}

    .track :global(li) {
        flex: 0 0 20%;
    }
	
	.controls {
		display: flex;
	}
</style>