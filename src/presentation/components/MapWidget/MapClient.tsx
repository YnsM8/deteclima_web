'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';

// Icono personalizado por defecto para solucionar bugs de Next.js
const createWeatherIcon = (temp: number | null) => {
  let color = '#3b82f6'; // blue
  if (temp !== null) {
    if (temp > 25) color = '#ef4444'; // red
    else if (temp > 15) color = '#f59e0b'; // amber
    else if (temp < 5) color = '#8b5cf6'; // purple (cold)
  }

  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; items-center; justify-center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
        <div style="transform: rotate(45deg); color: white; font-size: 10px; font-weight: bold; margin-bottom: 2px;">
          ${temp !== null ? Math.round(temp) + '°' : '?'}
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
};


const CITIES = [
  { id: 'jauja', name: 'Jauja', lat: -11.775, lon: -75.497 },
  { id: 'huancayo', name: 'Huancayo', lat: -12.065, lon: -75.204 },
  { id: 'concepcion', name: 'Concepción', lat: -11.916, lon: -75.316 },
  { id: 'tarma', name: 'Tarma', lat: -11.419, lon: -75.690 },
  { id: 'la_oroya', name: 'La Oroya', lat: -11.520, lon: -75.908 }
];

interface MapClientProps {
  lat: number;
  lon: number;
  setCoordinates: (lat: number, lon: number) => void;
  isFreeMode: boolean;
}

function MapClickHandler({ isFreeMode, setCoordinates }: { isFreeMode: boolean, setCoordinates: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      if (isFreeMode) {
        const { lat, lng } = e.latlng;
        setCoordinates(lat, lng);
      }
    },
  });
  return null;
}

export default function MapClient({ lat, lon, setCoordinates, isFreeMode }: MapClientProps) {
  const [cityWeather, setCityWeather] = useState<Record<string, number | null>>({});

  useEffect(() => {
    async function fetchCityWeather() {
      const weatherData: Record<string, number | null> = {};
      for (const city of CITIES) {
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
          if (res.ok) {
            const data = await res.json();
            weatherData[city.id] = data.current_weather.temperature;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setCityWeather(weatherData);
    }
    fetchCityWeather();
  }, []);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-[var(--color-border)] relative">
      <MapContainer 
        center={[lat, lon]} 
        zoom={9} 
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%', background: '#f1f5f9' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapClickHandler isFreeMode={isFreeMode} setCoordinates={setCoordinates} />

        {/* Dynamic Marker for Free Mode */}
        {isFreeMode && (
          <Marker 
            position={[lat, lon]}
            icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })}
          >
            <Popup>
              <div className="text-xs font-bold">Ubicación Manual</div>
              <div className="text-[10px] opacity-70">{lat.toFixed(4)}, {lon.toFixed(4)}</div>
            </Popup>
          </Marker>
        )}

        {/* Predefined City Markers */}
        {!isFreeMode && CITIES.map((city) => (
          <Marker 
            key={city.id}
            position={[city.lat, city.lon]} 
            icon={createWeatherIcon(cityWeather[city.id] || null)}
            eventHandlers={{
              click: () => {
                setCoordinates(city.lat, city.lon);
              },
            }}
          >
            <Popup className="text-black">
              <strong className="text-gray-800">{city.name}</strong><br/>
              Temp: {cityWeather[city.id] !== undefined ? `${cityWeather[city.id]}°C` : 'Cargando...'}
              <br/>Click para ver detalle.
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
