// Add event listener to Create form
document.getElementById('create-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = {
        sailboat: {
            id: document.getElementById('create-sailboat').value
        },
        race: {
            id: document.getElementById('create-race').value
        },
        points: document.getElementById('create-points').value
    };

    fetch('http://localhost:8080/api/race-results', {
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
    fetch('http://localhost:8080/api/race-results')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('race-results-list');
            const tbody = table.querySelector('tbody');

            // Clear the table body content in case it's being refreshed
            tbody.innerHTML = '';

            data.forEach(item => {
                let row = document.createElement('tr');
                ['id', 'race.date', 'race.boatType', 'race.id', 'race.boatType', 'sailboat.id', 'sailboat.name', 'points'].forEach(field => {
                    let cell = document.createElement('td');
                    let [object, property] = field.split('.');
                    cell.textContent = object && property ? item[object][property] : item[field];
                    row.appendChild(cell);
                });

                // Action buttons
                let actionCell = document.createElement('td');
                let updateBtn = document.createElement('button');
                updateBtn.textContent = 'Update';
                updateBtn.addEventListener('click', () => updateRaceResult(item.id));
                actionCell.appendChild(updateBtn);

                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => deleteRaceResult(item.id));
                actionCell.appendChild(deleteBtn);

                row.appendChild(actionCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}


// Close button functionality
document.getElementById("close").onclick = function() {
    var updateModal = document.getElementById("updateModal");
    updateModal.style.display = "none";
}


// Update a Race Result
function updateRaceResult(id) {
    var updateModal = document.getElementById("updateModal");
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
document.getElementById("updateForm").addEventListener("submit", function(event){
    event.preventDefault();

    console.log("update form submitted");

    var formData = {
        sailboat: {
            id: document.getElementById("sailboatId").value,
        },
        race: {
            id: document.getElementById("raceId").value,
        },
        points: document.getElementById("points").value,
    };

    var id = document.getElementById("updateId").value;

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
            var updateModal = document.getElementById("updateModal");
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


// Populate Sailboat Select
function populateSailboats(selectId, defaultSelection) {
    fetch('http://localhost:8080/api/sailboats')
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById(selectId);
            data.forEach(item => {
                let option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.name} - ${item.boatType}`;
                if(item.id == defaultSelection){
                    option.selected = true;
                }
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Populate Race Select
function populateRaces(selectId, defaultSelection) {
    fetch('http://localhost:8080/api/races')
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById(selectId);
            data.forEach(item => {
                let option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.date} - ${item.boatType}`;
                if(item.id === defaultSelection){
                    option.selected = true;
                }
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// todo add update select options to html instead of input fieldss
window.onload = function() {
    refreshList();
    populateSailboats('create-sailboat', 2);
    populateSailboats('update-sailboat', 2);
    populateRaces('create-race', 2);
    populateRaces('update-race', 2);
}
