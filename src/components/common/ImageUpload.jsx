import { useState, useRef } from 'react'
import { Camera, Upload, X, Loader } from 'lucide-react'
import { uploadService } from '../../api'

export default function ImageUpload({ value, onChange, label = 'Player Photo' }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    setError(null)
    try {
      const { url } = await uploadService.image(file)
      onChange(url)
    } catch (err) {
      // Fallback to local preview if backend is unavailable
      const reader = new FileReader()
      reader.onload = (e) => onChange(e.target.result)
      reader.readAsDataURL(file)
      setError('Uploaded locally (backend unavailable)')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-400">{label}</label>
      <div
        className={`relative w-40 h-48 rounded-xl border-2 border-dashed overflow-hidden transition-all cursor-pointer group ${
          dragging ? 'border-befa-green bg-befa-green/5'
          : value ? 'border-zinc-800' : 'border-zinc-800 hover:border-zinc-700'
        }`}
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
      >
        {value ? (
          <>
            <img src={value} alt="Player" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange('') }}
              className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Loader className="w-6 h-6 animate-spin text-befa-green" />
            <span className="text-[10px] mt-2">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 group-hover:text-gray-400 transition-colors px-3">
            <Upload className="w-6 h-6 mb-2" />
            <span className="text-[10px] text-center leading-tight">Drop image or click to upload</span>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-amber-400">{error}</p>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  )
}
