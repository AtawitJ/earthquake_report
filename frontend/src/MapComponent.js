import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css'; // CSS สำหรับ pulse

const { BaseLayer } = LayersControl;

export default function MapComponent({ earthquakes, mapCenter, getColorByMagnitude, theme }) {
  const createPulseIcon = (color) => L.divIcon({
    className: 'pulse-icon',
    html: `<div class="pulse-marker" style="background-color: ${color}; border: 2px solid #000;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer center={mapCenter} zoom={5} style={{ height: '600px', width: '100%' }}>
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri'
            />
          </BaseLayer>
        </LayersControl>

        {earthquakes.map((quake, idx) => (
          <Marker
            key={idx}
            position={quake.coordinates}
            icon={createPulseIcon(getColorByMagnitude(quake.magnitude))}
          >
            <Popup>
              <div>
                <strong>{quake.date}</strong><br />
                Location: {quake.location}<br />
                Magnitude: {quake.magnitude}<br />
                Depth: {quake.depth} km
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend overlay */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        background: theme === 'dark' ? '#2b2b2b' : '#eee',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 0 8px rgba(0,0,0,0.4)',
        zIndex: 1000,
      }}>
        <h4 style={{ margin: '0 0 8px' }}>🔴 Magnitude</h4>
        <div><span style={{ background: '#90ee90', padding: '3px 12px', marginRight: '10px' }}></span> 0 - 3</div>
        <div><span style={{ background: '#ffff66', padding: '3px 12px', marginRight: '10px' }}></span> 3 - 5</div>
        <div><span style={{ background: '#ffa500', padding: '3px 12px', marginRight: '10px' }}></span> 5 - 6</div>
        <div><span style={{ background: '#ff3333', padding: '3px 12px', marginRight: '10px' }}></span> 6 - 7</div>
        <div><span style={{ background: '#8b0000', padding: '3px 12px', marginRight: '10px' }}></span> &gt; 7</div>
      </div>
    </div>
  );
}
