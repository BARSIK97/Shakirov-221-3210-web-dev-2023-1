/* eslint-disable max-len */
function getSortedArray(array, key) {
    // Используем сортировку пузырьком для сортировки массива
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {
            // Сравниваем значения ключа для двух объектов
            if (array[j][key] > array[j + 1][key]) {
            // Если значение в текущем элементе больше, меняем их местами
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
    // Возвращаем отсортированный массив
    return array;
}

// Пример работы функции.
// let array = [{name: 'Макар', age: 20}, //{name: 'Роберт', age: 32}, {name: 'Екатерина', age: 50}, {name: 'Оксана', age: 24}, {name: 'Святослав', age: 43}];
// array = getSortedArray(array, 'age')
// console.log(array); // [{name: 'Макар', age: 20}, {name: 'Оксана', age: 24}, {name: 'Роберт', age: 32}, {name: 'Святослав', age: 43}, {name: 'Екатерина', age: 50}];
// array = getSortedArray(array, 'name')
// console.log(array); // [{name: 'Екатерина', age: 50}, {name: 'Макар', age: 20}, {name: 'Оксана', age: 24}, {name: 'Роберт', age: 32}, {name: 'Святослав', age: 43}];