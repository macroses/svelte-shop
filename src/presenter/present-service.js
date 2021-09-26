export function clickOutside(node) {
    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('outside', node)
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
        node.value    = node.value.replace(/[^\d]/g,'');
    }
    node.addEventListener('input', clean_val);
    return {
        destroy() {
            document.removeEventListener('input', clean_val);
        }
    }
}

export function zoom(e){
    var zoomer = e.currentTarget;
    e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX
    e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX
    x = offsetX/zoomer.offsetWidth*100
    y = offsetY/zoomer.offsetHeight*100
    zoomer.style.backgroundPosition = x + '% ' + y + '%';
}