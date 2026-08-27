"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default markers in Next.js
const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

// Component to handle map drag events
function MapEventHandler({ onMapMove, setIsDragging }) {
  useMapEvents({
    movestart: () => {
      if (setIsDragging) setIsDragging(true);
    },
    moveend: (e) => {
      if (setIsDragging) setIsDragging(false);
      const map = e.target;
      const center = map.getCenter();
      if (onMapMove) onMapMove(center);
    },
    click: (e) => {
      const map = e.target;
      map.flyTo(e.latlng, map.getZoom(), { animate: true, duration: 0.5 });
    }
  });
  return null;
}

function FlyToComponent({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function DraggableMap({ onMapMove, setIsDragging, initialCenter, forceCenter }) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Default to a central location if none provided (e.g., Lagos, Nigeria)
  const center = initialCenter || [6.5244, 3.3792];

  return (
    <MapContainer 
      center={center} 
      zoom={16} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
      dragging={true}
      touchZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {forceCenter && <FlyToComponent center={forceCenter} />}
      <MapEventHandler onMapMove={onMapMove} setIsDragging={setIsDragging} />
    </MapContainer>
  );
}
