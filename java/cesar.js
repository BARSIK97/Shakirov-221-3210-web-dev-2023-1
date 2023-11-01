"use strict"

// А - 1040, Я - 1071, Ё - 1025
// а - 1072, я - 1103, ё - 1105 

function cesar(str, shift, action) {
    shift = shift % 33;
    let lower = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    let upper = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    let res = "";

    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if ( code==1025 || code>=1040 && code <= 1071) {
            res+=String.fromCharCode(code+shift)
        }
    }
    return res;
}

// Пример работы кода
let strA = "АаБбВвГгДд 123+77=200 Hello, World!"
let encodedStrA = cesar(strA, 5, 'encode');
console.log(encodedStrA);
let decodedStrA = cesar(encodedStrA, 5, 'decode');
console.log(decodedStrA);

// Расшифровка фразы: "эзтыхз фзъзъз"
let secret = "эзтыхз фзъзъз";
let decodedSecret = cesar(secret, 8, 'decode');
console.log(decodedSecret);

// Ответ: "хакуна матата"