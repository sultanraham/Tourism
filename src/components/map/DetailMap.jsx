import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function DetailMap({ lat, lng, name }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={11}
      style={{ height:'400px', width:'100%', background:'#0A1410' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>'
      />
      <Circle center={[lat, lng]} radius={3000} pathOptions={{ color:'#D4A017', fillColor:'#D4A017', fillOpacity:0.1 }}/>
      <Marker position={[lat, lng]}>
        <Popup>
          <div style={{ fontFamily:'sans-serif', minWidth:'160px' }}>
            <strong style={{ fontSize:'15px' }}>{name}</strong>
            <br/>
            <small style={{ color:'#666' }}>{lat.toFixed(4)}, {lng.toFixed(4)}</small>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
