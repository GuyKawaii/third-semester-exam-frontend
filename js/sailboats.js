document.addEventListener('DOMContentLoaded', (event) => {
    refreshList();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('create-form').addEventListener('submit', createBoat);
    document.getElementById('close').onclick = closeModal;
    document.getElementById("updateForm").addEventListener("submit", updateBoatForm);
}

function createBoat(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('create-name').value,
        boatType: document.getElementById('create-boatType').value,
    };

    sendData('http://localhost:8080/api/sailboats', 'POST', formData);
}

function closeModal() {
    const updateModal = document.getElementById("updateModal");
    updateModal.style.display = "none";
}

function updateBoatForm(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        boatType: document.getElementById("boatType").value,
    };

    const id = document.getElementById("updateId").value;

    sendData(`http://localhost:8080/api/sailboats/${id}`, 'PUT', formData);
}

function sendData(url, method, data) {
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            refreshList();
            if(method == 'PUT') {
                closeModal();
            }
        }
    });
}

function refreshList() {
    fetch('http://localhost:8080/api/sailboats')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('sailboats-list');

            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            data.forEach(boat => {
                const row = table.insertRow(-1);
                row.insertCell(0).textContent = boat.id;
                row.insertCell(1).textContent = boat.name;
                row.insertCell(2).textContent = boat.boatType;

                const updateButton = document.createElement('button');
                updateButton.textContent = "Update";
                updateButton.addEventListener('click', () => updateBoat(boat.id));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener('click', () => deleteBoat(boat.id));

                const actionsCell = row.insertCell(3);
                actionsCell.appendChild(updateButton);
                actionsCell.appendChild(deleteButton);
            });
        });
}

function updateBoat(id) {
    document.getElementById("updateId").value = id;

    fetch(`http://localhost:8080/api/sailboats/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("name").value = data.name;
            document.getElementById("boatType").value = data.boatType;
        });

    document.getElementById("updateModal").style.display = "block";
}

function deleteBoat(id) {
    fetch(`http://localhost:8080/api/sailboats/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            refreshList();
        } else {
            alert('Cant delete sailboat as it has been in a race.');
        }
    }).catch(error => {
        alert(error.message);
    });
}
