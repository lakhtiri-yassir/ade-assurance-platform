import React, { useState } from 'react'
import { Database, CheckCircle, AlertCircle } from 'lucide-react'

export default function DatabaseSetup() {
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setupDatabase = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-database`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Setup failed')
      }

      setIsSetupComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSetupComplete) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Database setup completed! You can now search for members.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="text-center">
        <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Database Setup Required</h3>
        <p className="text-blue-700 mb-4">
          The members table needs to be created in your Supabase database.
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <button
          onClick={setupDatabase}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Setting up...</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              <span>Setup Database</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}