<script>
    export let spanValue;
    export let checkBrand;
    export let allCheckedFilters;

    let checked = allCheckedFilters;
</script>

<label>
    <input type="checkbox" on:input={checkBrand} bind:checked={checked}>
    <span>{spanValue}</span>
</label>

<style>
    input {
        visibility: hidden;
        position: absolute;
    }

    label {
        cursor: pointer;
        display: block;
        width: 100%;
        padding: 0.5rem 0 0.5rem 1rem;
        background: var(--main-section-color);
        color: var(--main-text-color);
    }

    span {
        position: relative;
        padding-left: 25px;
    }

    span:before {
        content: '';
        position: absolute;
        left: 0;
        top: 2px;
        width: 18px;
        height: 18px;
        border: 1px solid #ccc;
        background: #fff;
    }

    span:after {
        content: '';
        background: rgba(255,255,255,0);
        position: absolute;
        left: 4px;
        top: 6px;
        width: 12px;
        height: 12px;
    }

    input:checked + span:after {
        background: var(--main-theme-color);
    }
</style>