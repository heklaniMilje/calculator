const themeLabel = document.querySelector('.theme label');
const themeChkBox = document.querySelector('input[type=checkbox]');
const body = document.querySelector('body');
const calculator = document.querySelector('.calculator');
const buttons = Array.from(document.querySelectorAll('.button'));
const footer = document.querySelector('footer');
const display = document.querySelector('.display');
const numBtns = Array.from(document.querySelectorAll('button.number'));
numBtns.push(document.querySelector('.dot'));
const opBtns = Array.from(document.querySelectorAll('.op'));
const acBtn = document.querySelector('.delete');
const delBtn = document.querySelector('.delete-one');
const dotBtn = document.querySelector('.dot');
const calculateBtn = document.querySelector('.calculate');

let numbers = [];
let operators = [];
let number = [];
let result = 0;
let keyInputFlag = false;
const themableElements = [body, themeLabel, calculator, display, buttons, footer];

const storedTheme = JSON.parse(localStorage.getItem('darkTheme'));
let darkMode = storedTheme != null ? storedTheme.isDark : false;
console.log(darkMode)
refreshTheme();

window.addEventListener('keyup', keyInput);

themeChkBox.addEventListener('click', themeChange);
// window.addEventListener('load', handleThemeOnLoad);

numBtns.forEach(btn => btn.addEventListener('click', inputNumber));
opBtns.forEach(btn => btn.addEventListener('click', inputOperators));
acBtn.addEventListener('click', resetData);
delBtn.addEventListener('click', deleteOne);
calculateBtn.addEventListener('click', calculation);


function refreshTheme(){
    if(darkMode){
        themeChkBox.checked = true;
        loadTheme();}
}

function loadTheme() {
        themableElements.forEach(el => {
            if (Array.isArray(el))
                el.forEach(btn => btn.classList.toggle('dark'));
            else
                el.classList.toggle('dark');
        });
    
}

function themeChange(e) {
    darkMode = !darkMode;
    let theme = { isDark: darkMode };
    localStorage.setItem('darkTheme', JSON.stringify(theme));
    loadTheme();
}

function keyInput(e) {
    if (e.keyCode == 13) {
        calculation();
        return;
    }
    else if(e.keyCode == 8){
        deleteOne();
        return;
    }

    keyInputFlag = true;
    if (/[0-9\.]/.test(e.key))
        inputNumber(e.key);
    else if (/[\+\-\*\/]/.test(e.key))
        inputOperators(e.key);
}

// function handleThemeOnLoad() {
//     themeLabel.classList.add('loaded');
//     setInterval(function () {
//         themeLabel.classList.remove('loaded');
//         themeLabel.classList.add('unloaded');
//     }, 500);
// }

// themeCheck();


// function themeCheck() {
//     if(currentTheme === null)
//         return;
//     else if (currentTheme.isDark) {
//         themeChkBox.checked = true;
//         themeChange();
//     }
// }


function deleteOne(e) {

    const text = display.textContent;
    if (text == "") return;

    if (number.length != 0)
        addToNumbers();

    const last = text.substr(-1);

    if (isNumeric(last)) {
        let num = numbers.pop();

        num = removeLastDigit(num);
        if (!isNaN(num))
            addToNumbers(num);
    }
    else if (/[\+\-\*\/]/.test(last)) {
        operators.pop();
    }

    displayDeleteOne();
}

function calculation() {
    // add last written number when = pressed
    floatFlagOff();
    addToNumbers();
    displayClear();
    displayShow(calculate());
    addToNumbers(result);
}

function inputOperators(e) {
    let inputValue = keyInputFlag ? e : e.target.textContent;
    keyInputFlag = false;
    displayShow(" " + inputValue + " ");

    // add last written number when +-*/ pressed
    addToNumbers();
    operators.push(inputValue);
}

function inputNumber(e) {
    let inputValue = keyInputFlag ? e : e.target.textContent;
    keyInputFlag = false;

    displayShow(inputValue);

    if (inputValue == '.')
        inputValue = handleFloat();
    number.length == 0 ? number.push(inputValue)
        : number.push(number.pop() + inputValue);

}



function calculate() {

    if (numbers.length == 0) return "";

    let tmp = 0;

    while (numbers.length != 1) {
        let op = operators.shift();
        switch (op) {
            case '*':
            case '/':
                tmp = operate(numbers.shift(), numbers.shift(), op);
                numbers.unshift(tmp);
                break;
            case '+':
            case '-':
                if (operators.length == 0 || operators[0] == '+' || operators[0] == '-') {
                    tmp = operate(numbers.shift(), numbers.shift(), op);
                    numbers.unshift(tmp);
                }
                else {
                    tmp = operate(numbers.shift(), calculate(), op);
                    numbers.unshift(tmp);
                }
                break;
        }

    }
    result = numbers.shift();
    return result;
}

function resetData() {
    numbers = [];
    operators = [];
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
    const newText = text.substring(0, text.length - 1).trim();
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

    if (b == 0) {
        displayShow("ERROR zero division");
        return;
    }

    return a / b;
}

function operate(a, b, operator) {
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
            return divide(a, b);
            break;
    }
}

function addToNumbers(...num) {
    floatFlagOff();
    if (num.length != 0)
        numbers.push(num[0]);
    else if (number.length != 0) {
        numbers.push(parseFloat(number.pop()));
    }
}

function handleFloat() {
    floatFlag = true;
    dotBtn.disabled = true;

    if (number.length != 0 && /[\.]/.test(number.toString())) {
        console.log(number);
        return;
    }
    else
        return '.';
}

function floatFlagOff() {
    dotBtn.disabled = false;
    floatFlag = false;
}

function isNumeric(num) {
    return !isNaN(num);
}


function removeLastDigit(num) {
    let strNum = num.toString();
    return parseFloat(strNum.substring(0, strNum.length - 1));
}