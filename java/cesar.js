/* eslint-disable max-len */
"use strict";

function cesar(inputStr, shift, action) {
    shift = shift % 33;
    const smallLetters = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    const capitalLetters = smallLetters.toUpperCase();
    let result = "";

    for (let i = 0; i < inputStr.length; i++) {
        const character = inputStr[i];
        const characterCode = character.charCodeAt(0);
        let alphabet, alphabetIndex;
        // eslint-disable-next-line max-len
        if ((characterCode >= 1040 && characterCode <= 1071) || characterCode === 1025) {
            alphabet = capitalLetters;
            alphabetIndex = capitalLetters.indexOf(character);
        } else if ((characterCode >= 1072 && characterCode <= 1103) || characterCode === 1105) {
            alphabet = smallLetters;
            alphabetIndex = smallLetters.indexOf(character);
        } else {
            result += character;
            continue;
        }

        if (action === 'encode') {
            alphabetIndex = (alphabetIndex + shift) % 33;
        } else if (action === 'decode') {
            alphabetIndex = (33 + alphabetIndex - shift) % 33;
        } else {
            throw new Error("Недопустимое значение параметра action. Используйте 'encode' или 'decode'.");
        }

        result += alphabet[alphabetIndex];
    }

    return result;
}

// Ответ: хакуна матата
let phrase = "эзтыхз фзъзъз";
let decodedphrase = cesar(phrase, 8, 'decode');
console.log(decodedphrase);