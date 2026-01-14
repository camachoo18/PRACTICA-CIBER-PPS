const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/imc.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err);
    } else {
        console.log('✅ Conectado a SQLite');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Tabla de usuarios
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabla de registros IMC
db.run(`
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        birthDate TEXT NOT NULL,
        weight REAL NOT NULL,
        height REAL NOT NULL,
        imc TEXT NOT NULL,
        date TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
`);
    });
}

module.exports = db;