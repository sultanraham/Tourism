import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { 
  MapPin, Star, Clock, Mountain, Thermometer, Heart,
  Share2, ChevronLeft, ChevronRight, X, Sun, Cloud,
  Wind, ArrowRight, Bookmark, Eye, Calendar, DollarSign,
  Users, Camera, Compass, Info, Hotel, UtensilsCrossed,
  MessageSquare, ChevronDown, ChevronUp, ExternalLink,
  TrendingUp, Zap, Sparkles, ShieldCheck, Wifi, Coffee
} from 'lucide-react'
import { dataService } from '../../services/data.service';

export default function DestinationDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: place, isLoading, isError } = useQuery({
      queryKey: ['destination', slug],
      queryFn: () => dataService.getDestinationBySlug(slug),
  });

  const [activeTab, setActiveTab] = useState('overview')
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviews, setReviews] = useState([
    { id:1, name:'Muhammad Raham', city:'Lahore', rating:5, 
      comment:'Absolutely breathtaking! Best trip of my life.', 
      date:'2 days ago', avatar:'MR' },
    { id:2, name:'Muhammad Huzaifa', city:'Karachi', rating:4, 
      comment:'Beautiful place, roads are bit rough but worth it.', 
      date:'1 week ago', avatar:'MH' },
    { id:3, name:'Usman Tariq', city:'Islamabad', rating:5, 
      comment:'Pakistan ki khubsurti ka zabardast namuna. Must visit!', 
      date:'2 weeks ago', avatar:'UT' },
  ])

  // Real-time view count
  const [viewCount, setViewCount] = useState(0)
  useEffect(() => {
    if (!place) return;
    setViewCount(place.review_count * 4);
    const interval = setInterval(() => {
      setViewCount(v => v + Math.floor(Math.random() * 3))
    }, 8000)
    return () => clearInterval(interval)
  }, [place])

  // Weather — Open-Meteo FREE API
  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ['weather', place?.slug],
    enabled: !!place,
    queryFn: async () => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}&current=temperature_2m,weathercode,windspeed_10m&timezone=Asia%2FKarachi`
      )
      return res.json()
    },
    staleTime: 600000,
    retry: 1
  })

  if (isLoading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-b-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (isError || !place) return <Navigate to="/destinations" replace />;

  const hotels = (typeof HOTELS_DATA !== 'undefined') ? HOTELS_DATA.filter(h => h.destination_slug === slug) : []
  const restaurants = (typeof RESTAURANTS_DATA !== 'undefined') ? RESTAURANTS_DATA.filter(r => r.destination_slug === slug) : []

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from saved places' : '❤️ Saved to your places!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleReviewSubmit = () => {
    if (!reviewRating) return toast.error('Please select a rating')
    if (!reviewText.trim()) return toast.error('Please write a review')
    const newReview = {
      id: reviews.length + 1,
      name: 'You',
      city: 'Your City',
      rating: reviewRating,
      comment: reviewText,
      date: 'Just now',
      avatar: 'YO'
    }
    setReviews([newReview, ...reviews])
    setReviewText('')
    setReviewRating(0)
    toast.success('✅ Review submitted!')
  }

  const weatherCode = weather?.current?.weathercode
  const getWeatherLabel = (code) => {
    if (code === 0) return { label: 'Clear Sky', icon: '☀️' }
    if (code <= 3) return { label: 'Partly Cloudy', icon: '⛅' }
    if (code <= 67) return { label: 'Rainy', icon: '🌧️' }
    if (code <= 77) return { label: 'Snowy', icon: '❄️' }
    return { label: 'Thunderstorm', icon: '⛈️' }
  }

  const tabs = [
    { id:'overview', label:'Overview', icon:<Info size={16}/> },
    { id:'hotels', label:`Hotels (${hotels.length})`, icon:<Hotel size={16}/> },
    { id:'restaurants', label:`Food (${restaurants.length})`, icon:<UtensilsCrossed size={16}/> },
    { id:'reviews', label:`Reviews (${reviews.length})`, icon:<MessageSquare size={16}/> },
    { id:'map', label:'Map', icon:<MapPin size={16}/> },
  ]

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="min-h-screen bg-surface"
    >
  
      {/* ── BREADCRUMB ── */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'12px 0' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'14px', color:'var(--text-muted)' }}>
            <button onClick={() => navigate('/')} style={{ color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer' }}>Home</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate('/destinations')} style={{ color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer' }}>Destinations</button>
            <ChevronRight size={14} />
            <span style={{ color:'var(--accent)' }}>{place?.name || 'Loading...'}</span>
          </div>
        </div>
      </div>
  
      {/* ── IMAGE GALLERY ── */}
      <div style={{ position:'relative', height:'520px', overflow:'hidden', background:'var(--surface-2)' }}>
        
        {/* Main image */}
        <motion.img
          key={activeImage}
          src={ (place.images && place.images[activeImage]) || place.image_url || `https://picsum.photos/seed/${place.slug}/1400/600`}
          alt={place.name}
          initial={{ opacity:0, scale:1.05 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5 }}
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.src = `https://picsum.photos/seed/${place.slug}${activeImage}/1400/600` }}
        />
        
        {/* Gradient overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
        
        {/* Lightbox button */}
        <button 
          onClick={() => setLightboxOpen(true)}
          style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'8px 16px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', backdropFilter:'blur(8px)', fontSize:'14px' }}
        >
          <Camera size={14} /> View All Photos
        </button>
        
        {/* Image navigation arrows */}
        {(place.images && place.images.length > 1) && [
          { dir:'prev', icon:<ChevronLeft size={24}/>, action:() => setActiveImage(i => i === 0 ? place.images.length - 1 : i-1) },
          { dir:'next', icon:<ChevronRight size={24}/>, action:() => setActiveImage(i => (i+1) % place.images.length) }
        ].map(btn => (
          <button key={btn.dir}
            onClick={btn.action}
            style={{ position:'absolute', top:'50%', [btn.dir==='prev'?'left':'right']:'16px', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', color:'white', width:'44px', height:'44px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', backdropFilter:'blur(8px)' }}
          >{btn.icon}</button>
        ))}
  
        {/* Thumbnail dots */}
        {(place.images && place.images.length > 1) && (
          <div style={{ position:'absolute', bottom:'16px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px' }}>
            {place.images.map((_, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                style={{ width: i===activeImage ? '24px' : '8px', height:'8px', borderRadius:'4px', background: i===activeImage ? 'var(--accent)' : 'rgba(255,255,255,0.5)', border:'none', cursor:'pointer', transition:'all 0.3s' }}
              />
            ))}
          </div>
        )}
  
        {/* LIVE viewer count badge */}
        <div style={{ position:'absolute', bottom:'16px', right:'16px', background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', border:'1px solid rgba(212,160,23,0.3)', borderRadius:'8px', padding:'6px 12px', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'white' }}>
          <span style={{ width:'6px', height:'6px', background:'#4CAF8A', borderRadius:'50%', display:'inline-block', animation:'pulse 2s infinite' }}/>
          <Eye size={13} style={{color:'var(--accent)'}}/> {(viewCount || 0).toLocaleString()} viewed today
        </div>
      </div>
  
      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}
            onClick={() => setLightboxOpen(false)}
          >
            <button onClick={() => setLightboxOpen(false)}
              style={{ position:'absolute', top:'20px', right:'20px', background:'rgba(255,255,255,0.1)', border:'none', color:'white', width:'44px', height:'44px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'20px' }}
            ><X size={20}/></button>
            <img
              src={place.images?.[activeImage] || `https://picsum.photos/seed/${place.slug}${activeImage}/1200/800`}
              alt=""
              style={{ maxWidth:'90vw', maxHeight:'85vh', objectFit:'contain', borderRadius:'8px' }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12" style={{ maxWidth:'1280px', margin:'0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'32px', alignItems:'start' }}>
          
          {/* LEFT COLUMN */}
          <div>
  
            {/* Title + Actions Row */}
            <div style={{ marginBottom:'24px' }}>
              
              {/* Tags row */}
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px' }}>
                <span className="badge-province">{place.province.replace(/-/g,' ').toUpperCase()}</span>
                <span className="badge-category">{place.category}</span>
                <span className="badge-season">Best: {place.best_season.replace('_',' ')}</span>
                <span className="badge-difficulty" data-level={place.difficulty}>{place.difficulty}</span>
              </div>
  
              {/* Name + Stars + Actions */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'16px' }}>
                <div>
                  <h1 style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(28px,4vw,48px)', fontWeight:800, color:'var(--text-primary)', margin:0, lineHeight:1.1 }}>
                    {place.name}
                  </h1>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'10px', flexWrap:'wrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={18} fill={s <= Math.floor(place?.rating_avg || 4.5) ? '#D4A017' : 'none'} color='#D4A017'/>
                      ))}
                      <span style={{ color:'var(--accent)', fontWeight:700, marginLeft:'4px' }}>{place?.rating_avg || 4.5}</span>
                    </div>
                    <span style={{ color:'var(--text-muted)', fontSize:'14px' }}>({(place?.review_count || 0).toLocaleString()} reviews)</span>
                    <span style={{ color:'var(--text-muted)', fontSize:'14px' }}>·</span>
                    <span style={{ color:'var(--text-muted)', fontSize:'14px', display:'flex', alignItems:'center', gap:'4px' }}>
                      <Clock size={14}/> {place?.ideal_duration || '3-4 Days'}
                    </span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div style={{ display:'flex', gap:'10px' }}>
                  <motion.button whileTap={{ scale:0.9 }} onClick={handleSave}
                    style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 18px', borderRadius:'10px', border:`1px solid ${isSaved ? '#E05C5C' : 'var(--border)'}`, background: isSaved ? 'rgba(224,92,92,0.1)' : 'var(--surface-2)', color: isSaved ? '#E05C5C' : 'var(--text-muted)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500, transition:'all 0.2s' }}
                  >
                    <Heart size={16} fill={isSaved ? '#E05C5C' : 'none'}/> {isSaved ? 'Saved' : 'Save'}
                  </motion.button>
                  <motion.button whileTap={{ scale:0.9 }} onClick={handleShare}
                    style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 18px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--surface-2)', color:'var(--text-muted)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500, transition:'all 0.2s' }}
                  >
                    <Share2 size={16}/> Share
                  </motion.button>
                </div>
              </div>
            </div>
  
            {/* ── TABS ── */}
            <div style={{ display:'flex', gap:'4px', borderBottom:'1px solid var(--border)', marginBottom:'32px', overflowX:'auto', paddingBottom:'1px' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:'6px',
                    padding:'12px 20px', border:'none', background:'none', cursor:'pointer',
                    fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500, whiteSpace:'nowrap',
                    color: activeTab===tab.id ? 'var(--accent)' : 'var(--text-muted)',
                    borderBottom: activeTab===tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                    transition:'all 0.2s', marginBottom:'-1px'
                  }}
                >{tab.icon}{tab.label}</button>
              ))}
            </div>
  
            {/* ── TAB CONTENT ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
                transition={{ duration:0.25 }}
              >
  
                {/* ─── OVERVIEW TAB ─── */}
                {activeTab === 'overview' && (
                  <div>
                    {/* Description */}
                    <p style={{ fontFamily:'var(--font-body)', fontSize:'17px', lineHeight:1.8, color:'var(--text-secondary)', marginBottom:'32px' }}>
                      {place.description}
                    </p>
  
                    {/* Info Cards Grid */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'16px', marginBottom:'32px' }}>
                      {[
                        { icon:<MapPin size={20} color='var(--accent)'/>, label:'Province', value: place.province.replace(/-/g,' ') },
                        { icon:<Mountain size={20} color='var(--accent)'/>, label:'Category', value: place.category },
                        { icon:<Sun size={20} color='var(--accent)'/>, label:'Best Season', value: place.best_season.replace('_',' ') },
                        { icon:<Compass size={20} color='var(--accent)'/>, label:'Difficulty', value: place.difficulty },
                        { icon:<Clock size={20} color='var(--accent)'/>, label:'Ideal Stay', value: place.ideal_duration },
                        { icon:<ShieldCheck size={20} color='var(--accent)'/>, label:'Quality Status', value: 'Verified Elite' },
                      ].map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                          transition={{ delay: i * 0.07 }}
                          style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'14px', padding:'18px', display:'flex', flexDirection:'column', gap:'8px' }}
                        >
                          {item.icon}
                          <p style={{ margin:0, fontSize:'12px', color:'var(--text-muted)', fontFamily:'var(--font-body)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{item.label}</p>
                          <p style={{ margin:0, fontSize:'16px', fontWeight:600, color:'var(--text-primary)', fontFamily:'var(--font-heading)', textTransform:'capitalize' }}>{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
  
                    {/* Travel Tips */}
                    <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'16px', padding:'24px', marginBottom:'32px' }}>
                      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'20px', fontWeight:700, color:'var(--text-primary)', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
                        <Zap size={20} color='var(--accent)'/> Travel Tips
                      </h3>
                      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                        {(place.tags || []).map((tag, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                            <span style={{ width:'6px', height:'6px', background:'var(--accent)', borderRadius:'50%', flexShrink:0, marginTop:'7px' }}/>
                            <span style={{ fontFamily:'var(--font-body)', fontSize:'15px', color:'var(--text-secondary)', lineHeight:1.6 }}>{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    {/* Tags */}
                    <div>
                      <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--text-primary)', marginBottom:'12px' }}>Tags</h3>
                      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                        {(place.tags || []).map(tag => (
                          <span key={tag}
                            style={{ padding:'6px 14px', background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:'20px', fontSize:'13px', color:'var(--text-muted)', fontFamily:'var(--font-body)', cursor:'pointer' }}
                            onClick={() => navigate(`/destinations?search=${tag}`)}
                          >#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
  
                {/* ─── HOTELS TAB ─── */}
                {activeTab === 'hotels' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                    {hotels.length === 0 ? (
                      <EmptyState icon={<Hotel size={40}/>} title="No hotels listed yet" sub="Check back soon — we're adding hotels for this destination." />
                    ) : hotels.map((hotel, i) => (
                      <motion.div key={hotel.id}
                        initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', display:'flex', transition:'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(212,160,23,0.15)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                      >
                        <img src={`https://picsum.photos/seed/${hotel.name}/200/150`} alt={hotel.name}
                          style={{ width:'180px', height:'140px', objectFit:'cover', flexShrink:0 }} />
                        <div style={{ padding:'16px 20px', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                          <div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                              <h4 style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--text-primary)', margin:0 }}>{hotel.name}</h4>
                              <div style={{ display:'flex', gap:'2px' }}>
                                {Array.from({length:hotel.stars}).map((_,i)=><Star key={i} size={12} fill='#D4A017' color='#D4A017'/>)}
                              </div>
                            </div>
                            <p style={{ color:'var(--text-muted)', fontSize:'14px', margin:'6px 0 10px', fontFamily:'var(--font-body)' }}>{hotel.description}</p>
                            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                              {(hotel.amenities || []).slice(0,4).map(a => (
                                <span key={a} style={{ padding:'3px 10px', background:'var(--surface-3)', borderRadius:'20px', fontSize:'12px', color:'var(--text-muted)' }}>{a}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'12px' }}>
                            <div>
                              <span style={{ fontFamily:'var(--font-label)', fontSize:'22px', color:'var(--accent)' }}>PKR {hotel.price_per_night.toLocaleString()}</span>
                              <span style={{ fontSize:'12px', color:'var(--text-muted)', marginLeft:'4px' }}>/night</span>
                            </div>
                            <button
                              style={{ padding:'8px 18px', background:'var(--primary)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:600 }}
                              onClick={() => toast.success(`Booking info: ${hotel.contact || 'Contact via ROAM PK'}`)}
                            >Book Now</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
  
                {/* ─── RESTAURANTS TAB ─── */}
                {activeTab === 'restaurants' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' }}>
                    {restaurants.length === 0 ? (
                      <EmptyState icon={<UtensilsCrossed size={40}/>} title="No restaurants listed yet" sub="We're adding local food spots soon!" />
                    ) : restaurants.map((rest, i) => (
                      <motion.div key={rest.id}
                        initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden', transition:'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-hover)'; e.currentTarget.style.transform='translateY(-4px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)' }}
                      >
                        <img src={`https://picsum.photos/seed/${rest.name}food/400/200`} alt={rest.name}
                          style={{ width:'100%', height:'160px', objectFit:'cover' }}/>
                        <div style={{ padding:'16px' }}>
                          <h4 style={{ fontFamily:'var(--font-heading)', fontSize:'17px', fontWeight:700, color:'var(--text-primary)', margin:'0 0 6px' }}>{rest.name}</h4>
                          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'10px' }}>
                            {(rest.cuisine_types || []).map(c => (
                              <span key={c} style={{ padding:'2px 10px', background:'rgba(212,160,23,0.1)', border:'1px solid rgba(212,160,23,0.3)', borderRadius:'20px', fontSize:'12px', color:'var(--accent)' }}>{c}</span>
                            ))}
                            <span style={{ padding:'2px 10px', background:'var(--surface-3)', borderRadius:'20px', fontSize:'12px', color:'var(--text-muted)' }}>{rest.price_range}</span>
                          </div>
                          {rest.must_try && (
                            <p style={{ margin:0, fontSize:'13px', color:'var(--text-muted)', fontFamily:'var(--font-body)' }}>
                              🍽 Must try: <span style={{ color:'var(--text-secondary)', fontWeight:500 }}>{rest.must_try}</span>
                            </p>
                          )}
                          <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'10px' }}>
                            <Star size={14} fill='#D4A017' color='#D4A017'/>
                            <span style={{ fontSize:'14px', color:'var(--accent)', fontWeight:600 }}>{rest.rating || '4.4'}</span>
                            <span style={{ fontSize:'13px', color:'var(--text-muted)', marginLeft:'6px' }}>📍 {rest.address || place.name}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
  
                {/* ─── REVIEWS TAB ─── */}
                {activeTab === 'reviews' && (
                  <div>
                    {/* Rating summary */}
                    <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'16px', padding:'24px', marginBottom:'24px', display:'flex', gap:'32px', alignItems:'center', flexWrap:'wrap' }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:'var(--font-label)', fontSize:'64px', color:'var(--accent)', lineHeight:1 }}>{place.rating_avg}</div>
                        <div style={{ display:'flex', gap:'4px', justifyContent:'center', margin:'8px 0 4px' }}>
                          {[1,2,3,4,5].map(s=><Star key={s} size={20} fill={s<=place.rating_avg?'#D4A017':'none'} color='#D4A017'/>)}
                        </div>
                        <div style={{ fontSize:'13px', color:'var(--text-muted)' }}>{place.review_count.toLocaleString()} reviews</div>
                      </div>
                      <div style={{ flex:1, minWidth:'200px' }}>
                        {[5,4,3,2,1].map(star => (
                          <div key={star} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                            <span style={{ fontSize:'13px', color:'var(--text-muted)', width:'8px' }}>{star}</span>
                            <Star size={12} fill='#D4A017' color='#D4A017'/>
                            <div style={{ flex:1, height:'6px', background:'var(--surface-3)', borderRadius:'3px', overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${star===5?70:star===4?20:star===3?7:2}%`, background:'var(--accent)', borderRadius:'3px', transition:'width 1s ease' }}/>
                            </div>
                            <span style={{ fontSize:'12px', color:'var(--text-muted)', width:'30px' }}>{star===5?'70%':star===4?'20%':star===3?'7%':'2%'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
  
                    {/* Write review */}
                    <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'16px', padding:'24px', marginBottom:'24px' }}>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontSize:'18px', fontWeight:700, color:'var(--text-primary)', margin:'0 0 16px' }}>Write a Review</h4>
                      <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setReviewRating(s)}
                            style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
                            <Star size={28} fill={s<=reviewRating?'#D4A017':'none'} color='#D4A017'
                              style={{ transition:'transform 0.1s', transform: s<=reviewRating ? 'scale(1.2)' : 'scale(1)' }}/>
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="Share your experience at this destination..."
                        rows={4}
                        style={{ width:'100%', background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px', color:'var(--text-primary)', fontFamily:'var(--font-body)', fontSize:'15px', resize:'vertical', outline:'none', boxSizing:'border-box', border:'1px solid var(--border)' }}
                      />
                      <button onClick={handleReviewSubmit}
                        style={{ marginTop:'12px', padding:'12px 28px', background:'var(--primary)', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'15px', fontWeight:600, transition:'background 0.2s' }}
                      >Submit Review</button>
                    </div>
  
                    {/* Reviews list */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                      {reviews.map((review, i) => (
                        <motion.div key={review.id}
                          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                          transition={{ delay: i * 0.08 }}
                          style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px', display:'flex', gap:'16px' }}
                        >
                          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-heading)', fontWeight:700, color:'white', fontSize:'16px', flexShrink:0 }}>
                            {review.avatar}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px' }}>
                              <div>
                                <span style={{ fontFamily:'var(--font-heading)', fontWeight:700, color:'var(--text-primary)', fontSize:'16px' }}>{review.name}</span>
                                <span style={{ color:'var(--text-muted)', fontSize:'13px', marginLeft:'8px' }}>from {review.city}</span>
                              </div>
                              <span style={{ fontSize:'12px', color:'var(--text-disabled)' }}>{review.date}</span>
                            </div>
                            <div style={{ display:'flex', gap:'2px', margin:'6px 0 10px' }}>
                              {[1,2,3,4,5].map(s=><Star key={s} size={14} fill={s<=review.rating?'#D4A017':'none'} color='#D4A017'/>)}
                            </div>
                            <p style={{ margin:0, fontFamily:'var(--font-body)', fontSize:'15px', lineHeight:1.7, color:'var(--text-secondary)' }}>{review.comment}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
  
                {/* ─── MAP TAB ─── */}
                {activeTab === 'map' && (
                  <div>
                    <div style={{ borderRadius:'16px', overflow:'hidden', border:'1px solid var(--border)', marginBottom:'16px' }}>
                      <Suspense fallback={
                        <div style={{ height:'400px', background:'var(--surface-2)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>
                          Loading map...
                        </div>
                      }>
                        <DetailMap lat={place.lat} lng={place.lng} name={place.name} />
                      </Suspense>
                    </div>
                    <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                      <a href={`https://www.google.com/maps?q=${place.lat},${place.lng}`} target="_blank" rel="noreferrer"
                        style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>
                        <ExternalLink size={16}/> Open in Google Maps
                      </a>
                      <button onClick={() => { navigator.clipboard.writeText(`${place.lat}, ${place.lng}`); toast.success('Coordinates copied!') }}
                        style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--surface-2)', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:'10px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px' }}>
                        <MapPin size={16}/> Copy Coordinates
                      </button>
                    </div>
                  </div>
                )}
  
              </motion.div>
            </AnimatePresence>
          </div>
  
          {/* RIGHT STICKY SIDEBAR */}
          <div style={{ position:'sticky', top:'88px', display:'flex', flexDirection:'column', gap:'16px' }}>
            
            {/* Plan trip card */}
            <div style={{ background:'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', border:'1px solid var(--border-strong)', borderRadius:'20px', padding:'24px', textAlign:'center' }}>
              <div style={{ fontSize:'32px', marginBottom:'8px' }}>🗺️</div>
              <h3 style={{ fontFamily:'var(--font-heading)', fontSize:'20px', fontWeight:800, color:'var(--text-primary)', margin:'0 0 8px' }}>Plan a Trip Here</h3>
              <p style={{ color:'rgba(240,237,230,0.7)', fontSize:'14px', margin:'0 0 20px', fontFamily:'var(--font-body)', lineHeight:1.6 }}>Let AI build you a perfect itinerary for {place.name}</p>
              <motion.button
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                onClick={() => navigate(`/plan?destination=${place.slug}`)}
                style={{ width:'100%', padding:'14px', background:'var(--accent)', color:'var(--bg)', border:'none', borderRadius:'12px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'16px', fontWeight:700 }}
              >✨ Generate AI Itinerary</motion.button>
            </div>
  
            {/* Weather card */}
            <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px' }}>
              <h4 style={{ fontFamily:'var(--font-heading)', fontSize:'16px', fontWeight:700, color:'var(--text-primary)', margin:'0 0 14px', display:'flex', alignItems:'center', gap:'8px' }}>
                <Cloud size={18} color='var(--accent)'/> Live Weather
              </h4>
              {weatherLoading ? (
                <div style={{ fontSize:'14px', color:'var(--text-muted)' }}>Fetching weather...</div>
              ) : weather?.current ? (
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <span style={{ fontSize:'40px' }}>{getWeatherLabel(weather.current.weathercode).icon}</span>
                    <div>
                      <div style={{ fontFamily:'var(--font-label)', fontSize:'36px', color:'var(--text-primary)', lineHeight:1 }}>
                        {Math.round(weather.current.temperature_2m)}°C
                      </div>
                      <div style={{ fontSize:'14px', color:'var(--text-muted)', marginTop:'4px', display:'flex', alignItems:'center', gap:'6px' }}>
                        <span style={{ width:'6px', height:'6px', background:'#4CAF8A', borderRadius:'50%', display:'inline-block', animation:'pulse 2s infinite' }}/>
                        {getWeatherLabel(weather.current.weathercode).label}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop:'12px', padding:'10px', background:'var(--surface-3)', borderRadius:'8px', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--text-muted)' }}>
                    <Wind size={14} color='var(--accent)'/> Wind: {weather.current.windspeed_10m} km/h
                  </div>
                </div>
              ) : (
                <div style={{ fontSize:'14px', color:'var(--text-muted)' }}>Weather data unavailable</div>
              )}
            </div>
  
            {/* Quick stats */}
            <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px' }}>
              <h4 style={{ fontFamily:'var(--font-heading)', fontSize:'16px', fontWeight:700, color:'var(--text-primary)', margin:'0 0 14px', display:'flex', alignItems:'center', gap:'8px' }}>
                <TrendingUp size={18} color='var(--accent)'/> Quick Info
              </h4>
              {[
                { label:'Hotels nearby', value: hotels.length || '2–5' },
                { label:'Restaurants', value: restaurants.length || '5–10' },
                { label:'Best for', value: place.difficulty === 'easy' ? 'Families & all ages' : place.difficulty === 'moderate' ? 'Active travelers' : 'Adventure seekers' },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:'14px', color:'var(--text-muted)', fontFamily:'var(--font-body)' }}>{item.label}</span>
                  <span style={{ fontSize:'14px', color:'var(--text-primary)', fontWeight:600, fontFamily:'var(--font-body)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// EmptyState helper component
function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)', gridColumn:'1/-1' }}>
      <div style={{ opacity:0.3, marginBottom:'16px' }}>{icon}</div>
      <h3 style={{ fontFamily:'var(--font-heading)', color:'var(--text-muted)', margin:'0 0 8px' }}>{title}</h3>
      <p style={{ fontFamily:'var(--font-body)', fontSize:'14px', margin:0 }}>{sub}</p>
    </div>
  )
}
