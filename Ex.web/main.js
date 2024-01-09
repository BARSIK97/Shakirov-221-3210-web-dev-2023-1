/* eslint-disable max-len */

document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c';
    let currentPage = 1;
    const itemsPerPage = 4;
    const rangeSize = 9;
    let selectedRouteId = null;
    let selectedGuideId = null;
    let selectedGuideCost = null;

    function displayTableData(pageData) {
        const tableBody = document.querySelector('.table tbody');
        tableBody.innerHTML = '';
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
    }    
    function updatePaginationButtons(totalFilteredItems) {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
        let startRange = (Math.floor((currentPage - 1) / rangeSize) * rangeSize) + 1;
        let endRange = Math.min(startRange + rangeSize - 1, totalPages);    
        paginationContainer.classList.add('pagination');
        const navList = document.createElement('ul');
        navList.className = 'pagination';
        const createBootstrapListItem = (page, isDisabled = false, isCurrent = false, text = page) => {
            const listItem = document.createElement('li');
            listItem.className = `page-item ${isCurrent ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
            const linkItem = document.createElement('a');
            linkItem.className = 'page-link';
            linkItem.href = '#';
            linkItem.textContent = text;
            if (!isDisabled && !isCurrent) {
                
            }
            listItem.appendChild(linkItem);
            return listItem;
        };
        if (startRange > 1) {
            navList.appendChild(createBootstrapListItem(1, false, false, '<< Первая страница'));
        }
        if (startRange > 1) {
            navList.appendChild(createBootstrapListItem(startRange - 1, false, false, '<'));
        }
        for (let i = startRange; i <= endRange; i++) {
            navList.appendChild(createBootstrapListItem(i, false, currentPage === i));
        }    
        if (endRange < totalPages) {
            navList.appendChild(createBootstrapListItem(endRange + 1, false, false, '>'));
        }
        if (currentPage < totalPages) {
            navList.appendChild(createBootstrapListItem(totalPages, false, false, 'Последняя страница >>'));
        }
        paginationContainer.appendChild(navList);
    }    

    function loadTableData(url, page, searchTerm = '', mainObjectFilter = '') {
        const xhr = new XMLHttpRequest();
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    if (searchTerm) {
                        data = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
                    }
                    if (mainObjectFilter) {
                        data = data.filter(item => item.mainObject.toLowerCase().includes(mainObjectFilter.toLowerCase()));
                    }
                    totalItems = data.length;
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const pageData = data.slice(startIndex, endIndex);
                    displayTableData(pageData);
                    updatePaginationButtons(data.length);
                } else {
                    console.error('Ошибка при получении данных:', xhr.status, xhr.statusText);
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    let currentSearchTerm = '';
    let currentMainObjectFilter = '';
    window.selectObject = function(objectName) {
        alert('Выбран объект: ' + objectName);
    };

    
    function reloadFilteredData(searchTerm, mainObjectFilter) {
        currentPage = 1;
        loadTableData(apiUrl, currentPage, searchTerm, mainObjectFilter);
    }
    function navigateToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > Math.ceil(totalItems / itemsPerPage)) {
            console.error('Invalid page number:', pageNumber);
            return;
        }
        
        currentPage = pageNumber;
        loadTableData(apiUrl, currentPage, currentSearchTerm, currentMainObjectFilter);
    }
    
    document.querySelector('.pagination').addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const targetPage = event.target.textContent;
    
            switch (targetPage) {
            case '<< Первая страница':
                navigateToPage(1);
                break;
            case '<':
                navigateToPage(currentPage - 1);
                break;
            case '>':
                navigateToPage(currentPage + 1);
                break;
            case 'Последняя страница >>':
                navigateToPage(Math.ceil(totalItems / itemsPerPage));
                break;
            default:
                let pageNum = parseInt(targetPage, 10);
                if (pageNum) {
                    navigateToPage(pageNum);
                }
                break;
            }
        }
    });
    
    const searchInput = document.getElementById('FormControlInput2');
    searchInput.addEventListener('input', function() {
        currentSearchTerm = searchInput.value;
        reloadFilteredData(currentSearchTerm, currentMainObjectFilter);
    });


    const objectFilterSelect = document.querySelector('select[name="Основной объект"]');
    
    objectFilterSelect.addEventListener('change', function(e) {
        currentMainObjectFilter = e.target.value !== 'Не выбрано' && e.target.value !== 'Основной объект' ? e.target.value : '';
        reloadFilteredData(currentSearchTerm, currentMainObjectFilter);
    });


    loadTableData(apiUrl, currentPage, currentSearchTerm, currentMainObjectFilter);

    const languageFilterSelect = document.querySelector('select[name="Языки экскурсии"]');
    let minWorkExperience = null;
    let maxWorkExperience = null;
    function applyFilters() {
        const languageSelected = document.querySelector('select[name="Языки экскурсии"]').value;
        const guideRows = document.querySelectorAll('.realtor.table tbody tr');
        guideRows.forEach(row => {
            const guideLanguage = row.querySelector('td:nth-child(3)').textContent;
            const workExperience = parseInt(row.querySelector('td:nth-child(4)').textContent, 10);
            const matchesLanguage = languageSelected === 'Языки экскурсии' || guideLanguage.includes(languageSelected);
            const matchesMinExperience = minWorkExperience === null || workExperience >= minWorkExperience;
            const matchesMaxExperience = maxWorkExperience === null || workExperience <= maxWorkExperience;
            if (matchesLanguage && matchesMinExperience && matchesMaxExperience) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }            
        });
    }

    languageFilterSelect.addEventListener('change', function(e) {
        applyFilters();
    });

    function updateLanguagesDropdown(guideData) {
        const languageDropdown = document.querySelector('select[name="Языки экскурсии"]');
        languageDropdown.length = 1;
        const languages = new Set();
        guideData.forEach(function(guide) {
            languages.add(guide.language);
        });
        languages.forEach(function(language) {
            const option = document.createElement('option');
            option.value = language;
            option.text = language;
            languageDropdown.add(option);
        });
    }

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
                    const profileImagePath = "images/realtors.png";
                    
                    const row = `<tr>
                    <td><img src="${profileImagePath}" alt="Profile" class="img-fluid profile-pic"></td>
                    <td>${item.name}</td>
                    <td>${item.language}</td>
                    <td>${item.workExperience}</td>
                    <td>${item.pricePerHour}</td>
                    <td><button type="button" class="btn btn-primary guide-select-button">Выбрать</button></td>
                    <td>${item.id}</td> 
                    </tr>`;
                    relatedTableBody.innerHTML += row;
                });
                updateLanguagesDropdown(data);
            } else if (xhr.readyState === 4) {
                console.error('Ошибка при получении связанных данных:', xhr.status, xhr.statusText);
            }
        };
        xhr.send();
    }

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
            const routeNameChange = document.getElementById('routeNameChange');
            if (applicationFormInput) {
                applicationFormInput.placeholder = routeName;
                localStorage.setItem('selectedroutename', routeName);
            }
            if (routeNameChange) {
                routeNameChange.textContent = routeName;
            }    
            const objectId = e.target.closest('tr').getAttribute('data-object-id'); 
            selectedRouteId = objectId;
            loadRelatedData(objectId);
            document.querySelector('.realtor.table.table-bordered').style.display = 'block';
            document.querySelector('.realtor').style.display = 'block';

        }
    });
        
    function showApplyButton() {
        let applyButtonContainer = document.querySelector('.button-container');
        if (!applyButtonContainer) {
            applyButtonContainer = document.createElement('div');
            applyButtonContainer.className = 'button-container mt-3 d-flex justify-content-center';
            applyButtonContainer.innerHTML = '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#applyModal">Оформить заказ</button>';
            const realtorTableContainer = document.querySelector('.realtor.table.table-bordered');
            realtorTableContainer.after(applyButtonContainer);
        }    
    }

    function clearApplicationForm() {
        const applicationForm = document.getElementById('applicationForm');
        if (applicationForm) {
            applicationForm.reset();
            document.getElementById('totalCost').value = '';
            document.getElementById('excursionDate');
            document.getElementById('startTime');
            document.getElementById('durationSelect').value = '1';
            document.getElementById('groupSize').value = '';
        }
    }
    
    const guideTableBody = document.querySelector('.realtor.table.table-bordered tbody'); 
    guideTableBody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('guide-select-button')) {
            const guideButtons = document.querySelectorAll('.guide-select-button');
            guideButtons.forEach(button => {
                button.classList.remove('button-clicked');
            });
            e.target.classList.add('button-clicked'); 
            selectedGuideId = e.target.closest('tr').querySelector('td:nth-child(1)').textContent;
            localStorage.setItem('selectedGuideId', selectedGuideId);
            const guideName = e.target.closest('tr').querySelector('td:nth-child(2)').textContent;
            selectedGuideCost = parseFloat(e.target.closest('tr').querySelector('td:nth-child(5)').textContent);
            document.getElementById('guideName').placeholder = guideName;
            showApplyButton();
            clearApplicationForm();
        }
    });


    const minExperienceInput = document.getElementById('FormControlInput3');
    const maxExperienceInput = document.getElementById('FormControlInput4');
    minExperienceInput.addEventListener('input', function() {
        minWorkExperience = parseInt(minExperienceInput.value, 10) || null;
        applyFilters();
    });
    maxExperienceInput.addEventListener('input', function() {
        maxWorkExperience = parseInt(maxExperienceInput.value, 10) || null;
        applyFilters();
    });
    function calculatePrice(guideCostPerHour, hours, dayOffMultiplier, morningFee, eveningFee, visitors) {
        let visitorcost = 0;
        if (visitors >= 5 && visitors < 10) visitorcost = 1000;
        if (visitors >= 10 && visitors <= 20) visitorcost = 1500;
        return (guideCostPerHour * hours * dayOffMultiplier) + morningFee + eveningFee + visitorcost;
    }

    function getGuideServiceCost() {
        return selectedGuideCost;
    }

    function checkIfDayOff(dateString) {
        const date = new Date(dateString);
        const dayOfWeek = date.getDay();
        const publicHolidays = [
            '01-01', // Новый Год
            '01-07', // Рождество
            '05-01', // День труда
            '05-09', // День Победы
        ];
        const dateForCheck = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        if (dayOfWeek === 0 || dayOfWeek === 6 || publicHolidays.includes(dateForCheck)) {
            return 1.5;
        } else {
            return 1;
        }
    }

    function checkIfMorning(time) {
        const hour = parseInt(time.split(':')[0], 10);
        return (hour >= 9 && hour < 12) ? 400 : 0;
    }

    function checkIfEvening(time) {
        const hour = parseInt(time.split(':')[0], 10);
        return (hour >= 20 && hour < 23) ? 1000 : 0;
    }


    const applicationForm = document.getElementById('applicationForm');
    function handleFormInput() {
        const guideServiceCost = getGuideServiceCost(selectedGuideId); 
        const hoursNumber = parseInt(document.getElementById('durationSelect').value);
        const isThisDayOff = checkIfDayOff(document.getElementById('excursionDate').value);
        const isItMorning = checkIfMorning(document.getElementById('startTime').value);
        const isItEvening = checkIfEvening(document.getElementById('startTime').value);
        const numberOfVisitors = parseInt(document.getElementById('groupSize').value);
        const discountCheckbox = document.getElementById('additionalOption1');
        const hasDiscount = discountCheckbox.checked;   
        document.getElementById('additionalOption1').addEventListener('change', handleFormInput);

        let price = calculatePrice(guideServiceCost, hoursNumber, isThisDayOff, isItMorning, isItEvening, numberOfVisitors);
        if (hasDiscount) {
            price *= 0.75;
        }
        const hasExtraDiscount = document.getElementById('additionalOption2').checked;
        if (hasExtraDiscount) {
            if (isThisDayOff === 1.5) {
                price *= 1.25;
            } else {
                price *= 1.30;
            }
        }
        price = Math.round(price);
        document.getElementById('totalCost').value = price + ' руб.';
    } 

    function closeForm() {
        // Предполагаем, что атрибут id вашего модального окна - 'applyModal'
        const applyModalElement = document.getElementById('applyModal');
        const applyModal = bootstrap.Modal.getInstance(applyModalElement);
        
        // Проверяем, был ли экземпляр модального окна уже создан
        if (applyModal) {
            applyModal.hide();
        } else {
            // Если нет, создаем новый экземпляр и закрываем его
            const newApplyModal = new bootstrap.Modal(applyModalElement, { keyboard: true });
            newApplyModal.hide();
        }
    }

    applicationForm.addEventListener('input', handleFormInput);
    function sendApplication() {
        const routeId = selectedRouteId;
        const duration = parseInt(document.getElementById('durationSelect').value);
        const persons = parseInt(document.getElementById('groupSize').value);
        const price = parseFloat(document.getElementById('totalCost').value.replace(' руб.', ''));
        const optionFirst = document.getElementById('additionalOption1').checked ? 1 : 0;
        const optionSecond = document.getElementById('additionalOption2').checked ? 1 : 0;
        const date = document.getElementById('excursionDate').value;
        const time = document.getElementById('startTime').value;
        const guideRow = document.querySelector('.realtor.table.table-bordered tbody .button-clicked').parentNode.parentNode;
        const guideId = guideRow.querySelector('td:nth-child(7)').textContent;

        const formData = new FormData();
        formData.append('date', date);
        formData.append('time', time);
        formData.append('duration', duration);
        formData.append('guide_id', guideId);
        formData.append('optionFirst', optionFirst);
        formData.append('optionSecond', optionSecond);
        formData.append('persons', persons);
        formData.append('price', price);
        formData.append('route_id', routeId);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('Заявка успешно отправлена:', xhr.responseText);
                    closeForm();
                } else {
                    console.error('Ошибка при отправке заявки:', xhr.status, xhr.statusText);
                }
            }
        };
        xhr.open("POST", 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c', true);
        xhr.send(formData);
    }
    applicationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Добавьте это, чтобы предотвратить стандартную отправку формы
        sendApplication();
    });
});

