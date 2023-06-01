const urlParams = new URLSearchParams(window.location.search);
const raceId = urlParams.get('raceId');

async function fetchData(url, method='GET', body=null) {
    const options = body ? {method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)} : {method};
    const response = await fetch(url, options);
    return response.ok ? response.json() : null;
}

document.getElementById('create-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = {
        sailboat: { id: document.getElementById('create-sailboat').value },
        race: { id: Number(raceId) },
        points: document.getElementById('create-points').value
    };
    await fetchData('http://localhost:8080/api/race-results', 'POST', formData);
    refreshList();
});

async function populateSailboats(selectId) {
    const sailboats = await fetchData('http://localhost:8080/api/sailboats');
    let select = document.getElementById(selectId);
    sailboats.forEach(item => {
        let option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - ${item.boatType}`;
        select.appendChild(option);
    });
}

populateSailboats('create-sailboat');

async function refreshList() {
    const raceResults = await fetchData(`http://localhost:8080/api/race-results/race/${raceId}`);
    const table = document.getElementById('race-results-list');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    raceResults.forEach(item => {
        let row = document.createElement('tr');
        ['sailboat.id', 'sailboat.name', 'points'].forEach(field => {
            let cell = document.createElement('td');
            let [object, property] = field.split('.');
            cell.textContent = object && property ? item[object][property] : item[field];
            row.appendChild(cell);
        });
        createActions(row, item.id);
        tbody.appendChild(row);
    });
}

function createActions(row, id) {
    let actionCell = document.createElement('td');

    const updateBtn = createButton('Update', () => updateRaceResult(id));
    actionCell.appendChild(updateBtn);

    const deleteBtn = createButton('Delete', () => deleteRaceResult(id));
    actionCell.appendChild(deleteBtn);

    row.appendChild(actionCell);
}

function createButton(text, clickEvent) {
    let btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', clickEvent);
    return btn;
}

async function updateRaceResult(id) {
    const updateModal = document.getElementById("updateModal");
    document.getElementById("updateId").value = id;

    const raceResult = await fetchData(`http://localhost:8080/api/race-results/${id}`);
    document.getElementById("sailboatId").value = raceResult.sailboat.id;
    document.getElementById("points").value = raceResult.points;
    updateModal.style.display = "block";
}

document.getElementById("close").onclick = function () {
    document.getElementById("updateModal").style.display = "none";
}

document.getElementById("updateForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        sailboat: { id: document.getElementById("sailboatId").value },
        race: { id: Number(raceId) },
        points: document.getElementById("points").value
    };

    const id = document.getElementById("updateId").value;
    await fetchData(`http://localhost:8080/api/race-results/${id}`, 'PUT', formData);
    refreshList();
    document.getElementById("updateModal").style.display = "none";
});

async function deleteRaceResult(id) {
    await fetchData(`http://localhost:8080/api/race-results/${id}`, 'DELETE');
    refreshList();
}

refreshList();
