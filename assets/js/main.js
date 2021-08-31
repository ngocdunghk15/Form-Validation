const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Validator(options) {
    // Validate 
    function validate(inputElement, rule) {
        let formMessage = inputElement.parentElement.querySelector(options.errorSelector);
        let respond = rule.test(inputElement.value);
        if (respond) {
            formMessage.innerHTML = respond;
            inputElement.parentElement.classList.remove('valid');
            inputElement.parentElement.classList.add('invalid');

        } else {
            formMessage.innerHTML = 'Valid Infomation!';
            inputElement.parentElement.classList.remove('invalid');
            inputElement.parentElement.classList.add('valid');
        }
    }

    function clearMessages(inputElement) {
        let formMessage = inputElement.parentElement.querySelector(options.errorSelector);
        formMessage.innerHTML = '';
        inputElement.parentElement.classList.remove('invalid', 'valid');
    }

    // Lấy element của form cần validate
    var formElement = $(options.form);

    if (formElement) {
        options.rules.forEach((rule) => {
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                // Xử lí trường hợp khi người dùng blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
                // Xử lí mỗi khi người dùng nhập dữ liệu
                inputElement.oninput = function () {
                    clearMessages(inputElement);
                }

            }
        }
        )
    }
}

// Định nghĩa rules 


Validator.isRequired = (selector) => {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Please enter your name!';
        }
    }
}

Validator.isEmail = (selector) => {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Please enter an email!'
        }
    }
}

Validator.isGreaterMin = (selector, minLength) => {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= minLength ? undefined : `At least ${minLength} characters required!`
        }
    }
}

Validator.isEqual = (selector) => {
    return {
        selector: selector,
        test: function (value) {
            return value === $('#password').value ? undefined : `The entered passwords do not match. Let's try again.`
        }
    }
}