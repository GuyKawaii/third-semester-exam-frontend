// Add event listener to Create form
document.getElementById('create-form').addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = {
        date: document.getElementById('create-date').value,
        boatType: document.getElementById('create-boatType').value
    };

    fetch('http://localhost:8080/api/races', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        if (response.ok) {
            refreshList();
        }
    });
});

function refreshList() {
    fetch('http://localhost:8080/api/races')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('raceList');
            const tbody = table.querySelector('tbody');

            // Clear the table body content in case it's being refreshed
            tbody.innerHTML = '';

            data.forEach(item => {
                let row = document.createElement('tr');

                // Date
                let dateCell = document.createElement('td');
                dateCell.textContent = item.date;
                row.appendChild(dateCell);

                // Boat Type
                let boatTypeCell = document.createElement('td');
                boatTypeCell.textContent = item.boatType;
                row.appendChild(boatTypeCell);

                // Action buttons
                let actionCell = document.createElement('td');
                let selectBtn = document.createElement('button');
                selectBtn.textContent = 'Select';
                selectBtn.addEventListener('click', () => window.location.href = `race.html?raceId=${item.id}`);
                actionCell.appendChild(selectBtn);

                row.appendChild(actionCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

refreshList();

// Close button functionality
document.getElementById("close").onclick = function () {
    let updateModal = document.getElementById("updateModal");
    updateModal.style.display = "none";
}

// Update a Race Result
function updateRaceResult(id) {
    let updateModal = document.getElementById("updateModal");
    document.getElementById("updateId").value = id;

    // Fetch current details of Race Result and fill in form
    fetch(`http://localhost:8080/api/race-results/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("sailboatId").value = data.sailboat.id;
            document.getElementById("raceId").value = data.race.id;
            document.getElementById("points").value = data.points;
        });

    updateModal.style.display = "block";
}

// Submit form for update
document.getElementById("updateForm").addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("update form submitted");

    let formData = {
        sailboat: {
            id: document.getElementById("sailboatId").value,
        },
        race: {
            id: document.getElementById("raceId").value,
        },
        points: document.getElementById("points").value,
    };

    let id = document.getElementById("updateId").value;

    console.log(JSON.stringify(formData));

    fetch(`http://localhost:8080/api/race-results/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        if (response.ok) {
            refreshList();
            let updateModal = document.getElementById("updateModal");
            updateModal.style.display = "none";
        }
    });
});

// Delete a Race Result
function deleteRaceResult(id) {
    fetch(`http://localhost:8080/api/race-results/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            refreshList();
        }
    });
}

window.onload = function () {
    refreshList();
}
