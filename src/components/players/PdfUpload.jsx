import { useState, useRef } from 'react'
import { FileText, Upload, Loader, CheckCircle, AlertTriangle } from 'lucide-react'
import { useExtractFromPdf } from '../../hooks'

export default function PdfUpload({ onExtracted }) {
  const [file, setFile] = useState(null)
  const { execute: extract, loading, error } = useExtractFromPdf()
  const [success, setSuccess] = useState(false)
  const fileRef = useRef(null)

  const handleFile = async (f) => {
    if (!f || f.type !== 'application/pdf') return
    setFile(f)
    setSuccess(false)
    try {
      const extractedData = await extract(f)
      onExtracted(extractedData)
      setSuccess(true)
    } catch {
      // error state handled by hook
    }
  }

  const reset = () => { setFile(null); setSuccess(false) }

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Upload Filled Registration Form</h3>
          <p className="text-[11px] text-gray-500">Upload a scanned or digitally filled PDF to auto-extract player data</p>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          loading ? 'border-amber-500/30 bg-amber-500/5'
          : success ? 'border-befa-green/30 bg-befa-green/5'
          : error ? 'border-red-500/30 bg-red-500/5'
          : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
        }`}
        onClick={() => !loading && fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-amber-400 animate-spin" />
            <div>
              <p className="text-sm text-white font-medium">Processing PDF...</p>
              <p className="text-xs text-gray-500 mt-1">Running OCR and extracting player data</p>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-8 h-8 text-befa-green" />
            <div>
              <p className="text-sm text-white font-medium">Data Extracted</p>
              <p className="text-xs text-gray-500 mt-1">Form fields have been auto-filled. Review below before saving.</p>
              {file && <p className="text-[11px] text-gray-600 mt-2">{file.name}</p>}
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); reset() }}
              className="text-xs text-befa-green hover:text-befa-green-light cursor-pointer">Upload another</button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-sm text-white font-medium">Extraction Failed</p>
              <p className="text-xs text-red-400 mt-1">{error}</p>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); reset() }}
              className="text-xs text-gray-400 hover:text-white cursor-pointer">Try again</button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-300">Drop a PDF here or <span className="text-befa-green">browse</span></p>
              <p className="text-[11px] text-gray-600 mt-1">Supports scanned forms & digitally filled PDFs</p>
            </div>
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

      <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="text-gray-400 font-medium">How it works:</span> The backend uses OCR (Tesseract) for scanned forms
          and PDF text extraction for digital forms. Extracted data auto-fills the registration form for review before saving.
        </p>
      </div>
    </div>
  )
}
