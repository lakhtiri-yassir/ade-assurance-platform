import React from 'react'
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Member, supabase } from '../lib/supabase'

interface SearchResultProps {
  member: Member | null
  searched: boolean
}

export default function SearchResult({ member, searched }: SearchResultProps) {
  if (!searched) return null

  const handleDownload = async () => {
    if (!member) return
    
    try {
      // Get the public URL for the PDF
      const { data } = supabase.storage
        .from('pdfs')
        .getPublicUrl(member.pdf_name)
      
      if (data?.publicUrl) {
        // Create a download link
        const link = document.createElement('a')
        link.href = data.publicUrl
        link.download = member.pdf_name
        link.target = '_blank' // Open in new tab if direct download fails
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        throw new Error('Could not get file URL')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Erreur lors du téléchargement du fichier. Veuillez réessayer.')
    }
  }

  if (!member) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <p className="text-red-600 font-semibold text-lg">
            Personne non adhérente
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            <h3 className="text-xl font-bold text-gray-800">
              {member.prenom} {member.nom}
            </h3>
          </div>
          <p className="text-gray-600 font-medium mb-4">
            Fichier: {member.pdf_name}
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            <span>Télécharger PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}