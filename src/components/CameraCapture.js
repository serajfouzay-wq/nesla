'use client'
import { useRef, useState, useCallback } from 'react'

export default function CameraCapture({ onCapture, onSubmit, label = 'Capture Photo', maxPhotos = 5, points = 10 }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [active, setActive] = useState(false)
  const [photos, setPhotos] = useState([])
  const [labels, setLabels] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function startCamera() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setActive(true)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError(`Camera error: ${err.message}`)
      }
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setActive(false)
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    const photo = { id: Date.now(), dataUrl }
    setPhotos(prev => {
      const next = [...prev, photo]
      if (onCapture) onCapture(photo)
      if (next.length >= maxPhotos) stopCamera()
      return next
    })
  }, [maxPhotos, onCapture])

  function removePhoto(id) {
    setPhotos(p => p.filter(ph => ph.id !== id))
    setLabels(l => { const n = {...l}; delete n[id]; return n })
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files)
    files.slice(0, maxPhotos - photos.length).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        const photo = { id: Date.now() + Math.random(), dataUrl: ev.target.result }
        setPhotos(prev => [...prev, photo])
        if (onCapture) onCapture(photo)
      }
      reader.readAsDataURL(file)
    })
  }

  function handleSubmit() {
    const result = photos.map(p => ({ ...p, label: labels[p.id] || '' }))
    setSubmitted(true)
    stopCamera()
    if (onSubmit) onSubmit(result)
  }

  const score = photos.length * points

  return (
    <div className="space-y-4">
      {active && (
        <div className="relative rounded-xl overflow-hidden border border-neon-cyan/40 bg-black">
          <video ref={videoRef} className="w-full aspect-video object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-4 border-2 border-neon-cyan/30 rounded-lg">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-cyan rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-cyan rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-cyan rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-cyan rounded-br" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/70">
            <span className="text-neon-green text-sm font-bold">{photos.length}/{maxPhotos} captured</span>
            <button onClick={capturePhoto} disabled={photos.length >= maxPhotos}
              className="w-14 h-14 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 active:scale-90 transition-all flex items-center justify-center disabled:opacity-40">
              <div className="w-10 h-10 rounded-full bg-white" />
            </button>
            <button onClick={stopCamera} className="text-white/70 hover:text-white text-sm">Cancel</button>
          </div>
        </div>
      )}

      {!active && !submitted && (
        <div className="card text-center py-6">
          <p className="text-4xl mb-3">📷</p>
          <p className="font-bold text-white mb-1">{label}</p>
          <p className="text-gray-400 text-sm mb-4">Capture up to {maxPhotos} photos • {points} pts each</p>
          {error && <p className="text-neon-red text-sm mb-3 bg-neon-red/10 rounded-lg p-3">{error}</p>}
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={startCamera} className="btn-neon text-sm py-2 px-4">
              📷 Open Camera
            </button>
            <label className="btn-secondary text-sm py-2 px-4 cursor-pointer">
              📁 Upload Photos
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-neon-cyan">Captured Photos</p>
            <span className="score-counter text-sm">{score} pts</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {photos.map(photo => (
              <div key={photo.id} className="relative rounded-lg overflow-hidden border border-nestle-blue/30">
                <img src={photo.dataUrl} alt="capture" className="w-full aspect-video object-cover" />
                {!submitted && (
                  <button onClick={() => removePhoto(photo.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-neon-red rounded-full text-white text-xs flex items-center justify-center hover:scale-110 transition-transform">×</button>
                )}
                <div className="p-2">
                  {!submitted ? (
                    <input className="input text-xs py-1 px-2"
                      placeholder="Label this photo..."
                      value={labels[photo.id] || ''}
                      onChange={e => setLabels(l => ({...l, [photo.id]: e.target.value}))} />
                  ) : (
                    <p className="text-xs text-neon-green font-semibold">{labels[photo.id] || 'Submitted'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!submitted && photos.length > 0 && (
            <button onClick={handleSubmit} className="btn-primary w-full">
              Submit {photos.length} Photo{photos.length > 1 ? 's' : ''} (+{score} pts)
            </button>
          )}
          {!active && photos.length < maxPhotos && !submitted && (
            <button onClick={startCamera} className="btn-secondary w-full text-sm">
              + Add More Photos
            </button>
          )}
        </div>
      )}

      {submitted && (
        <div className="card text-center py-4">
          <p className="text-neon-green font-bold text-lg">✅ Photos Submitted!</p>
          <p className="score-counter text-2xl mt-1">+{score} pts</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}