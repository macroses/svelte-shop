export function clickOutside(node) {

    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}

export function onlyDigits(node) {
    function clean_val() {
        node.value = node.value.replace(/[^\d]/g, '');
    }
    node.addEventListener('input', clean_val);
    return {
        destroy() {
            document.removeEventListener('input', clean_val);
        }
    }
}