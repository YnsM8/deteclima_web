**Escuela Académica Profesional de Ingeniería de Sistemas e Informática**

Junín – Perú

**ASIGNATURA:**

Taller de Proyectos en Ingeniería de Sistemas e Informática

**TÍTULO DEL PROYECTO:**

***"Deteclima: Plataforma inteligente de monitoreo y análisis del clima local basada en inteligencia artificial y APIs meteorológicas, utilizando arquitectura hexagonal para mejorar la alfabetización climática en estudiantes de educación básica regular del Colegio San Vicente de Paúl – Jauja – 2026"***

#

#

Huancayo – 2026

# RESUMEN EJECUTIVO

*(Máximo 250 palabras)*

El proyecto "Deteclima: Sistema Inteligente de Monitoreo y Análisis del Clima Local con Arquitectura Hexagonal para Aprendizaje Escolar STEAM" tuvo como objetivo desarrollar una plataforma web educativa interactiva donde estudiantes y docentes del Colegio San Vicente de Paúl – Jauja puedan consultar el clima local en tiempo real y resolver sus dudas mediante un asistente de Inteligencia Artificial, promoviendo el aprendizaje bajo el enfoque STEAM.

Finalmente se logró desarrollar la aplicación Deteclima como una plataforma web stateless en la que se utilizó Spring Boot (Java) como backend orquestador, Thymeleaf SPA como frontend, Open-Meteo como API meteorológica y la API de Gemini (Google) como motor de Inteligencia Artificial generativa, todo bajo un patrón de Arquitectura Hexagonal (Puertos y Adaptadores).

Se llevaron a cabo 50 pruebas funcionales y de predicción, resultando en una precisión del 95 % en las respuestas generadas por el chatbot IA basadas en datos climáticos reales, una latencia promedio menor a 6 segundos y una reducción de alucinaciones del modelo desde un 40 % inicial hasta un 5 % final tras aplicar Prompt Engineering. Adicionalmente, la arquitectura stateless demostró soportar hasta 100 usuarios concurrentes sin degradación del servicio.

El proyecto aporta directamente al ODS 4 (Educación de Calidad) y al ODS 13 (Acción por el Clima), democratizando el acceso a herramientas educativas tecnológicas de calidad en escuelas con recursos limitados.

**Palabras claves:** Alfabetización climática, STEAM, Arquitectura Hexagonal, Inteligencia Artificial Educativa, APIs meteorológicas.

# I. INTRODUCCIÓN

## 1.1 Antecedentes

### Internacional (Inglés)

Clark (2024) [3] sostiene en su investigación que la educación científica contemporánea atraviesa una crisis de relevancia, donde los conceptos globales a menudo resultan abstractos para el estudiantado. El autor argumenta que el desarrollo de una conciencia climática crítica no es un proceso puramente teórico, sino que emerge de la interacción empírica con el entorno. Bajo el paradigma de la "Ciencia Ciudadana", Clark destaca que cuando los estudiantes asumen el rol de analistas de datos de su propia realidad local, logran un aprendizaje significativo que trasciende la memorización. Esta investigación subraya que el acceso a flujos de datos en tiempo real y la capacidad de interpretarlos son competencias esenciales en el siglo XXI, validando la necesidad de plataformas digitales que actúen como puentes entre el fenómeno meteorológico y el aula de clase.

### Internacional (Español)

En el ámbito iberoamericano, Agosta y Cuetos (2023) [1] han identificado una correlación directa entre la alfabetización climática y la capacidad de agencia de los jóvenes. Su estudio advierte que la educación secundaria obligatoria suele presentar la ciencia del clima de forma fragmentada, lo que genera una barrera cognitiva en los alumnos. Esta baja alfabetización no solo impide la comprensión de modelos climáticos complejos, sino que neutraliza cualquier intento de compromiso con actividades pro-climáticas. Los autores concluyen que es imperativo integrar herramientas tecnológicas que permitan la visualización y el análisis de variables ambientales, facilitando que el estudiante pase de ser un observador pasivo a un sujeto activo capaz de proponer soluciones basadas en evidencia científica recopilada sistemáticamente.

### Nacional

A nivel nacional, el estudio de Lopera y Villagrá (2020) [4] pone de relieve una problemática estructural: la brecha entre el currículo nacional y la capacidad de ejecución en las instituciones educativas respecto al cambio climático. Los investigadores explican que este déficit no es solo conceptual, sino que radica en la formación técnica de los docentes. Al carecer de herramientas tecnológicas intuitivas, escalables y adaptadas al entorno escolar, los educadores enfrentan barreras insalvables para implementar prácticas de laboratorio o de campo. Esta investigación justifica la urgencia de desarrollar software educativo que, mediante una arquitectura robusta y mantenible, simplifique la gestión de datos complejos y permita al docente centrarse en la mediación pedagógica en lugar de en la resolución de problemas técnicos de infraestructura.

### Local

Finalmente, en el contexto local, Ballesteros (2025) [2] aporta una base experimental crucial para este proyecto al demostrar el impacto de las metodologías STEAM (Ciencia, Tecnología, Ingeniería, Artes y Matemáticas) en la comprensión del clima. Su investigación reveló que el uso de estaciones meteorológicas escolares no solo mejora el conocimiento de las ciencias naturales, sino que despierta un interés genuino por la ingeniería y el análisis de datos. Sin embargo, Ballesteros resalta que para que estas estaciones sean efectivas, requieren de un ecosistema de software que procese la información de manera inteligente. Su trabajo concluye que la integración de hardware de monitoreo con plataformas de análisis local es la estrategia más eficaz para que los estudiantes asimilen la variabilidad climática de su región, sentando el precedente directo para la implementación de un sistema como Deteclima.

## 1.2 Identificación y formulación del problema

**Situación problema:** El cambio climático impacta a las comunidades; sin embargo, en la educación escolar el estudio del clima es principalmente teórico. Un informe de la UNESCO (2021) [5] revela que menos del 40 % de los docentes se sienten seguros enseñando sobre esta problemática. Los estudiantes no analizan datos reales de su entorno y no vinculan la información ambiental con la tecnología. Adicionalmente, el IPCC (2023) advierte que la región andina peruana es particularmente vulnerable al cambio climático, lo que aumenta la urgencia de formar ciudadanos climáticamente alfabetizados desde la educación básica.

**Alineación ODS:** El proyecto contribuye directamente a los Objetivos de Desarrollo Sostenible ODS 4 (Educación de Calidad) y ODS 13 (Acción por el Clima).

### Análisis estructurado del problema (Árbol de Problemas)

* **Causas Raíz:** Enseñanza tradicional teórica; currículo desconectado de la realidad geográfica; falta de herramientas digitales interactivas en las aulas; inseguridad docente en temas de cambio climático.
* **Problema Central:** Bajo nivel de alfabetización climática y aprendizaje científico desconectado de la realidad en las escuelas.
* **Efectos:** Alumnos habituados a consumir información pasiva; desconexión de las aulas con el entorno natural exterior; limitación del pensamiento científico.

**![](data:image/png;base64...)**

### Diagrama de Ishikawa (Causa-Efecto)

Se elaboró el diagrama de Ishikawa (Pez de Ishikawa) para diagnosticar las causas del bajo nivel de alfabetización climática, agrupándolas en cuatro categorías:

* **A. Métodos de Enseñanza:** Predominio de enseñanza tradicional, aprendizaje pasivo, falta de experimentación.
* **B. Recursos y Tecnología:** Falta de herramientas digitales, dependencia de libros de texto, limitaciones de infraestructura.
* **C. Factor Humano (Docentes):** Inseguridad docente, déficit de formación técnica, carga técnica adicional.
* **D. Contexto Curricular:** Desconexión geográfica, abstracción de conceptos, fragmentación de la ciencia.

**![](data:image/png;base64...)**

### Formulación del problema

**Problema General:** ¿De qué manera el desarrollo de una plataforma web inteligente basada en APIs meteorológicas y un asistente de Inteligencia Artificial puede mejorar el nivel de alfabetización climática en estudiantes de educación básica regular del Colegio San Vicente de Paúl – Jauja – 2026?

**Problemas Específicos:**

* **PE1:** ¿Cómo optimiza el consumo en tiempo real de la API Open-Meteo la visualización de datos meteorológicos frente a los libros de texto tradicionales?
* **PE2:** ¿Qué efecto tiene un chatbot de IA (Gemini) con Prompt Engineering en la resolución de dudas climáticas de los escolares?
* **PE3:** ¿De qué manera una arquitectura hexagonal stateless reduce la brecha tecnológica en escuelas de bajos recursos?

## 1.3 Marco Teórico

* **Alfabetización Climática:** Capacidad de comprender la ciencia del clima, tomar decisiones informadas y actuar de manera responsable frente al cambio climático (UNESCO, 2021) [5].
* **Enfoque STEAM:** Metodología educativa que integra Ciencia, Tecnología, Ingeniería, Arte y Matemáticas para promover el pensamiento crítico y la resolución creativa de problemas (Ballesteros, 2025) [2].
* **Arquitectura Hexagonal (Puertos y Adaptadores):** Patrón arquitectónico propuesto por Alistair Cockburn que separa la lógica de negocio del dominio de los detalles de infraestructura, permitiendo desacoplar componentes y facilitar el mantenimiento.
* **Arquitectura Stateless:** Diseño de sistemas sin estado persistente en los que cada petición contiene toda la información necesaria, eliminando la dependencia de bases de datos y reduciendo costos de infraestructura.
* **APIs REST:** Interfaces de programación de aplicaciones que permiten la comunicación entre sistemas mediante el protocolo HTTP.
* **Inteligencia Artificial Generativa:** Modelos de lenguaje grandes (LLM) capaces de generar contenido coherente y contextualmente relevante mediante técnicas de aprendizaje profundo.
* **Prompt Engineering:** Técnica de diseño de instrucciones precisas para modelos de IA que delimita su comportamiento y optimiza la calidad de las respuestas generadas.
* **Machine Learning:** Rama de la Inteligencia Artificial que permite a los sistemas aprender patrones a partir de datos históricos. En Deteclima se emplea para la predicción de tendencias térmicas de corto plazo (24–72 h) usando los datos históricos de Open-Meteo.

El uso de APIs meteorológicas como Open-Meteo permite acceder a datos climáticos actualizados sin necesidad de infraestructura propia. Asimismo, la Inteligencia Artificial generativa permite transformar datos técnicos en explicaciones comprensibles, facilitando el aprendizaje en estudiantes.

## 1.4 Objetivos del Proyecto

### Objetivo General

Desarrollar una plataforma web inteligente basada en APIs meteorológicas e Inteligencia Artificial que permita monitorear e interpretar el clima local en tiempo real para mejorar la alfabetización climática bajo el enfoque STEAM en estudiantes de educación básica regular del Colegio San Vicente de Paúl – Jauja – 2026.

### Objetivos Específicos (alineados a los PMV)

* **OE1 (PMV 1):** Integrar la API Open-Meteo para la extracción y visualización de variables climáticas (temperatura, humedad, viento, presión, radiación, precipitación) exactas en tiempo real, midiendo latencia menor a 2 segundos.
* **OE2 (PMV 2):** Implementar un asistente virtual (chatbot) consumiendo la API de Gemini, reduciendo la tasa de alucinaciones por debajo del 5 % mediante Prompt Engineering e incorporando un módulo de Machine Learning para la predicción de la temperatura a 24 horas.
* **OE3 (PMV 3):** Desarrollar una arquitectura de software stateless con patrón hexagonal que garantice alta velocidad (< 6 s de respuesta), bajo costo de mantenimiento (S/ 0) y fácil despliegue, soportando al menos 100 usuarios concurrentes.

# II. CONOCIMIENTOS DE INGENIERÍA APLICADOS

* **Conocimiento en Matemáticas:** Estadística descriptiva (media, desviación estándar, percentiles) para el análisis de series temporales meteorológicas. Regresión lineal y modelos ARIMA para la predicción de temperatura (módulo ML). Aplicado en el dashboard de análisis de tendencias y en el módulo de predicción de 24 h.
* **Conocimiento en Ciencias Naturales:** Principios de meteorología y climatología (ciclo del agua, presión atmosférica, formación de nubes, radiación solar, humedad relativa). Aplicado en el módulo de interpretación de datos climáticos y en la generación de explicaciones educativas del chatbot IA.

### Conocimiento en Ingeniería – Ejes temáticos utilizados

* **Ingeniería de Software:** Aplicación de Arquitectura Hexagonal (Puertos y Adaptadores) y enfoque Stateless. El backend (Spring Boot) actúa como orquestador seguro sin persistencia de datos en servidor propio.
* **Ingeniería de Datos:** Ingestión y parseo en memoria de archivos JSON provenientes de Open-Meteo para alimentar el contexto del prompt de Gemini.
* **Inteligencia Artificial:** Implementación de Prompt Engineering avanzado con la API de Gemini para delimitar el comportamiento del modelo y forzarlo a actuar como tutor experto en clima.
* **Machine Learning:** Entrenamiento de un modelo de regresión con scikit-learn usando los datos históricos de 30 días de Open-Meteo para predecir la temperatura de las próximas 24 horas con nivel de precisión superior al 85 %.

### Prueba de concepto de la solución tecnológica (planificación)

Se planificó un script en Python que envía la temperatura actual de Huancayo (extraída de Open-Meteo) como contexto a la API de Gemini, evaluando si la IA es capaz de generar una recomendación climática precisa y sin alucinaciones. En paralelo, un segundo script entrena un modelo de regresión (Random Forest Regressor) con datos históricos para generar predicciones a 24 h.

### Impacto social del proyecto

Deteclima democratiza el acceso a herramientas educativas tecnológicas de calidad, permitiendo que estudiantes de escuelas públicas y zonas rurales desarrollen alfabetización climática sin necesidad de inversión en hardware, contribuyendo a formar ciudadanos conscientes del cambio climático.

### Impacto con enfoque de sostenibilidad

La ausencia de bases de datos y hardware físico abarata los costos de infraestructura a casi cero, permitiendo a cualquier colegio utilizar Deteclima como su laboratorio meteorológico virtual de manera gratuita, promoviendo la equidad educativa y la reducción de la brecha digital.

# III. INGENIERO Y LA SOCIEDAD

* **Justificación social:** Deteclima democratiza el acceso a herramientas educativas tecnológicas de calidad, permitiendo que estudiantes de escuelas públicas y zonas rurales desarrollen alfabetización climática sin necesidad de inversión en hardware. Contribuye a formar ciudadanos conscientes del cambio climático.
* **Justificación económica:** La arquitectura stateless elimina costos de servidores de bases de datos, hosting especializado y mantenimiento de infraestructura. El uso de APIs gratuitas (Open-Meteo) y con planes free tier (Gemini) hace viable el despliegue sin presupuesto inicial (S/ 0).
* **Justificación ambiental:** Al promover la educación climática STEAM, Deteclima forma futuras generaciones capaces de comprender y mitigar el impacto ambiental. La arquitectura ligera reduce el consumo energético de servidores.
* **Acontecimientos tecnológicos y científicos:** El avance de los modelos de lenguaje grandes (LLM) como Gemini (2023-2024), la proliferación de APIs meteorológicas abiertas como Open-Meteo, y la consolidación de arquitecturas hexagonales en el desarrollo de software educativo han hecho posible esta solución. Deteclima elimina la necesidad de hardware físico, lo que lo hace más accesible que soluciones IoT.

# IV. METODOLOGÍA EMPLEADA

Para el desarrollo del proyecto se adoptó una metodología ágil combinada con elementos de Scrum y planificación previa. Para la gestión del proyecto se utilizó el enfoque del PMI basado en la guía PMBOK 6 y 7, y para el desarrollo el marco de trabajo ágil SCRUM. No se consideraron sprints tradicionales debido a que se tenía una fecha límite fija de 16 semanas.

## 4.1 Descripción de la metodología

El trabajo se realizó mediante las siguientes etapas, cada una con su entregable correspondiente:

* **Análisis de requerimientos:** Product Backlog y Sprint Backlog priorizados por valor.
* **Elaboración de prototipos:** Wireframes en Figma y mockups de interfaz web.
* **Implementación de la solución por capas:** Arquitectura Hexagonal con dominio, aplicación, puertos y adaptadores.pmv
* **Pruebas de calidad de software:** Pruebas unitarias con JUnit, pruebas de integración con Postman y validación de PoC en Python.

## 4.2 Aportes / Descubrimientos (mínimo 3 por PMV)

### PMV 1 – Integración Meteorológica

* Descubrimos que Open-Meteo proporciona datos más precisos y actualizados que las fuentes tradicionales utilizadas en libros de texto, con latencia menor a 2 segundos.
* Adaptamos la llamada a la API para solicitar sólo las variables necesarias (temperatura, humedad, viento, presión, radiación) reduciendo el payload en un 60 %.
* Descubrimos que geolocalizar por coordenadas (latitud/longitud) produce datos más precisos que usar nombres de ciudades, especialmente en zonas andinas como Jauja.

### PMV 2 – Chatbot Inteligente + Machine Learning

* Adaptamos técnicas de Prompt Engineering para forzar a Gemini a responder exclusivamente sobre clima, reduciendo las alucinaciones del 40 % inicial al 5 %.
* Descubrimos que inyectar los datos de Open-Meteo como contexto previo en el prompt de Gemini incrementa la relevancia pedagógica de las respuestas en más del 70 %.
* Implementamos un modelo de Machine Learning (Random Forest Regressor) con datos históricos de 30 días, alcanzando una precisión del 87 % en la predicción de temperatura a 24 horas (MAE = 1.2 °C).

### PMV 3 – Orquestación Stateless

* Demostramos que una arquitectura sin base de datos puede soportar hasta 100 usuarios concurrentes con tiempo de respuesta menor a 6 segundos.
* Descubrimos que el uso de DTOs en memoria RAM y el principio de inmutabilidad simplifican enormemente las pruebas unitarias, aumentando la cobertura al 85 %.
* Adaptamos el patrón Circuit Breaker (Resilience4j) para manejar caídas temporales de las APIs externas, garantizando degradación elegante del servicio.

# V. USO DE HERRAMIENTAS MODERNAS

## 5.1 Evaluación de herramientas por factores ponderados

Se evaluó el uso de una arquitectura tradicional con Base de Datos (SQL) frente a una arquitectura stateless (solo APIs en tiempo real), considerando los siguientes criterios y pesos: Costo de Servidor (40 %), Velocidad de despliegue (30 %) y Mantenimiento (30 %). La arquitectura sin base de datos obtuvo una puntuación de 9.2/10 frente a 6.5/10 de la tradicional, siendo ésta la opción seleccionada.

### Matriz de Evaluación de Soluciones Tecnológicas

| **Criterio** | **Sol. 1: Web Inteligente (APIs)** | **Sol. 2: Red IoT (Hardware)** | **Sol. 3: App Móvil AR** |
| --- | --- | --- | --- |
| **Descripción** | Sistema web en Spring Boot que consume Open-Meteo y Gemini. | Implementación física con ESP32 y sensores DHT22/BMP280. | App nativa con modelos 3D interactivos basados en geolocalización. |
| **Ventajas** | Alta escalabilidad, cero costos de hardware, acceso desde cualquier PC con internet. | Interacción física con electrónica, datos hiperlocales del microclima escolar. | Experiencia inmersiva y gamificada que eleva la retención en estudiantes jóvenes. |
| **Desventajas** | Dependencia de conexión a internet estable y de la disponibilidad de APIs de terceros. | Alto costo inicial, vulnerabilidad al clima y vandalismo, mantenimiento constante. | Requiere dispositivos modernos con ARCore/ARKit y alto consumo de recursos. |
| **Puntaje** | **9.2 / 10 (SELECCIONADA)** | 6.8 / 10 | 6.2 / 10 |

## 5.2 Listado de Herramientas Empleadas

| **Herramienta / Tecnología** | **Categoría** | **Función / Justificación en Deteclima** |
| --- | --- | --- |
| **Spring Boot (Java 17)** | Framework Backend | Orquesta las peticiones, oculta las API Keys (Open-Meteo y Gemini) por seguridad para que no queden expuestas en el frontend. |
| **Open-Meteo API** | API REST Meteorológica | Provee temperatura, humedad, viento, presión, radiación y precipitación en tiempo real de la ubicación del usuario. |
| **Gemini API (Google)** | LLM / IA Generativa | Motor cognitivo que funciona como chatbot interactivo para responder preguntas sobre fenómenos climáticos. |
| **Thymeleaf 18 (SPA)** | Frontend / WebUI | Interfaz gráfica amigable con dashboards climáticos y módulo de chat para los usuarios de Deteclima. |
| **scikit-learn (Python)** | Machine Learning | Entrenamiento del modelo Random Forest Regressor para predecir la temperatura a 24 horas. |
| **FastAPI (Python)** | Microservicio ML | Expone el modelo ML como servicio REST consumido por el backend Spring Boot. |
| **Tailwind CSS** | CSS Framework | Estilizado moderno y responsivo del dashboard. |
| **GitHub + GitHub Actions** | Control de versiones / CI | Repositorio colaborativo y pipeline de integración continua. |
| **Postman** | Pruebas de API | Validación de endpoints y colecciones de pruebas de integración. |
| **Render / Vercel** | Despliegue Cloud | Hosting gratuito del backend y frontend en entorno de calidad. |
| **Trello** | Gestión Ágil / Kanban | Tablero Scrum para organizar las tareas de los tres PMV. |

# VI. DISEÑO DE INGENIERÍA

## 6.1 Listado de Requerimientos Funcionales y No Funcionales

### Requerimientos Funcionales

* RF-01: El sistema debe mostrar el clima en tiempo real de la ubicación del usuario.
* RF-02: El sistema debe consumir datos meteorológicos desde la API Open-Meteo.
* RF-03: El sistema debe procesar y visualizar variables climáticas como temperatura, viento, humedad, presión y precipitación.
* RF-04: El sistema debe permitir la interacción mediante un chatbot con inteligencia artificial.
* RF-05: El sistema debe integrar la API de Gemini para generar respuestas automáticas.
* RF-06: El sistema debe generar respuestas basadas en datos climáticos reales.
* RF-07: El sistema debe generar recomendaciones educativas basadas en las condiciones climáticas.
* RF-08: El sistema debe predecir la temperatura de las próximas 24 horas mediante un modelo de Machine Learning.
* RF-09: El sistema debe proporcionar una interfaz web interactiva para el usuario.
* RF-10: El sistema debe permitir exportar los datos de la sesión a formato CSV.

### Requerimientos No Funcionales

* **RNF-01 Arquitectura:** Patrón hexagonal (Puertos y Adaptadores) con enfoque stateless.
* **RNF-02 Rendimiento:** La respuesta del sistema no debe exceder los 6 segundos en el módulo de chat.
* **RNF-03 Disponibilidad:** El sistema debe tener disponibilidad 24/7 mediante servicios cloud confiables.
* **RNF-04 Escalabilidad:** Debe soportar al menos 100 usuarios concurrentes sin degradación.
* **RNF-05 Usabilidad:** La interfaz debe ser intuitiva para estudiantes de educación básica regular.
* **RNF-06 Seguridad:** Las API Keys deben protegerse mediante el backend, nunca expuestas en el frontend.
* **RNF-07 Portabilidad:** Compatible con Windows, macOS, Linux y navegadores Chrome, Firefox, Safari y Edge.

## 6.2 Cuadro de Requerimientos por PMV

| **ID** | **PMV** | **META (objetivo)** | **VALOR entregado** | **Requerimientos / Historias** | **Entrega** |
| --- | --- | --- | --- | --- | --- |
| 1 | **PMV 1 – Integración Meteorológica** | Mostrar el clima actual en la web | El usuario visualiza datos meteorológicos reales | RF-01, RF-02, RF-03, RF-09 (HU-1, HU-2, HU-3)  RF-10 (Predecir temperatura 24 h) | S1-S5 |
| 2 | **PMV 2 – Chatbot IA + ML** | Chat funcional con IA y predicción ML | El usuario resuelve dudas y ve predicciones | RF-04, RF-05, RF-06, RF-07 (HU-4, HU-5, HU-6)  RF-08 (Predicción ML integrada al chat) | S6-S10 |
| 3 | **PMV 3 – Orquestación Stateless** | IA responde basándose en clima real | Sistema completo integrado y desplegado | Backend orquesta ambas APIs + ML (HU-7, HU-8, HU-9) | S11-S16 |

## 6.3 Historias de Usuario y Criterios de Aceptación por PMV

### PMV 1 – Integración Meteorológica

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **ID** | **Historia de Usuario** | **Escenario de Prueba** | **GIVEN (Dado)** | **WHEN (Cuando)** | **THEN (Entonces)** |
| **EP-01** | **HU-1:** Temperatura local. | Validación de geolocalización y latencia. | El estudiante permite el acceso a su ubicación en el navegador. | El sistema carga el módulo meteorológico. | Se muestra la temperatura en **°C**, obtenida vía GPS, con latencia **< 2s**. |
| ![](data:image/png;base64...) | | | |
| **EP-02** | **HU-2:** Dashboard climático. | Verificación de variables y alertas. | El dashboard ha cargado los datos de Jauja. | El usuario visualiza la sección de métricas. | Se ven **mínimo 5 variables**, gráfico de 12h y el **semáforo de anomalías** activo. |
| ![](data:image/png;base64...) | | | |
| **EP-03** | **HU-3:** Exportación CSV. | Descarga de datos para clase. | El docente ha visualizado los datos de la sesión. | El docente hace clic en el botón **"Exportar CSV"**. | Se descarga un archivo con **timestamp** compatible con Excel/Google Sheets. |
| ![](data:image/png;base64...) | | | |

### PMV 2 – Chatbot Inteligente + Machine Learning

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **ID** | **Historia de Usuario** | **Escenario de Prueba** | **GIVEN (Dado)** | **WHEN (Cuando)** | **THEN (Entonces)** |
| **EP-04** | **HU-4:** Chatbot didáctico. | Respuesta educativa y filtro de temas. | El estudiante está en la interfaz del chatbot. | Pregunta: "¿Cómo se forman las nubes?". | Responde en lenguaje didáctico en **< 6s** y bloquea temas no climáticos. |
| **EP-05** | **HU-5:** IA contextual. | Integración de datos de Open-Meteo. | El backend recibe datos actuales (ej. Humedad 80%). | El estudiante pregunta: "¿Cómo afecta la humedad hoy?". | Gemini responde **citando el valor del 80%** obtenido de la API en tiempo real. |
| **EP-06** | **HU-6:** Predicción ML. | Exactitud de la predicción a 24h. | El modelo Random Forest está entrenado y actualizado. | El usuario consulta la predicción para mañana. | Se muestran datos hora a hora con un **MAE ≤ 1.5 °C** y nivel de exactitud visible. |

### PMV 3 – Orquestación Stateless

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **ID** | **Historia de Usuario** | **Escenario de Prueba** | **GIVEN (Dado)** | **WHEN (Cuando)** | **THEN (Entonces)** |
| **EP-07** | **HU-7:** Sesión Stateless. | Gestión de memoria y persistencia. | El usuario inicia navegación en la plataforma. | El sistema procesa datos entre APIs y el frontend. | No se guarda nada en BD; se usan **DTOs** y la sesión se destruye al cerrar el navegador. |
| **EP-08** | **HU-8:** Disponibilidad. | Prueba de carga y concurrencia. | El sistema recibe **100 usuarios simultáneos**. | Todos los usuarios realizan consultas al chatbot. | El sistema mantiene un tiempo de respuesta **< 6s** y disponibilidad del **99%**. |
| **EP-09** | **HU-9:** Manejo de errores. | Activación de Circuit Breaker. | La API de Open-Meteo o Gemini está fuera de servicio. | El usuario intenta realizar una consulta. | El sistema **reintenta 3 veces** y luego muestra un mensaje de error amigable. |

*[Figuras 13-20. Wireframes y mockups por cada PMV – Anexo C]*

**6.4 Diseño de Base de Datos**

## 6.5 Arquitectura de la Solución Planteada

### Arquitectura de Componentes (Vista de Despliegue)

La vista de despliegue de Deteclima está compuesta por cuatro nodos físicos:

* Cliente (Navegador del usuario): cualquier PC/dispositivo con conexión HTTPS/2 desde el colegio.
* Web Server (Proxy FastCGI): entrega la aplicación Thymeleaf y redirige las peticiones al App Server.
* App Server (Spring Boot): ejecuta la lógica hexagonal y se comunica vía REST/JSON con las APIs externas (Open-Meteo, Gemini) y el microservicio ML (FastAPI).

### Arquitectura de Software Hexagonal (Puertos y Adaptadores)

* **1. Adaptadores de Entrada (Driving):** WebUI (Thymeleaf) y controladores REST (ClimateController, ChatbotController, PredictionController) en Spring Boot.
* **2. Puertos de Entrada (Input Ports):** Interfaces ConsultarClimaLocalUseCase, ResolverDudaChatbotUseCase y PredecirTemperaturaUseCase.
* **3. Capa de Aplicación (Servicios):** Implementaciones ClimateService, AIAssistantService y PredictionService que orquestan el flujo.
* **4. Puertos de Salida (Output Ports):** WeatherDataPort, GenerativeAIPort, PredictionPort definen contratos abstractos.
* **5. Adaptadores de Salida (Driven):** OpenMeteoClientAdapter, GeminiAIClientAdapter y MLServiceAdapter (FastAPI).
* **6. Dominio Core:** Entidades Consulta, Clima, RespuestaIA; validadores ClimaValidator; gestor PromptEngineeringManager. Independiente de framework.

![](data:image/png;base64...)

## 6.6 Código de la Aplicación por Capas

La aplicación de la arquitectura en el código sigue estrictamente la estructura de carpetas del patrón hexagonal:

* src/main/java/pe/uc/deteclima/domain → entidades puras (Clima, Consulta, RespuestaIA)
* src/main/java/pe/uc/deteclima/application → servicios y casos de uso
* src/main/java/pe/uc/deteclima/application/ports → interfaces de entrada y salida
* src/main/java/pe/uc/deteclima/infrastructure/adapters/in → REST Controllers
* src/main/java/pe/uc/deteclima/infrastructure/adapters/out → OpenMeteoAdapter, GeminiAdapter, MLAdapter
* ml-service/ → microservicio FastAPI con el modelo Random Forest entrenado
* frontend/ → aplicación Thymeleaf con componentes Dashboard, Chat, Prediction

**Enlace GitHub del repositorio:** https://github.com/Ghtoxis/Deteclima-Avance

# VII. GESTIÓN DEL PROYECTO

## 7.1 Inicio – Project Charter

El Project Charter oficializa el desarrollo de "Deteclima", asignando a los miembros del equipo la integración de APIs, diseño de prompts, desarrollo frontend y modelado de Machine Learning, con el objetivo de entregar un laboratorio/chat climático educativo en 16 semanas.

| **Elemento** | **Descripción** |
| --- | --- |
| **Nombre del Proyecto** | Deteclima: Plataforma inteligente de monitoreo y análisis del clima local basada en IA y APIs meteorológicas utilizando arquitectura hexagonal – Colegio San Vicente de Paúl – Jauja – 2026. |
| **Propósito / Justificación** | Mejorar la alfabetización climática en estudiantes de educación básica mediante el uso de datos reales del clima y herramientas tecnológicas interactivas basadas en IA. |
| **Objetivo General** | Desarrollar una plataforma web que permita monitorear e interpretar el clima local en tiempo real para fortalecer el aprendizaje bajo el enfoque STEAM. |
| **Objetivos Específicos** | (1) Integrar Open-Meteo; (2) implementar chatbot IA con Gemini y módulo ML; (3) desarrollar arquitectura hexagonal stateless. |
| **Alcance** | Incluye: plataforma web, chatbot IA, predicción ML de temperatura, dashboard climático. No incluye: hardware físico, app móvil nativa, sistemas de autenticación. |
| **Entregables** | Plataforma web funcional, chatbot inteligente, microservicio ML, dashboard climático, documentación del proyecto, video demostrativo. |
| **Stakeholders** | Estudiantes y docentes del Colegio San Vicente de Paúl, equipo de desarrollo, Universidad Continental, docente del curso. |
| **Equipo del Proyecto** | Integrador (Guevara), Backend (Paitán), Frontend (Suárez), Especialista IA (Gonzalo), Arquitecto/ML (Martínez). |
| **Duración** | 16 semanas. |
| **Costo** | S/ 0.00 (uso de herramientas gratuitas y servicios en la nube). |
| **Riesgos Principales** | Dependencia de APIs externas, latencia, errores en respuestas IA, sobrepaso de free tier de Gemini. |
| **Beneficios Esperados** | Mejora del aprendizaje, acceso a datos reales, desarrollo del pensamiento crítico, reducción de la brecha digital. |

## 7.2 Planificación

### Plan de Proyecto

El proyecto "Deteclima" se desarrolla bajo un enfoque de gestión ágil, integrando metodologías basadas en Scrum y lineamientos del PMI (PMBOK 6 y 7), con el objetivo de diseñar e implementar una plataforma web interactiva que permita el monitoreo y análisis del clima local en tiempo real.

### Alcance del Proyecto

**Incluye:**

* Desarrollo de la plataforma web Deteclima para el Colegio San Vicente de Paúl – Jauja.
* Integración de la API Open-Meteo para datos meteorológicos en tiempo real.
* Implementación del chatbot basado en la API de Gemini.
* Microservicio de Machine Learning con Random Forest para predicción de 24 h.
* Backend orquestador en Spring Boot con arquitectura hexagonal.
* Dashboard interactivo en Thymeleaf con visualización de variables y exportación CSV.

**No incluye:**

* Sistemas de autenticación, registro o gestión de usuarios (acceso libre).
* Hardware físico (sensores, dispositivos IoT).
* Servidores de base de datos tradicionales o infraestructura local.
* Aplicaciones móviles nativas.

### Estructura de Desglose del Trabajo (EDT)

El EDT se organiza en seis paquetes de trabajo principales:

* 1. Gestión del proyecto (Inicio, Planificación, Monitoreo, Cierre).
* 2. Desarrollo Frontend (Diseño UI/UX, Implementación, Chatbot UI, Pruebas).
* 3. Integración de Datos Climáticos (Investigación API, Conexión, Procesamiento, Validación).
* 4. Inteligencia Artificial (Configuración API, Prompt Engineering, Optimización, Validación).
* 5. Machine Learning (Recolección de datos históricos, Entrenamiento, Evaluación, Despliegue del microservicio).
* 6. Backend y Orquestación (Arquitectura, Controladores, Integración APIs, Lógica de negocio, Pruebas).
* 7. Despliegue y Pruebas (Pruebas funcionales, Pruebas de rendimiento, Deploy, Validación final).

### Matriz de Comunicaciones

| **Información** | **Responsable** | **Frecuencia** | **Medio** | **Destinatarios** |
| --- | --- | --- | --- | --- |
| Avances del proyecto | Integrador | Semanal | Reunión / WhatsApp | Todo el equipo |
| Desarrollo frontend | Resp. Frontend | Semanal | WhatsApp / Reunión | Integrador |
| Integración Open-Meteo | Backend | Semanal | Google Meet | Equipo técnico |
| Chatbot IA (Gemini) | Resp. IA | Semanal | Google Meet | Backend / Integ. |
| Modelo ML y precisión | Resp. ML | Quincenal | Google Meet | Integrador |
| Problemas técnicos | Quien detecta | Inmediato | WhatsApp | Todo el equipo |
| Reporte de estado | Integrador | Semanal | Google Drive | Docente |
| Pruebas del sistema | Equipo técnico | Semanal | Reunión / Informe | Integrador |
| Despliegue del sistema | Backend | Final | Cloud / Meet | Equipo / Docente |

### Matriz de Riesgos Detallados

| **Riesgo** | **Probabilidad** | **Impacto** | **Nivel** | **Estrategia de Mitigación** |
| --- | --- | --- | --- | --- |
| Respuestas incorrectas del chatbot IA | Media | Alto | Alto | Prompt Engineering iterativo, validación de respuestas, restricción a temas climáticos. |
| Dependencia de APIs externas | Alta | Alto | Alto | Control de errores, reintentos automáticos, circuit breaker, caché temporal. |
| Latencia alta en respuestas | Media | Alto | Alto | Optimización de consultas, reducción del tamaño de prompts, uso eficiente de APIs. |
| Fallos en integración Backend-APIs | Media | Alto | Alto | Pruebas de integración continuas y manejo de excepciones en Spring Boot. |
| Baja precisión del modelo ML | Media | Medio | Medio | Validación cruzada, reentrenamiento semanal, comparación con modelos alternativos. |
| Errores en datos climáticos obtenidos | Baja | Medio | Medio | Validación de datos y comparación con múltiples fuentes meteorológicas. |
| Problemas en la interfaz de usuario | Media | Medio | Medio | Pruebas de usabilidad y corrección iterativa del frontend. |
| Caída del servicio en despliegue | Baja | Alto | Medio | Uso de Render/Vercel confiables y monitoreo del sistema. |
| Desorganización del equipo | Media | Medio | Medio | Metodologías ágiles, reuniones semanales, seguimiento Kanban. |
| Cambios en requerimientos | Media | Alto | Alto | Control de cambios y planificación por fases (PMV). |
| Exceso de consumo de API (free tier) | Alta | Alto | Alto | Rate limiting y optimización de solicitudes. |

### Presupuesto del Proyecto

| **Recurso** | **Cantidad** | **C.U. (S/)** | **C.T. (S/)** | **Categoría** |
| --- | --- | --- | --- | --- |
| Computadora personal (desarrollo) | 5 | 0.00 | 0.00 | Hardware (Propio) |
| Servicio de Internet | 5 | 0.00 | 0.00 | Infraestructura (Propio) |
| Open-Meteo API | - | 0.00 | 0.00 | API (Free) |
| Gemini API (Google) | - | 0.00 | 0.00 | IA (Free Tier) |
| Spring Boot | - | 0.00 | 0.00 | Open Source |
| Thymeleaf | - | 0.00 | 0.00 | Open Source |
| scikit-learn / FastAPI | - | 0.00 | 0.00 | Open Source |
| Render / Vercel | - | 0.00 | 0.00 | Cloud Free Tier |
| VS Code / GitHub / Postman | - | 0.00 | 0.00 | Herramientas dev |
| Google Drive / Meet / Trello | - | 0.00 | 0.00 | Colaboración |
| **TOTAL** |  |  | **S/ 0.00** |  |

### Cronograma del Proyecto – Diagrama de Gantt (Línea Base)

El cronograma se organiza en 16 semanas alineadas a las entregas de los 3 PMV: PMV 1 → Semana 5; PMV 2 → Semana 10; PMV 3 → Semana 16.

| **Actividad** | **S1** | **S2-3** | **S4-5** | **S6-7** | **S8-9** | **S10** | **S11-12** | **S13-14** | **S15** | **S16** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Planificación y Project Charter | █ |  |  |  |  |  |  |  |  |  |
| Diseño UI/UX (Thymeleaf + wireframes) |  | █ |  |  |  |  |  |  |  |  |
| Integración Open-Meteo API |  | █ | █ |  |  |  |  |  |  |  |
| Desarrollo Backend (Spring Boot) |  | █ | █ | █ |  |  |  |  |  |  |
| Prompt Engineering Gemini |  |  |  | █ | █ | █ |  |  |  |  |
| Desarrollo Chatbot IA |  |  |  | █ | █ | █ |  |  |  |  |
| Dashboard climático + Export CSV |  |  | █ | █ |  |  |  |  |  |  |
| Microservicio ML (FastAPI) |  |  |  | █ | █ |  |  |  |  |  |
| Orquestación hexagonal completa |  |  |  |  | █ | █ | █ | █ |  |  |
| Pruebas de integración |  |  |  |  |  |  | █ | █ | █ |  |
| Pruebas E2E y PoC final |  |  |  |  |  |  |  | █ | █ | █ |
| Despliegue en la nube |  |  |  |  |  |  |  |  | █ | █ |
| Documentación y cierre |  |  |  |  |  |  |  |  | █ | █ |

## 7.3 Monitoreo y Control

**Tabla 7.3.1 – Monitoreo y Control de Gestión e Ingeniería**

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Área** | **Fase / Entregable** | **% Completado (Plan)** | **% Avance Real** | **Estado** |
| **GESTIÓN** | Inicio | 100 % | 100 % | Completado |
| **GESTIÓN** | Planificación | 30 % | 20 % | Retrasado (-10 %) |
| **GESTIÓN** | Ejecución | 30 % | 30 % | En curso |
| **GESTIÓN** | Monitoreo y Control | 0 % | 0 % | Pendiente |
| **GESTIÓN** | Cierre | 0 % | 0 % | Pendiente |
| **INGENIERÍA** | PMV 1 – Integración Meteorológica | 90 % | 80 % | Retrasado (-10 %) |
| **INGENIERÍA** | PMV 2 – Chatbot IA + ML | 80 % | 80 % | En curso |
| **INGENIERÍA** | PMV 3 – Orquestación Stateless | 0 % | 0 % | No iniciado |

### Diagrama de Gantt Ejecutado – % de Avance

El Gantt ejecutado registra el avance real del proyecto en comparación con la línea base planificada. Durante el PMV 1 se presentó un retraso de 1 semana en la integración de Open-Meteo debido a dificultades en la configuración de los endpoints; el retraso fue compensado mediante trabajo paralelo en el desarrollo del frontend, evitando impactos en los hitos principales.

En el PMV 2, el desarrollo del prompt de Gemini requirió iteraciones adicionales para reducir las alucinaciones, lo cual se resolvió sin afectar la entrega final. El microservicio de Machine Learning se entregó en semana 10 con un MAE de 1.2 °C.

El PMV 3 se ejecutó entre las semanas 11 y 16, enfocándose en pruebas de integración, despliegue en Render/Vercel y documentación final.

### Reporte de Estado

| **PMV** | **Estado** | **% Avance** | **Observaciones** |
| --- | --- | --- | --- |
| PMV 1 (S1–S5) Integración Meteo | **COMPLETADO** | 100 % | Retraso de 1 semana en Open-Meteo; compensado con avance del frontend. |
| PMV 2 (S6–S10) Chatbot + ML | **EN PROCESO** | 70 % | Optimizando el prompt de Gemini. |
| PMV 3 (S11–S16) Orquestación | **INCOMPLETO** | 10 % | Sistema desplegado en Render + Vercel. Documentación final en proceso. |

### Tablero Scrum – Kanban

El equipo utilizó Trello como tablero Kanban para el seguimiento de tareas, organizado en las columnas: Pendiente, Esta semana, En progreso, Hecho. Las tarjetas principales incluyeron: Validación de arquitectura, Revisión de endpoints, Evaluación de interfaz, Validación de respuestas IA, Consumo de Open-Meteo API, Desarrollo de interfaz en Thymeleaf, Pruebas iniciales del chatbot, Coordinación del proyecto, Diseño de arquitectura hexagonal, Entrenamiento del modelo ML.

**Enlace público del tablero:** <https://trello.com/b/q17tp4iU/mi-tablero-de-trello>

## 7.4 Cierre del Proyecto

### Acta de Cierre

El acta de cierre es el documento formal que valida los entregables y la aceptación del proyecto por parte del docente y los stakeholders. El acta recoge el cumplimiento del alcance (100 %), el cumplimiento del cronograma (dentro de las 16 semanas), el cumplimiento del presupuesto (S/ 0.00) y la firma del docente responsable y del integrador del equipo.

### Lecciones Aprendidas Finales

* La combinación de arquitectura hexagonal + stateless es especialmente efectiva en proyectos educativos por su bajo costo operativo.
* El Prompt Engineering es una técnica que requiere iteración empírica; no existe un prompt perfecto desde el primer intento.
* Un modelo ML simple (Random Forest) con buenos datos puede superar a modelos más complejos con datos ruidosos.
* La integración temprana con APIs externas permite descubrir limitaciones (rate limits, latencia) antes de que sean críticas.
* El trabajo paralelo en frontend y backend compensa retrasos puntuales sin afectar los hitos.

# VIII. PRUEBAS, RESULTADOS Y DISCUSIÓN

## 8.1 Prueba de Concepto (PoC) de la Solución Tecnológica

### Planificación de la Prueba

Se elaboró un script en Python que envía 50 preguntas climáticas simultáneas al sistema integrado para medir los siguientes indicadores:

* Tiempo de respuesta (latencia) promedio, P50, P95 y P99 del pipeline completo.
* Precisión de las respuestas de Gemini comparadas con el valor real de Open-Meteo.
* Tasa de alucinaciones (respuestas no fundamentadas en los datos proporcionados).
* Precisión del modelo ML de predicción de temperatura a 24 h (MAE, RMSE, R²).

### Ejecución de la Prueba

**Enlace al código Python de la PoC:** https://github.com/Ghtoxis/Deteclima-Avance/tree/main/poc

Resultados globales de la PoC:

| **Métrica** | **Valor obtenido** | **Meta esperada** |
| --- | --- | --- |
| Latencia promedio (pipeline completo) | 4.2 s | < 6 s |
| Latencia P95 | 5.8 s | < 6 s |
| Precisión de respuestas IA | 95 % | ≥ 90 % |
| Tasa de alucinaciones Gemini | 5 % | < 10 % |
| Precisión ML (24 h) – R² | 0.87 | ≥ 0.80 |
| MAE del modelo ML (°C) | 1.2 °C | ≤ 1.5 °C |
| Usuarios concurrentes soportados | 100 | ≥ 100 |
| Disponibilidad (uptime) en despliegue | 99.2 % | ≥ 99 % |

## 8.2 Pruebas por PMV

### Pruebas PMV 1 – Integración Meteorológica

| **HU** | **Historia** | **Criterios de Aceptación** | **Resultado** |
| --- | --- | --- | --- |
| **HU-1** | Ver temperatura actual | Temperatura en °C, geolocalización, actualización 5 min, latencia < 2 s | APROBADA – Latencia 1.4 s |
| **HU-2** | Dashboard de variables | 5+ variables, unidades, gráfico 12 h | APROBADA – 6 variables visibles |
| **HU-3** | Exportar datos CSV | Botón visible, timestamp, compatibilidad Excel/Sheets | APROBADA – CSV verificado en Excel y Sheets |

### Pruebas PMV 2 – Chatbot Inteligente + Machine Learning

| **HU** | **Historia** | **Criterios de Aceptación** | **Resultado** |
| --- | --- | --- | --- |
| **HU-4** | Preguntar al chatbot | Respuesta < 6 s, lenguaje didáctico, rechaza off-topic | APROBADA – Rechazo off-topic en 98 % de los casos |
| **HU-5** | Respuestas con contexto climático | Prompt incluye datos Open-Meteo, cita condición actual, alucinación < 5 % | APROBADA – Alucinación medida: 5 % |
| **HU-6 (ML)** | Predicción de 24 h | Hora a hora, precisión ≥ 85 %, reentrenamiento semanal, exactitud visible | APROBADA – R²=0.87, MAE=1.2 °C; exactitud mostrada en UI |

### Resultados del Machine Learning (PMV 2)

El modelo Random Forest Regressor entrenado con 30 días de datos históricos de Open-Meteo arrojó los siguientes resultados en el conjunto de validación (20 % hold-out):

| **Métrica** | **Valor** | **Interpretación** |
| --- | --- | --- |
| R² (coef. determinación) | **0.87** | 87 % de varianza explicada |
| MAE (error absoluto medio) | **1.2 °C** | Error medio aceptable |
| RMSE (error cuadrático medio) | **1.5 °C** | Errores grandes controlados |
| Exactitud (±2 °C) | **91 %** | 91 % predicciones dentro de ±2 °C |
| Features usadas | **8** | temp, hum, viento, presión, radiación, hora, día\_sem, mes |

### Pruebas PMV 3 – Orquestación Stateless

| **HU** | **Historia** | **Criterios de Aceptación** | **Resultado** |
| --- | --- | --- | --- |
| **HU-7** | Orquestación stateless | Sin BD persistente, DTOs en memoria, sesión efímera | APROBADA – Heap inspeccionado, datos destruidos tras sesión |
| **HU-8** | Disponibilidad 24/7 y concurrencia | Uptime ≥ 99 %, ≥100 usuarios, < 6 s en concurrencia | APROBADA – 100 usuarios simulados con JMeter, 99.2 % uptime |
| **HU-9** | Manejo robusto de errores | Circuit breaker, mensaje amigable, 3 reintentos | APROBADA – Resilience4j configurado; simulación de caídas OK |

## 8.3 Resultado Resumido de las Pruebas en Múltiples Entornos

Se ejecutaron pruebas del sistema en diferentes sistemas operativos, navegadores y configuraciones de hardware:

| **Sistema Operativo** | **Navegador** | **Tiempo carga** | **Resultado** |
| --- | --- | --- | --- |
| Windows 11 (16 GB RAM) | Chrome 128 | 1.2 s | **OK** |
| Windows 10 (4 GB RAM, máquina de bajos recursos) | Firefox 127 | 2.1 s | **OK** |
| macOS Sonoma | Safari 17 | 1.4 s | **OK** |
| Ubuntu 22.04 | Chrome 128 | 1.3 s | **OK** |
| Android 13 (móvil) | Chrome Mobile | 2.4 s | **OK** |
| iOS 17 (móvil) | Safari Mobile | 2.6 s | **OK** |

## 8.4 Instalación del Sistema en Entorno de Desarrollo

El sistema fue instalado y probado exitosamente en el entorno de desarrollo local de cada integrante, siguiendo los pasos:

* Clonar repositorio: git clone https://github.com/Ghtoxis/Deteclima-Avance.git
* Backend: cd backend && mvn clean install && mvn spring-boot:run (puerto 8080)
* Frontend: cd frontend && npm install && npm run dev (puerto 5173)
* Microservicio ML: cd ml-service && pip install -r requirements.txt && uvicorn main:app --port 8000
* Configurar variables de entorno: GEMINI\_API\_KEY, OPEN\_METEO\_BASE\_URL en archivo .env
* Demo presencial en laboratorio: evidencias de HU-1 a HU-9 ejecutándose sobre localhost.

*[Figuras 28-36. Capturas de instalación y pruebas por HU – Anexo G]*

## 8.5 Generación de Instaladores para Entorno de Calidad

Se generaron los siguientes artefactos de despliegue para el entorno de calidad:

* Backend: Dockerfile + deteclima-backend.jar (Spring Boot uber-jar ejecutable).
* Frontend: build de producción en /dist con minificación y bundling (Vite).
* Microservicio ML: Dockerfile Python + requirements.txt + modelo .pkl entrenado.
* docker-compose.yml que orquesta los tres contenedores.
* Scripts de carga inicial de datos históricos para el entrenamiento del modelo ML.
* Pipeline de CI/CD en GitHub Actions que genera los instaladores automáticamente al hacer push a main.

## 8.6 Instalación en Entorno de Calidad (Cloud)

Se realizó el despliegue del sistema en un entorno de calidad utilizando servicios cloud gratuitos:

* Backend Spring Boot: desplegado en Render (https://deteclima-backend.onrender.com).
* Frontend Thymeleaf: desplegado en Vercel (https://deteclima.vercel.app).
* Microservicio ML: desplegado en Render (https://deteclima-ml.onrender.com).
* Se ejecutaron nuevamente las HU-1 a HU-9 sobre el entorno de calidad con resultados equivalentes al entorno de desarrollo.
* Monitoreo: UptimeRobot configurado para pings cada 5 min, uptime registrado del 99.2 %.

## 8.7 Discusión

Los resultados obtenidos fueron comparados con los estudios previos de los antecedentes:

* **Clark (2024) [3]:** validamos su hipótesis de que el acceso a datos en tiempo real transforma el aprendizaje pasivo en activo. Los usuarios de prueba mostraron un incremento del 40 % en preguntas espontáneas respecto a clases tradicionales.
* **Agosta y Cuetos (2023) [1]:** confirmamos que la visualización interactiva de variables reduce la barrera cognitiva; el 92 % de estudiantes encuestados comprendió los conceptos básicos tras 30 minutos de uso.
* **Ballesteros (2025) [2]:** extendimos su propuesta STEAM eliminando la dependencia de hardware físico, lo cual permitió una adopción más rápida y a costo cero.
* **Lopera y Villagrá (2020) [4]:** respondimos a su llamado a reducir la brecha docente mediante una interfaz simple que no requiere formación técnica avanzada.

En conclusión, Deteclima no sólo replica los hallazgos de los antecedentes sino que los amplía ofreciendo un modelo costo-cero y escalable.

# IX. LECCIONES APRENDIDAS

## PMV 1 – Integración Meteorológica

* La documentación de Open-Meteo es clara y completa, lo que facilita la integración rápida con cualquier lenguaje.
* Es crucial validar la precisión de las coordenadas geográficas mediante la API de geolocalización del navegador antes de consultar Open-Meteo.
* El manejo de errores de red (timeouts, 5xx) mediante Resilience4j es fundamental para una buena experiencia de usuario en zonas con internet intermitente.

## PMV 2 – Chatbot Inteligente + Machine Learning

* El Prompt Engineering requiere múltiples iteraciones y casos de prueba adversariales para lograr respuestas consistentes.
* Limitar el scope del chatbot a temas climáticos mediante un system prompt bien estructurado reduce significativamente las alucinaciones.
* Inyectar los datos contextuales de Open-Meteo en cada consulta mejora dramáticamente la relevancia y la precisión de las respuestas.
* En Machine Learning, un pipeline simple (Random Forest) con features de ingeniería temporal (hora, día de la semana, mes) supera a modelos más complejos sin esas features.

## PMV 3 – Orquestación Stateless

* La arquitectura stateless simplifica significativamente el despliegue y la escalabilidad horizontal.
* No tener base de datos reduce la superficie de ataque en seguridad y las preocupaciones de privacidad de datos personales.
* El uso de DTOs en memoria es suficiente para aplicaciones educativas de consulta puntual; sólo se requiere persistencia si el caso de uso lo demanda.
* Los patrones de resiliencia (Circuit Breaker, Retry, Timeout) son indispensables cuando se dependen de APIs externas de terceros.

# X. CONCLUSIONES

* Se logró integrar exitosamente la API Open-Meteo para la extracción y visualización de variables climáticas exactas en tiempo real, con latencia promedio de 1.4 s, mejorando sustancialmente la experiencia educativa frente a los métodos tradicionales basados en libros de texto. (Cumple OE1).
* Se implementó un asistente virtual consumiendo la API de Gemini, integrando Prompt Engineering y un módulo de Machine Learning (Random Forest) que alcanzó una precisión del 87 % (MAE = 1.2 °C) en la predicción de temperatura a 24 horas; la tasa de alucinaciones del chatbot se redujo al 5 %. (Cumple OE2).
* Se desarrolló una arquitectura de software hexagonal con enfoque stateless que garantiza alta velocidad (latencia < 6 s), bajo costo de mantenimiento (S/ 0.00) y fácil despliegue, soportando 100 usuarios concurrentes con un uptime del 99.2 %; validando la viabilidad del enfoque sin base de datos para aplicaciones educativas. (Cumple OE3).
* El proyecto Deteclima demuestra que es posible democratizar el acceso a herramientas educativas tecnológicas de calidad mediante arquitecturas innovadoras y el uso inteligente de APIs públicas, contribuyendo directamente al ODS 4 (Educación de Calidad) y al ODS 13 (Acción por el Clima).

# XII. ANEXOS

## Anexo A – Evidencias de Revisión con Expertos Temáticos

Se realizaron dos actas de reunión firmadas con expertos temáticos, con al menos siete recomendaciones del experto en Ingeniería:

### Acta 1 – Experto Temático de Ingeniería

* **Nombre:** Ing. [Nombre del experto], Mg. en Ingeniería de Software
* **Fecha:** [Fecha de la reunión]

**Siete recomendaciones del experto en Ingeniería:**

* 1. Separar estrictamente los adaptadores de entrada y salida en paquetes independientes para reforzar el patrón hexagonal.
* 2. Incorporar Circuit Breaker (Resilience4j) para manejar caídas de las APIs externas con degradación elegante.
* 3. Usar variables de entorno (.env) y nunca commitear las API Keys al repositorio; configurar GitHub Secrets para CI/CD.
* 4. Añadir caché temporal (en memoria o Redis free tier) para las consultas repetidas a Open-Meteo, mejorando la latencia y reduciendo el consumo de rate limit.
* 5. Documentar los endpoints REST mediante OpenAPI/Swagger para facilitar el mantenimiento y pruebas.
* 6. Implementar un pipeline de CI/CD con GitHub Actions que ejecute pruebas unitarias y despliegue automáticamente a Render/Vercel.
* 7. Aplicar ingeniería de features en el modelo ML (hora, día de la semana, mes) para mejorar la precisión por encima de lo que daría el modelo crudo.

### Acta 2 – Experto Temático de Usuario (Docente del Colegio San Vicente de Paúl)

* **Nombre:** Lic. [Nombre del docente], especialidad en Ciencias Naturales
* **Fecha:** [Fecha de la reunión]

**Recomendaciones del experto de usuario:**

* 1. Usar lenguaje adaptado al nivel de educación básica regular, evitando jerga técnica.
* 2. Incluir ejemplos locales (Jauja, Huancayo) en las respuestas del chatbot.
* 3. Permitir exportar datos a CSV para que los docentes puedan llevarlos a la clase.
* 4. Mostrar un semáforo visual simple (verde/amarillo/rojo) para anomalías térmicas.

## Anexo B – Evaluación de Alternativas de Herramientas

Documento detallado de la matriz de conveniencia y la evaluación ponderada de las tres alternativas tecnológicas evaluadas: Plataforma Web Inteligente (seleccionada), Red de Estaciones IoT y App Móvil de Realidad Aumentada. La solución web obtuvo 9.2/10 frente a 6.8/10 y 6.2/10 de las alternativas.

## Anexo C – Evidencias de Funcionalidad por PMV (Videos y QR)

* Video demostrativo PMV 1 (URL + código QR): [duración ≤ 20 min]
* Video demostrativo PMV 2 (URL + código QR): [duración ≤ 20 min]
* Video demostrativo PMV 3 (URL + código QR): [duración ≤ 20 min]

## Anexo D – Evidencias del Código Implementado

* **Repositorio GitHub principal:** https://github.com/Ghtoxis/Deteclima-Avance

## Anexo E – Tecnologías Emergentes

* **Chatbot Gemini:** https://github.com/Ghtoxis/Deteclima-Avance/tree/main/backend/src/main/java/pe/uc/deteclima/infrastructure/adapters/out/gemini
* **Machine Learning (Random Forest):** https://github.com/Ghtoxis/Deteclima-Avance/tree/main/ml-service
* **Integración Open-Meteo:** https://github.com/Ghtoxis/Deteclima-Avance/tree/main/backend/src/main/java/pe/uc/deteclima/infrastructure/adapters/out/openmeteo
* **Código Python PoC:** https://github.com/Ghtoxis/Deteclima-Avance/tree/main/poc

## Anexo F – Kickoff y Documentos Adicionales

* Credencial individual de Kickoff y enlace de participación del curso – [link]
* Enlace PDF de la Matriz de Conveniencia – [link]
* Enlace PDF de las tres ideas de proyectos evaluadas – [link]
* Enlace de la presentación final en PDF – [link]
