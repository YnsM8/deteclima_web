# Registro de Tareas para Tablero de Trello - Deteclima

Este documento recopila de manera estructurada todas las tareas realizadas, dificultades encontradas y tareas pendientes para facilitar el llenado del tablero de Trello del proyecto **Deteclima**.

---

## 🟢 Lista: HECHO (Done)

### 📋 Tarjeta 1: Corrección de error crítico de tipado en Supabase Client
* **Descripción**: Resolver la falla de compilación en el build de producción provocada por tipos incompatibles (`never[]` e inserciones) en `SupabaseAdapter.ts` debido a esquemas de base de datos dinámicos generados al vuelo.
* **Detalle técnico**: 
  - Se modificó `server.ts` para tipar la constante exportada `supabaseAdmin` como `any` (`export const supabaseAdmin: any = ...`).
  - Se eliminaron los castings manuales redundantes en `SupabaseAdapter.ts`.
* **Dificultades encontradas**: La versión de `@supabase/supabase-js` exigía firmas estrictas de tablas que no existían localmente en los tipos genéricos por defecto, forzando la inferencia a `never` para cualquier llamada a `.insert()`.
* **Valor para el proyecto**: Permite compilar exitosamente en entornos locales y de despliegue continuo.

### 📋 Tarjeta 2: Rediseño de Arquitectura Multi-pantalla (Next.js Route Groups)
* **Descripción**: Segmentar la pantalla monolítica única en páginas modulares bien diferenciadas para estudiantes y profesores.
* **Detalle técnico**:
  - Se implementó un grupo de rutas `(dashboard)` para aislar el layout lateral.
  - Se creó el layout responsivo (`src/app/(dashboard)/layout.tsx`) con un Sidebar interactivo.
  - Se movió el visor del mapa interactivo y reporte meteorológico a `(dashboard)/page.tsx`.
* **Valor para el proyecto**: Mejora la experiencia de usuario y organiza el código bajo el patrón limpio recomendado de Next.js App Router.

### 📋 Tarjeta 3: Módulo de Asistente IA Dedicado
* **Descripción**: Crear una página independiente para el asistente chatbot climático potenciado por Groq Llama 3.
* **Detalle técnico**:
  - Se creó la ruta `/chat` (`src/app/(dashboard)/chat/page.tsx`).
  - Se implementó la recuperación del contexto del clima actual a partir de las coordenadas seleccionadas para inyectarlo al LLM y enriquecer las respuestas.
* **Valor para el proyecto**: Facilita la interacción del estudiante con la IA de forma aislada y enfocada.

### 📋 Tarjeta 4: Módulo de Predicciones ML y Alertas de Heladas
* **Descripción**: Crear una página dedicada para el modelo predictivo de temperaturas y recomendaciones de protección agrícola.
* **Detalle técnico**:
  - Se creó la ruta `/prediction` (`src/app/(dashboard)/prediction/page.tsx`).
  - Integra el componente `PredictionWidget` con su correspondiente visor de anomalías y sugerencias de protección de cultivos en caso de heladas.
* **Valor para el proyecto**: Proporciona a profesores y alumnos herramientas de análisis avanzadas sobre heladas de manera dedicada.

### 📋 Tarjeta 5: Barrera de Autenticación (Guards de Ruta)
* **Descripción**: Proteger los módulos de IA y predicciones para usuarios no registrados o invitados.
* **Detalle técnico**:
  - Se implementaron verificaciones activas en `/chat` y `/prediction` que redirigen al usuario a `/auth?redirect=...` si no existe una sesión activa de Supabase.
  - Se propagó el parámetro `?redirect` para retornar al usuario a su pestaña objetivo inmediatamente tras iniciar sesión.
* **Valor para el proyecto**: Protege la API contra consumos no autorizados y promueve el registro en la plataforma.

### 📋 Tarjeta 6: Sincronización y Persistencia de Coordenadas
* **Descripción**: Evitar que el usuario pierda la zona seleccionada en el mapa al navegar entre pantallas.
* **Detalle técnico**:
  - Sincronización URL bidireccional (`?lat=...&lon=...`).
  - Persistencia local en `localStorage` como fallback del estado global si el usuario recarga la página o entra sin parámetros URL.
* **Valor para el proyecto**: Excelente consistencia de navegación e interacción.

---

## 🟡 Lista: EN PROCESO (In Progress)

### 📋 Tarjeta 7: Integración y Despliegue Automático en Producción (GitHub Actions)
* **Descripción**: Integrar y desplegar los últimos cambios de arquitectura multi-pantalla en el servidor remoto de HostGator.
* **Detalle de dificultades**: 
  - Errores de pre-renderizado estático a nivel de build debido a la llamada de `useSearchParams()` de Next.js fuera de un contexto diferido.
  - **Solución implementada**: Se envolvió el componente `<Sidebar />` dentro del layout `(dashboard)/layout.tsx` en una frontera de `<Suspense>` para diferir su compilación estática.
* **Estado actual**: Commits subidos exitosamente a `main`. El build de producción local ya no presenta fallas.

---

## 🔴 Lista: POR HACER (To Do)

### 📋 Tarjeta 8: Sincronización de Sesión de Usuario en Sidebar y Header
* **Descripción**: Mejorar la cohesión visual de la sesión activa ocultando o unificando el botón "Iniciar Sesión / Alertas" de la cabecera cuando el sidebar ya muestra el estado del perfil.
* **Sugerencia de implementación**: Pasar el estado de autenticación a través del contexto o simplemente sincronizar el renderizado para evitar duplicidades de botones de ingreso en pantallas grandes.

### 📋 Tarjeta 9: Optimización de tiempos de carga iniciales de cartografía (Leaflet)
* **Descripción**: Reducir el tiempo de bloqueo en dispositivos móviles durante la carga del explorador climáticos.
* **Sugerencia de implementación**: Configurar un cargador skeleton específico o usar mapas estáticos simplificados en móviles hasta que el usuario decida interactuar.
