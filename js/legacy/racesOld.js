async function fetchRaces() {
    const response = await fetch('http://localhost:8080/api/races');
    return await response.json();
}

async function addRace(event) {
    event.preventDefault();

    const date = document.getElementById('dateInput').value;
    const boatType = document.getElementById('boatTypeInput').value;

    const response = await fetch('http://localhost:8080/api/races', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, boatType })
    });

    if (response.ok) {
        // Refresh the races list after adding a new race
        populateRacesList();
    }
}

function populateRacesList() {
    const racesList = document.getElementById('racesList');
    racesList.innerHTML = '';

    fetchRaces().then(races => {
        races.forEach(race => {
            const li = document.createElement('li');
            li.textContent = `Date: ${race.date}, Boat Type: ${race.boatType}`;
            const btn = document.createElement('button');
            btn.textContent = "Select";
            btn.onclick = function () {
                window.location.href = `race.html?raceId=${race.id}`;
            };
            li.appendChild(btn);
            racesList.appendChild(li);
        });
    });
}

populateRacesList();
