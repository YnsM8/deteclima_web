# 🎭 Guion de Exposición por Roles — Proyecto Deteclima v2

Este documento detalla las responsabilidades, logros técnicos y el "discurso" sugerido para cada rol durante la presentación del proyecto.

---

## 🏗️ 1. Arquitecto de Software
**Enfoque:** Estructura, escalabilidad y orden.

### Puntos Clave:
*   **Arquitectura Hexagonal:** Implementación de un patrón de "Puertos y Adaptadores" para independizar la lógica de negocio de las herramientas externas.
*   **Dominio Puro:** Creación de un núcleo de aplicación (`src/domain`) que no depende de frameworks ni librerías, garantizando que el código sea testeable y duradero.
*   **Inversión de Dependencia:** Uso de interfaces (`Ports`) para que el sistema pueda cambiar de proveedor de clima (ej. de Open-Meteo a AccuWeather) sin modificar una sola línea de lógica interna.

> **Guion sugerido:** *"Mi objetivo fue garantizar que Deteclima no fuera solo una web, sino un sistema robusto. Diseñé una Arquitectura Hexagonal donde el 'corazón' del proyecto —las reglas de negocio y entidades de clima— está totalmente aislado. Esto nos permite ser agnósticos a la tecnología: hoy usamos Supabase y Next.js, pero mañana podríamos migrar a cualquier otra plataforma con un impacto mínimo en el código base."*

---

## 🎨 2. Frontend Developer
**Enfoque:** Experiencia de usuario (UX), estética y rendimiento.

### Puntos Clave:
*   **Diseño Industrial Noir:** Creación de una interfaz premium con estética *glassmorphism*, tipografía moderna (Outfit/Inter) y una paleta de colores de alto contraste (Rojo vibrante #F42E0B sobre fondos oscuros).
*   **Visualización de Datos:** Implementación de gráficos interactivos dinámicos usando `Recharts` para mostrar tendencias de 24 horas.
*   **Mapas Geoespaciales:** Integración de `Leaflet` con capas de `CartoDB` para una navegación fluida por la región de Jauja, con marcadores inteligentes codificados por colores.
*   **Resiliencia (Offline First):** Desarrollo de hooks personalizados (`useOnlineStatus`) y estados de carga que mantienen la app funcional incluso sin conexión.

> **Guion sugerido:** *"En el Frontend, mi prioridad fue el 'WOW factor'. Implementamos un diseño Industrial Noir que se aleja de las interfaces genéricas. Logramos una experiencia fluida donde el usuario puede interactuar con mapas en tiempo real y ver predicciones detalladas en gráficos optimizados. Además, la interfaz es resiliente: si el agricultor pierde conexión en el campo, la app sigue mostrando los últimos datos cacheados con elegancia."*

---

## 🔌 3. API Developer
**Enfoque:** Conectividad, normalización y orquestación.

### Puntos Clave:
*   **Adaptadores de Salida:** Desarrollo del `OpenMeteoAdapter`, encargado de consumir APIs REST externas y transformar datos brutos en entidades de nuestro dominio.
*   **API Routes:** Creación de endpoints en Next.js que actúan como puentes seguros entre el frontend y los servicios de backend/IA.
*   **Normalización de Datos:** Implementación de lógica para manejar coordenadas, zonas horarias y unidades métricas, asegurando que el sistema siempre reciba datos limpios.
*   **Manejo de Errores:** Sistema de fallbacks para que, si una API externa falla, el sistema pueda responder con datos de respaldo o alertas claras.

> **Guion sugerido:** *"Mi rol fue construir los puentes de comunicación. Desarrollé adaptadores que consumen datos climáticos complejos y los transforman en información útil para el resto del equipo. Me aseguré de que la comunicación fuera eficiente y segura, manejando la lógica de peticiones al servidor de predicción y garantizando que cada coordenada consultada devuelva una respuesta normalizada y lista para ser procesada."*

---

## 🧠 4. IA / ML Specialist
**Enfoque:** Predicción, análisis y valor agregado.

### Puntos Clave:
*   **Modelo Predictivo:** Implementación de un algoritmo de *Random Forest* para predecir la temperatura de las próximas 24 horas con métricas de confianza (R² y MAE).
*   **Detección de Anomalías:** Algoritmo que compara la predicción actual contra un histórico de 7 días para detectar "Heladas Inusuales" o "Calor Extremo".
*   **Asistente AI:** Integración de la API de Groq (Llama 3) para ofrecer un chat inteligente que interpreta el clima actual y da consejos agrícolas o de transporte personalizados.
*   **Alertas Regionales:** Lógica de detección de riesgos basada en umbrales térmicos específicos de la zona.

> **Guion sugerido:** *"Damos el salto de los datos a la sabiduría. Implementamos un modelo de Machine Learning que no solo muestra el clima, sino que predice su comportamiento con un margen de error mínimo. Además, desarrollamos un sistema de detección de anomalías que alerta automáticamente sobre posibles heladas, y un asistente inteligente que analiza el contexto para dar recomendaciones reales a los agricultores de Jauja."*

---

## 🗄️ 5. Backend Developer
**Enfoque:** Persistencia, seguridad y gestión de datos.

### Puntos Clave:
*   **BaaS (Supabase):** Configuración de la infraestructura de backend usando Supabase para una gestión ágil de la base de datos.
*   **Autenticación:** Implementación de un sistema de cuentas seguro (Supabase Auth) para que los usuarios puedan guardar su configuración.
*   **Persistencia de Ubicaciones:** Diseño de la tabla de "Favoritos", permitiendo que cada usuario tenga su panel personalizado de puntos de monitoreo.
*   **Caché y Almacenamiento:** Estrategia de guardado de predicciones recientes para reducir latencia y costos de API.

> **Guion sugerido:** *"En el Backend, me encargué de que la información del usuario esté segura y disponible. Integramos Supabase para gestionar la autenticación y la persistencia de datos. Gracias a esto, los usuarios pueden guardar sus ubicaciones clave y tener una experiencia personalizada. También diseñé la lógica de caché que permite que las predicciones de IA se almacenen localmente, optimizando el rendimiento y los costos de operación."*

---

## 🏁 Conclusión Grupal
*"Deteclima v2 es el resultado de la unión de estas 5 áreas: una arquitectura sólida, una interfaz premium, APIs eficientes, inteligencia real y un backend seguro. Juntos, hemos creado una herramienta capaz de transformar la toma de decisiones climáticas en nuestra región."*
