## 📋 **Especificación de Requisitos**

### 📌 **Requisitos Funcionales (RF)**

| ID | Descripción | Prioridad | Implementación | Estado |
|----|-------------|-----------|----------------|--------|
| **RF-001** | Permitir ingresar peso en kilogramos | Alta | [`public/index.html`](../public/index.html) | ✅ |
| **RF-002** | Permitir ingresar altura en centímetros | Alta | [`public/index.html`](../public/index.html) | ✅ |
| **RF-003** | Calcular automáticamente el IMC usando la fórmula: peso/(altura en metros)² | Alta | [`public/js/calculator.js`](../public/js/calculator.js) | ✅ |
| **RF-004** | Clasificar el IMC según los rangos de la OMS | Alta | [`public/js/calculator.js`](../public/js/calculator.js) | ✅ |
| **RF-005** | Guardar registros de peso, altura, IMC y fecha | Alta | [`src/routes/records.js`](../src/routes/records.js) | ✅ |
| **RF-006** | Permitir ingresar nombre y apellido del paciente | Alta | [`public/index.html`](../public/index.html) | ✅ |
| **RF-007** | Calcular automáticamente la edad del paciente | Alta | [`public/js/app.js`](../public/js/app.js) | ✅ |
| **RF-008** | Mostrar un historial completo de registros | Alta | [`public/js/app.js`](../public/js/app.js)  | ✅ |
| **RF-009** | Ordenar el historial del más reciente al más antiguo | Media | [`public/js/app.js`](../public/js/app.js) | ✅ |
| **RF-010** | Asignar un color diferente a cada categoría de IMC | Media | [`public/js/calculator.js`](../public/js/calculator.js) | ✅ |
| **RF-011** | Proporcionar explicaciones personalizadas según el IMC | Media | [`public/js/calculator.js`](../public/js/calculator.js) | ✅ |
| **RF-012** | Permitir múltiples registros en el mismo día | Baja | [`src/routes/records.js`](../src/routes/records.js) | ✅ |
| **RF-013** | Establecer la fecha actual por defecto | Baja | [`public/js/app.js`](../public/js/app.js) | ✅ |

### 🔧 **Requisitos No Funcionales (RNF)**

| ID | Descripción | Verificación | Estado |
|----|-------------|--------------|--------|
| **RNF-001** | El tiempo de respuesta del cálculo IMC debe ser < 200ms | Manual / Performance tests | ✅ |
| **RNF-002** | La interfaz es responsive (móvil, tablet, escritorio) | [`public/css/styles.css`](../public/css/styles.css) | ✅ |
| **RNF-003** | La cobertura de código es ≥ 80% | [`jest.config.js`](../jest.config.js) | ✅ 94.44% |
| **RNF-004** | Validar todos los inputs antes de procesar | [`public/js/app.js`](../public/js/app.js) | ✅ |
| **RNF-005** | Persistir entre sesiones | [`data/records.json`](../data/records.json) | ✅ |
| **RNF-006** | Manejar errores de forma robusta sin crashes | [`src/routes/records.js`](../src/routes/records.js) | ✅ |
| **RNF-007** | Tener una cobertura de tests unitarios > 90% | [`coverage/index.html`](../coverage/index.html) | ✅ 94.44% |
| **RNF-008** | Funcionar en navegadores modernos (Chrome, Firefox) | Manual | ✅ |
| **RNF-009** | Seguir las guías de la OMS para categorización IMC | [`public/js/calculator.js`](../public/js/calculator.js) | ✅ |
| **RNF-010** | Los mensajes de error son claros | [`public/js/calculator.js`](../public/js/calculator.js) | ✅ |

### 🔒 **Requisitos de Seguridad (RS)**

| ID | Descripción | Verificación | Estado |
|----|-------------|--------------|--------|
| **RS-001** | Validar peso > 0 | [`public/js/calculator.js`](../public/js/calculator.js) | ✅ |
| **RS-002** | Validar altura > 0 | [`public/js/calculator.js`](../public/js/calculator.js)  | ✅ |
| **RS-003** | Rechazar valores no numéricos | [`public/js/calculator.js`](../public/js/calculator.js)  | ✅ |
| **RS-004** | Sanitizar inputs de texto (nombre, apellido) | [`src/routes/records.js`](../src/routes/records.js) (`.trim()`) | ✅ |
| **RS-005** | Validar formato de fecha (YYYY-MM-DD) | [`public/index.html`](../public/index.html) (`type="date"`) | ✅ |

---

# 🧭 **Descripción del Sistema de Registro de IMC**

## 📘 **Manual de Usuario – Descripción General**
El **Sistema de Registro de IMC** es una aplicación web que permite al usuario **registrar peso y altura diariamente**, calcular automáticamente su **Índice de Masa Corporal (IMC)** y mostrar su **estado de salud** según los rangos de la **OMS**.  
También almacena un **historial completo** de registros, mostrando la evolución del usuario con explicaciones y recomendaciones personalizadas.

---

## ⚙️ **Características Principales**

1. **Registro Diario de Datos**
   - Entrada de peso (kg) y altura (cm).
   - Fecha automática del registro.
   - Nombre, apellido, fecha de nacimiento del paciente
   - Permite múltiples registros en un mismo día.

2. **Cálculo Automático del IMC**
   - IMC = peso / (altura en metros)²  
   - Resultado con dos decimales.

3. **Clasificación según la OMS**
   - 🔵 Bajo peso: <18.5  
   - 🟢 Peso normal: 18.5–24.9  
   - 🟠 Sobrepeso: 25–29.9  
   - 🔴 Obesidad: ≥30  

4. **Explicaciones Personalizadas**
   - Muestra el valor del IMC, categoría, explicación y recomendaciones.

5. **Historial Completo**
   - Registros ordenados por fecha.
   - Muestra peso, altura, IMC y categoría.
   - Permite visualizar la evolución a lo largo del tiempo.

6. **Privacidad**
   - Los datos se guardan de forma segura.
   - No se almacenan nombres ni información personal.

---

## 🔄 **Flujos Principales de la Aplicación**

### 🧩 **Flujo 1: Nuevo Registro**
**Objetivo:** Calcular y guardar un nuevo IMC.  

**Pasos del usuario:**
1. Accede a la app desde el navegador.  
2. Completa los campos de peso y altura, nombre, apellido y fecha de nacimiento .  
3. Verifica la fecha (se llena automáticamente).  
4. Pulsa **“Calcular y Guardar”**.  

**Qué hace la app:**
- Valida los datos.  
- Calcula el IMC.  
- Determina la categoría.  
- Muestra tarjeta de resultados con color, explicación y recomendaciones.  
- Guarda el registro en el historial.  
- Limpia el formulario para nuevos datos.  

---

### 📜 **Flujo 2: Consultar Historial**
**Objetivo:** Revisar registros anteriores.  

**Pasos del usuario:**
1. Accede a la app (el historial se carga automáticamente).  
2. Desplázate hasta la sección “Historial de Registros”.  

**Qué hace la app:**
- Muestra cada registro con: fecha, peso, altura, IMC y categoría.  
- Ordena del más reciente al más antiguo.  
- Si no hay datos, muestra el mensaje “No hay registros todavía”.  

---

### 📅 **Flujo 3: Seguimiento Diario**
**Objetivo:** Llevar un control constante del peso y IMC para cada paciente.  

**Qué debe ocurrir:**
- El usuario realiza una medición diaria.  
- Registra peso y altura en la app.  
- El sistema genera un identificador único para cada registro.  
- Permite varios registros en el mismo día.  
- Actualiza el historial en tiempo real.  

**Beneficios:** seguimiento de progreso, detección temprana de cambios y motivación continua.

---

## 🧠 **Interpretación y Resultados**
Cada resultado incluye:
- Valor del IMC con dos decimales.  
- Categoría con color.  
- Explicación del significado.  
- Recomendaciones adaptadas.  

**Colores del sistema:**
- 🔵 Bajo Peso → Recomendación: aumentar calorías saludablemente.  
- 🟢 Peso Normal → Mantener hábitos.  
- 🟠 Sobrepeso → Ajustar dieta y aumentar actividad física.  
- 🔴 Obesidad → Consultar a un profesional de salud.  

---

## 📊 **Beneficios del Uso Regular**
- Seguimiento objetivo y visual del progreso.  
- Detección de tendencias de peso.  
- Toma de decisiones informadas.  
- Prevención de problemas de salud.  
- Motivación continua mediante resultados visibles.  

---

## ⚠️ **Consideraciones y Consejos**
- El IMC es una referencia, no un diagnóstico médico.  
- Medir siempre en las mismas condiciones (hora, báscula, ropa).  
- Mantener constancia en los registros.  
- Consultar a un profesional si hay resultados anómalos o cambios bruscos.  

---

## 💡 **Resumen Rápido de Uso**
1. Acceda a la aplicación.  
2. Ingrese peso, altura, nombre, apellido y fecha de nacimiento.  
3. Pulse “Calcular y Guardar”.  
4. Revise su IMC y recomendaciones.  
5. Consulte su historial.  
6. Repita diariamente.  

---

✅ **En resumen:**  
La aplicación debe permitir **registrar datos, calcular el IMC, mostrar resultados personalizados, guardar el historial y mantener la privacidad**.  
Su flujo principal consiste en **ingresar datos → calcular → mostrar resultados → guardar → visualizar historial**.
