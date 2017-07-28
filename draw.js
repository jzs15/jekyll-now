const isp = { '#': 0, '(': 1, '×': 5, '÷': 5, '+': 3, '-': 3, ')': 6 };
const icp = { '#': 0, '(': 6, '×': 4, '÷': 4, '+': 2, '-': 2, ')': 1 };
const eps = 1e-5;
const all_symbols = '+-×÷()#';

var num_bracket = 0;
const four_symbols = '+-×÷';
const special_nums = 'πex';
const bagic_nums = '0123456789';
var minX = -10, maxX = 10, dx = 0.01;
var fn;

var elem_input = document.getElementById('input');
var elem_nums = document.getElementsByClassName('num');
var elem_brackets = document.getElementsByClassName('bracket');
var elem_symbols = document.getElementsByClassName('symbol');
var elem_equal = document.getElementById('equal');
var elem_input = document.getElementById('input');
var elem_funcs = document.getElementsByClassName('func');
var elem_dels = document.getElementsByClassName('del');
var elem_record = document.getElementsByClassName("record");
var elem_settings = document.getElementsByClassName("input_setting");

elem_equal.addEventListener('click', answer);

elem_funcs[0].addEventListener('click', Sin);
elem_funcs[1].addEventListener('click', Cos);
elem_funcs[2].addEventListener('click', tan);
elem_funcs[3].addEventListener('click', arcSin);
elem_funcs[4].addEventListener('click', arcCos);
elem_funcs[5].addEventListener('click', arctan);
elem_funcs[6].addEventListener('click', exponent);
elem_funcs[7].addEventListener('click', log);
//elem_funcs[8].addEventListener('click', MyX);
elem_funcs[8].addEventListener('click', ln);

elem_dels[0].addEventListener('click', Allclear);
elem_dels[1].addEventListener('click', OneDelete);

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

function input_number() {
    if (elem_input.innerHTML.length == 0 ||
        elem_input.innerHTML[elem_input.innerHTML.length - 1] != ')') {
        if (this.innerText == '.') {
            if (!is_dot() && elem_input.innerHTML.length > 0) {
                if (!isNaN(elem_input.innerHTML[elem_input.innerHTML.length - 1])) {
                    elem_input.innerHTML += this.innerText;
                }
            }
        }
        else {
            if(elem_input.innerHTML.length == 0 || elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' '){
                elem_input.innerHTML += this.innerText;
            }
            else {
                if (isNaN(this.innerText)) {
                    if (bagic_nums.indexOf(elem_input.innerHTML[elem_input.innerHTML.length - 1]) != -1 ||
                        special_nums.indexOf(elem_input.innerHTML[elem_input.innerHTML.length - 1]) != -1) {
                        return;
                    }
                    elem_input.innerHTML += this.innerText;
                }
                else {
                    if(special_nums.indexOf(elem_input.innerHTML[elem_input.innerHTML.length - 1]) != -1) {
                        return;
                    }
                    elem_input.innerHTML += this.innerText;
                }
            }
        }
    }
}

function input_bracket() {
    if (this.innerText == '(' && num_bracket == 0) {
        if (elem_input.innerHTML.length == 0 || elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' ||
            (isNaN(elem_input.innerHTML[elem_input.innerHTML.length - 1]) && elem_input.innerHTML[elem_input.innerHTML.length - 1] != ')')) {
            elem_input.innerHTML += this.innerText;
            num_bracket++;
        }
    }
    else if (this.innerText == ')' && num_bracket > 0 &&
        (bagic_nums.indexOf(elem_input.innerHTML[elem_input.innerHTML.length - 1]) != -1 ||
            special_nums.indexOf(elem_input.innerHTML[elem_input.innerHTML.length - 1]) != -1)) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] != '(') {
            elem_input.innerHTML += this.innerText;
            num_bracket--;
        }
    }
}

function input_symbol() {
    if (elem_input.innerHTML.length == 0 && this.innerText != '-') {
        return;
    }
    for (let i = elem_input.innerHTML.length - 1; i >= 0; i--) {
        if (four_symbols.indexOf(elem_input.innerHTML[i]) != -1) {
            elem_input.innerHTML = elem_input.innerHTML.slice(0, i);
            elem_input.innerHTML += this.innerText;
            if(num_bracket == 0) {
                elem_input.innerHTML += ' ';
            }
            return;
        }
        else if (elem_input.innerHTML[i] != ' ') {
            break;
        }
    }

    if (num_bracket == 0) {
        elem_input.innerHTML += (' ' + this.innerText + ' ');
    }
    else {
        elem_input.innerHTML += this.innerText;
    }
}

function is_dot() {
    for(let i = elem_input.innerHTML.length; i >= 0; i--){
        if(four_symbols.indexOf(elem_input.innerHTML[i]) != -1){
            return false;
        }
        else if(elem_input.innerHTML[i] == '.') {
            return true;
        }
    }
    return false;
}

function Allclear() {
    elem_input.innerHTML = '';
    num_bracket = 0;
    fn('graph', []);
}

function OneDelete() {
    if (elem_input.innerHTML.length > 0) {
        if (num_bracket == 0 && elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ') {
            elem_input.innerHTML = elem_input.innerHTML.slice(0, -3);
        }
        else {
            if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ')') {
                num_bracket++;
            }
            else if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == '(') {
                num_bracket--;
                if (elem_input.innerHTML.lastIndexOf('arc') == elem_input.innerHTML.length - 7) {
                    elem_input.innerHTML = elem_input.innerHTML.slice(0, -7);
                    return;
                }
                else if (elem_input.innerHTML.lastIndexOf('sin') == elem_input.innerHTML.length - 4 ||
                    elem_input.innerHTML.lastIndexOf('cos') == elem_input.innerHTML.length - 4 ||
                    elem_input.innerHTML.lastIndexOf('tan') == elem_input.innerHTML.length - 4 ||
                    elem_input.innerHTML.lastIndexOf('log') == elem_input.innerHTML.length - 4) {
                    elem_input.innerHTML = elem_input.innerHTML.slice(0, -4);
                    return;
                }
                else if (elem_input.innerHTML.lastIndexOf('ln') == elem_input.innerHTML.length - 3) {
                    elem_input.innerHTML = elem_input.innerHTML.slice(0, -3);
                    return;
                }
                else if (elem_input.innerHTML.lastIndexOf('^') == elem_input.innerHTML.length - 2) {
                    elem_input.innerHTML = elem_input.innerHTML.slice(0, -2);
                    return;
                }
            }
            elem_input.innerHTML = elem_input.innerHTML.slice(0, -1);
        }
    }
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

function load(num) {
    if (elem_record[num].innerHTML != "") {
        elem_input.innerHTML = elem_record[num].innerHTML;
        draw_graph();
    }
}

function answer() {
    if(elem_input.innerHTML.length > 0 && num_bracket == 0) {
        my_shift();
        elem_record[0].innerHTML = elem_input.innerHTML;
        for (let i = 0; i < 10; i++) {
            var name = "draw_record" + i;
            localStorage.setItem(name, elem_record[i].innerHTML);
        }
        draw_graph();
    }
}

function draw_graph() {
    var data = [];
    var arr = elem_input.innerHTML.split(' ');
    for (var i = 0; i < arr.length; i += 2) {
        if (isNaN(arr[i])) {
            if (arr[i] == 'π') {
                arr[i] = Math.PI;
            }
            else if (arr[i] == 'e') {
                arr[i] = Math.E;
            }
            else {
                arr[i] = parse(arr[i]);
            }
        }
    }
    function get_data(arr) {
        for (var i = minX; i <= maxX; i += dx) {
            var temp = arr.concat();
            i = i.toFixed(10) * 1;
            var result = '';
            for (var j = 0; j < temp.length; j++) {
                temp[j] = temp[j].toString();
                if (temp[j].indexOf('x') != -1) {
                    temp[j] = temp[j].replace(/x/g, i);
                }
                temp[j] = figure(temp[j]);
                result += temp[j];
            }
            result = get_result(result);
            if (isNaN(result)) {
                data.push([i, null]);
            }
            else {
                data.push([i, result]);
            }
        }
    }
    get_data(arr);
    fn('graph', data);
    console.log(data);
}

function parse(elem) {
    elem = elem.replace(/e/g, Math.E);
    elem = elem.replace(/π/g, Math.PI);
    return elem;
}

function figure(elem) {
    if (elem.indexOf('arcsin') != -1) {
        var num = elem.slice(7, elem.length - 1);
        if(num[0] == '-') {
            num = '0' + num;
        }
        num = get_result(num);
        return Math.asin(num);
    }
    else if (elem.indexOf('arccos') != -1) {
        var num = elem.slice(7, elem.length - 1);
        if(num[0] == '-') {
            num = '0' + num;
        }
        num = get_result(num);
        return Math.acos(num);
    }
    else if (elem.indexOf('arctan') != -1) {
        var num = elem.slice(7, elem.length - 1);
        if(num[0] == '-') {
            num = '0' + num;
        }
        num = get_result(num);
        return Math.atan(num);
    }
    else if (elem.indexOf('sin') != -1) {
        var num = elem.slice(4, elem.length - 1);
        num = get_result(num);
        return Math.sin(num);
    }
    else if (elem.indexOf('cos') != -1) {
        var num = elem.slice(4, elem.length - 1);
        if(num[0] == '-') {
            num = '0' + num;
        }
        num = get_result(num);
        return Math.cos(num);
    }
    else if (elem.indexOf('tan') != -1) {
        var num = elem.slice(4, elem.length - 1);
        if(num[0] == '-') {
            num = '0' + num;
        }
        num = get_result(num);
        return Math.tan(num);
    }
    else if (elem.indexOf('log') != -1) {
        var num = elem.slice(4, elem.length - 1);
        if(num[0] == '-') {
            num = '0' + num;
        }
        num = get_result(num);
        if(num == 0) {
            return "NaN";
        } 
        return Math.log10(num);
    }
    else if (elem.indexOf('ln') != -1) {
        var num = elem.slice(3, elem.length - 1);
        if(num[0] == '-') {
            num = '0' + num;
        }
        num = get_result(num);
        if(num == 0) {
            return "NaN";
        } 
        return Math.log(num);
    }
    else if (elem.indexOf('^') != -1) {
        var num1 = elem.slice(elem.indexOf('(') + 1, elem.length - 1);
        if(num1[0] == '-') {
            num1 = '0' + num1;
        }
        num1 = get_result(num1);
        var num2 = elem.slice(0, elem.indexOf('(') - 1);
        return Math.pow(num2, num1);
    }
    return elem;
}

function Sin() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "sin(";
            num_bracket++;
        }
    }
}

function Cos() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "cos(";
            num_bracket++;
        }
    }
}

function tan() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "tan(";
            num_bracket++;
        }
    }
}

function arcSin() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "arcsin(";
            num_bracket++;
        }
    }
}

function arcCos() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "arccos(";
            num_bracket++;
        }
    }
}

function arctan() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "arctan(";
            num_bracket++;
        }
    }
}

function exponent() {
    if (num_bracket == 0) {
        if(!isNaN(elem_input.innerHTML[elem_input.innerHTML.length-1]) || special_nums.indexOf(elem_input.innerHTML[elem_input.innerHTML.length-1]) != -1) {
            elem_input.innerHTML += "^(";
            num_bracket++;
        }
    }
}

function log() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "log(";
            num_bracket++;
        }
    }
}

function ln() {
    if (num_bracket == 0) {
        if (elem_input.innerHTML[elem_input.innerHTML.length - 1] == ' ' || elem_input.innerHTML.length == 0) {
            elem_input.innerHTML += "ln(";
            num_bracket++;
        }
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


$(function () {
    var charts = [];
    var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    Highcharts.setOptions({
        colors: colors,
        global : {
          useUTC : false
        }
    });

    function makeChart(divId, coordinate) {
      var chart = new Highcharts.Chart({
          chart: {
              renderTo: divId,
              type: 'spline'
          },
          title: {
              text: '',
          },
          xAxis: {
              title: {
                  enabled: false,
              },
          },
          yAxis: {
              title: {
                  enabled: false,
              }
          },
          plotOptions: {
              series: {
                  marker: {
                      enabled: false
                  },
                  states: {
                    hover: {
                        lineWidth: 5
                    }
                  },
                  shadow: false,
                  events: {
                      mouseOver: function(event) {
                          this.chart.series[this.index].graph.attr({ 
                              style: 'opacity:1;z-index:99;'
                          });
                      },
                      mouseOut: function(event) {
                          this.chart.series[this.index].graph.attr({ 
                              style: ''
                          });
                      },
                      legendItemClick: function(event) {
                          var seriesIndex = this.index;
                          var series = this.chart.series;

                          if (series.length <= 1) {
                              return true;
                          }

                          var showAll = false;
                          var checkIndex = 0;
                          if (checkIndex == seriesIndex) {
                                checkIndex = 1;
                          }
                          
                          if (this.visible) {
                             if (!series[checkIndex].visible) {
                                 showAll = true;
                             }
                          }

                          for (var i = 0; i < series.length; i++)
                          {
                              if (!showAll && series[i].index != seriesIndex)
                              {
                                  series[i].hide();
                              } 
                              else
                              {
                                  series[i].show();
                              }
                          }
                          series = null;
                          return false;
                      }
                  }
              }
          },
          legend: {
          },
          credits: {
              enabled: false
          },
          tooltip: {
              formatter: function() {
                      return '<span style="color:'+ this.series.color + ';font-weight:bold;">x：</span><b>' + this.x +
                      '</b><br/><span style="color:'+ this.series.color + ';font-weight:bold;">y：</span><b>' + this.y + '</b>';
              },
              crosshairs: true
          },
          series: [{
              name: 'f(x)',
              data: coordinate
          }]
      }, function(chartObj) {
        $.each(chartObj.legend.allItems, function(i, item) {
          $.each(item.legendItem, function(j, element) {
            if (!element) return;
            $(element.element).hover(function(){
              item.graph.attr({ 
                style: 'opacity:1;z-index:99;'
              });
            }, function() {
              item.graph.attr({ 
                style: ''
              });

            });
          });

        });
      });
      return chart;
    }
    fn = makeChart;
});

function change_calculator(selector) {
    document.location = selector.value + '.html';
}

function load_record() {
    for (var i = 0; i < 10; i++) {
        var name = "draw_record" + i;
        elem_record[i].innerHTML = localStorage.getItem(name);
    }
}

function change_setting() {
    if(Number(elem_settings[1].value) >= Number(elem_settings[0].value)){
        alert("minX 不能大于或等于 maxX");
        elem_settings[1].value = minX;
        elem_settings[0].value = maxX;
        return;
    }
    if(Number(elem_settings[2].value) > 5000){
        alert("'间隔' 不能过大");
        elem_settings[2].value = 2000;
        return;
    }
    else if(Number(elem_settings[2].value) <= 0){
        alert("'间隔' 不能小于或等于 0");
        elem_settings[2].value = 2000;
        return;
    }
    minX = Number(elem_settings[1].value);
    maxX = Number(elem_settings[0].value);
    dx = (maxX - minX) / Number(elem_settings[2].value);
}