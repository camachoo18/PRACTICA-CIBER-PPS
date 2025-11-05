/**
 * @description Pruebas de Caja Blanca (Análisis Estructural)
 */

const request = require('supertest');
const express = require('express');
const fs = require('fs');

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

// Cargar la ruta real
const recordsRouter = require('../src/routes/records');

const app = express();
app.use(express.json());
app.use('/api/records', recordsRouter);

describe('Caja Blanca - /api/records', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/records → lectura correcta', async () => {
    const fakeStore = { records: [{ id: 1, firstName: 'A', weight: 70, height: 175 }] };
    fs.readFileSync.mockReturnValue(JSON.stringify(fakeStore));

    const res = await request(app).get('/api/records');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('records');
    expect(Array.isArray(res.body.records)).toBe(true);
    expect(res.body.records).toHaveLength(1);
  });

  test('GET /api/records → error de lectura (catch)', async () => {
    // Forzamos un error en lectura
    fs.readFileSync.mockImplementation(() => { throw new Error('read fail'); });

    const res = await request(app).get('/api/records');

    expect(res.status).toBe(200);
    // En catch la API responde { records: [] }
    expect(res.body).toHaveProperty('records');
    expect(res.body.records).toEqual([]);
  });

  test('POST /api/records → éxito con fecha personalizada', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify({ records: [] }));
    fs.writeFileSync.mockImplementation(() => { /* ok */ });

    const newRecord = {
      firstName: 'Test',
      lastName: 'User',
      birthDate: '1990-01-01',
      weight: 70,
      height: 175,
      date: '2025-01-01'
    };

    const res = await request(app).post('/api/records').send(newRecord);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('record');
    expect(res.body.record).toHaveProperty('imc');
  });

  test('POST /api/records → éxito sin fecha (usa actual)', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify({ records: [] }));
    fs.writeFileSync.mockImplementation(() => { /* ok */ });

    const newRecord = {
      firstName: 'Carlos',
      lastName: 'López',
      birthDate: '1992-03-10',
      weight: 80,
      height: 180
      
    };

    const res = await request(app).post('/api/records').send(newRecord);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.record).toHaveProperty('date'); // debe tener fecha por defecto
  });

  test('POST /api/records → error de escritura (catch)', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify({ records: [] }));
    // Forzamos fallo al escribir
    fs.writeFileSync.mockImplementation(() => { throw new Error('write fail'); });

    const newRecord = {
      firstName: 'Ana',
      lastName: 'Martínez',
      birthDate: '1988-11-25',
      weight: 65,
      height: 165
    };

    const res = await request(app).post('/api/records').send(newRecord);

    // En caso de fallo interno el handler responde 500
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('success', false);
  });
});