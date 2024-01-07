/* eslint-disable no-use-before-define */
/* eslint-disable max-len */


document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c';
    let currentPage = 1;
    const itemsPerPage = 4;
    const rangeSize = 9;
    let totalItems;
    let selectedGuideId = null;

    const tableBody = document.querySelector('.table tbody');
    tableBody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('select-button')) {
            const buttons = document.querySelectorAll('.select-button');
            buttons.forEach(button => {
                button.classList.remove('button-clicked'); 
            });
            e.target.classList.add('button-clicked'); 
            const routeName = e.target.closest('tr').querySelector('td:nth-child(1)').textContent;
            const applicationFormInput = document.getElementById('selectedRoute');
            if (applicationFormInput) {
                applicationFormInput.placeholder = routeName;
            }
            const objectId = e.target.closest('tr').getAttribute('data-object-id'); 
            loadRelatedData(objectId);
            document.querySelector('.realtor.table.table-bordered').style.display = 'block';
            document.querySelector('.realtor').style.display = 'block';
        }
    });
    
    const guideTableBody = document.querySelector('.realtor.table.table-bordered tbody'); 
    guideTableBody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('guide-select-button')) {
            const guideButtons = document.querySelectorAll('.guide-select-button');
            guideButtons.forEach(button => {
                button.classList.remove('button-clicked');
            });
            e.target.classList.add('button-clicked'); 
            selectedGuideId = e.target.closest('tr').getAttribute('data-guide-id');
            const guideName = e.target.closest('tr').querySelector('td:nth-child(2)').textContent;
            document.getElementById('guideName').placeholder = guideName;
            showApplyButton();
        }
    });

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
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const pageData = data.slice(startIndex, endIndex);
                    pageData.forEach(item => {
                        const row = document.createElement('tr');
                        row.setAttribute('data-object-id', item.id);
                        row.innerHTML = `<td>${item.name}</td>
                                         <td>${item.description}</td>
                                         <td colspan="2">${item.mainObject}</td>
                                         <td></td>`;
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
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const currentRange = Math.ceil(currentPage / rangeSize);
        paginationContainer.classList.add('pagination');
        const navList = document.createElement('ul');
        navList.className = 'pagination justify-content-center';
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

        if (currentPage > 1) {
            navList.appendChild(createBootstrapListItem(1, false, false, '<< Первая страница'));
        }

        if (currentPage > 1) {
            navList.appendChild(createBootstrapListItem(currentPage - 1, false, false, '<'));
        }

        for (let i = 1; i <= totalPages; i++) {
            navList.appendChild(createBootstrapListItem(i, false, currentPage === i));
        }

        if (currentPage < totalPages) {
            navList.appendChild(createBootstrapListItem(currentPage + 1, false, false, '>'));
        }

        if (currentPage < totalPages) {
            navList.appendChild(createBootstrapListItem(totalPages, false, false, 'Последняя страница >>'));
        }
        
        paginationContainer.appendChild(navList);
    }    

    window.selectObject = function(objectName) {
        alert('Выбран объект: ' + objectName);
    };

    function changePage(page) {
        currentPage = page;
        loadTableData(apiUrl, currentPage);
    }
   
    loadTableData(apiUrl, currentPage);
});

function loadRelatedData(id) {
    const relatedDataUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', relatedDataUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const relatedTableBody = document.querySelector('.realtor.table.table-bordered  tbody');
            relatedTableBody.innerHTML = '';
            data.forEach(function(item) {
                const row = `<tr>
                    <td></td>
                    <td>${item.name}</td>
                    <td>${item.language}</td>
                    <td>${item.workExperience}</td>
                    <td>${item.pricePerHour}</td>
                    <td><button type="button" class="btn btn-primary guide-select-button">Выбрать</button></td>
                </tr>`;
                relatedTableBody.innerHTML += row;
            });
        } else if (xhr.readyState === 4) {
            console.error('Ошибка при получении связанных данных:', xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}

function showApplyButton() {
    let applyButtonContainer = document.querySelector('.button-container');
    if (!applyButtonContainer) {
        applyButtonContainer = document.createElement('div');
        applyButtonContainer.className = 'button-container mt-3';
        applyButtonContainer.innerHTML = '<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#applyModal">Оформить заказ</button>';
        const realtorTableContainer = document.querySelector('.realtor.table.table-bordered');
        realtorTableContainer.after(applyButtonContainer);
    }    
}

