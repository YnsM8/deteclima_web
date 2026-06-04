export interface RecomendacionAgricola {
  nivel: 'bajo' | 'leve' | 'moderado' | 'alto';
  color: string;
  titulo: string;
  descripcion: string;
  acciones: string[];
}

export function obtenerRecomendacionPorTemperatura(minTemp: number): RecomendacionAgricola {
  if (minTemp <= 0) {
    return {
      nivel: 'alto',
      color: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
      titulo: 'Riesgo Alto de Helada (Temperatura Crítica)',
      descripcion: `Se pronostican temperaturas bajo cero (mínima de ${minTemp.toFixed(1)}°C). Los cultivos sufrirán daños graves por congelación celular.`,
      acciones: [
        'Riego de defensa: Active riego por aspersión durante la madrugada. El agua al congelarse libera calor latente que protege las plantas.',
        'Calefacción controlada: De ser posible, use calentadores o fogatas controladas con paja húmeda para crear una nube protectora de humo.',
        'Manta térmica urgente: Cubra almácigos y hortalizas de alto valor con mantas térmicas o plástico.',
        'Cosecha anticipada: Si los cultivos principales (como papa) ya alcanzaron madurez comercial, considere cosechar de inmediato.'
      ]
    };
  } else if (minTemp <= 2) {
    return {
      nivel: 'moderado',
      color: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
      titulo: 'Riesgo Moderado de Helada',
      descripcion: `Se esperan temperaturas muy bajas (mínima de ${minTemp.toFixed(1)}°C). Se requiere prevención activa para proteger la producción.`,
      acciones: [
        'Humidificación del suelo: Riegue el suelo un día antes para aumentar su capacidad de retención de calor solar.',
        'Uso de mulching o paja: Cubra la base de las plantas con restos orgánicos o paja para aislar el calor del suelo.',
        'Barreras contra el viento: Instale cortinas rompevientos temporales para evitar que el aire helado se estanque en las partes bajas del cultivo.'
      ]
    };
  } else if (minTemp <= 5) {
    return {
      nivel: 'leve',
      color: 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30',
      titulo: 'Riesgo Leve (Monitoreo Recomendado)',
      descripcion: `Temperaturas bajas en el rango de ${minTemp.toFixed(1)}°C. Adecuado para preparar medidas preventivas ligeras.`,
      acciones: [
        'Monitoreo constante: Esté atento a los sensores o reportes meteorológicos durante la medianoche y madrugada.',
        'Nutrición y bioestimulación: Aplique abonos foliares con alto contenido de potasio o aminoácidos para robustecer los cultivos frente al frío.',
        'Evitar deshierbe: No limpie las malezas en los surcos durante estos días; éstas ayudan a retener calor en el nivel del suelo.'
      ]
    };
  } else {
    return {
      nivel: 'bajo',
      color: 'text-green-400 bg-green-950/40 border-green-500/30',
      titulo: 'Sin Riesgo de Helada',
      descripcion: `La temperatura mínima pronostatica (${minTemp.toFixed(1)}°C) es segura para la mayoría de cultivos locales de Jauja.`,
      acciones: [
        'Labores habituales: Continúe con el manejo agronómico programado.',
        'Planificación: Aproveche el buen clima para realizar deshierbe, fertilización regular y mantenimiento de canales de riego.'
      ]
    };
  }
}
