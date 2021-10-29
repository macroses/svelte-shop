<script>
    export let flag;
    export let radioValue;
</script>

<label>
    <input type="radio" bind:group={flag} value={radioValue}>
    <span class="radio_content">
        <slot name="value"></slot>
        <slot name="price"></slot>
    </span>
</label>

<style>
    input {
        visibility: hidden;
        position: absolute;
    }

    label {
        cursor: pointer;
        padding: 1rem;
        border: 1px solid var(--main-border-color);
        transition: .2s;
        margin-bottom: 0.5rem;
    }

    label:hover {
        background: var(--main-section-color);
    }

    .radio_content {
        position: relative;
        padding-left: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.3rem;
    }

    .radio_content:before {
        content: '';
        position: absolute;
        left: 0;
        top: 6px;
        width: 18px;
        height: 18px;
        border: 1px solid #ccc;
        border-radius: 50%;
        background: #fff;
    }

    .radio_content:after {
        content: '';
        background: rgba(255,255,255,0);
        position: absolute;
        left: 5px;
        top: 11px;
        width: 10px;
        height: 10px;
        border-radius: 50px;
    }

    input:checked + .radio_content:after {
        background: var(--main-theme-color);
    }
</style>