const bodyOverflow = {
    isOverflow: false,
    toggle() {
        this.isOverflow ? this.unset() : this.set()
    },
    set() {
        const size = this.getScrollbarSize()
        console.log(document.querySelector('body'))
        document.querySelector('body').style.paddingRight = size[0] + 'px'
        document.querySelector('body').style.overflow = 'hidden'

        this.isOverflow = true
    },
    unset() {
        document.querySelector('body').setAttribute('style', '')
        
        this.isOverflow = false
    },
    getScrollbarSize() {
        const element = window.document.createElement('textarea'), style = {
            'visibility': 'hidden', 'position': 'absolute', 'zIndex': '-2147483647',
            'top': '-1000px', 'left': '-1000px', 'width': '1000px', 'height': '1000px',
            'overflow': 'scroll', 'margin': '0', 'border': '0', 'padding': '0'
        }, support = element.clientWidth !== undefined && element.offsetWidth !== undefined

        for (var key in style) {
            if (style.hasOwnProperty(key)) {
                element.style[key] = style[key]
            }
        }
        
        var size = null
        if(support && window.document.body) {
            window.document.body.appendChild(element)
            size = [element.offsetWidth - element.clientWidth, element.offsetHeight - element.clientHeight]
            window.document.body.removeChild(element)
        }

        return size
    }
}