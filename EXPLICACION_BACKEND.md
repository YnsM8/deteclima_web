# 🎤 Guion de Explicación: Lógica de Backend (Deteclima)

Este documento es una guía para explicar cómo funciona tu código de backend. Está dividido por archivos clave.

---

## 1. ClimateService.ts (El Cerebro Validador)

### 🧠 Concepto Simple
Es como un **filtro de seguridad** en la entrada de un edificio. Antes de dejar pasar a alguien (la petición), revisa si su identificación (las coordenadas) es válida.

### 💻 El Código (Resumen)
```typescript
async execute(lat: number, lon: number): Promise<Clima> {
    if (!validateCoordinates(lat, lon)) {
      throw new Error(`Coordenadas inválidas...`);
    }
    return this.weatherPort.getCurrentWeather(lat, lon);
}
```

### 🛠️ Explicación Técnica (Lo que debes decir)
*   **"Inyección de Dependencia":** "Uso un `weatherPort` que es una interfaz. Esto significa que mi servicio no sabe si el clima viene de Google, OpenMeteo o una base de datos; solo sabe que tiene un 'contrato' que le permite pedir datos".
*   **"Validación de Dominio":** "Llamo a `validateCoordinates` para asegurar que los datos son correctos antes de procesar nada. Si la latitud o longitud están fuera de rango, el código se detiene inmediatamente".

---

## 2. SupabaseAdapter.ts (El Conector a Base de Datos)

### 🧠 Concepto Simple
Es el **traductor**. La aplicación habla en "objetos de TypeScript" y la base de datos habla en "tablas de SQL". Este archivo traduce y guarda la información.

### 🛠️ Explicación Técnica (Lo que debes decir)
*   **"Persistencia de Datos":** "Este adaptador implementa el puerto `DatabasePort`. Se encarga de hacer operaciones asíncronas (`async/await`) para insertar datos en tablas como `weather_queries` y `chat_messages`".
*   **"Seguridad en el Servidor":** "Uso `supabaseAdmin`, que es un cliente privilegiado que solo existe en el servidor para evitar que las llaves secretas se filtren al navegador".

---

## 3. ChatbotService.ts (El Filtro de Inteligencia Artificial)

### 🧠 Concepto Simple
Es un **entrenador personal** para la IA. Le da un manual de reglas: "Solo puedes hablar de clima, usa lenguaje para estudiantes y sé un experto en meteorología peruana".

### 🛠️ Explicación Técnica (Lo que debes decir)
*   **"System Prompt":** "Configuro el comportamiento del modelo mediante un 'prompt de sistema'. Esto garantiza que la IA no se salga de su rol educativo".
*   **"Ahorro de Recursos":** "Antes de llamar a la API de Inteligencia Artificial, paso el mensaje por un validador local. Si el usuario pregunta algo irrelevante, el backend lo bloquea antes de gastar tokens".

---

## 🏁 Conclusión Maestra (Para cerrar con broche de oro)
> "Mi trabajo garantiza que el núcleo de la aplicación sea **robusto** y **escalable**. He separado las reglas de negocio de las herramientas externas, lo que nos permitiría cambiar de base de datos o de proveedor de clima en el futuro sin tener que reescribir todo el sistema."
