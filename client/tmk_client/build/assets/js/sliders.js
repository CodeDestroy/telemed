function initSliders()
{
    const articles = document.querySelector('.articles .swiper')
    if(articles) {
        const articlesSlider = new Swiper(articles, {
            slidesPerView: 'auto',
            spaceBetween: 12,
            navigation: {
                enabled: true,
                nextEl: '.articles .navigation-next',
                prevEl: '.articles .navigation-prev',
            },
            breakpoints: {
                992: {
                    slidesPerView: 5
                }
            }
        })
    }

    const appointments = document.querySelectorAll('.appointment-list--item')

    if(appointments.length) {
        appointments.forEach((appointment) => {
            const dates = appointment.querySelector('.dates')
            const times = appointment.querySelector('.times')

            let datesSlider, timesSlider

            if(dates) {
                datesSlider = new Swiper(dates, {
                    slidesPerView: 'auto',
                    spaceBetween: 15,
                    watchSlidesProgress: true,
                    slideToClickedSlide: true,
                    navigation: {
                        enabled: true,
                        nextEl: appointment.querySelector('.navigation-next'),
                        prevEl: appointment.querySelector('.navigation-prev'),
                    },
                    scrollbar: {
                        el: appointment.querySelector('.swiper-scrollbar'),
                        draggable: true
                    },
                    breakpoints: {
                        700: {
                            spaceBetween: 40
                        },
                        992: {
                            slidesPerView: 5,
                            spaceBetween: 15,
                        }
                    }
                })
            }

            if(times) {
                timesSlider = new Swiper(times, {
                    slidesPerView: 1,
                    thumbs: {
                        swiper: datesSlider ? datesSlider : null
                    }
                })
            }
        })
    }

    const services = document.querySelector('.services-slider .swiper')

    if(services) {
        const servicesSlider = new Swiper(services, {
            slidesPerView: 2,
            spaceBetween: 22,
            navigation: {
                enabled: true,
                nextEl: document.querySelector('.services-slider .navigation-next'),
                prevEl: document.querySelector('.services-slider .navigation-prev'),
            },
            breakpoints: {
                768: {
                    slidesPerView: 3
                },
                992: {
                    slidesPerView: 4
                }
            }
        })
    }
}