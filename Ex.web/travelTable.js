/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c';
    let currentPage = 1;
    const itemsPerPage = 4;
    const rangeSize = 9;
    let totalItems;

    const tableBody = document.querySelector('.table tbody');
    tableBody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('select-button')) {
            const buttons = document.querySelectorAll('.select-button');
            buttons.forEach(button => {
                button.classList.remove('button-clicked'); // Снимаем выделение со всех кнопок
            });
            e.target.classList.add('button-clicked'); // Выделяем нажатую кнопку
            const objectId = e.target.closest('tr').getAttribute('data-object-id'); // Получаем ID объекта из атрибута строки
            loadRelatedData(objectId);// Загрузка связанных данных для выбранного объекта
            document.querySelector('.realtor.table.table-bordered').style.display = 'block';
            document.querySelector('.realtor').style.display = 'block';
        }
    });
    
    loadTableData(apiUrl, currentPage);

    function loadTableData(url, page) {
        const xhr = new XMLHttpRequest();
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    totalItems = data.length;
                    const tableBody = document.querySelector('.table tbody');
                    tableBody.innerHTML = '';

                    // Вычисляем начальный и конечный индексы объектов для текущей страницы
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    // Добавление данных в таблицу для текущей страницы
                    const pageData = data.slice(startIndex, endIndex);
                    pageData.forEach(item => {
                        const row = document.createElement('tr');
                        row.setAttribute('data-object-id', item.id);
                        row.innerHTML = `<td>${item.name}</td>
                                         <td>${item.description}</td>
                                         <td colspan="2">${item.mainObject}</td>
                                         <td></td>`; // Вставляем ячейки без кнопки
                
                        // Создаём и добавляем кнопку "Выбрать" с классами Bootstrap
                        const selectButtonCell = row.querySelector('td:last-child');
                        const selectButton = document.createElement('button');
                        selectButton.type = 'button';
                        selectButton.className = 'btn btn-primary select-button';
                        selectButton.textContent = 'Выбрать';
                        selectButtonCell.appendChild(selectButton);
                
                        tableBody.appendChild(row);
                    });
                    updatePaginationButtons();
                } else {
                    console.error('Ошибка при получении данных:', xhr.status, xhr.statusText);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }
    function updatePaginationButtons() {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';
    
        // Загрузка общего числа страниц
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const currentRange = Math.ceil(currentPage / rangeSize);
        paginationContainer.classList.add('pagination');
    
        // Создаем навигационный список для пагинации
        const navList = document.createElement('ul');
        navList.className = 'pagination justify-content-center';
    
        // Для создания кнопок в пагинации теперь используем элементы 'li' и 'a' соответственно
        const createBootstrapListItem = (page, isDisabled = false, isCurrent = false, text = page) => {
            const listItem = document.createElement('li');
            listItem.className = `page-item ${isCurrent ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
            
            const linkItem = document.createElement('a');
            linkItem.className = 'page-link';
            linkItem.href = '#';
            linkItem.textContent = text;
    
            if (!isDisabled && !isCurrent) {
                linkItem.addEventListener('click', () => changePage(page));
            }
            
            listItem.appendChild(linkItem);
            return listItem;
        };
    
        // Кнопка "Первая страница"
        if (currentPage > 1) {
            navList.appendChild(createBootstrapListItem(1, false, false, '<< Первая страница'));
        }
    
        // Кнопка для перехода на предыдущий набор страниц
        if (currentPage > 1) {
            navList.appendChild(createBootstrapListItem(currentPage - 1, false, false, '<'));
        }
    
        // Создание номерных кнопок для страниц
        for (let i = 1; i <= totalPages; i++) {
            navList.appendChild(createBootstrapListItem(i, false, currentPage === i));
        }
    
        // Кнопка для перехода на следующую страницу
        if (currentPage < totalPages) {
            navList.appendChild(createBootstrapListItem(currentPage + 1, false, false, '>'));
        }
    
        // Кнопка "Последняя страница"
        if (currentPage < totalPages) {
            navList.appendChild(createBootstrapListItem(totalPages, false, false, 'Последняя страница >>'));
        }
    
        // Прикрепляем созданный навигационный список к контейнеру пагинации
        paginationContainer.appendChild(navList);
    }    

    window.selectObject = function(objectName) {
        alert('Выбран объект: ' + objectName);
    };

    function changePage(page) {
        currentPage = page;
        loadTableData(apiUrl, currentPage);
    }

    // Загрузка начальных данных
    loadTableData(apiUrl, currentPage);
});

// Функция для загрузки и заполнения второй таблицы данными, связанными с выбранным объектом
function loadRelatedData(id) {
    const relatedDataUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c`;
    const xhr = new XMLHttpRequest();

    xhr.open('GET', relatedDataUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText); //API возвращает JSON
            const relatedTableBody = document.querySelector('.realtor.table.table-bordered  tbody');
            relatedTableBody.innerHTML = ''; // Очищаем текущее содержимое таблицы

            // Заполняем таблицу данными, полученными от API
            data.forEach(function(item) {
                const row = `<tr>
                    <td></td>
                    <td>${item.name}</td>
                    <td>${item.language}</td>
                    <td>${item.workExperience}</td>
                    <td colspan="3">${item.pricePerHour}</td>
                </tr>`;
                relatedTableBody.innerHTML += row;
            });
        } else if (xhr.readyState === 4) {
            console.error('Ошибка при получении связанных данных:', xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}