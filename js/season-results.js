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

async function populateTables() {
    const raceDTOs = await fetchRacesDTO();
    const sailboatDTOs = await fetchSailboatCumulativeResultsDTO();
    const raceResultsList = document.getElementById('raceResultsList');
    const cumulativeResultsTable = document.getElementById('cumulativeResultsTable').getElementsByTagName('tbody')[0];

    await populateRaceResultsList(raceDTOs, raceResultsList);

    populateCumulativeResultsTable(sailboatDTOs, cumulativeResultsTable);
}

populateTables();
