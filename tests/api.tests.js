/**
 * Pruebas de integración para las rutas de la API
 * Cubre: endpoints, validaciones y persistencia
 */

const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Crear una app de prueba
const app = express();
app.use(express.json());

// Simular rutas (necesitarás ajustar esto según tu estructura)
const recordsRouter = require('../src/routes/records');
app.use('/api/records', recordsRouter);

describe('API de Registros - /api/records', () => {
  
  describe('GET /api/records', () => {
    
    test('Debe retornar status 200', async () => {
      const response = await request(app).get('/api/records');
      expect(response.status).toBe(200);
    });

    test('Debe retornar un objeto con propiedad records', async () => {
      const response = await request(app).get('/api/records');
      expect(response.body).toHaveProperty('records');
    });

    test('Debe retornar Content-Type application/json', async () => {
      const response = await request(app).get('/api/records');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('POST /api/records', () => {
    
    test('Debe crear un nuevo registro correctamente', async () => {
      const newRecord = {
        firstName: 'Test',
        lastName: 'Usuario',
        birthDate: '1990-01-01',
        weight: 70,
        height: 175,
        date: '2024-01-15'
      };

      const response = await request(app)
        .post('/api/records')
        .send(newRecord);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('record');
    });

    test('Debe calcular correctamente el IMC', async () => {
      const newRecord = {
        firstName: 'Carlos',
        lastName: 'López',
        birthDate: '1992-03-10',
        weight: 80,
        height: 180,
        date: '2024-01-15'
      };

      const response = await request(app)
        .post('/api/records')
        .send(newRecord);

      expect(response.body.record.imc).toBe('24.69');
    });

    test('Debe generar un ID único', async () => {
      const record1 = {
        firstName: 'Ana',
        lastName: 'Martínez',
        birthDate: '1988-11-25',
        weight: 60,
        height: 160,
        date: '2024-01-15'
      };

      const record2 = {
        firstName: 'Luis',
        lastName: 'Rodríguez',
        birthDate: '1995-07-18',
        weight: 75,
        height: 175,
        date: '2024-01-15'
      };

      const response1 = await request(app).post('/api/records').send(record1);
      const response2 = await request(app).post('/api/records').send(record2);

      expect(response1.body.record.id).not.toBe(response2.body.record.id);
    });
  });
});