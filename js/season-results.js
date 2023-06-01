async function fetchRacesDTO() {
    const response = await fetch('http://localhost:8080/api/races/races-dto');
    return await response.json();
}

async function fetchSailboatCumulativeResultsDTO() {
    const response = await fetch('http://localhost:8080/api/races/sailboats-cumulative-results-dto');
    return await response.json();
}

function createTableRow(columns) {
    const row = document.createElement('tr');
    columns.forEach(column => {
        const cell = document.createElement('td');
        cell.textContent = column;
        row.appendChild(cell);
    });
    return row;
}

function sortByDate(a, b) {
    return new Date(a.date) - new Date(b.date);
}

function sortByPoints(a, b) {
    return a.points - b.points;
}

function createParticipantItem(result) {
    const participant = document.createElement('li');
    participant.textContent = `${result.sailboat.name}: ${result.points} points`;
    return participant;
}

async function populateRaceResultsList(raceDTOs, raceResultsList) {
    raceDTOs.sort(sortByDate);

    raceDTOs.forEach(raceDTO => {
        // Sort raceResults by points
        raceDTO.raceResults.sort(sortByPoints);

        // Create a div for this race
        const raceDiv = document.createElement('div');
        raceDiv.innerHTML = `<h3>Race Date: ${raceDTO.date}, Boat Type: ${raceDTO.boatType}</h3>`;

        // Create a ul for the participant list
        const participantsList = document.createElement('ul');
        raceDTO.raceResults.forEach(result => {
            const participant = createParticipantItem(result);
            participantsList.appendChild(participant);
        });

        raceDiv.appendChild(participantsList);
        raceResultsList.appendChild(raceDiv);
    });
}

function populateCumulativeResultsTable(sailboatDTOs, cumulativeResultsTable) {
    sailboatDTOs.forEach(dto => {
        cumulativeResultsTable.appendChild(createTableRow([dto.name, dto.boatType, dto.totalRaces, dto.totalPoints]));
    });
}

async function fetchSailboatCount() {
    const response = await fetch('http://localhost:8080/api/sailboats/count');
    return await response.json();
}

async function fetchRaceCount() {
    const response = await fetch('http://localhost:8080/api/races/count');
    return await response.json();
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

async function populateSummaryStats() {
    const sailboatCount = await fetchSailboatCount();
    const raceCount = await fetchRaceCount();

    const summaryStatsTableBody = document.querySelector('table[summaryStats] tbody');

    // Append stats
    summaryStatsTableBody.appendChild(createStatRow('Total Sailboats', sailboatCount));
    summaryStatsTableBody.appendChild(createStatRow('Total Races', raceCount));
}





async function populateTables() {
    const raceDTOs = await fetchRacesDTO();
    const sailboatDTOs = await fetchSailboatCumulativeResultsDTO();
    const raceResultsList = document.getElementById('raceResultsList');
    const cumulativeResultsTable = document.getElementById('cumulativeResultsTable').getElementsByTagName('tbody')[0];

    await populateRaceResultsList(raceDTOs, raceResultsList);

    populateCumulativeResultsTable(sailboatDTOs, cumulativeResultsTable);
}

populateSummaryStats();
populateTables();

