import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, User } from 'lucide-react'
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
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  // Request cancellation ref
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounced search function
  const debouncedSearch = useCallback(async (searchQuery: string) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .or(`nom.ilike.%${searchQuery}%,prenom.ilike.%${searchQuery}%`)
        .limit(5)

      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      if (error) throw error
      
      const filteredMembers = data?.filter(member => {
        const fullName = `${member.prenom} ${member.nom}`.toLowerCase()
        const reverseName = `${member.nom} ${member.prenom}`.toLowerCase()
        const searchQueryLower = searchQuery.toLowerCase()
        return fullName.includes(searchQueryLower) || reverseName.includes(searchQueryLower)
      }) || []

      // Use setTimeout to avoid blocking the UI
      setTimeout(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          setSuggestions(filteredMembers)
          setShowSuggestions(filteredMembers.length > 0)
          setSelectedIndex(-1)
          setIsLoading(false)
        }
      }, 0)
      
    } catch (error: any) {
      // Don't show error if request was just cancelled
      if (error.name !== 'AbortError') {
        console.error('Error searching members:', error)
        setTimeout(() => {
          if (!abortControllerRef.current?.signal.aborted) {
            setSuggestions([])
            setShowSuggestions(false)
            setIsLoading(false)
          }
        }, 0)
      }
    }
  }, [])

  // Handle input change with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer - search after 400ms of no typing
    debounceTimerRef.current = setTimeout(() => {
      debouncedSearch(newQuery)
    }, 400)
  }, [debouncedSearch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

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

  const selectMember = useCallback((member: Member) => {
    const fullName = `${member.prenom} ${member.nom}`
    setQuery(fullName)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    onResult(member)
  }, [onResult])

  const handleSearch = useCallback(async () => {
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

      setTimeout(() => {
        onResult(member || null)
        setShowSuggestions(false)
        setIsLoading(false)
      }, 0)
      
    } catch (error) {
      console.error('Error searching member:', error)
      setTimeout(() => {
        onResult(null)
        setIsLoading(false)
      }, 0)
    }
  }, [query, onResult])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }, [handleSearch])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="TAPEZ VOTRE NOM COMPLET"
            className="w-full pl-12 pr-4 py-4 text-lg font-medium text-gray-800 placeholder-gray-400 bg-white border-0 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:shadow-xl transition-all duration-300"
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