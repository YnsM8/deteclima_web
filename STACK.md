# STACK.md — Deteclima v2

## Filosofía de selección

> **1 lenguaje principal, 1 framework, 1 despliegue gratuito.**
> Cada tecnología fue elegida para minimizar complejidad sin sacrificar los requisitos académicos del proyecto.

---

## Stack Principal — Next.js Full-Stack (TypeScript)

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Lenguaje** | TypeScript | Un solo lenguaje para frontend y backend. Tipado estático reduce bugs. |
| **Framework** | Next.js 15 (App Router) | React + API Routes en un solo proyecto. SSR/SSG para SEO y rendimiento. |
| **Estilos** | Tailwind CSS 4 | Desarrollo rápido de UI responsiva y moderna sin escribir CSS desde cero. |
| **Gráficos** | Recharts | Librería React nativa para dashboards climáticos (gráficos de línea, barras, área). |
| **Iconos** | Lucide React | Iconos limpios y ligeros para la UI. |
| **Geolocalización** | Navigator.geolocation API | API nativa del navegador, sin dependencias extra. |
| **Export CSV** | Generación client-side con Blob | Sin librería extra, JS nativo. |

---

## Backend & Base de Datos — Supabase (PostgreSQL)

| Componente | Tecnología | Justificación |
|-----------|-----------|---------------|
| **BaaS** | Supabase | Backend-as-a-Service con PostgreSQL, auth, storage y API REST/Realtime incluidos. Free tier generoso. |
| **Base de datos** | PostgreSQL (via Supabase) | Persistencia de consultas, historial climático, sesiones de chat. Relacional y robusto. |
| **Auth** | Supabase Auth | Autenticación lista para usar (email, Google, etc.) si se requiere en el futuro. |
| **Client SDK** | `@supabase/supabase-js` | SDK oficial para Next.js con soporte SSR y client-side. |
| **ORM/Queries** | Supabase Client (query builder) | API fluida tipo ORM sin configuración adicional. |

### Tablas principales (propuesta inicial)

```sql
-- Historial de consultas climáticas
weather_queries (id, lat, lon, location_name, data_json, created_at)

-- Historial de conversaciones del chatbot
chat_messages (id, session_id, role, content, weather_context, created_at)

-- Predicciones ML almacenadas
predictions (id, lat, lon, predicted_data, metrics_json, model_version, created_at)
```

---

## APIs Externas

| API | Uso | Costo |
|-----|-----|-------|
| **Open-Meteo** | Datos meteorológicos en tiempo real + históricos (30 días) | Gratis, sin API key |
| **Groq** (`groq-sdk`) | Chatbot IA educativo con contexto climático. Inferencia ultra-rápida con modelos LLM (LLaMA, Mixtral). | Gratis (free tier) |

### ¿Por qué Groq?

| Criterio | Groq | Gemini |
|----------|------|--------|
| Latencia | **~0.5s** (LPU hardware) | ~2-4s |
| Free tier | Generoso (30 req/min) | Limitado |
| Modelos disponibles | LLaMA 3.3 70B, Mixtral, Gemma 2 | Gemini Pro/Flash |
| SDK | `groq-sdk` (simple, compatible OpenAI) | `@google/generative-ai` |
| Velocidad de respuesta | **La más rápida del mercado** | Moderada |

---

## Microservicio ML — Python (mínimo)

> Se mantiene Python **solo** para Machine Learning porque scikit-learn es el estándar académico y el documento exige métricas específicas (R², MAE, RMSE).

| Componente | Tecnología | Justificación |
|-----------|-----------|---------------|
| **Framework** | FastAPI | Mínimo, rápido, auto-documenta con Swagger. |
| **ML** | scikit-learn (RandomForestRegressor) | Requisito académico. Modelo simple y efectivo para predicción 24h. |
| **Datos** | Open-Meteo Historical API | 30 días de datos para entrenamiento. Sin BD local. |
| **Runtime** | Python 3.11+ | Compatible con todas las librerías ML. |

### Endpoints ML (solo 2)

```
POST /predict      → Recibe coordenadas, retorna predicción 24h hora a hora
GET  /metrics      → Retorna R², MAE, RMSE del modelo actual
```

---

## PWA & Modo Offline

> La app funciona sin conexión a internet: cachea la UI, los últimos datos climáticos, permite navegación básica, exporta CSV offline y ofrece un chatbot de respaldo local.

### Tecnologías offline

| Componente | Tecnología | Función |
|-----------|-----------|--------|
| **Service Worker** | `next-pwa` (Workbox bajo el capó) | Intercepta requests, sirve assets cacheados, gestiona estrategias de cache. |
| **Cache de assets** | Cache API (via Workbox) | Cachea HTML, CSS, JS, imágenes, fuentes. Estrategia **Cache First** para assets estáticos. |
| **Cache de datos** | IndexedDB (`idb` wrapper) | Almacena últimos datos climáticos, historial de chat, preferencias del usuario. |
| **Manifest** | `manifest.json` | Define nombre, iconos, colores, display standalone para instalación como app nativa. |
| **Sync** | Background Sync API | Encola consultas realizadas offline y las sincroniza cuando vuelve la conexión. |

### Estrategias de cache por recurso

| Recurso | Estrategia | TTL | Offline behavior |
|---------|-----------|-----|------------------|
| **App Shell** (HTML, CSS, JS) | Cache First | Indefinido (versionado) | ✅ Navegación completa funcional |
| **Fuentes & Iconos** | Cache First | 30 días | ✅ UI íntegra |
| **Datos clima (Open-Meteo)** | Network First → fallback IndexedDB | 15 min | ⚠️ Muestra últimos datos cacheados con badge "Offline" |
| **Respuestas chatbot (Groq)** | Network Only → fallback local | — | ⚠️ Chatbot local con respuestas pre-definidas |
| **Imágenes generadas** | Stale While Revalidate | 1 hora | ✅ Sirve versión cacheada |
| **API Routes** | Network First | — | ⚠️ Respuestas desde IndexedDB |

### IndexedDB — Stores

```typescript
// Stores en IndexedDB (via 'idb' library)
const DB_NAME = 'deteclima-offline'
const DB_VERSION = 1

stores: {
  'weather-cache'     // Últimos datos climáticos por ubicación { key: "lat,lon", data, timestamp }
  'chat-history'      // Mensajes del chatbot para consulta offline { sessionId, messages[] }
  'predictions-cache' // Última predicción ML guardada { key: "lat,lon", predictions[], timestamp }
  'user-preferences'  // Ubicación favorita, tema, idioma { key, value }
  'offline-queue'     // Acciones pendientes de sincronizar { action, payload, createdAt }
}
```

### Chatbot offline (fallback local)

Cuando no hay conexión, el chatbot responde con un banco local de respuestas pre-definidas:

```typescript
// src/infrastructure/adapters/out/LocalChatbotAdapter.ts
const OFFLINE_RESPONSES: Record<string, string> = {
  'temperatura':  'Sin conexión. Según los últimos datos cacheados, la temperatura era {cached_temp}°C.',
  'humedad':      'Sin conexión. La última humedad registrada fue {cached_humidity}%.',
  'lluvia':       'Sin conexión. Consulta los datos cacheados en el dashboard.',
  'default':      'Estoy en modo offline. Puedo mostrarte los últimos datos guardados. Conéctate a internet para respuestas completas.',
}
// Busca keywords en la pregunta → responde con template + datos de IndexedDB
```

### CSV Export offline

- Los datos cacheados en IndexedDB se exportan a CSV directamente desde el cliente.
- Usa `Blob` + `URL.createObjectURL` — sin necesidad de servidor.
- Se añade header `[DATOS OFFLINE - última actualización: {timestamp}]` al CSV exportado sin conexión.

### PWA Manifest

```json
{
  "name": "Deteclima – Monitor Climático Inteligente",
  "short_name": "Deteclima",
  "description": "Plataforma educativa de monitoreo climático con IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "orientation": "any",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## Arquitectura Hexagonal — Mapeo a carpetas

```
deteclima_web/
├── public/
│   ├── manifest.json              # 📱 PWA manifest
│   ├── sw.js                      #    (generado por next-pwa)
│   └── icons/                     #    Iconos PWA (192, 512, maskable)
│
├── src/
│   ├── domain/                    # 🔵 Dominio puro (entidades, validadores)
│   │   ├── entities/              #    Clima, Consulta, RespuestaIA, Prediccion
│   │   └── validators/            #    ClimaValidator, PromptValidator
│   │
│   ├── application/               # 🟢 Casos de uso (lógica de negocio)
│   │   ├── ports/
│   │   │   ├── input/             #    ConsultarClimaUseCase, ChatbotUseCase, PredecirUseCase
│   │   │   └── output/            #    WeatherPort, AIPort, PredictionPort, DatabasePort
│   │   └── services/              #    ClimateService, ChatbotService, PredictionService
│   │
│   ├── infrastructure/            # 🟠 Adaptadores (implementaciones concretas)
│   │   └── adapters/
│   │       ├── out/               #    OpenMeteoAdapter, GroqAdapter, MLServiceAdapter, SupabaseAdapter
│   │       ├── out/               #    LocalChatbotAdapter (fallback offline)
│   │       └── in/                #    → son los API Routes de Next.js (app/api/*)
│   │
│   ├── lib/                       # 🔧 Configuración
│   │   ├── supabase/              #    Cliente Supabase (server + client)
│   │   ├── groq/                  #    Cliente Groq
│   │   ├── offline/               #    IndexedDB stores, cache helpers, sync manager
│   │   │   ├── db.ts              #    Configuración IndexedDB (idb wrapper)
│   │   │   ├── weather-cache.ts   #    CRUD weather cache store
│   │   │   ├── chat-cache.ts      #    CRUD chat history store
│   │   │   └── sync-queue.ts      #    Background sync queue
│   │   └── hooks/
│   │       ├── useOnlineStatus.ts  #   Hook para detectar online/offline
│   │       └── useOfflineData.ts   #   Hook para leer datos cacheados
│   │
│   └── app/                       # 🎨 Frontend React (pages, components, layouts)
│       ├── api/                   #    Route Handlers = Adaptadores de entrada
│       │   ├── weather/
│       │   ├── chat/
│       │   └── prediction/
│       ├── components/
│       │   ├── Dashboard/
│       │   ├── ChatWidget/
│       │   ├── WeatherCard/
│       │   └── OfflineBanner.tsx   #    Banner indicador de modo offline
│       ├── layout.tsx
│       └── page.tsx
│
├── ml-service/                    # 🐍 Microservicio Python (independiente)
│   ├── main.py
│   ├── model/
│   ├── requirements.txt
│   └── Dockerfile
│
├── next.config.ts                 #    Incluye config next-pwa
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Infraestructura & Despliegue

### Hosting & Dominio

| Recurso | Proveedor | Detalle |
|---------|----------|--------|
| **Hosting web** | Vercel | Deploy automático desde GitHub. Edge Network global. Free tier. |
| **Dominio** | Name.com | Dominio personalizado (ej. `deteclima.com`). DNS apuntando a Vercel. |
| **Backend (BaaS)** | Supabase | PostgreSQL + Auth + Storage + Realtime. Free tier (500MB, 50K filas). |
| **ML Service** | Render | Microservicio FastAPI con modelo scikit-learn. Free tier. |

### Configuración DNS (Name.com → Vercel)

```
Tipo    Nombre    Valor
A       @         76.76.21.21
CNAME   www       cname.vercel-dns.com
```

### Variables de entorno (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # solo server-side
GROQ_API_KEY=gsk_...
ML_SERVICE_URL=https://deteclima-ml.onrender.com
```

### Pipeline de deploy

```
git push main → Vercel build → next-pwa genera SW → Deploy a Edge Network
                                                   → Dominio Name.com sirve via Vercel DNS
```

---

## Resumen ejecutivo

```
Frontend + Backend  →  Next.js 15 (TypeScript)
Base de datos       →  Supabase (PostgreSQL)
Estilos             →  Tailwind CSS 4
Gráficos            →  Recharts
API Clima           →  Open-Meteo (gratis, sin key)
API IA              →  Groq (free tier, ultra-rápido)
ML Service          →  FastAPI + scikit-learn (Python)
Offline / PWA       →  Service Workers + IndexedDB (next-pwa)
Hosting             →  Vercel (gratis)
Dominio             →  Name.com
Backend (BaaS)      →  Supabase (gratis)
Deploy ML           →  Render (gratis)
Costo total         →  S/ 0.00 (+ costo dominio Name.com)
```

---

## Roadmap (Fase 2)

Las siguientes funcionalidades expanden el proyecto manteniendo la misma filosofía y tecnología (Next.js + Supabase + Python + Groq):

1. **Alertas Tempranas Personalizadas (Auth + Database)**: Implementación de inicio de sesión (`Supabase Auth`) para que los usuarios guarden ubicaciones. Un sistema de notificaciones en el dashboard mostrará "Alertas Rojas" cruzando estos datos con predicciones ML (ej. para advertir sobre Heladas/Friajes).
2. **Mapa Interactivo Regional (Frontend)**: Integración de un mapa interactivo geolocalizado con pines (usando leaflet o nativo) para clickear y predecir el clima en múltiples puntos del valle sin salir del inicio.
3. **Detección de Anomalías Climáticas (Python ML)**: Extensión del microservicio Python con modelos tipo *Isolation Forest* para reportar si la condición climática actual entra en parámetros de "anomalía histórica" comparado con el set de 30 años.
