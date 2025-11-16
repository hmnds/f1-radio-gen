'use client'

import { useState } from 'react'

export default function Home() {
  const [driverName, setDriverName] = useState('')
  const [situation, setSituation] = useState('')
  const [radioExchange, setRadioExchange] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!driverName.trim()) {
      setError('Please enter a driver name')
      return
    }

    if (!situation.trim()) {
      setError('Please enter a situation')
      return
    }

    setLoading(true)
    setError('')
    setRadioExchange('')

    try {
      const response = await fetch('http://localhost:8000/api/generate-radio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          driverName: driverName.trim(),
          situation: situation.trim()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || `HTTP ${response.status}: ${response.statusText}`)
      }

      setRadioExchange(data.exchange)
    } catch (err) {
      let errorMessage = 'An error occurred'
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Failed to connect to backend. Make sure the backend server is running on port 8000.'
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      console.error('Fetch error:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatRadioExchange = (exchange: string) => {
    return exchange.split('\n').map((line, index) => {
      if (line.trim() === '') return null
      
      if (line.startsWith('Driver:')) {
        return (
          <div key={index} className="mb-3 p-3 bg-red-900/30 rounded-lg border-l-4 border-red-500">
            <span className="font-bold text-red-400">Driver:</span>
            <span className="ml-2 text-gray-200">{line.replace('Driver:', '').trim()}</span>
          </div>
        )
      }
      
      if (line.startsWith('Engineer:')) {
        return (
          <div key={index} className="mb-3 p-3 bg-blue-900/30 rounded-lg border-l-4 border-blue-500">
            <span className="font-bold text-blue-400">Engineer:</span>
            <span className="ml-2 text-gray-200">{line.replace('Engineer:', '').trim()}</span>
          </div>
        )
      }
      
      return (
        <p key={index} className="mb-2 text-gray-300">
          {line}
        </p>
      )
    }).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
            F1 Radio Generator
          </h1>
          <p className="text-xl text-gray-300">
            Generate realistic F1 driver-engineer radio exchanges
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="space-y-4">
            <div>
              <label htmlFor="driverName" className="block text-sm font-medium mb-2 text-gray-300">
                Driver Name
              </label>
              <input
                id="driverName"
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g., Lewis Hamilton, Max Verstappen, Fernando Alonso"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="situation" className="block text-sm font-medium mb-2 text-gray-300">
                Situation
              </label>
              <input
                id="situation"
                type="text"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="e.g., tyres overheating, stuck behind slower car, safety car restart, final lap battle"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Generating...' : 'Generate Radio Exchange'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {radioExchange && (
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-red-400">
              Radio Exchange
            </h2>
            <div className="space-y-2">
              {formatRadioExchange(radioExchange)}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-400">Generating radio exchange...</p>
          </div>
        )}
      </div>
    </div>
  )
}
