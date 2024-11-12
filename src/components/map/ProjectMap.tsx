import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { useMapStore } from '../../store/mapStore';
import 'leaflet/dist/leaflet.css';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 55.7558,
  lng: 37.6173
};

interface ProjectMapProps {
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

function MapEvents({ onClick }: { onClick?: (latlng: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

export function ProjectMap({ onMapClick }: ProjectMapProps) {
  const { points, lines, selectedPoint, selectedLine, setSelectedPoint, setSelectedLine } = useMapStore();

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FFC107';
      case 'planned': return '#9E9E9E';
      default: return '#000000';
    }
  };

  const getLineColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FFC107';
      case 'planned': return '#9E9E9E';
      default: return '#000000';
    }
  };

  const handleMarkerClick = (pointId: string) => {
    setSelectedPoint(pointId);
    setSelectedLine(null);
  };

  const handleLineClick = (lineId: string) => {
    setSelectedLine(lineId);
    setSelectedPoint(null);
  };

  const createMarkerIcon = (color: string) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
        </svg>
      `)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      style={mapContainerStyle}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapEvents onClick={onMapClick} />

      {points.map(point => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={createMarkerIcon(getMarkerColor(point.status))}
          eventHandlers={{
            click: () => handleMarkerClick(point.id)
          }}
        />
      ))}

      {lines.map(line => {
        const linePoints = line.points.map(pointId => {
          const point = points.find(p => p.id === pointId);
          return point ? [point.lat, point.lng] : null;
        }).filter((point): point is [number, number] => point !== null);

        return (
          <Polyline
            key={line.id}
            positions={linePoints}
            pathOptions={{
              color: getLineColor(line.status),
              weight: selectedLine === line.id ? 4 : 2,
              opacity: 0.8
            }}
            eventHandlers={{
              click: () => handleLineClick(line.id)
            }}
          />
        );
      })}
    </MapContainer>
  );
}