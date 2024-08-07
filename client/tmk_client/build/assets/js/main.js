bodyOverflow.set()

document.addEventListener('DOMContentLoaded', function() {
    Notice.init()
    initForms()
    initSliders()

    const preLoader = document.querySelector('.pre-loader')
    if(preLoader) {
        preLoader.addEventListener('transitionend', () => {
            preLoader.style.display = 'none'
        })
        preLoader.classList.add('load')
        bodyOverflow.unset()
    }

    function inputClearAction(event) {
        const parent = this?.parentElement
        if(!parent) {
            return
        }
        
        const input = parent.querySelector('input')
        if(!input) {
            return
        }

        if(input.value.length) {
            input.value = ''
            typeof input.focus == 'function' ? input.focus() : null
        }
    }

    const formClear = document.querySelectorAll('.form-clear')
    if(formClear.length) {
        formClear.forEach((clear) => {
            clear.addEventListener('click', inputClearAction)
        })
    }

    const dropdownMenu = document.querySelectorAll('.with-dropdown');
    dropdownMenu.forEach((item) => {
        item.addEventListener('click', clickDropdownMenu)

        const inputs = item.querySelectorAll('.with-dropdown--menu__item input[type="radio"], .with-dropdown--menu__item input[type="checkbox"]')

        if(!inputs) {
            return;
        }

        inputs.forEach((item) => {
            item.addEventListener('change', clickDropDownMenuItem)
        })
    })

    document.addEventListener('click', (e) => {
        if(!isDropdownMenu(e.target)) {
            dropdownMenu.forEach((item) => item.classList.remove('open'))
        }
    })

    function clickDropdownMenu(e) {
        if(this.classList.contains('open')) {
            this.classList.remove('open')
        } else {
            dropdownMenu.forEach((item) => {
                item.classList.remove('open')
            })
            this.classList.add('open')
        }
    }

    function clickDropDownMenuItem(e) {
        const parent = e.target.closest('.with-dropdown')
        const placeholder = parent.dataset.placeholder;
        const titleNode = parent.querySelector('.with-dropdown--title')
        const checkedInputs = parent.querySelectorAll('.with-dropdown--menu__item input:checked')
        const checkedInputLabels = parent.querySelectorAll('.with-dropdown--menu__item input:checked + span')

        if(checkedInputs.length) {
            parent.classList.add('filled')

            if(checkedInputs[0].type == 'radio') {
                parent.classList.remove('open')
            }

            if(titleNode) {
                let title = []

                checkedInputLabels.forEach((item) => {
                    title.push(item.textContent)
                })

                titleNode.innerHTML = title.join(', ')
            }
        } else {
            parent.classList.remove('filled')

            if(titleNode && placeholder) {
                titleNode.innerHTML = placeholder
            }
        }
    }

    function isDropdownMenu(item) {
        return item.closest('.with-dropdown')
    }

    const accordion = document.querySelectorAll('.accordion--item')

    const accordionClose = (item, content) => {
        let currentHeight = content.clientHeight
        const velocity = currentHeight * 0.08

        const slideUp = (content) => {
            currentHeight = currentHeight - velocity
            content.style.height = currentHeight + 'px'

            if(currentHeight > 0) {
                requestAnimationFrame(() => {
                    slideUp(content)
                })
            } else {
                item.classList.remove('open')
                content.style.height = ''
            }
        }

        slideUp(content)
    }

    const accordionOpen = (item, content) => {
        let currentHeight = 0

        content.style.height = currentHeight + 'px'
        content.style.display = 'block'

        const scrollHeight = content.scrollHeight
        const velocity = scrollHeight * 0.08

        const slideDown = (content) => {
            currentHeight = currentHeight + velocity
            content.style.height = currentHeight + 'px'

            if(currentHeight < scrollHeight) {
                requestAnimationFrame(() => {
                    slideDown(content)
                })
            } else {
                item.classList.add('open')
                content.style.height = ''
                content.style.display = ''
            }
        }

        slideDown(content)
    }
    
    if(accordion) {
        accordion.forEach((item) => {
            const title = item.querySelector('.accordion--item__title')
            const content = item.querySelector('.accordion--item__content')

            title.addEventListener('click', () => {
                if(item.classList.contains('open')) {
                    accordionClose(item, content)
                } else {
                    accordionOpen(item, content)
                }
            })
        })
    }

    const tabs = document.querySelectorAll('.tabs')

    if(tabs) {
        tabs.forEach((tab) => {
            const controls = tab.querySelectorAll('.tab-control--item')
            const contents = tab.querySelectorAll('.tab-content--item')

            controls.forEach((tabControl, index) => {
                tabControl.addEventListener('click', () => {
                    if(!tabControl.classList.contains('open')) {
                        controls.forEach((item) => {
                            item.classList.remove('open')
                        })
                        contents.forEach((item) => {
                            item.classList.remove('open')
                        })

                        tabControl.classList.add('open')
                        contents[index].classList.add('open')
                    }
                })
            })
        })
    }

    const modalTrigger = document.querySelectorAll('.js-modal')

    if(modalTrigger) {
        modalTrigger.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const formId = event.target.dataset.formId;

                if(!formId) {
                    return
                }

                const form = document.getElementById(formId)
                if(form) {
                    form.classList.add('open')
                    bodyOverflow.set()
                }
            })
        })
    }

    const modalClose = document.querySelectorAll('.modal-content--close')

    if(modalClose) {
        modalClose.forEach((item) => {
            const parent = item.closest('.modal')

            item.addEventListener('click', (event) => {
                if(parent) {
                    parent.classList.remove('open')
                    bodyOverflow.unset()
                }
            })
        })
    }

    const modal = document.querySelectorAll('.modal')

    if(modal) {
        modal.forEach((item) => {
            item.addEventListener('click', (event) => {
                if(!event.target.classList.contains('modal-content') && !event.target.closest('.modal-content')) {
                    item.classList.remove('open')
                    bodyOverflow.unset()
                }
            })
        })
    }

    const mobileMenu = document.querySelector('.mobile-menu')
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon')
    const mobileMenuClose = document.querySelector('.mobile-menu--close')

    if(mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            mobileMenu.classList.add('open')
            bodyOverflow.set()
        })
    }

    if(mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open')
            bodyOverflow.unset()
        })
    }

    const bottomMenu = document.querySelector('.bottom-menu');
    if(bottomMenu) {
        window.addEventListener('scroll', () => {
            const documentScroll = document.documentElement.scrollTop;

            if(documentScroll > 0) {
                bottomMenu.classList.add('show')
            }

            if(window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                bottomMenu.classList.remove('show')
            }
        });
    }

    const filter = document.querySelector('.filter')
    const filterClose = document.querySelector('.filter--close')
    const filterIcon = document.querySelector('.filter-mobile-icon')

    if(filter && filterIcon) {
        filterIcon.addEventListener('click', () => {
            filter.classList.add('open')
            bodyOverflow.set()
        })

        filter.addEventListener('click', (event) => {
            if(event.target.classList.contains('filter')) {
                filter.classList.remove('open')
                bodyOverflow.unset()
            }
        })

        if(filterClose) {
            filterClose.addEventListener('click', () => {
                filter.classList.remove('open')
                bodyOverflow.unset()
            })
        }
    }

    if(window.matchMedia('screen and (max-width: 992px)').matches) {
        const readMoreLinks = document.querySelectorAll('.js-read-smore')
        if(readMoreLinks) {
            readSmore(readMoreLinks, {
                moreText: 'Читать полностью',
                lessText: 'Скрыть',
                wordsCount: 32,
            }).init()
        }
    }

    const contactsTabControl = document.querySelectorAll('.contacts-tab-control--item')
    const contactsTab = document.querySelectorAll('.contacts-tab--item')

    if(contactsTabControl) {
        contactsTabControl.forEach((item, index) => {
            item.addEventListener('click', () => {
                if(!item.classList.contains('selected')) {
                    contactsTabControl.forEach(item => item.classList.remove('selected'))
                    contactsTab.forEach(item => item.classList.remove('show'))

                    item.classList.add('selected')
                    contactsTab[index].classList.add('show')
                }
            })
        })
    }

    const profile = document.querySelector('.profile');
    const profileAlert = document.querySelector('.profile-alert');

    if(profile && profileAlert) {
        const inputs = profile.querySelectorAll('input')
        const profileAlertClose = profileAlert.querySelector('.profile-alert--close')

        profileAlertClose.addEventListener('click', () => {
            profileAlert.classList.remove('show')
            bodyOverflow.unset()
        })

        profileAlert.addEventListener('click', (event) => {
            if(event.target.classList.contains('profile-alert')) {
                profileAlert.classList.remove('show')
                bodyOverflow.unset()
            }
        })

        inputs.forEach((input) => {
            input.addEventListener('click', () => {
                profileAlert.classList.add('show')

                if(window.matchMedia('screen and (max-width: 992px)').matches) {
                    bodyOverflow.set()
                }
            })
        })
    }

    const notificationIcon = document.querySelector('.notifications-icon')
    const notificationContent = document.querySelector('.notifications-content')
    const notificationClose = document.querySelector('.notifications-content--close')

    if(notificationIcon && notificationContent) {
        notificationClose.addEventListener('click', () => {
            console.log(notificationContent)

            notificationContent.classList.remove('show')
            bodyOverflow.unset()
        })

        notificationContent.addEventListener('click', (event) => {
            if(event.target.classList.contains('notifications-content')) {
                notificationContent.classList.remove('show')
                bodyOverflow.unset()
            }
        })

        notificationIcon.addEventListener('click', () => {
            notificationContent.classList.add('show')

            if(window.matchMedia('screen and (max-width: 992px)').matches) {
                bodyOverflow.set()
            }
        })
    }
}, false)
