var is_active = 1;

var request = new XMLHttpRequest();
var xmlrate = '1';
var xmltime = '2017/01/01';
var current1 = 'USD';
var current2 = 'CNY';

var elem_nums = document.getElementsByClassName('num');
var elem_funcs = document.getElementsByClassName('func');
var elem_country1 = document.getElementsByClassName('country')[0];
var elem_country2 = document.getElementsByClassName('country')[1];
var elem_input1 = document.getElementsByClassName('input')[0];
var elem_input2 = document.getElementsByClassName('input')[1];
var elem_sel1 = document.getElementsByName('country_sel')[0];
var elem_sel2 = document.getElementsByName('country_sel')[1];
var elem_info = document.getElementById('info');
var elem_record = document.getElementsByClassName("record");
var elem_save = document.getElementById('save');

for(let i = 0; i < elem_nums.length; i++) {
    elem_nums[i].addEventListener('click', input_number);
}
for (let i = 0; i < elem_record.length; i++) {
    elem_record[i].addEventListener('click', function () { load(i); });
}

elem_funcs[0].addEventListener('click', Allclear);
elem_funcs[1].addEventListener('click', OneDelete);

elem_input1.addEventListener('click', function () { active_change(1); });
elem_input2.addEventListener('click', function () { active_change(2); });

elem_save.addEventListener('click', Save);

function input_number() {
    if(is_active == 1) {
        if ((this.innerText == '.' && is_dot(elem_input1)) ||
            elem_input1.innerText.length >= 15) {
            return;
        }
        if ((elem_input1.innerText == '0' && this.innerText != '.') ||
            isNaN(elem_input1.innerText)) {
            elem_input1.innerText = this.innerText;
        }
        else {
            elem_input1.innerText += this.innerText;
        }
        elem_input2.innerText = (elem_input1.innerText * xmlrate).toFixed(10) * 1;
        if(isNaN(elem_input2.innerText)) {
            //todo
        }
    }
    else if (is_active == 2) {
        if ((this.innerText == '.' && is_dot(elem_input2)) ||
            elem_input2.innerText.length >= 15) {
            return;
        }
        if ((elem_input2.innerText == '0' && this.innerText != '.') ||
            isNaN(elem_input2.innerText)) {
            elem_input2.innerText = this.innerText;
        }
        else {
            elem_input2.innerText += this.innerText;
        };
        elem_input1.innerText = (elem_input2.innerText * xmlrate).toFixed(10) * 1;
        if(isNaN(elem_input2.innerText)) {
           //todo 
        }
    }
}

function is_dot(elem_input) {
    if (elem_input.innerText.indexOf('.') != -1) {
        return true;
    }
    return false;
}

function Allclear() {
    elem_input1.innerText = '0'
    elem_input2.innerText = '0'
}

function OneDelete() {
    if (is_active == 1) {
        if (elem_input1.innerText.length > 0) {
            elem_input1.innerText = elem_input1.innerText.slice(0, -1);
        }
        if (elem_input1.innerText.length == 0) {
            elem_input1.innerText = '0';
        }
        elem_input2.innerText = (elem_input1.innerText * xmlrate).toFixed(10) * 1;
    }
    else if (is_active == 2) {
        if (elem_input2.innerText.length > 0) {
            elem_input2.innerText = elem_input2.innerText.slice(0, -1);
        }
        if (elem_input2.innerText.length == 0) {
            elem_input2.innerText = '0';
        }
        elem_input1.innerText = (elem_input2.innerText * xmlrate).toFixed(10) * 1;
    }
}

function update_data() {
    if(is_active == 1) {
    var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22' +
        elem_sel1.value + elem_sel2.value + '%22&format=xml&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    }
    else {
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22' +
        elem_sel2.value + elem_sel1.value + '%22&format=xml&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    }
    request.open("GET", url, true);

    
    request.send();
    request.onreadystatechange = update_money;
}

function update_money() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            xmlrate = request.responseXML.getElementsByTagName("Rate")[0].innerHTML;
            xmltime = request.responseXML.getElementsByTagName("Date")[0].innerHTML;
            update_time();
            if(is_active == 1){
                elem_input2.innerText = (elem_input1.innerText * xmlrate).toFixed(10) * 1;
            }
            else if(is_active == 2) {
                elem_input1.innerText = (elem_input2.innerText * xmlrate).toFixed(10) * 1;
            }
        }
    }
}

function update_time() {
    elem_info.innerHTML = '更新时间: ';
    if(xmltime != 'N/A') {
    var xml_year = xmltime.slice(xmltime.lastIndexOf('/') + 1, xmltime.length);
    var xml_month = xmltime.slice(0, xmltime.indexOf('/'));
    var xml_day = xmltime.slice(xmltime.indexOf('/') + 1, xmltime.lastIndexOf('/'));
    elem_info.innerHTML += xml_year + '年' + xml_month + '月' + xml_day + '日'
        + request.responseXML.getElementsByTagName("Time")[0].innerHTML;
    }
}

function init() {
    var items="<option value='USD'>美元 (USD)</option><option value='CNY'>人民幣 (CNY)</option><option value='KRW'>南韓圜 (KRW)</option><option value='HKD'>港元 (HKD)</option><option value='EUR'>歐元 (EUR)</option><option value='GBP'>英鎊 (GBP)</option><option value='AUD'>澳元 (AUD)</option><option value='CAD'>加拿大元 (CAD)</option><option value='CHF'>瑞士法郎 (CHF)</option><option value='IDR'>印尼盾 (IDR)</option><option value='INR'>印度盧比 (INR)</option><option value='JPY'>日圓 (JPY)</option><option value='THB'>泰銖 (THB)</option><option value='ALL'>阿爾巴尼亞列克 (ALL)</option><option value='DZD'>阿爾及利亞第納爾 (DZD)</option><option value='XAL'>鋁 (每盎司) (XAL)</option><option value='ARS'>阿根廷比索 (ARS)</option><option value='AWG'>阿魯巴島弗羅林 (AWG)</option><option value='BSD'>巴哈馬元 (BSD)</option><option value='BHD'>巴林第納爾 (BHD)</option><option value='BDT'>孟加拉塔卡 (BDT)</option><option value='BBD'>巴貝多元 (BBD)</option><option value='BYR'>白俄羅斯盧布 (BYR)</option><option value='BZD'>貝里斯元 (BZD)</option><option value='BMD'>百慕達元 (BMD)</option><option value='BTN'>不丹, 努爾特魯姆 (BTN)</option><option value='BOB'>玻利維亞諾 (BOB)</option><option value='BWP'>波札那普拉 (BWP)</option><option value='BRL'>巴西雷亞爾 (BRL)</option><option value='BND'>汶萊元 (BND)</option><option value='BGN'>保加利亞列弗 (BGN)</option><option value='BIF'>蒲隆地法郎 (BIF)</option><option value='KHR'>柬埔寨里耳 (KHR)</option><option value='CVE'>維德角埃斯庫多 (CVE)</option><option value='KYD'>開曼群島元 (KYD)</option><option value='XOF'>CFA 法朗 (BCEAO) (XOF)</option><option value='XAF'>CFA 法朗 (BEAC) (XAF)</option><option value='CLP'>智利比索 (CLP)</option><option value='COP'>哥倫比亞比索 (COP)</option><option value='KMF'>科摩羅法朗 (KMF)</option><option value='XCP'>銅 (每鎊) (XCP)</option><option value='CRC'>哥斯大黎加哥隆 (CRC)</option><option value='HRK'>克羅埃西亞庫納 (HRK)</option><option value='CUP'>古巴比索 (CUP)</option><option value='CZK'>捷克克朗 (CZK)</option><option value='DKK'>丹麥克朗 (DKK)</option><option value='DJF'>吉布地法朗 (DJF)</option><option value='DOP'>多明尼加比索 (DOP)</option><option value='XCD'>東加勒比元 (XCD)</option><option value='ECS'>厄瓜多爾蘇克雷 (ECS)</option><option value='EGP'>埃及鎊 (EGP)</option><option value='SVC'>薩爾瓦多哥隆 (SVC)</option><option value='ERN'>厄利垂亞納克法 (ERN)</option><option value='EEK'>愛沙尼亞克朗 (EEK)</option><option value='ETB'>衣索比亞比爾 (ETB)</option><option value='FKP'>福克蘭群島鎊 (FKP)</option><option value='FJD'>斐濟元 (FJD)</option><option value='GMD'>甘比亞達拉西 (GMD)</option><option value='GHC'>迦納西迪 (GHC)</option><option value='GIP'>直布羅陀鎊 (GIP)</option><option value='XAU'>金 (每盎司) (XAU)</option><option value='GTQ'>瓜地馬拉給薩 (GTQ)</option><option value='GNF'>幾內亞法朗 (GNF)</option><option value='GYD'>蓋亞那元 (GYD)</option><option value='HTG'>海地古德 (HTG)</option><option value='HNL'>宏都拉斯倫皮拉 (HNL)</option><option value='HUF'>匈牙利福林 (HUF)</option><option value='ISK'>冰島克朗 (ISK)</option><option value='IRR'>伊朗里亞爾 (IRR)</option><option value='IQD'>伊拉克第納爾 (IQD)</option><option value='ILS'>以色列新克爾 (ILS)</option><option value='JMD'>牙買加元 (JMD)</option><option value='JOD'>約旦第納爾 (JOD)</option><option value='KZT'>哈薩克坦吉 (KZT)</option><option value='KES'>肯亞先令 (KES)</option><option value='KWD'>科威特第納爾 (KWD)</option><option value='LAK'>寮國新普基 (LAK)</option><option value='LVL'>拉脫維亞拉特 (LVL)</option><option value='LBP'>黎巴嫩鎊 (LBP)</option><option value='LSL'>賴索托洛蒂 (LSL)</option><option value='LRD'>賴比瑞亞元 (LRD)</option><option value='LYD'>利比亞第納爾 (LYD)</option><option value='LTL'>立陶宛利塔 (LTL)</option><option value='MOP'>澳門元 (MOP)</option><option value='MKD'>馬其頓第納爾 (MKD)</option><option value='MWK'>馬拉威克瓦查 (MWK)</option><option value='MYR'>馬來西亞零吉 (MYR)</option><option value='MVR'>馬爾地夫拉菲亞 (MVR)</option><option value='MTL'>馬爾他里拉 (MTL)</option><option value='MRO'>茅利塔尼亞烏吉亞 (MRO)</option><option value='MUR'>模里西斯盧比 (MUR)</option><option value='MXN'>墨西哥比索 (MXN)</option><option value='MDL'>摩爾多瓦列伊 (MDL)</option><option value='MNT'>蒙古圖格里特 (MNT)</option><option value='MAD'>摩洛哥迪拉姆 (MAD)</option><option value='MMK'>緬甸基雅特 (MMK)</option><option value='NAD'>納米比亞元 (NAD)</option><option value='NPR'>尼泊爾盧比 (NPR)</option><option value='ANG'>荷屬安的列斯群島盾 (ANG)</option><option value='TRY'>土耳其里拉 (TRY)</option><option value='NZD'>紐西蘭元 (NZD)</option><option value='NIO'>尼加拉瓜科多巴 (NIO)</option><option value='NGN'>奈及利亞奈拉 (NGN)</option><option value='KPW'>北韓圜 (KPW)</option><option value='NOK'>挪威克朗 (NOK)</option><option value='OMR'>阿曼里亞爾 (OMR)</option><option value='XPF'>太平洋島國法朗 (XPF)</option><option value='PKR'>巴基斯坦盧比 (PKR)</option><option value='XPD'>鈀 (每盎司) (XPD)</option><option value='PAB'>巴拿馬巴波亞 (PAB)</option><option value='PGK'>巴布新幾內亞吉納 (PGK)</option><option value='PYG'>巴拉圭瓜拉尼 (PYG)</option><option value='PEN'>秘魯新索爾 (PEN)</option><option value='PHP'>菲律賓比索 (PHP)</option><option value='XPT'>白金 (每盎司) (XPT)</option><option value='PLN'>波蘭茲羅提 (PLN)</option><option value='QAR'>卡塔爾里亞爾 (QAR)</option><option value='RON'>羅馬尼亞新列伊 (RON)</option><option value='RUB'>俄羅斯盧布 (RUB)</option><option value='RWF'>盧旺達法朗 (RWF)</option><option value='WST'>薩摩亞塔拉 (WST)</option><option value='STD'>聖多美杜布拉 (STD)</option><option value='SAR'>沙烏地阿拉伯里亞爾 (SAR)</option><option value='SCR'>塞席爾盧比 (SCR)</option><option value='SLL'>獅子山利昂 (SLL)</option><option value='XAG'>銀 (每盎司) (XAG)</option><option value='SGD'>新加坡元 (SGD)</option><option value='SKK'>斯洛伐克克朗 (SKK)</option><option value='SIT'>斯洛維尼亞托拉爾 (SIT)</option><option value='SBD'>索羅門群島元 (SBD)</option><option value='SOS'>索馬利亞先令 (SOS)</option><option value='ZAR'>南非蘭特 (ZAR)</option><option value='LKR'>斯里蘭卡盧比 (LKR)</option><option value='SHP'>聖赫勒納鎊 (SHP)</option><option value='SDG'>蘇丹鎊 (SDG)</option><option value='SZL'>史瓦濟蘭里蘭吉尼 (SZL)</option><option value='SEK'>瑞典克朗 (SEK)</option><option value='SYP'>敘利亞鎊 (SYP)</option><option value='TWD'>新台幣 (TWD)</option><option value='TZS'>坦尚尼亞先令 (TZS)</option><option value='TOP'>東加帕安卡 (TOP)</option><option value='TTD'>千里達及托巴哥元 (TTD)</option><option value='TND'>突尼斯第納爾 (TND)</option><option value='AED'>UAE 迪拉姆 (AED)</option><option value='UGX'>烏干達先令 (UGX)</option><option value='UAH'>烏克蘭格裡夫納 (UAH)</option><option value='UYU'>烏拉圭新比索 (UYU)</option><option value='VUV'>瓦努瓦圖瓦圖 (VUV)</option><option value='VEF'>委內瑞拉強勢博利瓦 (VEF)</option><option value='VND'>越南盾 (VND)</option><option value='YER'>也門里亞爾 (YER)</option><option value='ZMK'>贊比亞克瓦查 (ZMK)</option><option value='ZWD'>津巴布韋元 (ZWD)</option>";  
    elem_sel1.innerHTML = items;
    elem_sel2.innerHTML = items;

    elem_input1.style.backgroundColor = 'skyblue';
    elem_country1.style.backgroundColor = 'skyblue';
    
    update_data();
    load_record();
}

function active_change(num) {
    if(num == 1) {
        is_active = 1;
        elem_input1.style.backgroundColor = 'skyblue';
        elem_input2.style.backgroundColor = 'white';

        elem_country1.style.backgroundColor = 'skyblue';
        elem_country2.style.backgroundColor = 'white';
        update_data();
    }
    else if(num == 2) {
        is_active = 2;
        elem_input1.style.backgroundColor = 'white';
        elem_input2.style.backgroundColor = 'skyblue';

        elem_country1.style.backgroundColor = 'white';
        elem_country2.style.backgroundColor = 'skyblue';
        update_data();
    }
}

function Save() {
    my_shift();
    elem_record[0].innerHTML = elem_sel1.value + " " + elem_input1.innerHTML + " = " + elem_sel2.value + " " + elem_input2.innerHTML;
    for (let i = 0; i < 10; i++) {
        var name = "exchange_record" + i;
        localStorage.setItem(name, elem_record[i].innerHTML);
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
        var temp = elem_record[num].innerHTML.split(' ');
        elem_sel1.value = temp[0];
        elem_input1.innerHTML = temp[1];
        elem_sel2.value = temp[3];
        elem_input2.innerHTML = temp[4];
    }
}

function load_record() {
    for (var i = 0; i < 10; i++) {
        var name = 'exchange_record' + i;
        elem_record[i].innerHTML = localStorage.getItem(name);
    }
}

function change_calculator(selector) {
    document.location = selector.value + '.html';
}