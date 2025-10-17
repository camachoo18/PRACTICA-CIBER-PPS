export async function saveRecord(weight, height, date) {
    const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ weight, height, date })
    });
    return await response.json();
}

export async function getRecords() {
    const response = await fetch('/api/records');
    return await response.json();
}