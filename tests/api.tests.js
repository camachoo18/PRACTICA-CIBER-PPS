const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Crear una app de prueba
const app = express();
app.use(express.json());

// Rutas
const { router: authRouter } = require('../src/routes/auth');
const recordsRouter = require('../src/routes/records');

app.use('/api/auth', authRouter);
app.use('/api/records', recordsRouter);

describe('API de Registros - /api/records', () => {
  
  let token;
  let userId = 1;

  beforeAll(() => {
    // Generar token válido para tests
    token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );
  });

  describe('GET /api/records', () => {
    
    test('Debe retornar status 200', async () => {
      const response = await request(app)
        .get('/api/records')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    test('Debe retornar un objeto con propiedad records', async () => {
      const response = await request(app)
        .get('/api/records')
        .set('Authorization', `Bearer ${token}`);
      expect(response.body).toHaveProperty('records');
    });

    test('Debe retornar Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/records')
        .set('Authorization', `Bearer ${token}`);
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
        .set('Authorization', `Bearer ${token}`)
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
        height: 180
      };

      const response = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${token}`)
        .send(newRecord);

      expect(response.status).toBe(200);
      expect(response.body.record.imc).toBe('24.69');
    });

    test('Debe generar un ID único', async () => {
      const record1 = {
        firstName: 'Juan',
        lastName: 'Pérez',
        birthDate: '1985-05-20',
        weight: 75,
        height: 180
      };

      const record2 = {
        firstName: 'María',
        lastName: 'García',
        birthDate: '1990-08-15',
        weight: 65,
        height: 165
      };

      const response1 = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${token}`)
        .send(record1);

      const response2 = await request(app)
        .post('/api/records')
        .set('Authorization', `Bearer ${token}`)
        .send(record2);

      expect(response1.body.record.id).not.toBe(response2.body.record.id);
    });
  });
});