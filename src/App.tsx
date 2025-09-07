import React, { useState } from 'react'
import { Shield } from 'lucide-react'
import SearchBar from './components/SearchBar'
import SearchResult from './components/SearchResult'
import { Member } from './lib/supabase'

function App() {
  const [searchResult, setSearchResult] = useState<Member | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearchResult = (member: Member | null) => {
    setSearchResult(member)
    setHasSearched(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-3 mb-2">
            <div className="bg-black p-3 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              adeam-assurance
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Recherche des membres adhérents
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="mb-8">
            <SearchBar onResult={handleSearchResult} />
          </div>

          {/* Results Section */}
          <SearchResult member={searchResult} searched={hasSearched} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2025 adeam-assurance. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default App