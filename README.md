# Sistema de Registro de IMC

## 🚀 Instrucciones de Ejecución

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

3. **Verificar que existe el archivo de datos**
   
   El archivo `data/records.json` debe contener y es donde se guardara nuestros datos de altura y peso:
   ```json
   {
     "records": []
   }
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