// fetch data
async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

// data manipulation
function createTableRow(columns) {
    const row = document.createElement('tr');
    columns.forEach(column => {
        const cell = document.createElement('td');
        cell.textContent = column;
        row.appendChild(cell);
    });
    return row;
}

function createParticipantItem(result) {
    const participant = document.createElement('li');
    participant.textContent = `${result.sailboat.name}: ${result.points} points`;
    return participant;
}

function createStatRow(label, value) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    const valueCell = document.createElement('td');

    labelCell.textContent = label;
    valueCell.textContent = value;

    row.appendChild(labelCell);
    row.appendChild(valueCell);

    return row;
}


// Populate
async function populateRaceResultsList(raceResultsList) {
    const raceDTOs = await fetchData('http://localhost:8080/api/races/races-dto');
    raceDTOs.sort((a, b) => new Date(a.date) - new Date(b.date));

    raceDTOs.forEach(raceDTO => {
        raceDTO.raceResults.sort((a, b) => a.points - b.points);

        const raceDiv = document.createElement('div');
        raceDiv.innerHTML = `<h3>Race Date: ${raceDTO.date}, Boat Type: ${raceDTO.boatType}</h3>`;

        const participantsList = document.createElement('ul');
        raceDTO.raceResults.forEach(result => {
            const participant = createParticipantItem(result);
            participantsList.appendChild(participant);
        });

        raceDiv.appendChild(participantsList);
        raceResultsList.appendChild(raceDiv);
    });
}

async function populateCumulativeResultsTable(cumulativeResultsTable) {
    const sailboatDTOs = await fetchData('http://localhost:8080/api/races/sailboats-cumulative-results-dto');
    sailboatDTOs.forEach(dto => {
        cumulativeResultsTable.appendChild(createTableRow([dto.name, dto.boatType, dto.totalRaces, dto.totalPoints]));
    });
}

async function populateSummaryStats() {
    const sailboatCount = await fetchData('http://localhost:8080/api/sailboats/count');
    const raceCount = await fetchData('http://localhost:8080/api/races/count');

    const summaryStatsTableBody = document.querySelector('table[summaryStats] tbody');

    summaryStatsTableBody.appendChild(createStatRow('Total Sailboats', sailboatCount));
    summaryStatsTableBody.appendChild(createStatRow('Total Races', raceCount));
}

// initialize
async function initialize() {
    const raceResultsList = document.getElementById('raceResultsList');
    const cumulativeResultsTable = document.getElementById('cumulativeResultsTable').getElementsByTagName('tbody')[0];

    await populateRaceResultsList(raceResultsList);
    populateCumulativeResultsTable(cumulativeResultsTable);
    populateSummaryStats();
}

initialize();
