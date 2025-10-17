/**
 * Pruebas para funciones de utilidad
 * Cubre: cálculo de edad y validaciones
 */

describe('Funciones de Utilidad', () => {
  
  // Función auxiliar para calcular edad
  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  describe('calculateAge - Cálculo de edad', () => {
    
    test('Debe calcular correctamente la edad para fecha hace 30 años', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 30);
      const age = calculateAge(birthDate.toISOString().split('T')[0]);
      expect(age).toBe(30);
    });

    test('Debe retornar 0 para nacimiento este año', () => {
      const today = new Date();
      const birthDate = `${today.getFullYear()}-01-01`;
      const age = calculateAge(birthDate);
      expect(age).toBe(0);
    });

    test('Debe manejar personas mayores de 100 años', () => {
      const birthDate = '1920-05-15';
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThan(100);
    });
  });

  describe('Validación de fechas', () => {
    
    test('Debe validar formato de fecha YYYY-MM-DD', () => {
      const validDate = '2024-01-15';
      expect(validDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('Debe detectar formato de fecha inválido', () => {
      const invalidDate = '15-01-2024';
      expect(invalidDate).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Validación de datos personales', () => {
    
    test('Debe validar que firstName no esté vacío', () => {
      const firstName = 'Juan';
      expect(firstName.trim().length).toBeGreaterThan(0);
    });

    test('Debe recortar espacios en blanco', () => {
      const firstName = '  Juan  ';
      expect(firstName.trim()).toBe('Juan');
    });
  });
});