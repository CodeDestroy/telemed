const Notice = {
    overlay: null,
    body: null,
    message: null,
    init()
    {
        this.overlay || this.createOverlay()
        this.body || this.createBody()
    },
    setMessage(message)
    {
        this.message = message
        this.updateBodyContent()
    },
    appendDocument(element)
    {
        document.body.append(element)
    },
    createOverlay()
    {
        this.overlay = document.createElement('div')
        this.overlay.classList.add('overlay')
        this.overlay.addEventListener('click', () => {
            this.hide()
        })

        this.appendDocument(this.overlay)
    },
    createBody()
    {
        this.body = document.createElement('div')
        this.body.classList.add('notice')

        this.close = document.createElement('span')
        this.close.classList.add('notice--close')
        this.close.innerHTML =
        '<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M1.33105 10.0914L10.6045 1.09137M1.33105 1L10.6045 9.99999" stroke="#D30D15" stroke-width="0.909137" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'

        this.close.addEventListener('click', () => {
            this.hide()
        })

        this.bodyContent = document.createElement('div')
        this.bodyContent.classList.add('notice--content')

        this.body.append(this.close)
        this.body.append(this.bodyContent)

        this.appendDocument(this.body)
    },
    updateBodyContent()
    {
        this.bodyContent.innerHTML = this.message
    },
    showBody()
    {
        this.body.classList.add('show')
    },
    hideBody()
    {
        this.body.classList.remove('show')
    },
    showOverlay()
    {
        this.overlay.classList.add('show')
    },
    hideOverlay()
    {
        this.overlay.classList.remove('show')
    },
    show(message = null)
    {
        if(message) {
            this.setMessage(message)
        }

        bodyOverflow.set()
        this.showOverlay()
        this.showBody()
    },
    hide()
    {
        bodyOverflow.unset()
        this.hideOverlay()
        this.hideBody()
    },
}