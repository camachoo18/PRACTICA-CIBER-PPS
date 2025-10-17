export async function saveRecord(firstName, lastName, birthDate, weight, height, date) {
    const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, birthDate, weight, height, date })
    });
    return await response.json();
}

export async function getRecords() {
    const response = await fetch('/api/records');
    return await response.json();
}