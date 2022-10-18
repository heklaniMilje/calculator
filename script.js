const themeDiv = document.querySelector('.theme');
const themeChkBox = document.querySelector('input[type=checkbox]');
const body = document.querySelector('body');
const calculator = document.querySelector('.calculator');
const buttons = Array.from(document.querySelectorAll('.button'));
const footer = document.querySelector('footer');
const display = document.querySelector('.display');
const numBtns = Array.from(document.querySelectorAll('.number'));
const acBtn = document.querySelector('.delete');
const delBtn = document.querySelector('.delete-one');


let numbers = [];
let operands = [];
let isNumberLast = false;
let number = [];
let result = 0;


numBtns.forEach(btn => addEventListener('click', input));
acBtn.addEventListener('click', resetData);
delBtn.addEventListener('click', deleteOne);
themeChkBox.addEventListener('click', themeChange);

themeCheck();


function themeCheck() {
    if (JSON.parse(localStorage.getItem('dark')).isDark) {
        //TODO: theme button - remove transition animation when refreshing 
        themeChkBox.checked = true;
        themeChange();
    }
}

window.onload = () => {
    themeDiv.classList.add('loaded');
    setInterval(function(){themeDiv.classList.remove('loaded');},500);
}

function deleteOne(e) {

    console.log(isNumberLast, numbers, operands);

    if (isNumberLast) {
        if (numbers.length == 0) return;
        numbers.pop();
    }
    else {
        if (operands.length == 0) return;
        operands.pop();
    }

    displayDeleteOne();
}

function themeChange(e) {
    body.classList.toggle('dark');
    calculator.classList.toggle('dark');
    display.classList.toggle('dark');
    buttons.forEach(btn => btn.classList.toggle('dark'));
    footer.classList.toggle('dark');

    if (Array.from(body.classList).some(el => el == 'dark')) {
        const dark = { isDark: true };
        localStorage.setItem('dark', JSON.stringify(dark));
    }
    else {
        const dark = JSON.parse(localStorage.getItem('dark'));
        dark.isDark = false;
        localStorage.setItem('dark', JSON.stringify(dark));
    }
}

function input(e) {
    if (!Array.from(e.target.classList).some(el => el == 'button')) return;
    if (Array.from(e.target.classList).some(el => el == 'delete')) return;
    if (Array.from(e.target.classList).some(el => el == 'delete-one')) return;

    if (!Array.from(e.target.classList).some(el => el == 'number')) {

        if (Array.from(e.target.classList).some(el => el == 'calculate')) {
            if (number.length != 0) {
                numbers.push(number.pop());
                isNumberLast = true;
            }
            displayClear();
            displayShow(calculate());
            return;
        }

        const inputValue = e.target.textContent;
        displayShow(" " + inputValue + " ");
        if (number.length != 0) {
            numbers.push(number.pop());
            isNumberLast = true;
        }

        operands.push(inputValue);
        isNumberLast = false;

    }
    else {

        const inputValue = parseFloat(e.target.textContent);
        displayShow(inputValue);
        if (number.length == 0)
            number.push(inputValue);
        else {
            number.push(number.pop() * 10 + inputValue);
        }
    }
}

function calculate() {
    if (numbers.length == 1) return numbers.pop();
    let tmp = 0;

    while (numbers.length != 1) {
        let op = operands.shift();

        switch (op) {
            case '*':
            case '/':
                if (numbers[1] == 0)
                    displayShow("ERROR zero division");
                tmp = operate(numbers.shift(), numbers.shift(), op);
                numbers.unshift(tmp);
                break
            case '+':
            case '-':
                if (operands.length == 0 || operands[0] == '+' || operands[0] == '-') {
                    tmp = operate(numbers.shift(), numbers.shift(), op);
                    numbers.unshift(tmp);
                }
                else {
                    tmp = operate(numbers.shift(), calculate(), op);
                    numbers.unshift(tmp);
                }
                break;
        }

        console.log(numbers);
    }

    let result = numbers.pop();
    numbers.push(result);
    return result;
}

function resetData() {
    numbers = [];
    operands = [];
    displayClear();
}

function displayClear() {
    display.textContent = "";
}

function displayShow(value) {
    display.textContent += value;
}

function displayDeleteOne() {
    const text = display.textContent;
    const newText = text.substring(0, text.length - 1);
    console.log(newText)
    displayClear();
    displayShow(newText);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, operator) {
    console.log('helo');
    switch (operator) {
        case '+':
            return add(a, b);
            break;
        case '-':
            return subtract(a, b);
            break;
        case '*':
            return multiply(a, b);
            break;
        case '/':
            return add(a, b);
            break;
    }
}