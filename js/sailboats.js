// Fetch all Sailboats when the page loads
window.onload = function() {
    refreshList();
};

// Add event listener to Create form
document.getElementById('create-form').addEventListener('submit', function(event) {
    event.preventDefault();// Add event listener to Create form
document.getElementById('create-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = {
        name: document.getElementById('create-name').value,
        boatType: document.getElementById('create-boatType').value,
    };

    fetch('http://localhost:8080/api/sailboats', {
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

    var formData = {
        name: document.getElementById('create-name').value,
        boatType: document.getElementById('create-boatType').value,
    };

    fetch('http://localhost:8080/api/sailboats', {
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

// Refresh list of Sailboats
function refreshList() {
    fetch('http://localhost:8080/api/sailboats')
        .then(response => response.json())
        .then(data => {
            var table = document.getElementById('sailboats-list');
            // Clear the table
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            // Repopulate the table
            data.forEach(boat => {
                var row = table.insertRow(-1);
                row.insertCell(0).textContent = boat.id;
                row.insertCell(1).textContent = boat.name;
                row.insertCell(2).textContent = boat.boatType;

                // Create "Update" button
                var updateButton = document.createElement('button');
                updateButton.textContent = "Update";
                updateButton.addEventListener('click', function() {
                    updateBoat(boat.id);
                });

                // Create "Delete" button
                var deleteButton = document.createElement('button');
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener('click', function() {
                    deleteBoat(boat.id);
                });

                // Add buttons to new cell
                var actionsCell = row.insertCell(3);
                actionsCell.appendChild(updateButton);
                actionsCell.appendChild(deleteButton);
            });
        });
}

// Update a Sailboat
function updateBoat(id) {
    var updateModal = document.getElementById("updateModal");
    document.getElementById("updateId").value = id; // TODO checkout later location HTML and so on

    console.log("to update: " + id);

    // Fetch current details of Sailboat and fill in form
    fetch(`http://localhost:8080/api/sailboats/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("name").value = data.name;
            document.getElementById("boatType").value = data.boatType;
        });

    updateModal.style.display = "block";
}

// Close button functionality
document.getElementById("close").onclick = function() {
    var updateModal = document.getElementById("updateModal");
    updateModal.style.display = "none";
}

// Submit form for update
document.getElementById("updateForm").addEventListener("submit", function(event){
    event.preventDefault();

    console.log("update form submitted");

    var formData = {
        name: document.getElementById("name").value,
        boatType: document.getElementById("boatType").value,
    };

    var id = document.getElementById("updateId").value;

    console.log(JSON.stringify(formData));

    fetch(`http://localhost:8080/api/sailboats/${id}`, {
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


// Delete a Sailboat
function deleteBoat(id) {
    fetch(`http://localhost:8080/api/sailboats/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            refreshList();
        }
    });
}
