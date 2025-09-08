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
              <img 
                src="/logo-ade.png" 
                alt="Adeam Assurance Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to shield icon if logo doesn't load
                  console.error('Logo failed to load, using fallback icon');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Show the fallback shield icon
                  const container = target.parentElement;
                  if (container && !container.querySelector('.fallback-icon')) {
                    const fallbackIcon = document.createElement('div');
                    fallbackIcon.className = 'fallback-icon';
                    fallbackIcon.innerHTML = '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>';
                    container.appendChild(fallbackIcon);
                  }
                }}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              ADEAM ASSURANCE
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
        <p>&copy; 2025 ADEAM ASSURANCE. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default App