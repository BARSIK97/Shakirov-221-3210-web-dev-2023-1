// load-table.js
document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/{id-маршрута}/guides?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c';

    function loadTableData(url) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) { // если запрос завершён
                if (xhr.status === 200) { // если HTTP-статус 200, то есть OK
                    const data = JSON.parse(xhr.responseText); // парсим полученные данные из JSON
                    const tableBody = document.querySelector('.table tbody');
                    tableBody.innerHTML = ''; // очищаем тело таблицы перед добавлением новых строк

                    // Добавление данных в таблицу
                    data.forEach((item) => {
                        const row = `<tr>
                        <td>}</td>
                        <td>${item.name}</td>
                        <td>${item.language}</td>
                        <td>${item.workExperience}</td>
                        <td colspan = "2">${item.pricePerHour}</td>
                        <td><button type="button" class="select-button">Выбрать</button></td>
                         </tr>`;
                        tableBody.innerHTML += row;
                    });
                } else {
                    console.error('Ошибка при получении данных:', xhr.status, xhr.statusText);
                }
            }
        };
        xhr.open('GET', url, true); // инициализируем запрос
        xhr.send(); // отправляем запрос
    }

    window.selectObject = function(objectName) {
        // Обработка события выбора основного объекта
        alert('Выбран объект: ' + objectName);
        // Дополнительно здесь может быть логика для обработки выбора объекта
    };

    loadTableData(apiUrl); // вызываем функцию для загрузки данных в таблицу
});
