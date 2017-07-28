
const isp = { '#': 0, '(': 1, '×': 5, '÷': 5, '+': 3, '-': 3, ')': 6 };
const icp = { '#': 0, '(': 6, '×': 4, '÷': 4, '+': 2, '-': 2, ')': 1 };
const eps = 1e-5;
const all_symbols = '+-×÷()#';
const four_symbols = '+-×÷';

var is_change_symbol = false;
var modify_mod = 0;
var num_bracket = 0;
/*
0: 맨 처음 같은 상황               num - input2 숫자 처음부터 입력(상태 1), sym - 계속 입력(상태 2), del불가
1: 숫자입력 or CE입력              num - 계속 입력(상태 1), sym - 계속 입력(상태 2), 
2: 사칙연산 입력 후(기호 변경 가능) num -  input2 숫자 처음부터 입력(상태 1), sym - 기호 변경(상태 2), del불가 
3: pi입력                         num -  input2 숫자 처음부터 입력(상태 1), sym - 계속 입력(상태 2), del불가
4: 함수 입력                       num - 초기화 후 input2 다시 입력(상태 1), sym - 계속 입력(상태 2), del불가
5: 괄호')' 입력                     num - 에러, sym - 기호만 입력(상태 2), del불가
*/

var secret_input = "";
var my_secret_input = [];
var elem_buttons = document.getElementsByTagName("td");
var elem_funcs = document.getElementsByClassName('func');
var elem_nums = document.getElementsByClassName('num');
var elem_brackets = document.getElementsByClassName('bracket');
var elem_symbols = document.getElementsByClassName('symbol');
var elem_dels = document.getElementsByClassName('del');
var elem_equal = document.getElementById('equal');
var elem_change = document.getElementById('change');

var elem_input1 = document.getElementById("input1");
var elem_input2 = document.getElementById("input2");
var elem_record = document.getElementsByClassName("record");

for (let i = 0; i < elem_nums.length; i++) {
    elem_nums[i].addEventListener('click', input_number);
}
for (let i = 0; i < elem_brackets.length; i++) {
    elem_brackets[i].addEventListener('click', input_bracket);
}
for (let i = 0; i < elem_symbols.length; i++) {
    elem_symbols[i].addEventListener('click', input_symbol);
}
for (let i = 0; i < elem_record.length; i++) {
    elem_record[i].addEventListener('click', function () { load(i); });
}

elem_equal.addEventListener('click', answer);
elem_dels[0].addEventListener('click', ClearEntry);
elem_dels[1].addEventListener('click', Allclear);
elem_dels[2].addEventListener('click', OneDelete);
elem_change.addEventListener('click', change_sumbol);

elem_funcs[0].addEventListener('click', Square);
elem_funcs[1].addEventListener('click', yroot);
elem_funcs[2].addEventListener('click', Sin);
elem_funcs[3].addEventListener('click', Cos);
elem_funcs[4].addEventListener('click', factorial);
elem_funcs[5].addEventListener('click', root);
elem_funcs[6].addEventListener('click', exponent);
elem_funcs[7].addEventListener('click', log);
elem_funcs[8].addEventListener('click', tan);
elem_funcs[9].addEventListener('click', percent);
elem_funcs[10].addEventListener('click', negate);

for (let i = 0; i < elem_buttons.length; i++) {
    elem_buttons[i].addEventListener('click', debug);
}

function debug() {
    if (modify_mod == 6) {
        secret_input = '';
        elem_input1.innerHTML = '';
        elem_input2.innerText = '0';
    }
    console.log("secret_input", secret_input);
}


function is_dot() {
    if (elem_input2.innerText.indexOf('.') != -1) {
        return true;
    }
    return false;
}

function load(num) {
    if (elem_record[num].innerHTML != "") {
        var input1 = elem_record[num].innerHTML.slice(0, elem_record[num].innerHTML.indexOf('='));
        elem_input1.innerHTML = input1;

        var input2 = elem_record[num].innerHTML.slice(elem_record[num].innerHTML.indexOf('<b>') + 3, elem_record[num].innerHTML.indexOf('</b>'));
        elem_input2.innerHTML = input2;

        secret_input = my_secret_input[num];
        modify_mod = 4;
    }
}

function input_number() {
    if (modify_mod == 0 || modify_mod == 2 || modify_mod == 3) {
        if (this.innerText == '.') {
            if (!is_dot()) {
                elem_input2.innerText += this.innerText;
                modify_mod = 1;
            }
        }
        else {
            elem_input2.innerText = this.innerText;
            modify_mod = 1;
        }
    }
    else if (modify_mod == 1) {
        if (elem_input2.innerText == '0') {
            if (this.innerText == '.') {
                if (!is_dot()) {
                    elem_input2.innerText += this.innerText;
                }
            }
            else {
                elem_input2.innerText = this.innerText;
            }
        }
        else {
            if (this.innerText == '.') {
                if (!is_dot()) {
                    elem_input2.innerText += this.innerText;
                }
            }
            else {
                elem_input2.innerText += this.innerText;
            }
        }
    }
    else if (modify_mod == 4) {
        secret_input = '';
        elem_input1.innerHTML = '';
        if (this.innerText == '.') {
            elem_input2.innerText = '0' + this.innerText;
        }
        else {
            elem_input2.innerText = this.innerText;
        }
        modify_mod = 1;
    }
    else if (modify_mod == 5) {
        return;
    }
    else if (modify_mod == 7 || modify_mod == 9) {
        elem_input2.innerText = this.innerText;
        modify_mod++;
    }
    else if (modify_mod == 8 || modify_mod == 10) {
        elem_input2.innerText += this.innerText;
    }
    if (this.innerText == 'π') {
        elem_input2.innerText = Math.PI;
        if (modify_mod == 8 || modify_mod == 10) {
            modify_mod--;
        }
        else {
            modify_mod = 3;
        }
    }
    if (this.innerText == 'e') {
        elem_input2.innerText = Math.E;
        if (modify_mod == 8 || modify_mod == 10) {
            modify_mod--;
        }
        else {
            modify_mod = 3;
        }
    }
}

function input_bracket() {
    if (this.innerText == '(' && modify_mod != 4 &&
        (secret_input.length == 0 || secret_input.lastIndexOf(')') != secret_input.length - 1)) {
        elem_input1.innerHTML += this.innerText;
        secret_input += this.innerText;
        num_bracket++;
        modify_mod = 0;
    }
    else if (this.innerText == ')' && num_bracket > 0) {
        if (secret_input.lastIndexOf('(') == secret_input.length - 1){
            //todo
            return;
        }
        if(secret_input.lastIndexOf(')') != secret_input.length - 1) {
            elem_input1.innerHTML += elem_input2.innerText;
            secret_input += elem_input2.innerText;
        }
        elem_input1.innerHTML += this.innerText;
        secret_input +=  this.innerText;
        if (num_bracket == 0) {
            elem_input2.innerText = get_result(secret_input);
        }
        num_bracket--;
        modify_mod = 5;
    }
}

function input_symbol() {
    if (modify_mod == 0 || modify_mod == 1 || modify_mod == 3) {
        elem_input1.innerHTML += (elem_input2.innerText + this.innerText);
        secret_input += elem_input2.innerText;
        if (num_bracket == 0) {
        elem_input2.innerText = get_result(secret_input);
        }
        secret_input += this.innerText;

        modify_mod = 2;
    }
    else if (modify_mod == 2) {
        elem_input1.innerHTML = elem_input1.innerHTML.slice(0, -1) + this.innerText;
        secret_input = secret_input.slice(0, -1) + this.innerText;
    }
    else if (modify_mod == 4) {
        if (num_bracket == 0) {
        elem_input2.innerText = get_result(secret_input);
        }
        secret_input += this.innerText;
        elem_input1.innerHTML += this.innerText;
        modify_mod = 2;
    }
    else if (modify_mod == 5) {
        elem_input1.innerHTML += this.innerText;
        secret_input += this.innerText;

        modify_mod = 2;
    }
    else if (modify_mod == 7 || modify_mod == 8) {
        var temp_result, temp_txt1;
        for (let i = elem_input1.innerHTML.length - 1; i >= 0; i--) {
            if (four_symbols.indexOf(elem_input1.innerHTML[i]) != -1) {
                temp_txt1 = elem_input1.innerHTML.slice(i + 1, elem_input1.innerHTML.lastIndexOf('^'));
                break;
            }
            else if (i == 0) {
                temp_txt1 = elem_input1.innerHTML.slice(i, elem_input1.innerHTML.lastIndexOf('^'));
                break;
            }
        }
        yroot_cul(temp_txt1, elem_input2.innerText, 1);
        if (num_bracket == 0) {
        elem_input2.innerText = get_result(secret_input);
        }
        elem_input1.innerHTML += this.innerText;
        secret_input += this.innerText;
        modify_mod = 0;
    }
    else if (modify_mod == 9 || modify_mod == 10) {
        var temp_result, temp_txt1;
        for (let i = elem_input1.innerHTML.length - 1; i >= 0; i--) {
            if (four_symbols.indexOf(elem_input1.innerHTML[i]) != -1) {
                temp_txt1 = elem_input1.innerHTML.slice(i + 1, elem_input1.innerHTML.lastIndexOf(' yroot'));
                break;
            }
            else if (i == 0) {
                temp_txt1 = elem_input1.innerHTML.slice(i, elem_input1.innerHTML.lastIndexOf(' yroot'));
                break;
            }
        }
        yroot_cul(temp_txt1, elem_input2.innerText, 2);
        if (num_bracket == 0) {
        elem_input2.innerText = get_result(secret_input);
        }
        elem_input1.innerHTML += this.innerText;
        secret_input += this.innerText;
        modify_mod = 0;
    }

}

function input_function(value, text) {
    if (modify_mod != 5) {
        elem_input2.innerText = value;
        elem_input1.innerHTML += text;
        secret_input += value;

        modify_mod = 4;
    }
}

function my_push(str) {
    my_shift();
    elem_record[0].innerHTML = str;
}

function my_shift() {
    var arr = [];
    for (var i = 0; i < 9; i++) {
        arr.push(elem_record[i].innerHTML);
    }
    for (var i = 1; i < 10; i++) {
        elem_record[i].innerHTML = arr[i - 1];
    }
}

function push_secret(str) {
    var temp = my_secret_input.reverse();
    temp.push(str);
    if(temp.length > 10){
        temp.shift();
    }
    my_secret_input = temp.reverse();
}

function answer() {
    if(num_bracket != 0) {
        return;
    }
    var result;
    if (secret_input.length != 0 && four_symbols.indexOf(secret_input[secret_input.length - 1]) == -1) {
        result = get_result(secret_input);
        my_push(elem_input1.innerHTML + '=<br>' + '<b>' + result + '</b><br><br>');
        push_secret(secret_input);
    }
    else if (modify_mod == 7 || modify_mod == 8) {
        var temp_result, temp_txt1;
        for (let i = elem_input1.innerHTML.length - 1; i >= 0; i--) {
            if (four_symbols.indexOf(elem_input1.innerHTML[i]) != -1) {
                temp_txt1 = elem_input1.innerHTML.slice(i + 1, elem_input1.innerHTML.lastIndexOf('^'));
                break;
            }
            else if (i == 0) {
                temp_txt1 = elem_input1.innerHTML.slice(i, elem_input1.innerHTML.lastIndexOf('^'));
                break;
            }
        }
        yroot_cul(temp_txt1, elem_input2.innerText, 1);
        result = get_result(secret_input);
        my_push(elem_input1.innerHTML + '=<br>' + '<b>' + result + '</b><br><br>');
        push_secret(secret_input);

    }
    else if (modify_mod == 9 || modify_mod == 10) {
        var temp_result, temp_txt1;
        for (let i = elem_input1.innerHTML.length - 1; i >= 0; i--) {
            if (four_symbols.indexOf(elem_input1.innerHTML[i]) != -1) {
                temp_txt1 = elem_input1.innerHTML.slice(i + 1, elem_input1.innerHTML.lastIndexOf(' yroot'));
                break;
            }
            else if (i == 0) {
                temp_txt1 = elem_input1.innerHTML.slice(i, elem_input1.innerHTML.lastIndexOf(' yroot'));
                break;
            }
        }
        yroot_cul(temp_txt1, elem_input2.innerText, 2);
        result = get_result(secret_input);
        my_push(elem_input1.innerHTML + '=<br>' + '<b>' + result + '</b><br><br>');
        push_secret(secret_input);
    }
    else {
        if (secret_input == '' && elem_input2.innerText[0] == '-') {
            secret_input = '0';
        }
        result = get_result(secret_input + elem_input2.innerText);
        my_push(elem_input1.innerHTML + elem_input2.innerText + '=<br>' + '<b>' + result + '</b><br><br>');
        push_secret(secret_input + elem_input2.innerText);
    }
    elem_input2.innerText = result;
    elem_input1.innerHTML = '';
    secret_input = '';
    modify_mod = 0;

    for (let i = 0; i < 10; i++) {
        var name = "calculator_record" + i;
        localStorage.setItem(name, elem_record[i].innerHTML);
        name = "scret_record" + i;
        localStorage.setItem(name, my_secret_input[i]);
    }
}


function Square() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        if (!is_change_symbol) {
            input_function(Math.pow(num, 2), num + "<sup>2</sup>");
        }
        else {
            input_function(Math.pow(num, 3), num + "<sup>3</sup>");
        }
    }
}

function yroot() {
    var num = elem_input2.innerText;
    if (modify_mod < 7 && modify_mod != 4) {
        if (!is_change_symbol) {
            elem_input1.innerHTML += (num + "^");
            modify_mod = 7;
        }
        else {
            elem_input1.innerHTML += (num + " yroot");
            modify_mod = 9;
        }
    }
}

function yroot_cul(x, y, mode) {
    var num = elem_input2.innerText;
    if (mode == 1) {
        secret_input += Math.pow(x, y);
        elem_input1.innerHTML += y;
    }
    else if (mode == 2) {
        secret_input += Math.pow(x, 1 / y);
        elem_input1.innerHTML += y;
    }
}

function Sin() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        if (!is_change_symbol) {
            input_function(Math.sin(num * Math.PI / 180).toFixed(10) * 1, "sin(" + num + "°)");
        }
        else {
            if (isNaN(Math.asin(num) * 180 / Math.PI * 1)) {
                modify_mod = 6;
                input_function("输入错误", "arcsin(" + num + ")");
            }
            else {
                input_function(Math.asin(num) * 180 / Math.PI * 1, "arcsin(" + num + ")");
            }
        }
    }
}
function Cos() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        if (!is_change_symbol) {
            input_function(Math.cos(num * Math.PI / 180).toFixed(10) * 1, "cos(" + num + "°)");
        }
        else {
            if (isNaN(Math.acos(num) * 180 / Math.PI * 1)) {
                modify_mod = 6;
                input_function("输入错误", "arccos(" + num + ")");
            }
            else {
                input_function(Math.acos(num) * 180 / Math.PI * 1, "arccos(" + num + ")");
            }
        }
    }
}
function tan() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        if (!is_change_symbol) {
            if ((num - 90) % 180 == 0) {
                modify_mod = 6;
                input_function("输入错误", "tan(" + num + "°)");
            }
            else {
                input_function(Math.tan(num * Math.PI / 180) * 1, "tan(" + num + "°)");
            }
        }
        else {
            input_function(Math.atan(num) * 180 / Math.PI * 1, "arctan(" + num + ")");
        }
    }
}
function root() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        if (!is_change_symbol) {
            if (isNaN(Math.sqrt(num))) {
                modify_mod = 6;
                input_function("输入错误", "√(" + num + ")");
            }
            else {
                input_function(Math.sqrt(num), "√(" + num + ")");
            }
        }
        else {
            if (num == "0") {
                modify_mod = 6;
                input_function("输入错误", "1/(" + num + ")");
            }
            else {
                input_function(1 / num, "1/(" + num + ")");
            }
        }
    }
}
function exponent() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        if (!is_change_symbol) {
            input_function(Math.pow(10, num), "10" + "<sup>" + num + "</sup>");
        }
        else {
            input_function(Math.pow(Math.E, num), "e" + "<sup>" + num + "</sup>");
        }
    }
}

function log() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        if (!is_change_symbol) {
            if (isNaN(Math.log10(num)) || num == '0') {
                modify_mod = 6;
                input_function("输入错误", "log(" + num + ")");
            }
            else {
                input_function(Math.log10(num), "log(" + num + ")");
            }
        }
        else {
            if (isNaN(Math.log(num)) || num == '0') {
                modify_mod = 6;
                input_function("输入错误", "ln(" + num + ")");
            }
            else {
                input_function(Math.log(num), "ln(" + num + ")");
            }
        }
    }
}

function factorial() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = Math.floor(Number(elem_input2.innerText));
        var result = 1;
        if (num < 0) {
            modify_mod = 6;
            input_function("输入错误", num + '!');
            return;
        }
        for (let i = 1; i <= num; i++) {
            result *= i;
        }
        input_function(result, num + '!');
    }
}
function negate() {
    if (elem_input2.innerText != "0") {
        if (elem_input2.innerText[0] == '-') {
            elem_input2.innerText = elem_input2.innerText.slice(1, elem_input2.innerText.length);
        }
        else {
            elem_input2.innerText = '-' + elem_input2.innerText;
        }
    }
}
function percent() {
    if (modify_mod < 7 && modify_mod != 4) {
        var num = elem_input2.innerText;
        input_function(num / 100, num + "%");
    }
}

function change_sumbol() {
    if (is_change_symbol) {
        is_change_symbol = false;

        elem_funcs[0].innerHTML = "<i>x </i><sup>2</sup>";
        elem_funcs[1].innerHTML = "<i>x <sup>y</sup></i>";
        elem_funcs[2].innerHTML = "sin";
        elem_funcs[3].innerHTML = "cos";
        elem_funcs[5].innerHTML = "√";
        elem_funcs[6].innerHTML = "10 <i><sup>x</sup></i>";
        elem_funcs[7].innerHTML = "log";
        elem_funcs[8].innerHTML = "tan";
    }
    else {
        is_change_symbol = true;

        elem_funcs[0].innerHTML = "<i>x </i><sup>3</sup>";
        elem_funcs[1].innerHTML = "<i><sup>y</sup>√x</i>";
        elem_funcs[2].innerHTML = "sin <sup>-1</sup>";
        elem_funcs[3].innerHTML = "cos <sup>-1</sup>";
        elem_funcs[8].innerHTML = "tan <sup>-1</sup>";
        elem_funcs[5].innerHTML = "<sup>1</sup>/<i>x</i>";
        elem_funcs[6].innerHTML = "e <i><sup>x</sup></i>";
        elem_funcs[7].innerHTML = "ln";
        elem_funcs[8].innerHTML = "tan <sup>-1</sup>";
    }
}

function ClearEntry() {
    elem_input2.innerText = '0';
    if (modify_mod < 7) {
        modify_mod = 0;
    }
}
function Allclear() {
    elem_input1.innerHTML = '';
    elem_input2.innerText = '0';
    secret_input = '';
    modify_mod = 0;
}
function OneDelete() {
    if (modify_mod == 1) {
        if (elem_input2.innerText.length > 0) {
            elem_input2.innerText = elem_input2.innerText.slice(0, -1);
        }
        if (elem_input2.innerText.length == 0) {
            elem_input2.innerText = '0';
        }
        modify_mod = 1;
    }
}

function change_to_Suffix(infixArray) {
    var tempArray = ['#'];
    var suffixArray = [];
    var top, element;
    infixArray.push('#');
    for (var i = 0; i < infixArray.length;) {
        if (all_symbols.indexOf(infixArray[i]) == -1) {
            suffixArray.push(infixArray[i]);
            i++;
        } else {
            top = tempArray[tempArray.length - 1];
            if (icp[infixArray[i]] > isp[top]) {
                tempArray.push(infixArray[i]);
                i++;
            }
            else if (icp[infixArray[i]] < isp[top]) {
                element = tempArray.pop();
                suffixArray.push(element);
            } else {
                element = tempArray.pop();
                if (element == '(' || '#') i++;
            }
        }
    }
    return suffixArray;
}

function separate(expression) {
    var tempArray = [], finalArray = [];
    expression = expression.replace(/--/g, '+');
    for (var i = 0; i < expression.length; i++) {
        if (all_symbols.indexOf(expression[i]) == -1 || (expression[i] == '+' && i == 0) ||
            (expression[i] == '-' && (i == 0 || four_symbols.indexOf(expression[i - 1]) != -1 ||
                expression[i - 1] == '('))) {
            if (expression[i] == 'e') {
                tempArray.push(expression[i]);
                i++;
            }
            tempArray.push(expression[i]);
        } else {
            if (tempArray.length != 0) {
                var a = tempArray.join('');
                finalArray.push(a);
                tempArray = [];
            }
            finalArray.push(expression[i]);
        }
    }
    if (tempArray.length > 0) {
        var a = tempArray.join('');
        finalArray.push(a);
    }
    return finalArray;
}
function calculate(suffixArray) {
    var calculator = [];
    for (var i = 0; i < suffixArray.length; i++) {
        if (all_symbols.indexOf(suffixArray[i]) == -1) {
            element = parseFloat(suffixArray[i]);
            calculator.push(element);
        }
        else {
            var element1 = calculator.pop();
            var element2 = calculator.pop();

            if (suffixArray[i] == '+') {
                element = element1 + element2;
            }
            else if (suffixArray[i] == '-') {
                element = element2 - element1;
            }
            else if (suffixArray[i] == '×') {
                element = element2 * element1;
            }
            else if (suffixArray[i] == '÷') {
                element = element2 / element1;
            }

            calculator.push(element);
        }
    }
    var calculateResult = calculator.pop();
    calculateResult = to_round(calculateResult);
    return calculateResult;
}

function to_round(result) {
    var resultI = Math.round(result * 1e5);
    if (Math.abs(resultI - result * 1e5) < eps) {
        result = resultI / 1e5;
    }
    return result;
}

function get_result(calculus) {
    return calculate(change_to_Suffix(separate(calculus)));
}

function load_record() {
    for (var i = 0; i < 10; i++) {
        var name = 'calculator_record' + i;
        elem_record[i].innerHTML = localStorage.getItem(name);
    }
    var i = 0;
    var name = "scret_record" + i;
    while(localStorage.getItem(name)){
        my_secret_input.push(localStorage.getItem(name));
        i++;
        name = "scret_record" + i;
    }
}

function change_calculator(selector) {
    document.location = selector.value + '.html';
}