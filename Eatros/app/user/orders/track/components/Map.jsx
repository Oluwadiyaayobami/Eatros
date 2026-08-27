"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// Component to dynamically fit the map bounds to the route
function ChangeView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [bounds, map]);
  return null;
}

export default function TrackMap({ userLocation, driverLocation, onRouteCalculated }) {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  useEffect(() => {
    if (userLocation && driverLocation) {
      // Fetch route from OSRM (Open Source Routing Machine) public API
      const fetchRoute = async () => {
        try {
          // OSRM expects longitude,latitude format
          const url = `https://router.project-osrm.org/route/v1/driving/${driverLocation[1]},${driverLocation[0]};${userLocation[1]},${userLocation[0]}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            
            // OSRM returns GeoJSON coordinates as [longitude, latitude], Leaflet needs [latitude, longitude]
            const latLngs = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteCoordinates(latLngs);
            
            // Calculate bounds to comfortably fit both markers
            const newBounds = L.latLngBounds([userLocation, driverLocation]);
            setBounds(newBounds);

            // Pass the calculated distance and duration back up to the parent component
            if (onRouteCalculated) {
              onRouteCalculated({
                distance: (route.distance / 1000).toFixed(1), // Convert meters to km
                duration: Math.max(1, Math.round(route.duration / 60)) // Convert seconds to minutes
              });
            }
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };

      fetchRoute();
    }
  }, [userLocation, driverLocation, onRouteCalculated]);

  // Fallback center if locations haven't loaded yet
  const center = userLocation || [6.5244, 3.3792]; // Lagos default

  return (
    <MapContainer 
      center={center} 
      zoom={14} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={true}
      dragging={true}
      touchZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {bounds && <ChangeView bounds={bounds} />}
      
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Delivery Destination (You)</Popup>
        </Marker>
      )}
      
      {driverLocation && (
        <Marker position={driverLocation}>
          <Popup>Lezlie Alexander (Driver)</Popup>
        </Marker>
      )}

      {/* Draw the route line */}
      {routeCoordinates.length > 0 && (
        <Polyline positions={routeCoordinates} color="#00A082" weight={5} opacity={0.8} />
      )}
    </MapContainer>
  );
}
