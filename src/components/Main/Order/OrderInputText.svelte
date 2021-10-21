<script>
    import {formatByPattern} from '../../../presenter/present-service';

    export let pholder;
    export let inpVal;
    export let idVal;
    export let label;
    export let pattern = false;

    let input

    function clearAndFocus() {
        inpVal = "";
        input.focus();
    }
</script>

<div class="inp_elem">
    <label for={idVal} >
        <slot name="label">{label}</slot>
    </label>
    {#if pattern}
        <input type="text" id={idVal} placeholder={pholder} use:formatByPattern={'(***) ***-**-**'} bind:value={inpVal} bind:this={input}>
    {:else}
        <input type="text" id={idVal} placeholder={pholder} bind:value={inpVal} bind:this={input}>
    {/if}
    
    {#if inpVal}
        <span class="material-icons-outlined clear" on:click={clearAndFocus}>clear</span>
    {/if}
</div>



<style>
    .inp_elem {
        display: flex;
        flex-direction: column;
    }

    input {
        padding: 6px 10px;
        height: 50px;
        border: 1px solid var(--main-border-color);
        font-family: var(--font);
        font-size: 1rem;
        transition: .2s;
    }

    .clear {
        position: absolute;
        right: 1rem;
        bottom: 14px;
    }
</style>