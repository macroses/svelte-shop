<script>
    export let spanValue;
    export let checkBrand;
    let checkedFilter = false;
</script>

<label>
    <input type="checkbox" on:input={checkBrand} checked={checkedFilter}>
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