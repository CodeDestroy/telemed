function initForms() {
    const authForm = document.querySelector('.auth-form')
    if(authForm) {
        const authFormValidate = new JustValidate(authForm, {
            errorFieldCssClass: 'error',
            errorLabelCssClass: 'form-error',
            lockForm: true
        }).addField('#phone', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            }
        ]).addField('#password', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            }
        ]).onSuccess(() => {
            Notice.show('Ваш номер телефона или пароль введены неверно, пожалуйста, проверьте правильность данных или зарегистрируйтесь в нашей системе.')
        })
    }

    const registerStep1Form = document.querySelector('.register-form.step-1')
    if(registerStep1Form) {
        new JustValidate(registerStep1Form, {
            errorFieldCssClass: 'error',
            errorLabelCssClass: 'form-error',
            lockForm: true
        }).addField('#phone', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            }
        ]).onSuccess(() => {
            Notice.show('Ваш номер телефона или пароль введены неверно, пожалуйста, проверьте правильность данных или зарегистрируйтесь в нашей системе.')
        })
    }

    const registerStep2Form = document.querySelector('.register-form.step-2')
    if(registerStep2Form) {
        new JustValidate(registerStep2Form, {
            errorFieldCssClass: 'error',
            errorLabelCssClass: 'form-error',
            lockForm: true
        }).addField('#code', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            },
            {
                validator: (value) => {
                    return /\d{4}/i.test(value)
                },
                errorMessage: 'Код должен иметь длину в 4 символа',
            }
        ]).onSuccess(() => {
            Notice.show('Ваш номер телефона или пароль введены неверно, пожалуйста, проверьте правильность данных или зарегистрируйтесь в нашей системе.')
        })
    }

    const registerStep3Form = document.querySelector('.register-form.step-3')
    if(registerStep3Form) {
        new JustValidate(registerStep3Form, {
            errorFieldCssClass: 'error',
            errorLabelCssClass: 'form-error',
            lockForm: true
        }).addField('#lastname', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            },
            {
                rule: 'minLength',
                value: 3,
                errorMessage: 'Фамилия не может быть короче 3 символов'
            }
        ]).addField('#name', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            },
            {
                rule: 'minLength',
                value: 3,
                errorMessage: 'Имя не может быть короче 3 символов'
            }
        ]).addField('#fathername', [
            {
                rule: 'minLength',
                value: 3,
                errorMessage: 'Отчество не может быть короче 3 символов'
            }
        ]).addField('#birthday', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            },
            {
                validator: (value) => {
                    if(!/\d{2} . \d{2} . (\d{4}|\d{2})/g.test(value)) {
                        return false;
                    }

                    const splitDate = value.split(' . ')

                    let year = splitDate[2]
                    let month = splitDate[1]
                    let day = splitDate[0]

                    if(year.length == 3) {
                        return false;
                    }

                    if(year.length == 2) {
                        year = year > new Date().getFullYear().toString().slice(2) ? '19' + year : '20' + year;
                    }

                    const date = new Date(year + '/' + month + '/' + day)

                    return !isNaN(date.getTime())
                },
                errorMessage: 'Неверно указана дата'
            }
        ]).addField('#email', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            },
            {
                rule: 'email',
                value: 3,
                errorMessage: 'Укажите правильный email'
            }
        ]).addField('#agreement', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения'
            }
        ]).onSuccess(() => {
            Notice.show('Ваш номер телефона или пароль введены неверно, пожалуйста, проверьте правильность данных или зарегистрируйтесь в нашей системе.')
        })
    }

    const restoreStep1Form = document.querySelector('.restore-form.step-1')
    if(restoreStep1Form) {
        new JustValidate(restoreStep1Form, {
            errorFieldCssClass: 'error',
            errorLabelCssClass: 'form-error',
            lockForm: true
        }).addField('#phone', [
            {
                rule: 'required',
                errorMessage: 'Поле телефон обязательно для заполнения'
            }
        ]).onSuccess(() => {
            Notice.show('Ваш номер телефона введен неверно, пожалуйста, проверьте правильность данных или зарегистрируйтесь в нашей системе.')
        })
    }

    const restoreStep2Form = document.querySelector('.restore-form.step-2')
    if(restoreStep2Form) {
        new JustValidate(restoreStep2Form, {
            errorFieldCssClass: 'error',
            errorLabelCssClass: 'form-error',
            lockForm: true,
        }).addField('#code', [
            {
                rule: 'required',
                errorMessage: 'Поле обязательно для заполнения',
            },
            {
                validator: (value) => {
                    return /\d{4}/i.test(value)
                },
                errorMessage: 'Код должен иметь длину в 4 символа',
            }
        ]).onSuccess(() => {
            Notice.show('Ваш номер телефона введен неверно, пожалуйста, проверьте правильность данных или зарегистрируйтесь в нашей системе.')
        })
    }

    const stars = document.querySelectorAll('.reviews-rating--stars__item input')

    if(stars) {
        stars.forEach((star, index) => {
            star.addEventListener('change', (event) => {
                for(let i = index; i < stars.length; i++) {
                    stars[i].checked = false
                }
                for(let i = 0; i <= index; i++) {
                    stars[i].checked = true
                }
            })
        })
    }

    const selects = document.querySelectorAll('select')

    if(selects) {
        selects.forEach((select) => {
            NiceSelect.bind(select)
        })
    }

    const phoneMask = document.querySelectorAll('.phone-mask')
    if(phoneMask.length) {
        phoneMask.forEach((input) => {
            new Inputmask('+7 (999) 999-99-99')
                .mask(input)
        })
    }

    const codeMask = document.querySelectorAll('.code-mask')
    if(codeMask.length) {
        codeMask.forEach((input) => {
            new Inputmask('9999', {placeholder: '----'})
                .mask(input)
        })
    }

    const dateMask = document.querySelectorAll('.date-mask')
    if(dateMask.length) {
        dateMask.forEach((input) => {
            new Inputmask('99.99.9{2,4}', {placeholder: '--.--.--'})
                .mask(input)
        })
    }

    const passSerialMask = document.querySelectorAll('.pass-serial-mask')
    if(passSerialMask.length) {
        passSerialMask.forEach((input) => {
            new Inputmask('9999', {placeholder: '----'})
                .mask(input)
        })
    }

    const passNumberMask = document.querySelectorAll('.pass-number-mask')
    if(passNumberMask.length) {
        passNumberMask.forEach((input) => {
            new Inputmask('999999', {placeholder: '------'})
                .mask(input)
        })
    }

    const departmentMask = document.querySelectorAll('.department-code-mask')
    if(departmentMask.length) {
        departmentMask.forEach((input) => {
            new Inputmask('999 999', {placeholder: '--- ---'})
                .mask(input)
        })
    }

    const indexMask = document.querySelectorAll('.index-mask')
    if(indexMask.length) {
        indexMask.forEach((input) => {
            new Inputmask('999999', {placeholder: '------'})
                .mask(input)
        })
    }
}