'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

interface StudioTab {
  id: string
  name: string
  icon: string
}

const TABS: StudioTab[] = [
  { id: 'character', name: 'Create Character', icon: '人' },
  { id: 'scene', name: 'Design Scene', icon: '風' },
  { id: 'animation', name: 'Animate', icon: '動' },
  { id: 'export', name: 'Export', icon: '出' },
]

export function StudioInterface() {
  const [activeTab, setActiveTab] = useState<string>('character')
  const [prompt, setPrompt] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setGeneratedImages(prev => [...prev, `https://via.placeholder.com/400x500?text=${encodeURIComponent(prompt)}`])
      setIsGenerating(false)
      setPrompt('')
    }, 2000)
  }

  return (
    <div className="h-screen bg-(--af-black) flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <h1 className="text-xl font-bold text-(--af-cream)">DUAL Studio</h1>
          <span className="text-xs text-(--af-grey-light)">Powered by 200+ AI Models</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs px-3 py-1 border border-white/20 rounded text-(--af-grey-light) hover:text-(--af-cream)">
            Help
          </button>
          <button className="text-xs px-3 py-1 border border-white/20 rounded text-(--af-grey-light) hover:text-(--af-cream)">
            Settings
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Tabs */}
        <div className="w-32 border-r border-white/10 bg-(--af-grey)/30 p-4 space-y-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-3 rounded text-left text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-(--af-red) text-(--af-cream) font-semibold'
                  : 'text-(--af-grey-light) hover:bg-(--af-grey) hover:text-(--af-cream)'
              }`}
            >
              <span className="block text-lg mb-1">{tab.icon}</span>
              <span className="text-xs">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Input area */}
          <div className="border-b border-white/10 p-6 bg-(--af-grey)/20">
            <label className="block text-sm font-semibold text-(--af-cream) mb-3">
              {activeTab === 'character' && 'Describe your anime character'}
              {activeTab === 'scene' && 'Describe your scene'}
              {activeTab === 'animation' && 'Describe the animation'}
              {activeTab === 'export' && 'Select what to export'}
            </label>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={
                  activeTab === 'character' 
                    ? 'E.g., Anime girl, blonde hair, blue eyes, school uniform, happy expression'
                    : 'Enter your prompt...'
                }
                className="flex-1 bg-(--af-grey) border border-white/20 rounded px-4 py-3 text-(--af-cream) placeholder-gray-500 focus:outline-none focus:border-white/40"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`px-6 py-3 rounded font-semibold transition-all ${
                  isGenerating || !prompt.trim()
                    ? 'bg-(--af-grey) text-(--af-grey-light) cursor-not-allowed'
                    : 'bg-(--af-red) text-(--af-cream) hover:bg-(--af-red)/90'
                }`}
              >
                {isGenerating ? 'Creating...' : 'Generate'}
              </button>
            </div>

            <p className="text-xs text-(--af-grey-light) mt-3">
              💡 Tip: Be specific! Add style, emotion, clothing, and setting for best results.
            </p>
          </div>

          {/* Results grid */}
          <div className="flex-1 overflow-auto p-6">
            {generatedImages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <span className="text-5xl block mb-4">🎨</span>
                  <p className="text-(--af-grey-light) mb-2">
                    {activeTab === 'character' && 'Start by describing your anime character'}
                    {activeTab === 'scene' && 'Describe a scene to visualize'}
                    {activeTab === 'animation' && 'Upload images or describe an animation'}
                    {activeTab === 'export' && 'Generate content first, then export'}
                  </p>
                  <p className="text-xs text-(--af-grey-light)/60">
                    Your creations will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <img src={img} alt={`Generated ${i}`} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                      <button className="text-xs px-2 py-1 bg-(--af-red) text-(--af-cream) rounded hover:bg-(--af-red)/90">
                        Download
                      </button>
                      <button className="text-xs px-2 py-1 bg-(--af-grey) text-(--af-cream) rounded hover:bg-(--af-grey)/90">
                        Refine
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel - DUAL Tips */}
        <div className="w-64 border-l border-white/10 bg-(--af-grey)/30 p-6 overflow-auto text-sm">
          <h3 className="font-semibold text-(--af-cream) mb-4 flex items-center gap-2">
            <span>🤖</span> DUAL Tips
          </h3>
          
          <div className="space-y-4">
            {activeTab === 'character' && (
              <>
                <div className="p-3 bg-(--af-grey)/50 rounded border border-white/10">
                  <p className="font-semibold text-(--af-red) text-xs mb-1">Anime Style</p>
                  <p className="text-(--af-grey-light) text-xs">Use terms like cel-shaded, anime girl, manga, shoujo, cyberpunk anime</p>
                </div>
                <div className="p-3 bg-(--af-grey)/50 rounded border border-white/10">
                  <p className="font-semibold text-(--af-red) text-xs mb-1">Details Matter</p>
                  <p className="text-(--af-grey-light) text-xs">Include hair color, eye color, outfit, expressions for consistency</p>
                </div>
                <div className="p-3 bg-(--af-grey)/50 rounded border border-white/10">
                  <p className="font-semibold text-(--af-red) text-xs mb-1">Quick Start</p>
                  <p className="text-(--af-grey-light) text-xs">Try: "Anime girl, purple hair, confident smile, futuristic outfit"</p>
                </div>
              </>
            )}
            
            {activeTab === 'scene' && (
              <>
                <div className="p-3 bg-(--af-grey)/50 rounded border border-white/10">
                  <p className="font-semibold text-(--af-red) text-xs mb-1">Environments</p>
                  <p className="text-(--af-grey-light) text-xs">Schools, cities, nature, fantasy worlds, cyberpunk streets</p>
                </div>
                <div className="p-3 bg-(--af-grey)/50 rounded border border-white/10">
                  <p className="font-semibold text-(--af-red) text-xs mb-1">Lighting & Mood</p>
                  <p className="text-(--af-grey-light) text-xs">Sunset, moonlight, stormy, cinematic, golden hour</p>
                </div>
              </>
            )}

            <div className="mt-6 p-3 bg-(--af-red)/10 rounded border border-(--af-red)/30">
              <p className="text-(--af-red) font-semibold text-xs mb-2">✨ Pro Tip</p>
              <p className="text-xs text-(--af-grey-light)">Use the same description multiple times to generate variations of the same character</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
