# Arquitectura Hexagonal en Deteclima

Este documento justifica por qué la estructura de **Deteclima** cumple con los principios de la Arquitectura Hexagonal (también conocida como Puertos y Adaptadores).

## 1. Visión General
La arquitectura está diseñada para desacoplar el núcleo de negocio de las tecnologías externas (APIs de clima, bases de datos, frameworks de UI). Esto se logra mediante la separación en tres capas principales: **Dominio**, **Aplicación** e **Infraestructura**.

---

## 2. Capa de Dominio (`src/domain`)
**Estado:** Totalmente aislada.
- **Justificación:** Los archivos en esta carpeta (ej. `entities/Clima.ts`) no importan nada fuera de su propia capa. Contienen la "verdad" del negocio, independiente de si los datos vienen de una base de datos SQL o de una API REST.
- **Evidencia:**
  - `src/domain/entities/`: Define interfaces puras de TypeScript.
  - `src/domain/validators/`: Lógica de validación pura (ej. coordenadas válidas) sin dependencias de librerías externas.

## 3. Capa de Aplicación (`src/application`)
**Estado:** Orquestación mediante abstracciones.
- **Puertos (Interfaces):**
  - **Input Ports (`ports/input/`):** Definen la interfaz de los casos de uso (ej. `ConsultarClimaUseCase`). Son la puerta de entrada al hexágono.
  - **Output Ports (`ports/output/`):** Definen qué necesita el hexágono del mundo exterior (ej. `WeatherPort`, `DatabasePort`).
- **Servicios (`services/`):**
  - **Justificación:** Implementan la lógica de los casos de uso. Crucialmente, **no dependen de implementaciones concretas**.
  - **Evidencia:** `ClimateService.ts` recibe un `WeatherPort` en su constructor. No sabe si es `OpenMeteo`, `AccuWeather` o un Mock para tests. Esto es el corazón de la Inversión de Dependencia.

## 4. Capa de Infraestructura (`src/infrastructure`)
**Estado:** Implementaciones técnicas (Adaptadores).
- **Adaptadores de Salida (`adapters/out/`):**
  - **Justificación:** Aquí es donde reside la complejidad técnica y el acoplamiento con librerías externas (Supabase, Fetch API, Groq SDK).
  - **Evidencia:** `OpenMeteoAdapter.ts` traduce la respuesta de una API externa al formato de la entidad `Clima` del dominio. Si la API de OpenMeteo cambia, solo se modifica este archivo.
- **Adaptadores de Entrada (Driving Adapters):**
  - **Evidencia:** Las rutas de Next.js (`src/app/api/`) actúan como el pegamento que instancia los adaptadores y los inyecta en los servicios.

---

## 5. Beneficios Verificados en el Proyecto

1.  **Facilidad de Testing:** Podemos probar `ClimateService` inyectando un `WeatherPort` falso sin necesidad de hacer peticiones HTTP reales.
2.  **Mantenibilidad:** Si decidimos cambiar Supabase por otra base de datos, solo tendríamos que crear un nuevo `DatabaseAdapter` que implemente el `DatabasePort`. El resto de la aplicación no se enteraría.
3.  **Independencia del Framework:** Aunque usamos Next.js, la lógica de negocio (`domain` y `application`) podría moverse a otro framework (ej. Express o NestJS) con cambios mínimos.
4.  **Resiliencia Offline:** La separación permite que los adaptadores de infraestructura manejen la lógica de caché de manera transparente para el resto de la aplicación.

---

## Conclusión
Deteclima no es solo un conjunto de carpetas; es una implementación fiel de la **Inversión de Dependencia**. El núcleo (Dominio) es el centro del universo, y las herramientas externas (Infraestructura) son detalles que se "conectan" a través de contratos definidos en la capa de Aplicación.
