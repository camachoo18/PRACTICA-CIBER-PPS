# 📝 Notas de Entrevista con el Cliente (Profesor)

## 🎯 Objetivo de la Entrevista

Definir los requisitos funcionales y no funcionales para el **Sistema de Registro de IMC**, incluyendo características, flujos de usuario y prioridades.

## 📋 Objetivos

### El propósito principal del sistema
Necesitamos una aplicación web que permita a los usuarios registrar su peso y altura diariamente para calcular automáticamente su IMC y mantener un historial completo de mediciones.

### Información que se debe almacenar de cada usuario
Nombre, apellido, fecha de nacimiento, peso, altura y fecha del registro.

### Debe clasificarse el IMC

> Según los rangos de la OMS:
> - Bajo peso: < 18.5
> - Peso normal: 18.5 - 24.9
> - Sobrepeso: 25 - 29.9
> - Obesidad: ≥ 30

### Mostrar el historial de registros
Sí, ordenado mostrando fecha, peso, altura, IMC y categoría con colores diferenciados.

**Decisión para guardar los datos:** JSON plano en `data/records.json`, basicamente por simplicidad para proyecto educativo, sin dependencias externas.

### Validaciones necesarias
Peso y altura deben ser mayores a 0, todos los campos obligatorios, formato de fecha válido.

### Front end
En principio, sera un front end basico donde el feedback visual y el entendimiento del cliente sea claro y conciso.