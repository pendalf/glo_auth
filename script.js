'use strict';

// Объявление переменных

const userName = document.querySelector('#username'),
    userRegister = document.querySelector('#user-register'),
    login = document.querySelector('#login'),
    userList = document.querySelector('#user-list');

let userData = localStorage.userList ? JSON.parse(localStorage.userList) : [];

const setLocalStorage = function() {
    localStorage.userList = JSON.stringify(userData);
};

let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

// Функция для получения фразы с первой заглавной буквы
const capitalizeFirstLetter = function(string) {
    if (!string) {
        return string;
    }
    return string[0].toUpperCase() + string.slice(1);
};

// Функция опроса ползователя.
const askUser = (type, correct, incorrect, defValue = '', repeat = false) => {
    const promtText = repeat ? incorrect : correct;
    let text = prompt(promtText, defValue);

    switch (type) {
        case Number:
            text = !isNumber(text) ? askUser(type, correct, incorrect, defValue, true) : +text;

            break;
        case String:
            text = isNumber(text) || text === null || text === '' ? askUser(type, correct, incorrect, defValue, true) : text;

            break;

        case 'fullName':
            text = text ? text.replace(/[\s]+/g, ' ').trim() : text;
            console.log(text);
            const wordsCount = text ? text.split(' ').length : text;
            text = (isNumber(text) || text === null || text === '' || wordsCount > 2 || wordsCount < 2) ?
                askUser(type, correct, incorrect, defValue, true) : text;

            break;

        case 'password':
            text = text === null || text === '' ? askUser(type, correct, incorrect, defValue, true) : text;

            break;

        default:
            break;
    }

    return text;
};

const render = function() {
    userList.textContent = '';

    userData.forEach(function(item, i) {
        const li = document.createElement('li'),
            dateOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            },
            register = new Date(item.register).toLocaleDateString('ru-RU', dateOptions);
        let output = ''
        li.classList.add('user-item');
        li.dataset.index = i;

        output += '<span class="user-item__first-name">Имя: ' + item.firstName + '</span>';
        output += '<span class="user-item__last-name">, фамилия: ' + item.lastName + '</span>';
        output += '<span class="user-item__register">, зарегистрирован: ' + register + '</span>';

        li.innerHTML = output;

        userList.append(li);
    });

};

userRegister.addEventListener('click', function() {
    const userFullName = askUser('fullName', 'Введите имя и фамилию', 'Вы ввели не коррректные данные, повторите ввод имени и фамилии', 'Василий Алибабаевич'),
        userFullNameSplit = userFullName.split(' '),
        userName = askUser(String, 'Введите login', 'Вы ввели не коррректные данные, логин должен содержать буквы. Повторите ввод', 'Vasya'),
        password = askUser('password', 'Введите пароль', 'Вы ввели не коррректные данные, пароль должен содержать буквы. Повторите ввод', '12345'),
        user = {
            login: userName,
            firstName: capitalizeFirstLetter(userFullNameSplit[0]),
            lastName: capitalizeFirstLetter(userFullNameSplit[1]),
            password,
            register: new Date()
        };
    userData.push(user);
    setLocalStorage();
    render();

});

render();