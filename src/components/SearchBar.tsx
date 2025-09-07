import React, { useState, useEffect, useRef } from 'react'
import { Search, Download, User } from 'lucide-react'
import { supabase, Member } from '../lib/supabase'

interface SearchBarProps {
  onResult: (member: Member | null) => void
}

export default function SearchBar({ onResult }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Member[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const searchMembers = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%`)
          .limit(5)

        if (error) throw error
        
        const filteredMembers = data?.filter(member => {
          const fullName = `${member.prenom} ${member.nom}`.toLowerCase()
          const reverseName = `${member.nom} ${member.prenom}`.toLowerCase()
          const searchQuery = query.toLowerCase()
          return fullName.includes(searchQuery) || reverseName.includes(searchQuery)
        }) || []

        setSuggestions(filteredMembers)
        setShowSuggestions(filteredMembers.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error searching members:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchMembers, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectMember(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest'
      })
    }
  }, [selectedIndex])

  const selectMember = (member: Member) => {
    const fullName = `${member.prenom} ${member.nom}`
    setQuery(fullName)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    onResult(member)
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')

      if (error) throw error

      const member = data?.find(m => {
        const fullName = `${m.prenom} ${m.nom}`.toLowerCase()
        const reverseName = `${m.nom} ${m.prenom}`.toLowerCase()
        const searchQuery = query.toLowerCase().trim()
        return fullName === searchQuery || reverseName === searchQuery
      })

      onResult(member || null)
      setShowSuggestions(false)
    } catch (error) {
      console.error('Error searching member:', error)
      onResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="TAPEZ VOTRE NOM COMPLET"
            className="w-full pl-12 pr-4 py-4 text-lg font-medium text-gray-800 placeholder-gray-400 bg-white border-0 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:shadow-xl transition-all duration-300"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
            </div>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border-0 overflow-hidden z-50 max-h-60 overflow-y-auto">
            {suggestions.map((member, index) => (
              <button
                key={member.id}
                ref={el => suggestionRefs.current[index] = el}
                type="button"
                onClick={() => selectMember(member)}
                className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 flex items-center space-x-3 ${
                  selectedIndex === index ? 'bg-gray-50' : ''
                }`}
              >
                <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 font-medium">
                  {member.prenom} {member.nom}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}