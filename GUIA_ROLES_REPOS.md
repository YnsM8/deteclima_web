# 🗺️ Guía de Organización por Roles — Proyecto Deteclima v2

Esta guía clasifica los archivos del proyecto según los roles definidos, utilizando la analogía de un **rompecabezas**. Existe una **base central (Rama Brain)** y cada rol aporta sus **piezas específicas** para completar el sistema.

---

## 🧠 La Rama "Brain" (Base del Rompecabezas)
**Misión:** Establecer el esqueleto y los puntos de unión entre todas las piezas. Esta rama es el punto de partida para todos los roles.

### Contenido de la Rama `main` (Brain):
*   **Estructura de Carpetas:** El árbol vacío de `src/`, `public/` y `ml-service/`.
*   **Configuración Base:** `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.local` (ejemplo).
*   **Contratos de Unión:**
    *   `src/domain/`: Las entidades que todos usarán.
    *   `src/application/ports/`: Las interfaces que conectan el Frontend con el Backend y las APIs.
*   **Documentación:** `README.md`, `HEXAGONAL_ARCHITECTURE.md`.

> **Nota:** Sin esta base, las piezas de los demás roles no encajarían. El Arquitecto es el encargado de mantener esta rama.

---

## 🏗️ 1. Pieza: Arquitecto de Software
**Misión:** Mantener la integridad de la Rama Brain y definir los estándares.

### Archivos bajo su mando:
*   `src/application/ports/`
*   `src/domain/`
*   Configuraciones de build y despliegue.

---

## 🎨 2. Pieza: Frontend Developer
**Misión:** Dar vida visual al sistema sobre la base existente.

### Archivos que agrega:
*   `src/app/`: (Páginas, layouts, componentes visuales).
*   `public/`: Assets y multimedia.
*   `src/lib/`: Utilidades de UI y Hooks.
*   `styles/` o configuraciones de CSS/Tailwind.

---

## 🔌 3. Pieza: API Developer
**Misión:** Conectar el sistema con el mundo exterior.

### Archivos que agrega:
*   `src/app/api/weather/`: Rutas de servidor.
*   `src/infrastructure/adapters/out/`: Adaptadores para APIs externas (OpenMeteo, etc.).

---

## 🧠 4. Pieza: IA / ML Specialist
**Misión:** Aportar la inteligencia predictiva.

### Archivos que agrega:
*   `ml-service/`: Todo el microservicio Python independiente.
*   `src/app/api/prediction/` y `src/app/api/chat/`.
*   `src/infrastructure/adapters/out/`: Adaptadores para el servicio ML y Groq.

---

## 🗄️ 5. Pieza: Backend Developer
**Misión:** Asegurar la persistencia y la lógica de negocio.

### Archivos que agrega:
*   `src/application/services/`: Implementación de los casos de uso.
*   `src/infrastructure/adapters/out/SupabaseAdapter.ts`: Persistencia en DB.
*   Configuraciones de seguridad y bases de datos.

---

## 🚀 Estrategia de Ramas y Commits

### 1. Nomenclatura de Ramas
Cada rol saca su rama desde `main` (Brain):
*   `arch/*`, `front/*`, `back/*`, `api/*`, `ai/*`.

### 2. Prefijos de Commits
`arch:`, `front:`, `back:`, `api:`, `ai:`, `docs:`, `fix:`.

---

## 📦 Proceso de "Armado del Rompecabezas" en un Nuevo Repo

1.  **El Inicio (Brain):** El Arquitecto crea el repo, sube la base (Rama Brain) y hace el primer push a `main`.
2.  **Reparto de Tareas:** Cada rol hace un `git checkout -b rol/nombre-tarea` desde el `main` actualizado.
3.  **Desarrollo en Paralelo:** 
    *   El **Frontend** puede maquetar usando los *Ports* (interfaces) aunque el Backend no esté listo.
    *   El **IA Specialist** trabaja en su carpeta `ml-service` sin afectar al resto.
4.  **Integración:** Se hacen Pull Requests a una rama `develop`. Si el código encaja con los contratos de la Rama Brain, se fusiona.
5.  **Final:** `main` siempre tiene el rompecabezas armado y funcional.
