async function fetchSailboats() {
    const response = await fetch('http://localhost:8080/api/sailboats');
    return await response.json();
}

async function fetchRaces() {
    const response = await fetch('http://localhost:8080/api/races');
    return await response.json();
}

async function fetchRaceResults(raceId) {
    const response = await fetch(`http://localhost:8080/api/race-results/race/${raceId}`);
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

async function populateRaceResultsTable(races, raceResultsTable, sailboatResults) {
    await Promise.all(races.map(async (race) => {
        const raceResults = await fetchRaceResults(race.id);
        raceResults.forEach(result => {
            const row = createTableRow([race.date, result.sailboat.name, result.sailboat.boatType, result.points]);
            raceResultsTable.appendChild(row);

            if (!sailboatResults[result.sailboat.id]) {
                sailboatResults[result.sailboat.id] = {
                    name: result.sailboat.name,
                    boatType: result.sailboat.boatType,
                    races: 0,
                    points: 0
                };
            }
            sailboatResults[result.sailboat.id].races++;
            sailboatResults[result.sailboat.id].points += result.points;
        });
    }));
}

function populateCumulativeResultsTable(sailboats, sailboatResults, cumulativeResultsTable) {
    sailboats.forEach(sailboat => {
        if (sailboatResults[sailboat.id]) {
            const row = createTableRow([sailboat.name, sailboat.boatType, sailboatResults[sailboat.id].races, sailboatResults[sailboat.id].points]);
            cumulativeResultsTable.appendChild(row);
        }
    });
}

async function populateTables() {
    const sailboats = await fetchSailboats();
    const races = await fetchRaces();
    const raceResultsTable = document.getElementById('raceResultsTable').getElementsByTagName('tbody')[0];
    const cumulativeResultsTable = document.getElementById('cumulativeResultsTable').getElementsByTagName('tbody')[0];

    let sailboatResults = {};

    await populateRaceResultsTable(races, raceResultsTable, sailboatResults);

    populateCumulativeResultsTable(sailboats, sailboatResults, cumulativeResultsTable);
}

populateTables();
