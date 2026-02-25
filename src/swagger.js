const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Registro de IMC - API REST',
      version: '1.0.0',
      description: 'API REST para gestión de registros IMC con autenticación JWT y WAF ModSecurity',
      contact: {
        name: 'Equipo D',
        url: 'https://github.com/camachoo18/PRACTICA-CIBER-PPS'
      },
      license: {
        name: 'MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
        variables: {
          port: {
            default: '3000'
          }
        }
      },
      {
        url: 'http://localhost',
        description: 'Servidor con WAF Apache'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido en /api/auth/login. Formato: Bearer [token]'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Descripción del error'
            }
          }
        },
        User: {
          type: 'object',
          required: ['id', 'firstName', 'lastName', 'email', 'role'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            firstName: {
              type: 'string',
              example: 'José'
            },
            lastName: {
              type: 'string',
              example: 'López'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'jose@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-02-05T10:30:00Z'
            }
          }
        },
        Record: {
          type: 'object',
          required: ['id', 'userId', 'firstName', 'lastName', 'birthDate', 'weight', 'height', 'imc', 'category'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            userId: {
              type: 'integer',
              example: 1
            },
            firstName: {
              type: 'string',
              example: 'José María'
            },
            lastName: {
              type: 'string',
              example: 'López Martínez'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1990-01-15'
            },
            weight: {
              type: 'number',
              format: 'double',
              minimum: 0,
              maximum: 300,
              example: 75.5
            },
            height: {
              type: 'number',
              format: 'double',
              minimum: 50,
              maximum: 250,
              example: 182.5
            },
            imc: {
              type: 'string',
              example: '22.71'
            },
            category: {
              type: 'string',
              enum: ['Bajo peso', 'Peso normal', 'Sobrepeso', 'Obesidad'],
              example: 'Peso normal'
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2025-02-05'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-02-05T10:30:00Z'
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, './routes/auth.js'),
    path.join(__dirname, './routes/records.js'),
    path.join(__dirname, './routes/admin.js')
  ]
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };