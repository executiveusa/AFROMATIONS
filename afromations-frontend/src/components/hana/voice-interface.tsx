'use client'

import { useEffect, useState, useRef } from 'react'

interface VoiceInterfaceProps {
  prompt: string // Japanese text to speak for reference
  onRecordingComplete: (audioUrl: string, transcription: string) => void
  isListening?: boolean
}

export function VoiceInterface({
  prompt,
  onRecordingComplete,
  isListening = true,
}: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isBrowserSupported, setIsBrowserSupported] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Initialize Web Speech API on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsBrowserSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'ja-JP' // Japanese

    recognition.onstart = () => {
      console.log('Speech recognition started')
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + text + ' ')
        } else {
          interim += text
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
    }

    recognition.onend = () => {
      console.log('Speech recognition ended')
      setIsRecording(false)
    }

    recognitionRef.current = recognition
  }, [])

  // Initialize Media Recorder for audio capture
  useEffect(() => {
    if (typeof window === 'undefined') return

    const setupAudioRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        })

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/webm;codecs=opus',
          })
          const audioUrl = URL.createObjectURL(audioBlob)

          // Callback with audio URL and transcript
          onRecordingComplete(audioUrl, transcript)

          // Reset for next recording
          audioChunksRef.current = []
          setTranscript('')
        }

        mediaRecorderRef.current = mediaRecorder
      } catch (error) {
        console.error('Audio setup error:', error)
        setIsBrowserSupported(false)
      }
    }

    setupAudioRecording()
  }, [onRecordingComplete, transcript])

  const toggleRecording = () => {
    if (!recognitionRef.current || !mediaRecorderRef.current) {
      return
    }

    if (isRecording) {
      // Stop recording
      recognitionRef.current.stop()
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    } else {
      // Start recording
      audioChunksRef.current = []
      recognitionRef.current.start()
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  if (!isBrowserSupported) {
    return (
      <div className="p-4 bg-[var(--af-red)]/10 border border-[var(--af-red)]/30 rounded">
        <p className="text-[var(--af-red)] text-sm">
          Your browser doesn't support voice recording. Please use a modern browser like Chrome, Firefox, or Edge.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Reference text (what they should say) */}
      <div className="p-4 bg-[var(--af-grey-mid)]/50 border border-[var(--af-grey-light)]/20 rounded">
        <p className="text-xs font-semibold text-[var(--af-grey-light)] mb-2 uppercase tracking-wider">
          Say this:
        </p>
        <p className="text-lg font-semibold text-[var(--af-cream)]">{prompt}</p>
      </div>

      {/* Recording button */}
      <div className="flex gap-3 items-center">
        <button
          onClick={toggleRecording}
          className={`flex-1 py-3 px-4 rounded font-semibold text-sm tracking-wider transition-all ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-[var(--af-red)] hover:bg-[var(--af-red-dark)] text-[var(--af-cream)]'
          }`}
        >
          {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
        </button>

        {isRecording && (
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-[var(--af-grey-light)]">Recording...</span>
          </div>
        )}
      </div>

      {/* Live transcript */}
      {transcript && (
        <div className="p-3 bg-[var(--af-grey-mid)]/50 border border-green-500/30 rounded">
          <p className="text-xs font-semibold text-green-400 mb-1">Transcript:</p>
          <p className="text-sm text-[var(--af-cream)]">{transcript}</p>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-[var(--af-grey-light)]">
        💡 Speak clearly and naturally. Agent Hana will evaluate your pronunciation, grammar, and fluency.
      </p>
    </div>
  )
}
