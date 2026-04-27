'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono personalizado por defecto para solucionar bugs de Next.js
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CITIES = [
  { id: 'jauja', name: 'Jauja', lat: -11.775, lon: -75.497 },
  { id: 'huancayo', name: 'Huancayo', lat: -12.065, lon: -75.204 },
  { id: 'concepcion', name: 'Concepción', lat: -11.916, lon: -75.316 }
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
        setCoordinates(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapClient({ lat, lon, setCoordinates, isFreeMode }: MapClientProps) {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden glass border border-[var(--color-border)] isolate">
      <MapContainer 
        center={[lat, lon]} 
        zoom={10} 
        style={{ height: '100%', width: '100%', background: '#0a0f1e' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapClickHandler isFreeMode={isFreeMode} setCoordinates={setCoordinates} />

        {/* Dynamic Marker for Free Mode */}
        {isFreeMode && (
          <Marker position={[lat, lon]} icon={defaultIcon}>
            <Popup>
              Punto seleccionado <br/> Lat: {lat.toFixed(3)}, Lon: {lon.toFixed(3)}
            </Popup>
          </Marker>
        )}

        {/* Predefined City Markers */}
        {!isFreeMode && CITIES.map((city) => (
          <Marker 
            key={city.id}
            position={[city.lat, city.lon]} 
            icon={defaultIcon}
            eventHandlers={{
              click: () => {
                setCoordinates(city.lat, city.lon);
              },
            }}
          >
            <Popup className="text-black">
              <strong className="text-gray-800">{city.name}</strong><br/>
              Click para pronóstico.
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
