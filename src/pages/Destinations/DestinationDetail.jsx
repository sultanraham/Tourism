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
    {
      id: 1, name: 'Muhammad Raham', city: 'Lahore', rating: 5,
      comment: 'Absolutely breathtaking! Best trip of my life.',
      date: '2 days ago', avatar: 'MR'
    },
    {
      id: 2, name: 'Muhammad Huzaifa', city: 'Karachi', rating: 4,
      comment: 'Beautiful place, roads are bit rough but worth it.',
      date: '1 week ago', avatar: 'MH'
    },
    {
      id: 3, name: 'Usman Tariq', city: 'Islamabad', rating: 5,
      comment: 'Pakistan ki khubsurti ka zabardast namuna. Must visit!',
      date: '2 weeks ago', avatar: 'UT'
    },
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
    { id: 'overview', label: 'Overview', icon: <Info size={16} /> },
    { id: 'hotels', label: `Hotels (${hotels.length})`, icon: <Hotel size={16} /> },
    { id: 'restaurants', label: `Food (${restaurants.length})`, icon: <UtensilsCrossed size={16} /> },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <MessageSquare size={16} /> },
    { id: 'map', label: 'Map', icon: <MapPin size={16} /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-surface"
    >

      {/* ── BREADCRUMB ── */}
      <div className="bg-surface border-b border-white/5 py-3 overflow-x-auto scroll-hide">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 text-[12px] md:text-sm text-text-muted whitespace-nowrap">
            <button onClick={() => navigate('/')} className="hover:text-accent transition-colors">Home</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate('/destinations')} className="hover:text-accent transition-colors">Destinations</button>
            <ChevronRight size={14} />
            <span className="text-accent truncate max-w-[150px] md:max-w-none">{place?.name || 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* ── IMAGE GALLERY ── */}
      <div className="relative h-[350px] md:h-[520px] overflow-hidden bg-surface-2 group/gallery">

        {/* Main image */}
        <motion.img
          key={activeImage}
          src={(place.images && place.images[activeImage]) || place.image_url || `https://picsum.photos/seed/${place.slug}/1400/600`}
          alt={place.name}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = `https://picsum.photos/seed/${place.slug}${activeImage}/1400/600` }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Lightbox button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 bg-black/50 border border-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-black/70 transition-all backdrop-blur-md text-[12px] md:text-[14px]"
        >
          <Camera size={14} /> View All Photos
        </button>

        {/* Image navigation arrows */}
        {(place.images && place.images.length > 1) && (
          <>
            <button
              onClick={() => setActiveImage(i => i === 0 ? place.images.length - 1 : i - 1)}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 border border-white/20 text-white w-10 h-10 md:w-11 md:h-11 rounded-full items-center justify-center hover:bg-accent hover:border-accent transition-all backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setActiveImage(i => (i + 1) % place.images.length)}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 border border-white/20 text-white w-10 h-10 md:w-11 md:h-11 rounded-full items-center justify-center hover:bg-accent hover:border-accent transition-all backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Thumbnail dots */}
        {(place.images && place.images.length > 1) && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
            {place.images.map((_, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeImage ? 'w-6 bg-accent' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        )}

        {/* LIVE viewer count badge */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md border border-accent/30 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] md:text-[13px] text-white">
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_#4CAF8A]" />
          <Eye size={14} className="text-accent" /> {(viewCount || 0).toLocaleString()} viewed today
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setLightboxOpen(false)}
          >
            <button onClick={() => setLightboxOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px' }}
            ><X size={20} /></button>
            <img
              src={place.images?.[activeImage] || `https://picsum.photos/seed/${place.slug}${activeImage}/1200/800`}
              alt=""
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">

          {/* LEFT COLUMN */}
          <div>

            {/* Title + Actions Row */}
            <div className="mb-10">

              {/* Tags row */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="badge-province">{place.province.replace(/-/g, ' ').toUpperCase()}</span>
                <span className="badge-category">{place.category}</span>
                <span className="badge-season">Best: {place.best_season.replace('_', ' ')}</span>
                <span className="badge-difficulty" data-level={place.difficulty}>{place.difficulty}</span>
              </div>

              {/* Name + Stars + Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-text-primary leading-tight m-0">
                    {place.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-[15px]">
                    <div className="flex items-center gap-1 text-accent">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={18} fill={s <= Math.floor(place?.rating_avg || 4.5) ? '#D4A017' : 'none'} />
                      ))}
                      <span className="font-bold ml-1">{place?.rating_avg || 4.5}</span>
                    </div>
                    <span className="text-text-muted">({(place?.review_count || 0).toLocaleString()} reviews)</span>
                    <span className="text-text-muted hidden md:inline">·</span>
                    <span className="text-text-muted flex items-center gap-1.5">
                      <Clock size={14} /> {place?.ideal_duration || '3-4 Days'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 w-full md:w-auto">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all text-sm font-bold ${isSaved ? 'border-danger bg-danger/10 text-danger' : 'border-white/10 bg-surface-2 text-text-muted hover:text-text-primary hover:border-white/20'}`}
                  >
                    <Heart size={16} fill={isSaved ? '#E05C5C' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleShare}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-surface-2 text-text-muted hover:text-text-primary hover:border-white/20 transition-all text-sm font-bold"
                  >
                    <Share2 size={16} /> Share
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="flex gap-1 border-b border-white/5 mb-8 overflow-x-auto scroll-hide pb-0.5">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 border-b-2 transition-all text-sm font-bold whitespace-nowrap ${activeTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text-primary'}`}
                >{tab.icon}{tab.label}</button>
              ))}
            </div>

            {/* ── TAB CONTENT ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >

                {/* ─── OVERVIEW TAB ─── */}
                {activeTab === 'overview' && (
                  <div className="space-y-10">
                    {/* Description */}
                    <p className="text-[16px] md:text-[18px] leading-relaxed text-text-secondary">
                      {place.description}
                    </p>

                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { icon: <MapPin size={20} className="text-accent" />, label: 'Province', value: place.province.replace(/-/g, ' ') },
                        { icon: <Mountain size={20} className="text-accent" />, label: 'Category', value: place.category },
                        { icon: <Sun size={20} className="text-accent" />, label: 'Best Season', value: place.best_season.replace('_', ' ') },
                        { icon: <Compass size={20} className="text-accent" />, label: 'Difficulty', value: place.difficulty },
                        { icon: <Clock size={20} className="text-accent" />, label: 'Ideal Stay', value: place.ideal_duration },
                        { icon: <ShieldCheck size={20} className="text-accent" />, label: 'Status', value: 'Verified' },
                      ].map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="bg-surface-2 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 group hover:border-accent/30 transition-all"
                        >
                          {item.icon}
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{item.label}</p>
                            <p className="text-[14px] md:text-[16px] font-heading font-bold text-text-primary capitalize">{item.value}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Travel Tips */}
                    <div className="bg-surface-2 border border-white/5 rounded-[2rem] p-8 space-y-6">
                      <h3 className="font-heading text-xl font-bold text-text-primary flex items-center gap-3">
                        <Zap size={20} className="text-accent" /> Essential Travel Intel
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(place.tags || []).map((tag, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0 shadow-[0_0_8px_#D4A017]" />
                            <span className="text-sm md:text-[15px] text-text-secondary leading-relaxed">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── HOTELS TAB ─── */}
                {activeTab === 'hotels' && (
                  <div className="space-y-4">
                    {hotels.length === 0 ? (
                      <EmptyState icon={<Hotel size={40} />} title="No hotels listed yet" sub="Check back soon — we're adding hotels for this destination." />
                    ) : hotels.map((hotel, i) => (
                      <motion.div key={hotel.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-accent/30 transition-all group"
                      >
                        <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden">
                          <img src={`https://picsum.photos/seed/${hotel.name}/400/300`} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex gap-0.5">
                            {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} size={10} fill='#D4A017' className="text-accent" />)}
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-heading text-lg font-bold text-text-primary">{hotel.name}</h4>
                              <span className="text-accent font-heading font-bold text-xl">PKR {hotel.price_per_night.toLocaleString()} <span className="text-[10px] text-text-muted font-body uppercase tracking-widest">/night</span></span>
                            </div>
                            <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{hotel.description}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {(hotel.amenities || []).slice(0, 4).map(a => (
                                <span key={a} className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] uppercase font-bold text-text-muted tracking-wider">{a}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            className="w-full md:w-auto self-end px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-light transition-colors"
                            onClick={() => toast.success(`Booking info: ${hotel.contact || 'Contact via ROAM PK'}`)}
                          >Book Sanctuary</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ─── RESTAURANTS TAB ─── */}
                {activeTab === 'restaurants' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {restaurants.length === 0 ? (
                      <EmptyState icon={<UtensilsCrossed size={40} />} title="No restaurants listed yet" sub="We're adding local food spots soon!" />
                    ) : restaurants.map((rest, i) => (
                      <motion.div key={rest.id}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-all group"
                      >
                        <div className="h-40 overflow-hidden relative">
                          <img src={`https://picsum.photos/seed/${rest.name}food/400/200`} alt={rest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5">
                            <Star size={12} fill='#D4A017' className="text-accent" />
                            <span className="text-[11px] font-bold text-white">{rest.rating || '4.4'}</span>
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          <h4 className="font-heading text-md font-bold text-text-primary">{rest.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            {(rest.cuisine_types || []).map(c => (
                              <span key={c} className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-md text-[10px] font-bold text-accent uppercase tracking-wider">{c}</span>
                            ))}
                          </div>
                          {rest.must_try && (
                            <p className="text-[12px] text-text-muted">
                              🍴 Must try: <span className="text-text-secondary font-bold">{rest.must_try}</span>
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ─── REVIEWS TAB ─── */}
                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Rating summary */}
                    <div className="bg-surface-2 border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-center">
                      <div className="text-center md:border-r md:border-white/5 md:pr-12">
                        <div className="font-heading text-7xl text-accent font-black leading-none">{place.rating_avg}</div>
                        <div className="flex gap-1 justify-center my-3">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill={s <= place.rating_avg ? '#D4A017' : 'none'} className="text-accent" />)}
                        </div>
                        <div className="text-[12px] uppercase font-bold tracking-widest text-text-muted">{place.review_count.toLocaleString()} Dispatch Reviews</div>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        {[5, 4, 3, 2, 1].map(star => (
                          <div key={star} className="flex items-center gap-4">
                            <span className="text-[11px] font-bold text-text-muted w-4">{star}</span>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 2}%` }}
                                className="h-full bg-accent rounded-full"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-text-muted w-8">{star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : '2%'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Write review */}
                    <div className="bg-surface-2 border border-white/5 rounded-[2rem] p-8 space-y-6">
                      <h4 className="font-heading text-xl font-bold text-text-primary">Transmit Experience</h4>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setReviewRating(s)} className="hover:scale-125 transition-transform">
                            <Star size={32} fill={s <= reviewRating ? '#D4A017' : 'none'} className="text-accent" />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="Log your journey..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-text-primary font-body text-[15px] focus:outline-none focus:border-accent/50 min-h-[120px] resize-none transition-all"
                      />
                      <button onClick={handleReviewSubmit} className="px-10 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg shadow-primary/20">Submit Review</button>
                    </div>
                  </div>
                )}

                {/* ─── MAP TAB ─── */}
                {activeTab === 'map' && (
                  <div className="space-y-6">
                    <div className="rounded-[2rem] overflow-hidden border border-white/10 h-[400px] bg-surface-2">
                      <Suspense fallback={<div className="h-full flex items-center justify-center text-text-muted uppercase tracking-widest font-black text-[10px]">Syncing Satellites...</div>}>
                        <DetailMap lat={place.lat} lng={place.lng} name={place.name} />
                      </Suspense>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <a href={`https://www.google.com/maps?q=${place.lat},${place.lng}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
                        <ExternalLink size={16} /> Intelligence Matrix
                      </a>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT STICKY SIDEBAR */}
          <aside className="lg:sticky lg:top-24 space-y-6">

            {/* Plan trip card */}
            <div className="bg-gradient-to-br from-primary to-primary-dark border border-white/10 rounded-[2.5rem] p-8 text-center space-y-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/10 text-3xl">🗺️</div>
              <div className="space-y-2">
                <h3 className="font-heading text-2xl font-black text-text-primary">Neural Planner</h3>
                <p className="text-sm text-text-primary/60 leading-relaxed">Let AI architect the perfect expedition for {place.name}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/plan?destination=${place.slug}`)}
                className="w-full py-4 bg-accent text-surface rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:bg-white transition-all"
              >✨ Generate Itinerary</motion.button>
            </div>

            {/* Weather card */}
            <div className="bg-surface-2 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="font-heading text-sm font-bold text-text-primary flex items-center gap-3 uppercase tracking-widest opacity-60">
                <Cloud size={18} className="text-accent" /> Local Atmos
              </h4>
              {weatherLoading ? (
                <div className="animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-2 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
              ) : weather?.current ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getWeatherLabel(weather.current.weathercode).icon}</span>
                    <div className="space-y-1">
                      <div className="font-heading text-4xl font-bold text-text-primary">{Math.round(weather.current.temperature_2m)}°C</div>
                      <div className="text-[10px] text-accent font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_#4CAF8A]" />
                        {getWeatherLabel(weather.current.weathercode).label}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                      <Wind size={12} className="text-accent" /> {weather.current.windspeed_10m} km/h
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-danger font-black uppercase tracking-widest text-center py-4">Data Stream Offline</div>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-surface-2 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="font-heading text-sm font-bold text-text-primary flex items-center gap-3 uppercase tracking-widest opacity-60">
                <TrendingUp size={18} className="text-accent" /> Vault Info
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Local Sanctuaries', value: hotels.length || '2–5' },
                  { label: 'Gastronomy Hubs', value: restaurants.length || '5–10' },
                  { label: 'Ideal Cohort', value: place.difficulty === 'easy' ? 'All Citizens' : 'Active Explorers' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-end pb-3 border-b border-white/[0.03]">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.label}</span>
                    <span className="text-[12px] font-heading font-bold text-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

// EmptyState helper component
function EmptyState({ icon, title, sub }) {
  return (
    <div className="text-center py-20 px-6 border border-white/5 border-dashed rounded-[2rem] bg-surface-2/50">
      <div className="opacity-20 mb-6 flex justify-center">{icon}</div>
      <h3 className="font-heading text-lg font-bold text-text-muted mb-2">{title}</h3>
      <p className="text-sm text-text-muted/60 max-w-xs mx-auto">{sub}</p>
    </div>
  )
}

