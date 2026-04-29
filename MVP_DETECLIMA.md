# Deteclima v2 — Documentación del MVP

## 🌦️ ¿Qué es Deteclima?
Deteclima es una plataforma avanzada de monitoreo y predicción climática diseñada para la región de Jauja y alrededores. Combina datos en tiempo real, inteligencia artificial y modelos de aprendizaje automático para ofrecer una herramienta de toma de decisiones para agricultores, transportistas y ciudadanos.

## 🚀 Estado Actual (MVP)
El proyecto ha alcanzado su fase de Producto Mínimo Viable, integrando las siguientes capacidades core:

### 1. Visualización Geoespacial
- **Mapa Interactivo:** Integración con Leaflet y CartoDB Voyager.
- **Modo Libre:** Capacidad de seleccionar cualquier punto geográfico para obtener datos climáticos instantáneos.
- **Marcadores Dinámicos:** Ciudades clave con indicadores de temperatura codificados por colores.

### 2. Inteligencia Artificial y Datos
- **Asistente AI (Groq):** Un chat inteligente que analiza el contexto climático actual para dar recomendaciones personalizadas.
- **Predicciones ML:** Sistema de predicción de temperatura a 24 horas con algoritmos de Random Forest (incluye fallback de simulación).
- **Alertas Regionales:** Sistema automático que detecta riesgos (como heladas < 5°C) en las ubicaciones del usuario.

### 3. Infraestructura y Usuario
- **Autenticación:** Sistema de cuentas gestionado por Supabase Auth.
- **Persistencia:** Guardado de ubicaciones favoritas vinculadas a la cuenta del usuario.
- **Resiliencia Offline:** Capacidad de mostrar datos cacheados cuando no hay conexión a internet.

---

## 🛠️ Arquitectura Técnica
El proyecto sigue una **Arquitectura Hexagonal**, lo que permite cambiar proveedores (ej. cambiar Open-Meteo por otra API) sin tocar la lógica de negocio:
- **Dominio:** Entidades y reglas de negocio.
- **Aplicación:** Casos de uso (servicios y puertos).
- **Infraestructura:** Adaptadores para APIs externas, base de datos y UI.

---

## 📈 Plan de Mejora: Enfoque en Datos
Actualmente, la base de datos es minimalista (solo almacena ubicaciones). Para escalar a una versión productiva robusta, se proponen las siguientes expansiones:

### 1. Historial de Clima (Time-series)
- **Problema:** Actualmente solo consultamos datos en tiempo real. No podemos analizar tendencias.
- **Solución:** Crear una tabla `weather_logs` que almacene periódicamente (vía Cron Job) la temperatura, humedad y presión de puntos estratégicos. Esto permitirá entrenar modelos de ML propios.

### 2. Caché de Consultas IA
- **Problema:** Cada consulta al chat consume tokens de la API de Groq.
- **Solución:** Tabla `ai_cache` para almacenar respuestas a preguntas comunes sobre coordenadas similares, reduciendo costos y tiempo de respuesta.

### 3. Registro de Alertas y Notificaciones
- **Problema:** Las alertas desaparecen al refrescar.
- **Solución:** Tabla `alert_history` para guardar cuándo y dónde ocurrió una helada. Esto permitiría enviar correos o notificaciones Push incluso si el usuario no tiene la app abierta.

### 4. Preferencias de Usuario Pro
- **Problema:** Los umbrales de alerta (ej. 5°C) son fijos para todos.
- **Solución:** Tabla `user_preferences` donde cada usuario defina sus propios rangos de riesgo según su tipo de cultivo o necesidad.

### 5. Capas de Datos Avanzadas
- Integración de capas de satélite, índices UV y mapas de calor de humedad sobre el mapa actual.

---

## 💻 Stack Tecnológico
- **Frontend:** Next.js 15, Tailwind CSS (Industrial Noir Design).
- **Backend/Auth:** Supabase.
- **IA:** Groq API (Llama 3).
- **Mapas:** React Leaflet.
- **Predicciones:** Adaptador de servicios ML (Python/Mock).

---
*Desarrollado para el Colegio San Vicente de Paúl — Jauja, Perú.*
