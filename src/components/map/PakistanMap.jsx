import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star } from 'lucide-react';

// Custom Marker Icon
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Create a pulse animation icon using CSS
const pulseIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-6 h-6 bg-accent rounded-full animate-ping opacity-75"></div>
      <div class="relative w-3 h-3 bg-accent rounded-full border-2 border-white shadow-lg"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const FEATURED_SPOTS = [
    { name: 'Hunza Valley', lat: 36.3167, lng: 74.6500, province: 'Gilgit-Baltistan', rating: 4.9, img: '/src/assets/hero/hunza_valley_hero_1775421507878.png' },
    { name: 'Skardu', lat: 35.2975, lng: 75.6342, province: 'Gilgit-Baltistan', rating: 4.8, img: '/src/assets/hero/skardu_mountains_hero_1775421532625.png' },
    { name: 'Swat Valley', lat: 34.7717, lng: 72.3600, province: 'KPK', rating: 4.7, img: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Lahore', lat: 31.5497, lng: 74.3436, province: 'Punjab', rating: 4.7, img: '/src/assets/hero/badshahi_mosque_hero_1775421551697.png' },
    { name: 'Karachi', lat: 24.8607, lng: 67.0011, province: 'Sindh', rating: 4.6, img: 'https://images.unsplash.com/photo-1568241723642-9907f1bd6562?q=80&w=2069&auto=format&fit=crop' },
    { name: 'Quetta', lat: 30.1798, lng: 66.9750, province: 'Balochistan', rating: 4.5, img: 'https://images.unsplash.com/photo-1627914800262-d4b94fca4df3?q=80&w=2070&auto=format&fit=crop' },
];

const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 2 });
  return null;
};

const PakistanMap = () => {
    const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]);
    const [zoom, setZoom] = useState(5);

    const provinces = [
        { name: 'Punjab', coords: [31.1704, 72.7097], count: 85 },
        { name: 'Sindh', coords: [25.8943, 68.5247], count: 42 },
        { name: 'KPK', coords: [34.4042, 72.2478], count: 64 },
        { name: 'Balochistan', coords: [28.4907, 65.0958], count: 28 },
        { name: 'Gilgit-Baltistan', coords: [35.8026, 74.9818], count: 52 },
        { name: 'AJK', coords: [33.9141, 73.7686], count: 19 },
    ];

    return (
        <section className="py-24 bg-surface-2 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                
                <div className="text-center mb-16">
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block"
                    >
                      Interactive Experience
                    </motion.span>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary">
                      Explore by <span className="italic text-accent">Province</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                    
                    {/* Province Side Panel (Enhanced & Scroll-hidden) */}
                    <div className="order-2 lg:order-1 flex flex-col gap-3 max-h-[500px] pr-2 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {provinces.map((p) => (
                            <motion.button 
                                key={p.name}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setMapCenter(p.coords);
                                    setZoom(7);
                                }}
                                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                                    mapCenter[0] === p.coords[0] 
                                    ? 'bg-accent/10 border-accent shadow-lg shadow-accent/5 scale-[1.02]' 
                                    : 'bg-surface border-white/5 hover:bg-surface-2 hover:border-white/10'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                    mapCenter[0] === p.coords[0] ? 'bg-accent text-surface' : 'bg-surface-2 text-accent group-hover:bg-accent/20'
                                }`}>
                                   <MapPin size={20} />
                                </div>
                                <div className="text-left flex-grow">
                                    <h4 className={`font-heading text-[10px] uppercase tracking-[0.2em] transition-all ${
                                        mapCenter[0] === p.coords[0] ? 'text-accent font-bold' : 'text-text-muted group-hover:text-text-primary'
                                    }`}>{p.name}</h4>
                                    <p className="text-[9px] text-text-muted mt-0.5 font-body flex items-center gap-2">
                                        <span className="w-1 h-1 bg-accent/40 rounded-full"></span>
                                        {p.count} Destinations
                                    </p>
                                </div>
                                <Navigation size={12} className={`transition-all ${mapCenter[0] === p.coords[0] ? 'text-accent translate-x-0' : 'text-text-muted/30 opacity-0 group-hover:opacity-100'}`} />
                            </motion.button>
                        ))}
                        
                        <button 
                            onClick={() => {
                                setMapCenter([30.3753, 69.3451]);
                                setZoom(5);
                            }}
                            className="mt-2 py-3 bg-surface-2 border border-white/5 rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] text-text-muted hover:text-accent hover:border-accent/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Star size={10} /> Reset View
                        </button>
                    </div>

                    {/* Map Component (Less Curve) */}
                    <div className="order-1 lg:order-2 lg:col-span-3 min-h-[500px] rounded-3xl overflow-hidden border border-white/5 relative shadow-inner">
                        <MapContainer 
                            center={mapCenter} 
                            zoom={zoom} 
                            scrollWheelZoom={false}
                            attributionControl={false}
                            className="h-[500px] w-full z-0"
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                            
                            <MapFlyTo center={mapCenter} zoom={zoom} />

                            {FEATURED_SPOTS.map((spot) => (
                                <Marker 
                                    key={spot.name} 
                                    position={[spot.lat, spot.lng]} 
                                    icon={pulseIcon}
                                    eventHandlers={{
                                        mouseover: (e) => e.target.openPopup(),
                                    }}
                                >
                                    <Popup className="custom-popup" closeButton={false}>
                                        <div className="w-48 overflow-hidden rounded-xl bg-surface-2 border border-white/10 shadow-2xl">
                                            <img src={spot.img} alt={spot.name} className="w-full h-24 object-cover brightness-75" />
                                            <div className="p-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h5 className="font-heading text-[10px] uppercase text-accent tracking-widest">{spot.name}</h5>
                                                    <div className="flex items-center gap-1 text-[9px] text-white/50">
                                                        <Star size={10} className="fill-accent text-accent" /> {spot.rating}
                                                    </div>
                                                </div>
                                                <p className="text-[9px] text-text-muted mb-3 flex items-center gap-1">
                                                    <MapPin size={8} /> {spot.province}
                                                </p>
                                                <button className="w-full py-1.5 bg-accent/10 border border-accent/20 text-accent text-[8px] uppercase tracking-widest rounded-lg font-bold hover:bg-accent hover:text-surface transition-all">Details</button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Map Overlay Decor */}
                        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
                             <div className="px-4 py-2 bg-surface/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                                <div className="w-2 h-2 bg-accent animate-pulse rounded-full"></div>
                                <span className="text-[10px] uppercase tracking-widest text-text-primary font-heading">Live Map Active</span>
                             </div>
                        </div>
                    </div>

                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
                .leaflet-popup-tip {
                    background: #162219 !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                }
                .leaflet-container {
                    cursor: crosshair !important;
                }
                .custom-popup .leaflet-popup-close-button {
                    display: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            ` }} />

        </section>
    );
};

export default PakistanMap;
