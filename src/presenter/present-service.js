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

export function formatByPattern(node,pattern) {
		
    function set_cursor(){
        const match = node.value.match(/[\d]/gi);
        const pos = match ? node.value.lastIndexOf(match.pop())+1 : 0;
        node.setSelectionRange(pos, pos);
    }
    
    function format_value(){
        let digits = node.value.replace(/[^\d]/g,'').split('');
        node.value = pattern.replace(/[*]/g,(m)=>digits.shift()||m);
        set_cursor();
    }
    
    node.addEventListener('input',format_value);
    
    format_value();
    
    return {
        destroy: ()=>node.removeEventListener('input',format_value)
    }
}