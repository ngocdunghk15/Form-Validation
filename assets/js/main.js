const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
'use strict';
function Validator(options) {
    function getParent(element, selector) {
        let limited = 10;
        while (limited) {
            limited--;
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    // Select rules
    var selectRules = {};
    // Execute Validate 
    function validate(inputElement, rule) {
        let formMessage = getParent(inputElement, options.parentForm).querySelector(options.errorSelector);
        let respond = rule.test(inputElement.value);
        var rules = selectRules[rule.selector];
        getParent(inputElement, options.parentForm);
        // Lặp qua từng rule nếu có lỗi thì dừng lại
        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    {
                        respond = rules[i](
                            formElement.querySelector(rule.selector + ':checked')
                        );

                        break;
                    }
                default:
                    {
                        respond = rules[i](inputElement.value);
                    }
            }
            if (respond) break;
        }
        if (respond) {
            formMessage.innerHTML = respond;
            getParent(inputElement, options.parentForm).classList.remove('valid');
            getParent(inputElement, options.parentForm).classList.add('invalid');

        } else {
            formMessage.innerHTML = 'Valid Infomation!';
            getParent(inputElement, options.parentForm).classList.remove('invalid');
            getParent(inputElement, options.parentForm).classList.add('valid');
        }
        return !respond;
    }

    function clearMessages(inputElement) {
        let formMessage = getParent(inputElement, options.parentForm).querySelector(options.errorSelector);
        formMessage.innerHTML = '';
        getParent(inputElement, options.parentForm).classList.remove('invalid', 'valid');
    }

    // Lấy element của form cần validate
    var formElement = $(options.form);

    if (formElement) {
        // Lắng nghe và xử lý fomr Submit
        var userData = {};
        formElement.onsubmit = (e) => {
            e.preventDefault();

            isFormValid = true;

            options.rules.forEach((rule) => {
                var inputElements = formElement.querySelectorAll(rule.selector);
                Array.from(inputElements).forEach((inputElement) => {
                    var isValid = validate(inputElement, rule);
                    if (!isValid) {
                        userData = {};
                        isFormValid = false;
                    } else {
                        if (inputElement.matches('input[name="gender"]')) {
                            if (inputElement.matches(':checked')) {
                                userData[rule.selector] = inputElement.value;
                            }
                        } else {
                            userData[rule.selector] = inputElement.value;
                        }

                    }
                })

            });
            if (isFormValid) {
                alert('Đăng ký thông tin thành công!');
                console.log(userData);
            } else {
                console.log('Incorrect!');
            }
        }
        // Lắng nghe và xử lí sự kiện từ các trường input
        options.rules.forEach((rule) => {

            if (Array.isArray(selectRules[rule.selector])) {
                selectRules[rule.selector].push(rule.test);
            } else {
                selectRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach((inputElement) => {
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
            })

        }
        )
    }
}

// Định nghĩa rules 


Validator.isRequired = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            if (typeof value === 'string') {
                return value.trim() ? undefined : errorMessage || 'Please enter your name!';
            } else {
                return value ? undefined : errorMessage || 'Pleaser enter your name!';
            }
        }
    }
}

Validator.isEmail = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : errorMessage || 'Please enter an email!'
        }
    }
}

Validator.isGreaterMin = (selector, minLength, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= minLength ? undefined : errorMessage || `At least ${minLength} characters required!`
        }
    }
}

Validator.isEqual = (selector, errorMessage) => {
    return {
        selector: selector,
        test: function (value) {
            return value === $('#password').value ? undefined : errorMessage || `Invalid Infomation`;
        }
    }
}

