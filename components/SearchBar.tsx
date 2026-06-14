'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    setValue(searchParams.get('search') ?? '')
  }, [searchParams])

  const handleSearch = (v: string) => {
    setValue(v)
    const params = new URLSearchParams(searchParams.toString())
    if (v.trim()) {
      params.set('search', v.trim())
    } else {
      params.delete('search')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Rezepte suchen..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={() => handleSearch('')}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
