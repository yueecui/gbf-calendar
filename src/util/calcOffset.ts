export function getOffsetToClass(node: HTMLElement, topClass: string){
    return offset(node, topClass);
}


function offset(node: HTMLElement, topClass: string) {
    const offest = {
        top: 0,
        left: 0
    };

    getOffset(node, topClass, true);

    return offest;

    // 递归获取 offset, 可以考虑使用 getBoundingClientRect
    function getOffset(node: HTMLElement, topClass: string, init?: boolean) {
        if (node.nodeType !== 1) {
            return;
        }

        const _position = window.getComputedStyle(node)['position'];

        // position=static: 继续递归父节点
        if (typeof(init) === 'undefined' && _position === 'static') {
            getOffset(node.parentNode as HTMLElement, topClass);
            return;
        }

        const find_class = node.classList.contains(topClass);
        if (find_class) {
            return;
        }else if (node.nodeName == 'HTML'){
            return;
        }else{
            offest.top += node.offsetTop;
            offest.left += node.offsetLeft;
            getOffset(node.parentNode as HTMLElement, topClass);
        }
    }
}