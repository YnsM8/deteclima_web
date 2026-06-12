Reporte de Calidad y Seguridad — Deteclima 2026  |  Pág. 


**UNIVERSIDAD CONTINENTAL**

Escuela Académica Profesional de Ingeniería de Sistemas e Informática

**REPORTE TÉCNICO DE CALIDAD Y SEGURIDAD**

**PROYECTO DETECLIMA**

Plataforma inteligente de monitoreo y análisis del clima local basada en IA y APIs meteorológicas – Arquitectura Hexagonal

**Contiene:**

I.  Reporte de Hallazgos FURPS+

II.  Reporte de Hallazgos OWASP Top 10

III.  Plan de Mejora Integrado


**AUTORES**

Suárez Suárez, Sheila Karol

Gonzalo Guerrero, Luis Antony

Guevara Moscoso, David André

Paitán Montes, Robert

Martínez Llanos, Marco Jhair

Docente: Guevara Jiménez, Jorge A.

Asignatura: Taller de Proyectos en Ingeniería de Sistemas e Informática  |  NRC: 28602

Huancayo, Junín – Perú  |  2026



|**SECCIÓN I — REPORTE DE HALLAZGOS FURPS+**|
| :-: |

# **1. REPORTE DE HALLAZGOS FURPS+**
## **1.1 Resumen Ejecutivo**
El modelo FURPS+ evalúa la calidad de un sistema de software desde cinco dimensiones: Funcionalidad (F), Usabilidad (U), Confiabilidad/Reliability (R), Rendimiento/Performance (P) y Soportabilidad (S). La siguiente auditoría se basa en los artefactos documentados en el informe de la Unidad 3 del proyecto Deteclima — incluyendo requerimientos, arquitectura, código por capas, pruebas, despliegue y actas de expertos.

## **1.2 Score de Calidad por Dimensión**

|**Dimensión**|**Peso**|**Puntaje Obtenido**|**Puntaje Máximo**|**Estado**|
| :-: | :-: | :-: | :-: | :-: |
|F — Funcionalidad|25 %|23\.5|25\.0|✔ APROBADO|
|U — Usabilidad|20 %|14\.0|20\.0|⚠ CON BRECHAS|
|R — Confiabilidad|20 %|18\.5|20\.0|✔ APROBADO|
|P — Rendimiento|20 %|18\.0|20\.0|✔ APROBADO|
|S — Soportabilidad|15 %|10\.5|15\.0|⚠ CON BRECHAS|
|**TOTAL FURPS+**|**100 %**|**84.5**|**100.0**|**APROBADO**|

## **1.3 F — Funcionalidad**
**Hallazgos positivos**

- RF-01 a RF-09 completamente implementados y validados mediante 50 pruebas funcionales con criterios GIVEN/WHEN/THEN (HU-1 a HU-9 aprobadas).
- Chatbot Gemini con filtrado temático activo: rechaza preguntas off-topic en el 98 % de los casos y responde con datos Open-Meteo en tiempo real.
- Dashboard con 6 variables climáticas (supera el mínimo de 5 requerido por HU-2).
- Módulo ML integrado: Random Forest con R²=0.87, MAE=1.2°C, Accuracy=94 %, Recall=95 %.
- Circuit Breaker (Resilience4j) implementado: 3 reintentos automáticos con fallback de chatbot local.
- Exportación CSV (RF-10) verificada en Excel y Google Sheets con timestamp ISO.

**Brechas detectadas**

- Recomendaciones automáticas interpretadas por IA (no solo respuestas) — pendiente según tablero Scrum (backlog).
- Exportación a PDF y opción de compartir reportes — reportada como pendiente por el experto usuario Prof. Suárez Flores.
- Semáforo visual de riesgo (bajo/medio/alto) para alertas térmicas — en backlog, no plenamente integrado.

## **1.4 U — Usabilidad**
**Hallazgos positivos**

- Interfaz compatible con Chrome, Firefox, Safari y Edge en Windows, macOS, Linux, Android e iOS (pruebas multi-entorno documentadas).
- Tiempo de carga menor a 2.6 s en dispositivos móviles; 1.2 s en escritorio de alto rendimiento.
- Respuesta del chatbot en lenguaje didáctico adaptado a EBR; filtro temático funcional.

**Brechas detectadas — evidencia de expertos**

|**Brecha**|**Fuente**|**Criticidad**|
| :-: | :-: | :-: |
|Tamaño de texto insuficiente y bajo contraste en botones|Experto usuario (Prof. Suárez Flores)|Alta|
|Ausencia de guía de inicio o tutorial breve|Experto usuario|Alta|
|Falta de explicación de variables climáticas en la UI|Experto usuario|Media|
|Alertas poco visibles, sin niveles de riesgo (bajo/medio/alto)|Experto usuario|Media|
|Diseño responsivo en móvil incompleto (en progreso)|Tablero Scrum|Media|

## **1.5 R — Confiabilidad**
**Hallazgos positivos**

- Uptime del 99.2 % en despliegue cloud (Render + Vercel) monitoreado con UptimeRobot.
- Circuit Breaker + Retry configurado en Resilience4j: ante caída de Open-Meteo o Gemini, el sistema reintenta 3 veces y muestra mensaje amigable.
- Arquitectura stateless elimina corrupción de estado en sesiones concurrentes.
- 100 usuarios concurrentes simulados con JMeter sin degradación (latencia máx. 0.789 s, éxito 100 %).

**Brechas detectadas**

- Monitoreo de fallos limitado a UptimeRobot (ping HTTP). No existe registro detallado de errores (logs estructurados) en producción.
- Dependencia crítica de APIs externas gratuitas (Open-Meteo, Gemini) sin SLA formal — riesgo de interrupción no controlado.

## **1.6 P — Rendimiento**
**Resultados de la Prueba de Concepto**

|**Métrica**|**Valor Obtenido**|**Meta Definida**|**Estado**|
| :-: | :-: | :-: | :-: |
|Latencia promedio (pipeline completo)|4\.2 s|< 6 s|✔ CUMPLE|
|Latencia P95|5\.8 s|< 6 s|✔ CUMPLE|
|Latencia integración Open-Meteo|1\.4 s|< 2 s|✔ CUMPLE|
|Usuarios concurrentes soportados|100|≥ 100|✔ CUMPLE|
|Absorción de carga masiva (1 000 vectores)|0\.013 s/req|< 0.5 s|✔ CUMPLE|
|Latencia máx. con 100 usuarios concurrentes|0\.789 s|< 2.0 s|✔ CUMPLE|

**Brechas detectadas**

- El modelo ML (Random Forest .pkl) se carga en frío en cada inicio del microservicio FastAPI en Render — cold start añade latencia adicional no medida formalmente.
- No se documenta política de reentrenamiento periódico automatizado del modelo ML.

## **1.7 S — Soportabilidad**
**Hallazgos positivos**

- Arquitectura hexagonal garantiza separación de capas (dominio, aplicación, infraestructura, presentación).
- Pipeline CI/CD en GitHub Actions: generación automática de artefactos al hacer push en main.
- Documentación en informe: arquitectura, requerimientos, pruebas, lecciones aprendidas.
- Repositorio público con README, Dockerfiles y docker-compose.yml.

**Brechas detectadas**

- Cobertura de pruebas unitarias no documentada — solo se documentan pruebas funcionales e2e.
- Ausencia de pruebas de integración automatizadas para los adaptadores (OpenMeteoAdapter, GeminiAdapter, MLServiceAdapter).
- Documentación de la API interna (endpoints REST) no formalizada (sin Swagger/OpenAPI).
- Proceso de reentrenamiento del modelo ML manual, no automatizado en el pipeline CI/CD.

## **1.8 Tabla Resumen de Hallazgos FURPS+**

|**#**|**Dimensión**|**Tipo**|**Hallazgo**|**Severidad**|
| :-: | :-: | :-: | :-: | :-: |
|F-01|Funcionalidad|Brecha|Recomendaciones automáticas IA no implementadas|Media|
|F-02|Funcionalidad|Brecha|Exportación PDF / compartir reportes ausente|Media|
|F-03|Funcionalidad|Brecha|Semáforo de riesgo no plenamente integrado|Baja|
|U-01|Usabilidad|Brecha|Bajo contraste y tamaño de texto insuficiente|Alta|
|U-02|Usabilidad|Brecha|Ausencia de guía de inicio / onboarding|Alta|
|U-03|Usabilidad|Brecha|Variables climáticas sin explicación en UI|Media|
|U-04|Usabilidad|Brecha|Alertas térmicas sin niveles visibles (bajo/medio/alto)|Media|
|U-05|Usabilidad|Brecha|Responsividad móvil incompleta|Media|
|R-01|Confiabilidad|Brecha|Ausencia de logging estructurado en producción|Alta|
|R-02|Confiabilidad|Brecha|Dependencia de APIs externas sin SLA formal|Media|
|P-01|Rendimiento|Brecha|Cold start del microservicio ML en Render sin mitigar|Media|
|P-02|Rendimiento|Brecha|Política de reentrenamiento ML no automatizada|Baja|
|S-01|Soportabilidad|Brecha|Cobertura de pruebas unitarias no documentada|Alta|
|S-02|Soportabilidad|Brecha|Ausencia de pruebas de integración automatizadas|Alta|
|S-03|Soportabilidad|Brecha|API interna sin documentación Swagger/OpenAPI|Media|



|**SECCIÓN II — REPORTE DE HALLAZGOS OWASP TOP 10**|
| :-: |

# **2. REPORTE DE HALLAZGOS OWASP TOP 10**
## **2.1 Alcance y Metodología**
La auditoría OWASP evalúa el sistema desde la perspectiva de seguridad exclusivamente, analizando frontend (Thymeleaf), backend (Spring Boot Java 17), microservicio ML (FastAPI), adaptadores de API (Gemini, Open-Meteo), configuración de despliegue (Render, Vercel, GitHub Actions) y las prácticas de gestión de secretos documentadas en el informe de la Unidad 3.

## **2.2 Score Global de Seguridad**

|**Categoría OWASP**|**Estado**|**Severidad**|**Evidencia clave**|
| :-: | :-: | :-: | :-: |
|A01 – Broken Access Control|⚠ PARCIAL|Alta|No existe módulo de autenticación/autorización (fuera de alcance declarado)|
|A02 – Cryptographic Failures|✔ MITIGADO|Baja|API Keys protegidas en backend (RNF-06); nunca expuestas en frontend|
|A03 – Injection|⚠ RIESGO RESIDUAL|Alta|Prompt Injection posible en chatbot Gemini con entradas maliciosas|
|A04 – Insecure Design|✔ MITIGADO|Baja|Arquitectura hexagonal + stateless minimiza superficie de ataque|
|A05 – Security Misconfiguration|⚠ RIESGO|Media|CORS no documentado; variables de entorno en .env sin gestión formal|
|A06 – Vulnerable Components|⚠ RIESGO|Media|No se documenta análisis de dependencias (OWASP Dependency Check)|
|A07 – Auth Failures|N/A – INTENCIONADO|Informativo|El sistema no tiene autenticación por diseño (plataforma educativa pública)|
|A08 – Data Integrity Failures|✔ MITIGADO|Baja|CI/CD en GitHub Actions con pipeline controlado; docker-compose firmado|
|A09 – Logging & Monitoring Failures|✗ NO MITIGADO|Alta|Sin logging estructurado; solo UptimeRobot (ping HTTP)|
|A10 – SSRF|⚠ RIESGO RESIDUAL|Media|Backend consume Open-Meteo con URL fija; sin validación de redireccionamientos|

**Score global de seguridad estimado:  68 / 100  (Nivel: ACEPTABLE CON RIESGOS RESIDUALES)**

## **2.3 Detalle por Categoría**
**A01 — Broken Access Control**

- Estado: Parcialmente mitigado por diseño — el sistema no implementa roles ni sesiones.
- Evidencia: El Project Charter declara explícitamente que el sistema no incluye autenticación (plataforma educativa de acceso público).
- Riesgo residual: Cualquier usuario puede acceder a todos los endpoints (/api/weather, /api/chat, /api/predict). Si en versiones futuras se agrega información sensible, la ausencia de control de acceso sería crítica.
- Recomendación: Documentar formalmente la decisión de diseño. Si se agregan funcionalidades con datos personales, implementar Spring Security con JWT.

**A02 — Cryptographic Failures**

- Estado: Mitigado.
- Evidencia: RNF-06 establece que las API Keys (Gemini, Open-Meteo) deben protegerse en el backend. Spring Boot las consume desde variables de entorno (.env) sin exponerlas al cliente.
- Riesgo residual bajo: El archivo .env podría ser commiteado accidentalmente en GitHub. No se documenta uso de .gitignore ni GitHub Secrets para el pipeline CI/CD.

**A03 — Injection (Prompt Injection)**

- Estado: Riesgo residual — mitigación parcial mediante Prompt Engineering.
- Evidencia: El sistema aplica Prompt Engineering para restringir el chatbot a temas climáticos (tasa de rechazo off-topic: 98 %). Sin embargo, un atacante podría intentar instrucciones en lenguaje natural para sobreescribir el system prompt.
- Riesgo: Prompt Injection podría hacer que Gemini responda fuera del scope educativo, filtre el system prompt, o genere contenido inapropiado para estudiantes menores.
- Recomendación: Añadir capa de sanitización del input del usuario antes de enviarlo a Gemini. Implementar validación de longitud máxima y caracteres especiales.

**A05 — Security Misconfiguration**

- Estado: Riesgo identificado.
- Evidencia: No se documenta configuración explícita de CORS en Spring Boot. En despliegue en Render + Vercel (dominios distintos), una política CORS permisiva (\* wildcard) podría permitir solicitudes cross-origin no autorizadas.
- Las variables GEMINI\_API\_KEY y OPEN\_METEO\_BASE\_URL se gestionan en archivo .env local sin evidencia de uso de GitHub Secrets en el pipeline CI/CD.
- Recomendación: Configurar CORS con lista blanca explícita de dominios. Migrar secretos a GitHub Secrets o AWS Secrets Manager.

**A06 — Vulnerable Components**

- Estado: Riesgo no evaluado formalmente.
- Evidencia: El informe no documenta análisis de dependencias vulnerables. Spring Boot Java 17 + scikit-learn + FastAPI tienen historiales de CVEs en versiones específicas.
- Recomendación: Incorporar OWASP Dependency Check (Maven) y Safety (Python) en el pipeline CI/CD. Automatizar alertas de dependencias vulnerables.

**A09 — Logging & Monitoring Failures**

- Estado: NO MITIGADO — hallazgo crítico.
- Evidencia: El sistema solo usa UptimeRobot para pings HTTP. No existe logging estructurado de errores, eventos de seguridad, ni intentos de acceso no autorizado.
- Impacto: Incapacidad de detectar ataques en curso (abuso del chatbot, DoS, Prompt Injection) o diagnosticar fallos en producción.
- Recomendación prioritaria: Implementar SLF4J + Logback en Spring Boot con appender a un servicio de agregación (Logtail, Datadog free tier) y configurar alertas ante errores 5xx recurrentes.

**A10 — SSRF (Server-Side Request Forgery)**

- Estado: Riesgo residual bajo.
- Evidencia: OpenMeteoAdapter consume la API con URL base fija (OPEN\_METEO\_BASE\_URL). No se documenta validación de redireccionamientos HTTP (3xx) en el cliente RestTemplate/WebClient.
- Recomendación: Configurar el cliente HTTP para no seguir redireccionamientos automáticos. Validar que la URL base provenga solo de variables de entorno controladas.

## **2.4 Tabla Resumen de Hallazgos OWASP**

|**#**|**Categoría**|**Estado**|**Severidad**|**Recomendación**|
| :-: | :-: | :-: | :-: | :-: |
|O-01|A01 – Broken Access Control|Parcial|Alta|Documentar decisión; preparar Spring Security para versiones futuras|
|O-02|A02 – Cryptographic Failures|Mitigado|Baja|Agregar .gitignore para .env; usar GitHub Secrets en CI/CD|
|O-03|A03 – Prompt Injection|Parcial|Alta|Sanitizar input antes de enviar a Gemini; validar longitud y caracteres|
|O-04|A05 – Security Misconfiguration|Riesgo|Media|Configurar CORS explícito; migrar secretos a GitHub Secrets|
|O-05|A06 – Vulnerable Components|Sin evaluar|Media|Integrar OWASP Dependency Check + Safety en pipeline CI/CD|
|O-06|A09 – Logging & Monitoring|No mitigado|Alta|Implementar SLF4J + Logback con agregación cloud y alertas 5xx|
|O-07|A10 – SSRF|Residual|Media|Deshabilitar seguimiento de redireccionamientos en cliente HTTP|



|**SECCIÓN III — PLAN DE MEJORA INTEGRADO**|
| :-: |

# **3. PLAN DE MEJORA INTEGRADO**
## **3.1 Principios del Plan**
- El sistema ya funciona y está en producción (Render + Vercel, uptime 99.2 %).
- Ninguna mejora debe poner en riesgo las funcionalidades existentes (HU-1 a HU-9 aprobadas).
- Todos los cambios son incrementales, con validación obligatoria y posibilidad de rollback.
- Se prioriza por impacto en usuarios (estudiantes EBR) y por nivel de riesgo de seguridad.

## **3.2 Priorización de Mejoras**

|**ID**|**Origen**|**Mejora**|**Prioridad**|**Esfuerzo**|**Riesgo de impl.**|
| :-: | :-: | :-: | :-: | :-: | :-: |
|M-01|OWASP A09|Logging estructurado (SLF4J + Logback + agregación cloud)|CRÍTICA|Medio|Bajo|
|M-02|OWASP A03|Sanitización de input para Prompt Injection|CRÍTICA|Bajo|Bajo|
|M-03|FURPS U-01/U-02|Accesibilidad: contraste, tamaño de texto y onboarding|ALTA|Medio|Muy bajo|
|M-04|OWASP A05|Configuración CORS explícita + GitHub Secrets|ALTA|Bajo|Bajo|
|M-05|FURPS S-01/S-02|Pruebas unitarias y de integración automatizadas|ALTA|Alto|Muy bajo|
|M-06|OWASP A06|Análisis de dependencias en CI/CD (Dependency Check)|MEDIA|Bajo|Muy bajo|
|M-07|FURPS F-01|Recomendaciones automáticas IA (interpretadas, no solo respuestas)|MEDIA|Medio|Bajo|
|M-08|FURPS U-04|Alertas térmicas con niveles visibles (bajo/medio/alto)|MEDIA|Bajo|Muy bajo|
|M-09|FURPS F-02|Exportación PDF y opción de compartir reportes|MEDIA|Medio|Bajo|
|M-10|FURPS S-03|Documentación API interna con Swagger/OpenAPI|MEDIA|Bajo|Muy bajo|
|M-11|FURPS P-01|Warm-up del microservicio ML para reducir cold start|BAJA|Bajo|Bajo|
|M-12|OWASP A10|Deshabilitar redireccionamientos en cliente HTTP (SSRF)|BAJA|Muy bajo|Muy bajo|
|M-13|FURPS P-02|Automatizar reentrenamiento semanal del modelo ML en CI/CD|BAJA|Medio|Bajo|

## **3.3 Roadmap de Implementación**

**FASE 1 — Seguridad y Calidad Base (Sprint 17, semanas 1–2)**

Objetivo: Cerrar los riesgos de seguridad críticos sin afectar ninguna funcionalidad existente.

|**Tarea**|**Responsable sugerido**|**Herramientas**|**Validación**|
| :-: | :-: | :-: | :-: |
|M-01: Implementar SLF4J + Logback en Spring Boot con appender a Logtail (free tier)|Backend Dev|Spring Boot Logback, Logtail|Ver logs estructurados en dashboard; alerta ante 5xx|
|M-02: Agregar capa de sanitización de input en ChatApiAdapter antes de llamada a Gemini|Backend Dev|Apache Commons Text / regex Spring|Prueba de Prompt Injection con 10 casos adversariales|
|M-04: Configurar CORS en SecurityConfig.java + migrar API Keys a GitHub Secrets|DevOps / Backend|Spring CorsRegistry, GitHub Secrets|Solicitud cross-origin desde dominio no autorizado rechazada|

Rollback: Los cambios de M-01 y M-02 son aditivos (no modifican lógica de negocio). M-04 requiere prueba de regresión de endpoint /api/chat antes de merge a main.

**FASE 2 — Usabilidad y Experiencia de Usuario (Sprint 18, semanas 3–4)**

Objetivo: Atender las observaciones del experto usuario (Prof. Suárez Flores) sin romper el flujo existente.

|**Tarea**|**Responsable sugerido**|**Herramientas**|**Validación**|
| :-: | :-: | :-: | :-: |
|M-03: Aumentar contraste de botones (WCAG AA), incrementar tamaño de fuente base a 16px, añadir tutorial de inicio (modal o tooltip)|Frontend Dev|Tailwind CSS, Thymeleaf fragments|Prueba de contraste con WebAIM Contrast Checker; validar HU-1 a HU-3 sin regresiones|
|M-08: Integrar semáforo visual de riesgo térmico (verde/amarillo/rojo) en dashboard|Frontend Dev|Thymeleaf + JS|Verificar que HU-2 sigue aprobada con 6 variables visibles + semáforo|
|M-05: Escribir pruebas unitarias para ClimateService, ChatbotService, PredictionService y adaptadores|QA / Backend|JUnit 5, Mockito, Pytest|Cobertura ≥ 80 % medida con JaCoCo|

Rollback: Cambios CSS son reversibles vía Git revert. Las pruebas son solo aditivas y no afectan producción.

**FASE 3 — Funcionalidad Adicional y Documentación (Sprint 19, semanas 5–6)**

Objetivo: Completar funcionalidades en backlog y fortalecer la mantenibilidad.

|**Tarea**|**Responsable sugerido**|**Herramientas**|**Validación**|
| :-: | :-: | :-: | :-: |
|M-07: Actualizar prompts Gemini para generar recomendaciones proactivas (no solo respuestas reactivas)|Backend Dev|Gemini API, Prompt Engineering|20 casos de prueba: chatbot ofrece recomendación antes de que usuario la pida|
|M-09: Implementar exportación a PDF desde el dashboard con reportlab/iText|Backend Dev|iText7 (Java) o Thymeleaf + Flying Saucer|PDF descargable con datos de sesión, validado en Adobe Reader y Chrome PDF viewer|
|M-10: Generar documentación OpenAPI 3.0 con springdoc-openapi|Backend Dev|springdoc-openapi-ui|Swagger UI accesible en /swagger-ui.html en entorno de desarrollo|
|M-06: Integrar OWASP Dependency Check en Maven lifecycle (fase verify)|DevOps|OWASP Dependency Check plugin|Pipeline CI/CD falla si existe CVE de severidad ALTA sin mitigar|

Rollback: M-07 se puede revertir restaurando el prompt anterior (versionado en archivo de configuración). M-09 es funcionalidad nueva, no modifica existente.

**FASE 4 — Optimización y Operaciones (Sprint 20, semanas 7–8)**

Objetivo: Consolidar la estabilidad operativa a largo plazo.

|**Tarea**|**Responsable sugerido**|**Herramientas**|**Validación**|
| :-: | :-: | :-: | :-: |
|M-11: Configurar warm-up del microservicio FastAPI con UptimeRobot ping cada 4 min para evitar cold start en Render|DevOps|UptimeRobot, Render cron job|Latencia de primer request < 2s incluso tras inactividad de 30 min|
|M-12: Deshabilitar followRedirects en RestTemplate/WebClient del OpenMeteoAdapter|Backend Dev|Spring WebClient config|Solicitud con redirección 301 es rechazada y logeada|
|M-13: Crear GitHub Actions workflow semanal para reentrenamiento del modelo ML con datos Open-Meteo recientes|ML Engineer|GitHub Actions, Python cron, scikit-learn|Workflow ejecuta, genera nuevo .pkl y lo despliega al microservicio sin downtime|

## **3.4 Estrategia de Preservación de Funcionalidad**
- Feature flags: Las mejoras de M-07 (recomendaciones automáticas) y M-09 (PDF) se implementarán como funcionalidades adicionales detrás de feature flags desactivados por defecto.
- Regresión obligatoria: Antes de cada merge a main, ejecutar las 50 pruebas funcionales documentadas (HU-1 a HU-9) en el entorno de staging.
- Branching: Cada mejora en rama propia (feature/M-XX). Pull Request requiere aprobación de al menos un miembro del equipo.
- Rollback automático: El pipeline CI/CD en Render detecta fallos en el health check /api/weather y revierte al release anterior en menos de 3 minutos.

## **3.5 Riesgos de Ejecución del Plan**

|**Riesgo**|**Probabilidad**|**Impacto**|**Mitigación**|
| :-: | :-: | :-: | :-: |
|M-04 (CORS) bloquea requests legítimos del frontend en Vercel|Media|Alto|Prueba de regresión en staging con dominio deteclima.vercel.app antes de producción|
|M-07 (nuevos prompts) incrementa tasa de alucinaciones|Media|Alto|Ejecutar 50 casos adversariales de PoC antes de despliegue; mantener prompt anterior en backup|
|M-09 (PDF) introduce latencia adicional > 6s en generación|Baja|Medio|Generar PDF asíncronamente con polling; no bloquear el hilo principal|
|M-13 (reentrenamiento) despliega modelo degradado|Baja|Alto|Validar R² ≥ 0.80 y MAE ≤ 1.5°C antes de reemplazar el modelo en producción|

## **3.6 Indicadores de Éxito del Plan**

|**Indicador**|**Valor Actual**|**Meta Post-Plan**|
| :-: | :-: | :-: |
|Score FURPS+ global|84\.5 / 100|≥ 92 / 100|
|Score OWASP global estimado|68 / 100|≥ 85 / 100|
|Cobertura de pruebas unitarias|No documentada|≥ 80 %|
|Hallazgos de seguridad Alta/Crítica abiertos|3 (O-01, O-03, O-06)|≤ 1|
|Brechas de usabilidad reportadas por expertos|7 (U-01 a U-05 + F-02 + alertas)|≤ 2|
|Disponibilidad (uptime) en producción|99\.2 %|≥ 99.5 %|
|Tiempo de respuesta pipeline completo (P95)|5\.8 s|< 5 s|


|<p>**VEREDICTO FINAL DEL PLAN**</p><p></p><p>**APTO PARA PRODUCCIÓN CON OBSERVACIONES**</p><p></p><p>El proyecto Deteclima cumple sus objetivos funcionales y de rendimiento. Se recomienda ejecutar las fases 1 y 2 del plan de mejora antes de un despliegue institucional masivo. Las brechas identificadas no comprometen la funcionalidad actual, pero sí la madurez operativa y la postura de seguridad del sistema.</p>|
| :-: |

FURPS+ · OWASP Top 10 · Plan de Mejora Integrado  —  Universidad Continental, Huancayo 2026
