import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Star, Compass, Info, ArrowUpRight } from 'lucide-react';

// Enhanced Pulse Animation Icon
const pulseIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-accent/30 rounded-full animate-ping"></div>
      <div class="absolute w-5 h-5 bg-accent/40 rounded-full animate-pulse"></div>
      <div class="relative w-3 h-3 bg-accent rounded-full border-2 border-surface shadow-[0_0_10px_rgba(212,160,23,0.8)]"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const FEATURED_SPOTS = [
    { id: 1, name: 'Hunza Valley', lat: 36.3167, lng: 74.6500, province: 'Gilgit-Baltistan', rating: 4.9, img: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200&auto=format&fit=crop', desc: 'The Shangri-La of Pakistan.' },
    { id: 2, name: 'Skardu', lat: 35.2975, lng: 75.6342, province: 'Gilgit-Baltistan', rating: 4.8, img: 'https://images.unsplash.com/photo-1527266324838-89c09647f15d?q=80&w=1200&auto=format&fit=crop', desc: 'Gateway to the highest peaks.' },
    { id: 3, name: 'Fairy Meadows', lat: 35.3858, lng: 74.5828, province: 'Gilgit-Baltistan', rating: 4.9, img: 'https://images.unsplash.com/photo-1621251397893-97992983b0f5?q=80&w=1200&auto=format&fit=crop', desc: 'Base camp for Nanga Parbat.' },
    { id: 4, name: 'Lahore Fort', lat: 31.5882, lng: 74.3090, province: 'Punjab', rating: 4.7, img: 'https://images.unsplash.com/photo-1618334415951-69ced53a551b?q=80&w=1200&auto=format&fit=crop', desc: 'Mughal architectural masterpiece.' },
    { id: 5, name: 'Mohenjo-Daro', lat: 27.3294, lng: 68.1386, province: 'Sindh', rating: 4.8, img: 'https://images.unsplash.com/photo-1622329842416-2fd1258652ca?q=80&w=1200&auto=format&fit=crop', desc: 'Ancient Indus Valley civilization.' },
    { id: 6, name: 'Gwadar', lat: 25.1264, lng: 62.3225, province: 'Balochistan', rating: 4.7, img: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=1200&auto=format&fit=crop', desc: 'Pristine coastal beauty.' },
];

const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();
  map.flyTo(center, zoom, { duration: 2.5, easeLinearity: 0.25 });
  return null;
};

const PakistanMap = () => {
    const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]);
    const [zoom, setZoom] = useState(5.5);
    const [hoveredProvince, setHoveredProvince] = useState(null);

    const provinces = [
        { name: 'Punjab', coords: [31.1704, 72.7097], count: 85, color: '#4CAF8A' },
        { name: 'Sindh', coords: [25.8943, 68.5247], count: 42, color: '#D4A017' },
        { name: 'KPK', coords: [34.4042, 72.2478], count: 64, color: '#4A9EDB' },
        { name: 'Balochistan', coords: [28.4907, 65.0958], count: 28, color: '#E05C5C' },
        { name: 'Gilgit-Baltistan', coords: [35.8026, 74.9818], count: 52, color: '#F0C040' },
        { name: 'AJK', coords: [33.9141, 73.7686], count: 19, color: '#F5A623' },
    ];

    return (
        <section className="py-32 bg-surface relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
                    <div className="max-w-2xl text-center lg:text-left">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-center lg:justify-start gap-3 mb-4"
                        >
                          <div className="w-10 h-[1px] bg-accent"></div>
                          <span className="text-accent font-label text-[10px] font-bold uppercase tracking-[0.4em]">Interactive Cartography</span>
                        </motion.div>
                        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight">
                            Regional <span className="italic text-accent">Manifest</span>
                        </h2>
                        <p className="text-text-muted font-body text-lg mt-6 max-w-lg leading-relaxed">
                            Navigate through the diverse landscapes of Pakistan. From the glacial peaks of the north to the golden shores of the south.
                        </p>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-display text-accent mb-2">220+</span>
                            <span className="text-[10px] font-label font-bold uppercase tracking-widest text-text-muted">Destinations</span>
                        </div>
                        <div className="w-[1px] h-12 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-display text-text-primary mb-2">06</span>
                            <span className="text-[10px] font-label font-bold uppercase tracking-widest text-text-muted">Provinces</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Province Explorer Panel */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="p-6 bg-surface-2/50 backdrop-blur-xl border border-white/5 rounded-[2rem] h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-display text-2xl text-text-primary">Regions</h3>
                                <Compass size={20} className="text-accent animate-spin-slow" />
                            </div>

                            <div className="space-y-3 flex-grow overflow-y-auto scroll-hide pr-2">
                                {provinces.map((p) => (
                                    <motion.button 
                                        key={p.name}
                                        onMouseEnter={() => setHoveredProvince(p.name)}
                                        onMouseLeave={() => setHoveredProvince(null)}
                                        onClick={() => {
                                            setMapCenter(p.coords);
                                            setZoom(8);
                                        }}
                                        className={`w-full group relative flex items-center justify-between p-4 transition-all duration-500 overflow-hidden ${
                                            mapCenter[0] === p.coords[0] 
                                            ? 'bg-accent text-surface shadow-lg' 
                                            : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={`w-10 h-10 flex items-center justify-center transition-colors ${
                                                mapCenter[0] === p.coords[0] ? 'bg-surface/20' : 'bg-surface-3 text-accent'
                                            }`}>
                                               <MapPin size={18} />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-label font-bold text-[11px] uppercase tracking-widest leading-none">{p.name}</h4>
                                                <p className={`text-[9px] mt-1.5 transition-colors ${
                                                    mapCenter[0] === p.coords[0] ? 'text-surface/70' : 'text-text-muted'
                                                }`}>{p.count} Destinations</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight size={16} className={`relative z-10 transition-transform duration-500 ${
                                            mapCenter[0] === p.coords[0] ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-50'
                                        }`} />
                                        
                                        {/* Hover Glow */}
                                        <div className={`absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent transition-opacity duration-500 ${
                                            hoveredProvince === p.name ? 'opacity-100' : 'opacity-0'
                                        }`}></div>
                                    </motion.button>
                                ))}
                            </div>

                            <button 
                                onClick={() => {
                                    setMapCenter([30.3753, 69.3451]);
                                    setZoom(5.5);
                                }}
                                className="mt-8 py-4 bg-surface-3 border border-white/5 text-[10px] font-label font-bold uppercase tracking-[0.3em] text-text-muted hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-3"
                            >
                                <Compass size={14} /> Reset Exploration
                            </button>
                        </div>
                    </div>

                    {/* Interactive Map Canvas */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="lg:col-span-9 relative"
                    >
                        <div className="h-[700px] w-full overflow-hidden border border-white/10 shadow-2xl relative group">
                            <MapContainer 
                                center={mapCenter} 
                                zoom={zoom} 
                                scrollWheelZoom={false}
                                attributionControl={false}
                                className="h-full w-full z-0"
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                
                                <MapFlyTo center={mapCenter} zoom={zoom} />

                                {FEATURED_SPOTS.map((spot) => (
                                    <Marker 
                                        key={spot.id} 
                                        position={[spot.lat, spot.lng]} 
                                        icon={pulseIcon}
                                    >
                                        <Popup className="custom-popup" closeButton={false}>
                                            <div className="w-64 overflow-hidden bg-surface-2 border border-white/10 shadow-2xl">
                                                <div className="relative h-32 overflow-hidden">
                                                    <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-2 to-transparent"></div>
                                                    <div className="absolute top-4 right-4 px-2 py-1 bg-accent flex items-center gap-1">
                                                        <Star size={10} className="fill-surface text-surface" />
                                                        <span className="text-[10px] font-label font-bold text-surface">{spot.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h5 className="font-display text-xl text-text-primary mb-1">{spot.name}</h5>
                                                    <p className="text-[10px] font-label font-bold uppercase tracking-widest text-accent mb-3">{spot.province}</p>
                                                    <p className="text-xs text-text-muted mb-5 leading-relaxed">{spot.desc}</p>
                                                    <button className="w-full py-3 bg-white/5 border border-white/10 text-text-primary text-[10px] font-label font-bold uppercase tracking-widest rounded-none hover:bg-accent hover:text-surface hover:border-accent transition-all duration-500">Explore Destination</button>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>

                            {/* Map Overlays */}
                            <div className="absolute top-8 left-8 z-10">
                                 <div className="px-5 py-3 bg-surface/40 backdrop-blur-xl border border-white/10 flex items-center gap-4">
                                    <div className="relative w-3 h-3">
                                        <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75"></div>
                                        <div className="relative w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_rgba(212,160,23,1)]"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-label font-bold uppercase tracking-widest text-text-primary">Global Neural Feed</span>
                                        <span className="text-[9px] text-text-muted mt-0.5">Tracking live exploration data...</span>
                                    </div>
                                 </div>
                            </div>

                            <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-3">
                                <div className="p-3 bg-surface-2/60 backdrop-blur-md border border-white/10 text-text-muted hover:text-accent cursor-pointer transition-colors shadow-xl">
                                    <Info size={20} />
                                </div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-accent/20 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-accent/20 pointer-events-none"></div>
                        </div>
                    </motion.div>

                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    border-radius: 0px !important;
                }
                .leaflet-popup-tip {
                    background: #0F1C14 !important;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                }
                .leaflet-container {
                    cursor: crosshair !important;
                    background: #0A1410 !important;
                }
                .custom-popup .leaflet-popup-close-button {
                    display: none;
                }
                .scroll-hide::-webkit-scrollbar {
                    display: none;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            ` }} />

        </section>
    );
};

export default PakistanMap;
