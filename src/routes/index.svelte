<script>
    import CategoryList from "../components/Main/CategoryList.svelte";
    import Model from '../model/data-service';
    import GoodItemView from '../components/Main/Good/GoodItemView.svelte';

    let steps;
    const temp = new Model();
    const staticData = temp.getCategoryItem(0);
    let idxCounter = 4;
	
	function step(toggler) {
        if(toggler === "next") {
            idxCounter++;
        } else if (toggler === "prev") {
            idxCounter--;
        }

        

        steps.children[idxCounter].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if(idxCounter >= steps.children.length) return; 
        if(idxCounter <= 4) idxCounter = 4; 
	}

    console.log(staticData)
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
                        <div class="step" style={"flex: 0 0 20%"}>
                            <GoodItemView {...item} categoryId={0}/>
                        </div>
                        
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
		margin-bottom: 1rem;
		overflow: hidden;
	}

    .step {
        padding: 2rem;
    }
	
	.track {
		display: flex;
	}
	
	.controls {
		display: flex;
	}
</style>