/* eslint-disable max-len */
function loadRelatedData() {
    const relatedDataUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', relatedDataUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const relatedTableBody = document.querySelector('.applications.table.table-bordered  tbody');
            relatedTableBody.innerHTML = '';
            data.forEach(function(item) {
            
                const row = `<tr>
            
                <td>${item.id}</td>
                <td>${localStorage.getItem('selectedroutename')}</td>
                <td>${item.date}</td>
                <td>${item.price}</td>
                <td><button type="button" class="btn btn-danger guide-select-button">DELETE</button></td>
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
document.addEventListener('DOMContentLoaded', function() {
    loadRelatedData();
});