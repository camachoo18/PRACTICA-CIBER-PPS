# **Reportes de sistemas**

**17/10/2025**

- Observaciones: Usamos Cypress para pruebas de interfaz, y nos ayuda a automatizar la interacción con la interfaz gráfica y validar 
el comportamiento del usuario.
Por consiguiente nos da buenos resultados como estos:

```bash
visit http://localhost:3000
get#firstName
typeJuan
(fetch)GET 200 /api/records
get#lastName
typePérez
get#birthDate
type1990-01-01
get#weight
type70
get#height
type175
get#date
type2025-10-17
get.btn-primary
click
(fetch)POST 200 /api/records
(fetch)GET 200 /api/records
get#result
assertexpected <div#result.card.result-card> to be visible
get#recordsList
assertexpected <div#recordsList> to contain Juan
```