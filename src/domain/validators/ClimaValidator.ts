const CLIMATE_KEYWORDS = [
  'clima', 'tiempo', 'temperatura', 'humedad', 'viento', 'lluvia',
  'presión', 'nube', 'sol', 'tormenta', 'pronóstico', 'weather',
  'calor', 'frío', 'precipitación', 'radiación', 'atmósfera',
  'meteorología', 'estación', 'helada', 'granizo', 'sequía',
  'inundación', 'cambio climático', 'efecto invernadero', 'ozono',
  'ciclón', 'huracán', 'monzón', 'brisa', 'neblina', 'niebla',
];

export function isClimateRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return CLIMATE_KEYWORDS.some((kw) => lower.includes(kw));
}

export function validateCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function validateTemperature(temp: number): boolean {
  return temp >= -90 && temp <= 60;
}

export function sanitizeInput(text: string): string {
  // Limitar longitud a 400 caracteres
  let sanitized = text.trim().slice(0, 400);
  // Eliminar etiquetas HTML o scripts
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  return sanitized;
}

export function hasPromptInjectionPattern(text: string): boolean {
  const lowerText = text.toLowerCase();
  const injectionKeywords = [
    'ignore previous', 'ignore the previous', 'ignora las', 'ignora los',
    'instrucciones anteriores', 'system prompt', 'prompt del sistema',
    'forget the rules', 'forget previous instructions', 'olvida las reglas',
    'acting as', 'actúa como', 'you are now', 'ahora eres',
    'override', 'sobreescribe', 'jailbreak', 'system_prompt'
  ];
  return injectionKeywords.some((keyword) => lowerText.includes(keyword));
}

