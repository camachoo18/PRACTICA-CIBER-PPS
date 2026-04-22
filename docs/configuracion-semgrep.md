# 🔍 Configuración de Semgrep - SAST

**Fecha**: 5 de febrero de 2026  
**Herramienta**: Semgrep (Static Application Security Testing)  
**Estado**: Implementado

---

## ¿Qué es Semgrep?

Semgrep es un scanner SAST rápido que detecta bugs, vulnerabilidades y problemas de seguridad en el código usando patrones personalizables.

### Características
- ✅ Detección de inyecciones SQL
- ✅ Detección de XSS
- ✅ Análisis de autenticación débil
- ✅ Validación de entrada
- ✅ Información sensible expuesta
- ✅ Dependencias vulnerables

---

## Instalación

### Opción 1: Script automático
```bash
curl -sSL https://semgrep.dev/install | sh
```

### Opción 2: Homebrew (macOS)
```bash
brew install semgrep
```

### Opción 3: pip
```bash
pip install semgrep
```

---

## Ejecución

### Análisis completo
```bash
npm run semgrep:check
```

### Generar reporte JSON
```bash
npm run semgrep:report
```

### Analizar un archivo específico
```bash
semgrep --config .semgrep.yml src/routes/auth.js
```

### Análisis con salida SARIF (para GitHub)
```bash
semgrep --config .semgrep.yml --sarif src/ > semgrep.sarif
```

---

## Reglas Implementadas

| ID | Descripción | Severidad | Auto-fix |
|----|-------------|-----------|----------|
| jwt_secret_hardcoded | JWT_SECRET hardcodeado | 🔴 CRITICAL | ❌ |
| sql_injection_sqlite | Inyección SQL potencial | 🔴 CRITICAL | ❌ |
| xss_innerHTML | XSS vía innerHTML | 🟠 HIGH | ❌ |
| weak_crypto_md5 | Crypto débil (MD5/SHA1) | 🟠 HIGH | ✅ |
| missing_input_validation | Validación de entrada faltante | 🟡 MEDIUM | ❌ |
| console_log_sensitive | Logging de datos sensibles | 🟡 MEDIUM | ✅ |
| missing_error_handling | Manejo de errores vacío | 🟢 LOW | ❌ |
| insecure_random | Math.random() inseguro | 🟡 MEDIUM | ✅ |
| path_traversal_risk | Path Traversal potencial | 🟠 HIGH | ❌ |
| cors_allow_all | CORS demasiado permisivo | 🟡 MEDIUM | ❌ |
| missing_rate_limit | Rate limit faltante | 🟡 MEDIUM | ❌ |
| weak_email_validation | Validación email débil | 🟢 LOW | ❌ |

---

## Interpretación de Resultados

### Salida JSON
```json
{
  "results": [
    {
      "check_id": "jwt_secret_hardcoded",
      "path": "src/routes/auth.js",
      "start": {"line": 10},
      "message": "JWT_SECRET o credenciales hardcodeadas detectadas",
      "severity": "CRITICAL"
    }
  ]
}
```

### Severidades
- 🔴 **CRITICAL**: Vulnerabilidad grave, corregir inmediatamente
- 🟠 **HIGH**: Vulnerabilidad importante, corregir en sprint actual
- 🟡 **MEDIUM**: Problema de seguridad moderado, corregir en próximos sprints
- 🟢 **LOW**: Mejora recomendada, considerar en roadmap

---

## Integración CI/CD

El archivo `.github/workflows/semgrep.yml` ejecuta automáticamente Semgrep en:
- ✅ Cada push a main/develop
- ✅ Cada PR (comenta resultados)
- ✅ Sube resultados a GitHub Security tab

---

## Próximos Pasos

1. **Ejecutar análisis inicial**
   ```bash
   npm run semgrep:check
   ```

2. **Revisar y corregir falsos positivos**
   ```bash
   semgrep --config .semgrep.yml --json src/ > semgrep-report.json
   ```

3. **Integrar en CI/CD**
   - El workflow de GitHub ya está configurado
   - Los resultados aparecerán en Security → Code scanning

4. **Actualizar reglas periódicamente**
   ```bash
   semgrep registry update
   ```

---

**Responsable**: Equipo D  
**Última actualización**: 5 de febrero de 2026
