# Sistema de Registro de IMC

[![CI](https://github.com/camachoo18/PRACTICA-CIBER-PPS/actions/workflows/test.yml/badge.svg)](https://github.com/camachoo18/PRACTICA-CIBER-PPS/actions/workflows/test.yml)

![coverage](./coverage/badge.svg) 


## Instrucciones de Ejecución

### Prerrequisitos

- **Node.js** versión 14 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (se instala automáticamente con Node.js)

### Pasos para Ejecutar

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/camachoo18/PRACTICA-CIBER-PPS.git
   cd PRACTICA-CIBER-PPS
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar archivo setup.sh/setup.bat dependiendo del SO para poner en funcionamiento proyecto**
   
   El archivo `setup.sh` debe ejecutarse en linux:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   El archivo `setup.bat` debe ejecutarse en Windows:
   ```bash
   setup.bat
   ```
   

4. **Iniciar el servidor**
   ```bash
   npm start
   ```

5. **Abrir en el navegador**
   
   Visita: **http://localhost:3000**

### Comandos Disponibles

```bash
npm start       # Iniciar servidor en modo producción
```

### Verificación

Si todo funciona correctamente, deberías ver en la consola:
```
Servidor corriendo en http://localhost:3000
```

---

**Nota**: Con esto podras acceder a la app web de registro de IMC.

## 🧪 Pruebas Unitarias

Se han implementado **pruebas unitarias** que garantizan la calidad del código y su correcto funcionamiento.  
Estas pruebas cubren tres tipos principales de casos:

### Casos Normales
Verifican el comportamiento esperado con **entradas válidas**.  
Ejemplo: cálculos correctos del IMC, validaciones de edad y respuestas HTTP válidas.

### ⚡ Casos Límite
Comprueban el funcionamiento en los **bordes de los rangos válidos**.  
Ejemplo: valores mínimos y máximos de peso y altura, límites exactos de categorías IMC.

### Errores Esperados
Evalúan el manejo de **entradas inválidas o excepciones**.  
Ejemplo: valores nulos, negativos, no numéricos o formatos incorrectos.

---

### Ejecución de Pruebas

Para ejecutar todas las pruebas unitarias del proyecto:

```bash
npm run test    # Ejecutar pruebas
```
De esta manera podra ejecutar un testeo de todos los casos previamente mencionados. Estas pruebas aseguran que el sistema sea fiable, mantenible y libre de errores antes de cada despliegue.

Para ejecutar el coverage del proyecto

```bash
npm run test:coverage     # Generar cobertura
```
De esta manera genera un coverage del proyecto en un html. Para acceder al informe debes irte a:

```bash
start coverage/index.html
```
