/**
 * Pruebas unitarias para el módulo calculator.js
 * Cubre: casos normales, casos límite y manejo de errores
 */

const { calculateIMC, getIMCCategory } = require('./calculator-wrapper.tests.js');

// ... resto del código sin cambios
describe('calculateIMC - Cálculo del Índice de Masa Corporal', () => {
  
  // ========== CASOS NORMALES ==========
  describe('Casos normales', () => {
    test('Debe calcular correctamente IMC para peso 70kg y altura 175cm', () => {
      const result = calculateIMC(70, 175);
      expect(result).toBe('22.86');
    });

    test('Debe calcular correctamente IMC para peso 85kg y altura 180cm', () => {
      const result = calculateIMC(85, 180);
      expect(result).toBe('26.23');
    });

    test('Debe calcular correctamente IMC para peso 55kg y altura 160cm', () => {
      const result = calculateIMC(55, 160);
      expect(result).toBe('21.48');
    });

    test('Debe retornar string con dos decimales', () => {
      const result = calculateIMC(70, 175);
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d+\.\d{2}$/);
    });
  });

  // ========== CASOS LÍMITE ==========
  describe('Casos límite', () => {
    test('Debe manejar peso mínimo (30kg) y altura mínima (100cm)', () => {
      const result = calculateIMC(30, 100);
      expect(result).toBe('30.00');
    });

    test('Debe manejar peso máximo (200kg) y altura máxima (220cm)', () => {
      const result = calculateIMC(200, 220);
      expect(result).toBe('41.32');
    });

    test('Debe manejar decimales en peso (70.5kg)', () => {
      const result = calculateIMC(70.5, 175);
      expect(result).toBe('23.02');
    });

    test('Debe manejar decimales en altura (175.5cm)', () => {
      const result = calculateIMC(70, 175.5);
      expect(result).toBe('22.73');
    });

    test('Debe manejar valores muy pequeños', () => {
      const result = calculateIMC(40, 150);
      expect(result).toBe('17.78');
    });

    test('Debe manejar valores muy grandes', () => {
      const result = calculateIMC(150, 200);
      expect(result).toBe('37.50');
    });
  });

  // ========== ERRORES ESPERADOS ==========
  describe('Manejo de errores y inputs inválidos', () => {
    test('Debe lanzar error con peso 0', () => {
      expect(() => calculateIMC(0, 175)).toThrow();
    });

    test('Debe lanzar error con altura 0', () => {
      expect(() => calculateIMC(70, 0)).toThrow();
    });

    test('Debe lanzar error con peso negativo', () => {
      expect(() => calculateIMC(-70, 175)).toThrow();
    });

    test('Debe lanzar error con altura negativa', () => {
      expect(() => calculateIMC(70, -175)).toThrow();
    });

    test('Debe lanzar error con peso no numérico', () => {
      expect(() => calculateIMC('abc', 175)).toThrow();
    });

    test('Debe lanzar error con altura no numérica', () => {
      expect(() => calculateIMC(70, 'xyz')).toThrow();
    });

    test('Debe lanzar error con valores null', () => {
      expect(() => calculateIMC(null, 175)).toThrow();
      expect(() => calculateIMC(70, null)).toThrow();
    });

    test('Debe lanzar error con valores undefined', () => {
      expect(() => calculateIMC(undefined, 175)).toThrow();
      expect(() => calculateIMC(70, undefined)).toThrow();
    });
  });
});

describe('getIMCCategory - Clasificación del IMC', () => {
  
  // ========== CASOS NORMALES ==========
  describe('Casos normales - Categorías', () => {
    test('Debe clasificar IMC 17 como Bajo peso', () => {
      const result = getIMCCategory(17);
      expect(result.category).toBe('Bajo peso');
      expect(result.color).toBe('#3498db');
      expect(result.explanation).toContain('bajo peso');
    });

    test('Debe clasificar IMC 22 como Peso normal', () => {
      const result = getIMCCategory(22);
      expect(result.category).toBe('Peso normal');
      expect(result.color).toBe('#2ecc71');
      expect(result.explanation).toContain('saludable');
    });

    test('Debe clasificar IMC 27 como Sobrepeso', () => {
      const result = getIMCCategory(27);
      expect(result.category).toBe('Sobrepeso');
      expect(result.color).toBe('#f39c12');
      expect(result.explanation).toContain('sobrepeso');
    });

    test('Debe clasificar IMC 32 como Obesidad', () => {
      const result = getIMCCategory(32);
      expect(result.category).toBe('Obesidad');
      expect(result.color).toBe('#e74c3c');
      expect(result.explanation).toContain('obesidad');
    });
  });

  // ========== CASOS LÍMITE ==========
  describe('Casos límite - Bordes de categorías', () => {
    test('Debe clasificar IMC 18.5 exacto como Peso normal (límite inferior)', () => {
      const result = getIMCCategory(18.5);
      expect(result.category).toBe('Peso normal');
    });

    test('Debe clasificar IMC 18.49 como Bajo peso (justo debajo del límite)', () => {
      const result = getIMCCategory(18.49);
      expect(result.category).toBe('Bajo peso');
    });

    test('Debe clasificar IMC 25 exacto como Sobrepeso (límite inferior)', () => {
      const result = getIMCCategory(25);
      expect(result.category).toBe('Sobrepeso');
    });

    test('Debe clasificar IMC 24.99 como Peso normal (justo debajo del límite)', () => {
      const result = getIMCCategory(24.99);
      expect(result.category).toBe('Peso normal');
    });

    test('Debe clasificar IMC 30 exacto como Obesidad (límite inferior)', () => {
      const result = getIMCCategory(30);
      expect(result.category).toBe('Obesidad');
    });

    test('Debe clasificar IMC 29.99 como Sobrepeso (justo debajo del límite)', () => {
      const result = getIMCCategory(29.99);
      expect(result.category).toBe('Sobrepeso');
    });

    test('Debe manejar IMC extremadamente bajo (10)', () => {
      const result = getIMCCategory(10);
      expect(result.category).toBe('Bajo peso');
    });

    test('Debe manejar IMC extremadamente alto (50)', () => {
      const result = getIMCCategory(50);
      expect(result.category).toBe('Obesidad');
    });
  });

  // ========== ESTRUCTURA DEL OBJETO ==========
  describe('Estructura del objeto de retorno', () => {
    test('Debe retornar objeto con propiedades requeridas', () => {
      const result = getIMCCategory(22);
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('explanation');
    });

    test('Todas las categorías deben tener colores válidos', () => {
      const categories = [17, 22, 27, 32];
      categories.forEach(imc => {
        const result = getIMCCategory(imc);
        expect(result.color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    test('Todas las explicaciones deben ser strings no vacíos', () => {
      const categories = [17, 22, 27, 32];
      categories.forEach(imc => {
        const result = getIMCCategory(imc);
        expect(typeof result.explanation).toBe('string');
        expect(result.explanation.length).toBeGreaterThan(0);
      });
    });
  });

  // ========== ERRORES ESPERADOS ==========
  describe('Manejo de errores', () => {
    test('Debe lanzar error con IMC no numérico', () => {
      expect(() => getIMCCategory('abc')).toThrow();
    });

    test('Debe lanzar error con IMC null', () => {
      expect(() => getIMCCategory(null)).toThrow();
    });

    test('Debe lanzar error con IMC undefined', () => {
      expect(() => getIMCCategory(undefined)).toThrow();
    });

    test('Debe lanzar error con IMC negativo', () => {
      expect(() => getIMCCategory(-5)).toThrow();
    });

    test('Debe lanzar error con IMC 0', () => {
      expect(() => getIMCCategory(0)).toThrow();
    });
  });
});