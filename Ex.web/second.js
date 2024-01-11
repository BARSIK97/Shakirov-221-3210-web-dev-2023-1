
document.addEventListener('DOMContentLoaded', function () {
    function loadRelatedData() {
        const relatedDataUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.`
            +
            `ru/api/orders?api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c`;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', relatedDataUrl, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    const relatedTableBody = document.querySelector(
                        '.applications.table.table-bordered  tbody');
                    relatedTableBody.innerHTML = '';
                    data.forEach(function (item) {
                        const row = `<tr data-id="${item.id}">
                        <td>${item.id}</td>
                        <td></td>
                        <td>${item.date}</td>
                        <td>${item.price}</td>
                        <td><button type="button" class="btn btn-danger" 
                        data-bs-target="#deleteorder">УДАЛИТЬ</button></td>
                    </tr>`;
                        relatedTableBody.innerHTML += row;
                        let id = item.route_id;
                        const secondaryDataUrl
                            = `http://exam-2023-1-api.std-900.`
                            +
                            `ist.mospolytech.ru/api/routes/${id}?`
                            +
                            `api_key=287a1b11-36b0-4af6-854a-a2a9ad26525c`;
                        const xhrSecondary = new XMLHttpRequest();
                        xhrSecondary.open('GET', secondaryDataUrl, true);
                        xhrSecondary.onreadystatechange = function () {
                            if (xhrSecondary.readyState === 4) {
                                if (xhrSecondary.status === 200) {
                                    const secondaryData = JSON.parse(
                                        xhrSecondary.responseText);
                                    const rowToUpdate
                                        = relatedTableBody.querySelector(
                                            `tr[data-id="${item.id}"]`);
                                    const secondColumnCell
                                        = rowToUpdate.querySelector(
                                            'td:nth-child(2)');
                                    if (secondColumnCell.textContent === '') {
                                        secondColumnCell.textContent =
                                            secondaryData.name;
                                    }
                                } else {
                                    console.error(
                                        'Ошибка при получении втор данных:',
                                        xhrSecondary.status,
                                        xhrSecondary.statusText);
                                }
                            }
                        };
                        xhrSecondary.send();
                    });
                } else if (xhr.readyState === 4) {
                    console.error(
                        'Ошибка при получении основных данных:',
                        xhr.status, xhr.statusText);
                }
            }
        };
        xhr.send();


        /*document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', function (event) {
                if (this.getAttribute("data-bs-target") === "#deleteorder") {
                    alert("Yes");
                }
            });
        });*/

        /*function deleteItem(id) {
            const deleteUrl = `http://exam-2023-1-api.std-900.ist.
            mospolytech.ru/api/orders/${id}?api_key=287a1b11-36b0-4a
            f6-854a-a2a9ad26525c`;  
            const xhrDelete = new XMLHttpRequest();
            xhrDelete.open('DELETE', deleteUrl, true);
            xhrDelete.onreadystatechange = function() {
                if (xhrDelete.readyState === 4) {
                    if (xhrDelete.status === 200) {
                        loadRelatedData();
                        alert("deleted");
                    } else {
                        console.error('
                        Ошибка при удалении данных:', 
                        xhrDelete.status, xhrDelete.statusText);
                    }
                }
            };
    
            xhrDelete.send();
        }
        */

    }

    loadRelatedData();
});