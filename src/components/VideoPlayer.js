'use client'
import { useRef, useState, useEffect, useCallback } from 'react'

export default function VideoPlayer({
  src,
  title = 'Video',
  onHazardTap,
  hazardMode = false,
  spotMode = false,
  onSpotMistake,
  maxTaps = 5,
  pointsPerTap = 10,
  onComplete,
}) {
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [taps, setTaps] = useState([])
  const [mistakes, setMistakes] = useState([])
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [feedbackPos, setFeedbackPos] = useState(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) videoRef.current.pause()
    else videoRef.current.play()
    setPlaying(p => !p)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoaded = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }

  const handleEnded = () => {
    setPlaying(false)
    setCompleted(true)
    if (onComplete) onComplete(score)
  }

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pct * duration
  }

  const handleOverlayTap = useCallback((e) => {
    if (!videoRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) / rect.width * 100
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) / rect.height * 100
    const timestamp = videoRef.current.currentTime

    if (hazardMode) {
      if (taps.length >= maxTaps) return
      const tap = { x, y, timestamp, id: Date.now() }
      setTaps(prev => [...prev, tap])
      setFeedbackPos({ x, y })
      setScore(s => s + pointsPerTap)
      if (onHazardTap) onHazardTap(tap)
      setTimeout(() => setFeedbackPos(null), 800)
    }

    if (spotMode) {
      const mistake = { x, y, timestamp, id: Date.now(), count: mistakes.length + 1 }
      setMistakes(prev => [...prev, mistake])
      setScore(s => s + pointsPerTap)
      if (onSpotMistake) onSpotMistake(mistake)
      setFeedbackPos({ x, y })
      setTimeout(() => setFeedbackPos(null), 800)
    }
  }, [hazardMode, spotMode, taps, mistakes, maxTaps, pointsPerTap, onHazardTap, onSpotMistake])

  const formatTime = (t) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!src) {
    return (
      <div className="rounded-xl overflow-hidden border border-nestle-blue/30 bg-nestle-navy">
        <div className="aspect-video flex flex-col items-center justify-center gap-3">
          <div className="text-5xl">🎬</div>
          <p className="text-gray-400 font-semibold">{title}</p>
          <p className="text-gray-600 text-sm text-center px-4">
            Video asset not loaded.<br/>
            Place video at <code className="text-neon-cyan">/public/videos/{title.toLowerCase().replace(/\s+/g,'-')}.mp4</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-nestle-blue/30 bg-nestle-navy">
      <div className="relative aspect-video bg-black cursor-crosshair"
        ref={overlayRef}
        onClick={handleOverlayTap}
        onTouchEnd={handleOverlayTap}>
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoaded}
          onEnded={handleEnded}
          playsInline
        />
        {feedbackPos && (
          <div className="absolute pointer-events-none animate-shield-flash"
            style={{ left: `${feedbackPos.x}%`, top: `${feedbackPos.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="w-12 h-12 rounded-full border-4 border-neon-green flex items-center justify-center">
              <span className="text-neon-green font-bold text-xs">+{pointsPerTap}</span>
            </div>
          </div>
        )}
        {taps.map(tap => (
          <div key={tap.id} className="absolute pointer-events-none"
            style={{ left: `${tap.x}%`, top: `${tap.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="w-6 h-6 rounded-full border-2 border-neon-green/60 bg-neon-green/20" />
          </div>
        ))}
        {mistakes.map(m => (
          <div key={m.id} className="absolute pointer-events-none"
            style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="w-7 h-7 rounded-full border-2 border-neon-red/70 bg-neon-red/20 flex items-center justify-center">
              <span className="text-neon-red text-xs font-bold">{m.count}</span>
            </div>
          </div>
        ))}
        {!playing && (
          <button onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors">
            <div className="w-16 h-16 rounded-full bg-nestle-red/80 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
          </button>
        )}
        {(hazardMode || spotMode) && playing && (
          <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
            <div className="bg-black/60 rounded-lg px-3 py-1 text-xs text-neon-green font-bold">
              {hazardMode ? `${taps.length}/${maxTaps} hazards` : `${mistakes.length} mistakes`} • {score} pts
            </div>
            <div className="bg-nestle-red/80 rounded-lg px-3 py-1 text-xs text-white font-bold animate-pulse">
              TAP HAZARDS
            </div>
          </div>
        )}
      </div>
      <div className="p-3 bg-nestle-dark/80">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={togglePlay} className="text-white hover:text-neon-cyan transition-colors">
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </button>
          <span className="text-xs text-gray-400 tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="flex-1 h-1.5 bg-nestle-navy rounded-full cursor-pointer overflow-hidden" onClick={handleSeek}>
            <div className="h-full bg-neon-cyan rounded-full transition-all"
              style={{width: duration ? `${(currentTime/duration)*100}%` : '0%'}}/>
          </div>
        </div>
        {(hazardMode || spotMode) && (
          <p className="text-xs text-gray-500 text-center">
            {hazardMode ? `Tap on hazards as they appear • ${maxTaps - taps.length} taps remaining` : 'Tap every time you spot a mistake'}
          </p>
        )}
      </div>
    </div>
  )
}