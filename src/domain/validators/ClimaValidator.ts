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
