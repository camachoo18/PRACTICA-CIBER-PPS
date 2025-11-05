# Pruebas de Caja Blanca (Análisis Estructural)
Las pruebas de **Caja Blanca** o **Análisis Estructural** se basan en conocer el funcionamiento interno del código.

Este módulo gestiona las operaciones `GET` y `POST` sobre el recurso `/api/records`, que permite consultar y registrar información de usuarios y su índice de masa corporal (IMC).

---

## ⚙️ Objetivos
1. **Obtener el diagrama de flujo de control (CFG)** de las funciones principales.
2. **Calcular la complejidad ciclomática** para estimar la cantidad mínima de pruebas necesarias.
3. **Definir los caminos independientes del programa**.
4. **Diseñar y ejecutar pruebas unitarias con Jest** que cubran todos los caminos posibles.

---

## 1. Diagrama de Flujo de Control (CFG)
### Handler: `GET /api/records`

```text
Inicio
  ├── Intentar leer archivo JSON (try)
  │     ├── Éxito → devolver contenido (res.json(data))
  │     └── Error → devolver objeto vacío (res.json({ records: [] }))
  └── Fin
```

### Handler: `POST /api/records`

```text
Inicio
  ├── Intentar leer archivo (try)
  │     ├── Calcular IMC = peso / (altura²)
  │     ├── Crear registro con:
  │     │     ├── fecha proporcionada (date)
  │     │     └── o fecha actual por defecto
  │     ├── Escribir registro en fichero
  │     └── Responder con éxito (200)
  └── Error → Responder con error (500)
  └── Fin
```

---

## 2. Complejidad Ciclomática
Se ha utilizado la fórmula de McCabe:
`V(G) = E - N + 2P`

| Ruta | Decisiones | Complejidad Ciclomática |
|------|-------------|--------------------------|
| GET /api/records | 1 | 2 |
| POST /api/records | 3 | 4 |
| **Total del módulo** | — | **6** |

La complejidad V(G) = 6 indica un código de moderada complejidad.

---

## 3. Caminos independientes del programa

| Nº | Descripción                               | Ruta asociada                                      |
| -- | ----------------------------------------- | -------------------------------------------------- |
| 1  | GET éxito: lectura correcta del archivo   | `try → res.json(data)`                             |
| 2  | GET error: lectura falla                  | `catch → res.json([])`                             |
| 3  | POST éxito con fecha personalizada        | `try → date definido → writeFileSync → res.ok`     |
| 4  | POST éxito sin fecha (por defecto)        | `try → date vacío → asignar fecha actual → res.ok` |
| 5  | POST error (fallo de escritura o lectura) | `catch → res.status(500)`                          |

---

## 4. Pruebas Unitarias

``tests/records.whitebox.test.js``

| Test                 | Propósito                                  | Cobertura |
| -------------------- | ------------------------------------------ | --------- |
| GET éxito            | Verifica lectura correcta del archivo JSON | Camino 1  |
| GET error            | Simula fallo en `readFileSync`             | Camino 2  |
| POST éxito con fecha | Inserta registro con fecha manual          | Camino 3  |
| POST éxito sin fecha | Inserta registro usando fecha actual       | Camino 4  |
| POST error escritura | Simula fallo en `writeFileSync`            | Camino 5  |

### Ejemplo de uso

```bash
npm test records.whitebox.test.js
```