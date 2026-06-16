'use client'
import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { createClient } from '@supabase/supabase-js'

// Initializing the Supabase Client using your project environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Internal component to render the 360-degree environment mapping
function VideoSphere({ videoElement }) {
  const texture = new THREE.VideoTexture(videoElement)
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    // Inverting the mesh scale on X axis flips the video texture inside out
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default function HazardVideoScene({ lang, onComplete, pointsPerTap = 15 }) {
  const videoRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [hazardActive, setHazardActive] = useState(false)
  const [score, setScore] = useState(0)
  const [hasClickedCurrentHazard, setHasClickedCurrentHazard] = useState(false)
  const [timeline, setTimeline] = useState(null)

  // 1. Fetch video metadata and hazard timing configs from Supabase
  useEffect(() => {
    async function fetchTimeline() {
      try {
        const { data, error } = await supabase
          .from('hazard_timelines')
          .select('*')
          .eq('module_slug', 'safe-driving')
          .single()

        if (error) throw error
        if (data) {
          setTimeline(data)
          setVideoUrl(data.video_url)
        }
      } catch (err) {
        console.error('Error fetching timeline from Supabase:', err)
        // Fallback safety values if your database connection drops
        setTimeline({ start_time: 5.0, end_time: 9.0 })
        setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-driving-in-the-rain-in-a-city-41617-large.mp4')
      } finally {
        setLoading(false)
      }
    }
    fetchTimeline()
  }, [])

  // 2. Setup HTML5 Video streams and tracking event listeners
  useEffect(() => {
    if (!videoUrl) return

    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = 'anonymous'
    video.playsInline = true
    video.webkitPlaysInline = true
    video.muted = true // Muted is mandatory for modern browsers to allow programmatic play triggers
    videoRef.current = video

    const handleTimeUpdate = () => {
      if (!timeline) return
      const time = video.currentTime
      setCurrentTime(time)

      // Evaluate if current timestamp matches the danger zone loaded from database
      if (time >= timeline.start_time && time <= timeline.end_time) {
        setHazardActive(true)
      } else {
        setHazardActive(false)
        setHasClickedCurrentHazard(false) // Reset click allowance for subsequent hazards
      }
    }

    const handleVideoEnded = () => {
      // Pass the final total score back out to your module layout parent component
      onComplete(score)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleVideoEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleVideoEnded)
      video.pause()
    }
  }, [videoUrl, timeline, score, onComplete])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(err => console.log('Playback blocked by browser settings:', err))
    }
    setIsPlaying(!isPlaying)
  }

  const handleHazardTap = () => {
    if (hazardActive && !hasClickedCurrentHazard) {
      setScore(prev => prev + pointsPerTap)
      setHasClickedCurrentHazard(true)
      alert(lang === 'en' ? '🎯 Hazard Spotted!' : '🎯 Bahaya Terdeteksi!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <p>{lang === 'en' ? 'Loading video scenario...' : 'Memuat skenario video...'}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
      
      {/* 3D Render Canvas Viewport */}
      <div className="absolute inset-0 w-full h-full z-0">
        {videoRef.current && (
          <Canvas camera={{ position: [0, 0, 0.1], fov: 70 }}>
            <VideoSphere videoElement={videoRef.current} />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              reverseOrbit={true}
            />
          </Canvas>
        )}
      </div>

      {/* 2D HUD UI Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
        
        {/* Top Section: Live Score & Timer Status */}
        <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/50 pointer-events-auto">
          <div className="text-xs text-gray-400 font-medium">
            {lang === 'en' ? 'Drag to look 360°' : 'Geser untuk melihat 360°'}
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">
            {score} PTS
          </div>
          <div className="text-xs text-gray-300 font-mono bg-slate-950 px-2 py-0.5 rounded">
            {currentTime.toFixed(1)}s
          </div>
        </div>

        {/* Middle Section: Dynamic Reflex Button */}
        <div className="flex items-center justify-center h-full w-full">
          {isPlaying && (
            <button
              onClick={handleHazardTap}
              disabled={hasClickedCurrentHazard}
              className={`pointer-events-auto px-8 py-4 rounded-full font-black text-white text-lg tracking-wider transition-all duration-300 transform active:scale-95 shadow-lg
                ${hazardActive && !hasClickedCurrentHazard 
                  ? 'bg-red-600 hover:bg-red-700 animate-bounce border-4 border-white' 
                  : 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 text-gray-400'
                }`}
            >
              {hazardActive && !hasClickedCurrentHazard 
                ? (lang === 'en' ? '⚠️ TAP HAZARD!' : '⚠️ KETIK BAHAYA!') 
                : (lang === 'en' ? 'LOOK FOR HAZARDS' : 'CARI BAHAYA JALANAN')}
            </button>
          )}
        </div>

        {/* Bottom Section: Media Controls */}
        <div className="flex justify-center pointer-events-auto w-full">
          <button 
            onClick={togglePlay}
            className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all uppercase ${
              isPlaying 
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                : 'bg-red-600 text-white hover:bg-red-500'
            }`}
          >
            {isPlaying 
              ? (lang === 'en' ? '⏸ Pause Simulation' : '⏸ Jeda Simulasi') 
              : (lang === 'en' ? '▶ Start Simulation' : '▶ Mulai Simulasi')}
          </button>
        </div>

      </div>
    </div>
  )
}