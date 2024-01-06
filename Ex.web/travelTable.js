document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c';
    let currentPage = 1;
    const itemsPerPage = 4;
    const rangeSize = 9;
    let totalItems;

    function loadTableData(url, page) {
        const xhr = new XMLHttpRequest();
        // Clears the pagination to avoid duplicate buttons
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
                        const row = `<tr>
                                        <td>${item.name}</td>
                                        <td>${item.description}</td>
                                        <td colspan="3">${item.mainObject}</td>
                                        <td><button type="button" class="select-button">Выбрать</button></td>
                                     </tr>`;
                        tableBody.innerHTML += row;
                    });
                    updatePaginationButtons();
                    tableBody.addEventListener('click', function(e) {
                        if (e.target && e.target.classList.contains('select-button')) {
                            const buttons = document.querySelectorAll('.select-button');
                            buttons.forEach(button => {
                                if (button !== e.target) {
                                    button.classList.remove('button-clicked');
                                }
                            });
                            e.target.classList.toggle('button-clicked');
                        }
                    });
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
        paginationContainer.innerHTML = ''; // Очисщаем перед повторным добавлением
    
        // Загрузка общего числа страниц
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const totalRanges = Math.ceil(totalPages / rangeSize);
        const currentRange = Math.ceil(currentPage / rangeSize);
    
        // Кнопка "Первая страница"
        if (currentPage > 1) {
            const firstPageBtn = document.createElement('button');
            firstPageBtn.textContent = '<< Первая страница';
            firstPageBtn.addEventListener('click', function() {
                changePage(1);
            });
            paginationContainer.appendChild(firstPageBtn);
        }
        // Spacer после кнопки "Первая страница" и перед пагинацией
        const spacer1 = document.createElement('span');
        spacer1.className = 'spacer';
        paginationContainer.appendChild(spacer1);
    
        // Кнопка для перехода на предыдущий набор страниц
        if (currentRange > 1) {
            const prevRangeBtn = document.createElement('button');
            prevRangeBtn.textContent = '<';
            prevRangeBtn.addEventListener('click', function() {
                changePage((currentRange - 2) * rangeSize + 1);
            });
            paginationContainer.appendChild(prevRangeBtn);
        }
    
        // Создание номерных кнопок для страниц
        const startPage = (currentRange - 1) * rangeSize + 1;
        const endPage = Math.min(startPage + rangeSize - 1, totalPages);
    
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', function() {
                changePage(i);
            });
            if (currentPage === i) {
                button.disabled = true; // Disable the current page button
            }
            paginationContainer.appendChild(button);
        }
    
        // Кнопка для перехода на следующий набор страниц
        if (currentRange < totalRanges) {
            const nextRangeBtn = document.createElement('button');
            nextRangeBtn.textContent = '>';
            nextRangeBtn.addEventListener('click', function() {
                changePage(currentRange * rangeSize + 1);
            });
            paginationContainer.appendChild(nextRangeBtn);
        }

        const spacer2 = document.createElement('span');
        spacer2.className = 'spacer';
        paginationContainer.appendChild(spacer2);
        // Кнопка "Последняя страница"
        if (currentPage < totalPages) {
            const lastPageBtn = document.createElement('button');
            lastPageBtn.textContent = 'Последняя траница >>';
            lastPageBtn.addEventListener('click', function() {
                changePage(totalPages);
            });
            paginationContainer.appendChild(lastPageBtn);
        }
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
