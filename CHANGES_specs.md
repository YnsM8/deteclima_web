# Change Management — AI Agent Instructions

> Este documento describe los cambios pendientes y en curso del proyecto. Cada entrada incluye el contexto técnico necesario para que el agente implemente o continúe las mejoras de forma autónoma.

---

## CHG-001 — Arquitectura Hexagonal en Next.js

- **Estado Trello:** Refinamiento Experto
- **Sección Informe:** Arquitectura Solución
- **Sección Artículo:** Proposed Methodology
- **Impacto Técnico:** Escalabilidad

### Descripción
Implementación de arquitectura hexagonal (ports & adapters) en el proyecto Next.js. Separar la lógica de dominio de los detalles de infraestructura (API routes, base de datos, servicios externos).

### Acciones esperadas del agente
1. Crear estructura de carpetas `domain/`, `application/`, `infrastructure/`, `ports/` dentro de `src/`.
2. Refactorizar componentes y servicios existentes para respetar la separación de capas.
3. Definir interfaces (ports) para cada adaptador externo.
4. Verificar que no existan importaciones directas entre capa de dominio e infraestructura.

---

## CHG-002 — Integración de Modelo RandomForest Regressor (ML)

- **Estado Trello:** Sprint Backlog (PMV2)
- **Sección Informe:** Microservicio de ML
- **Sección Artículo:** Machine Learning
- **Impacto Técnico:** Predicción Climática

### Descripción
Integrar un modelo de regresión RandomForest para predicción climática, expuesto como microservicio independiente y consumido por la aplicación principal.

### Acciones esperadas del agente
1. Crear microservicio Python (FastAPI o Flask) que cargue y sirva el modelo `.pkl`.
2. Exponer endpoint `POST /predict` que reciba features climáticas y devuelva la predicción.
3. Conectar el cliente Next.js al microservicio mediante un adaptador en la capa de infraestructura.
4. Incluir manejo de errores y validación de inputs con Pydantic.

---

## CHG-003 — Integración de LLM Llama 3.3 con Groq API *(EN CURSO)*

- **Estado Trello:** IN PROGRESS
- **Sección Informe:** Asistente Conversacional IA
- **Sección Artículo:** AI Integration
- **Impacto Técnico:** IA Conversacional

### Descripción
Integrar el modelo Llama 3.3 a través de la API de Groq para construir un asistente conversacional dentro de la aplicación.

### Acciones esperadas del agente
1. Verificar que `GROQ_API_KEY` esté definida en `.env.local`.
2. Crear servicio `src/infrastructure/groq/groqClient.ts` usando el SDK oficial de Groq.
3. Implementar endpoint `POST /api/chat` que gestione el historial de conversación.
4. Conectar el componente de UI del asistente al endpoint anterior.
5. Respetar arquitectura hexagonal: el cliente Groq va en `infrastructure/`, la lógica de conversación en `application/`.

---

## CHG-004 — Estrategia Offline con IndexedDB + Fallback Sinusoidal

- **Estado Trello:** DONE (PMV1)
- **Sección Informe:** Resiliencia y Tolerancia a Fallos
- **Sección Artículo:** Implementation
- **Impacto Técnico:** Resiliencia

### Descripción
Implementación completada en PMV1. La app almacena datos en IndexedDB para funcionar sin conexión. Cuando no hay datos disponibles, se usa una función sinusoidal como fallback de datos climáticos simulados.

### Acciones esperadas del agente
1. Verificar que el servicio de IndexedDB está correctamente inicializado al arrancar la app.
2. Comprobar que el fallback sinusoidal se activa solo cuando IndexedDB no tiene datos y la red no está disponible.
3. Añadir tests unitarios para el fallback si no existen.
4. Documentar el flujo de resiliencia en `docs/resiliencia.md` si no existe.

---

## CHG-005 — Integración de APIs de Open-Meteo para Ingesta de Datos

- **Estado Trello:** DONE (PMV1)
- **Sección Informe:** Preparación de Datos
- **Sección Artículo:** Data Acquisition
- **Impacto Técnico:** Integración de Datos

### Descripción
Integración completada en PMV1. Se consumen las APIs públicas de Open-Meteo para obtener datos meteorológicos en tiempo real.

### Acciones esperadas del agente
1. Revisar que el cliente Open-Meteo está en la capa de infraestructura (`infrastructure/open-meteo/`).
2. Verificar que los datos recibidos se normalizan antes de pasar a la capa de dominio.
3. Asegurar que los datos se persisten en IndexedDB tras cada ingesta exitosa (conexión con CHG-004).
4. Revisar manejo de rate limits y timeouts en el cliente HTTP.

---

## CHG-006 — Ajuste de Backlog por Retroalimentación de Sprint Review

- **Estado Trello:** Sprint Retrospective
- **Sección Informe:** Gestión Proyecto
- **Sección Artículo:** Scrum-Kanban
- **Impacto Técnico:** Gestión Ágil

### Descripción
Ajustes al backlog derivados de la Sprint Review. Reordenación de prioridades y refinamiento de historias de usuario según feedback del equipo.

### Acciones esperadas del agente
1. Revisar el tablero Trello y mover tarjetas según el nuevo orden de prioridades.
2. Actualizar descripciones de tareas con los criterios de aceptación revisados.
3. Identificar deuda técnica detectada en la review y crear tarjetas específicas en la columna "Tech Debt".
4. Asegurar que CHG-003 (IN PROGRESS) tiene criterios de aceptación claros antes del próximo sprint.

---

## Resumen de Estados

| ID      | Descripción Corta                        | Estado            | Prioridad |
|---------|------------------------------------------|-------------------|-----------|
| CHG-001 | Arquitectura Hexagonal Next.js           | Refinamiento      | Alta      |
| CHG-002 | RandomForest Regressor ML                | Sprint Backlog    | Media     |
| CHG-003 | LLM Llama 3.3 + Groq API                 | **IN PROGRESS**   | Alta      |
| CHG-004 | Offline IndexedDB + Fallback Sinusoidal  | ✅ DONE (PMV1)    | —         |
| CHG-005 | Open-Meteo Data Ingestion                | ✅ DONE (PMV1)    | —         |
| CHG-006 | Backlog Sprint Review Adjustments        | Retrospectiva     | Media     |

---

*Generado automáticamente a partir del Change Log del proyecto. Última revisión: Sprint actual.*
