/**
 * Voice Input Scaffold
 * ─────────────────────────────────────────────────────────────────────────
 * Placeholder for voice-to-browser-command pipeline.
 *
 * Integration points:
 *   Frontend: attach a non-invasive voice hook to the Hana chat component
 *             following the existing AFROMATIONS design pattern (dark/red/cream).
 *   Backend:  transcribed text is treated as a normal Hana tool request.
 *
 * Wire-up order:
 *   1. Browser/OS MediaRecorder API captures audio
 *   2. Audio chunk → transcription API (Whisper / ElevenLabs / Web Speech API)
 *   3. Transcript → parseVoiceCommand() → HanaToolRequest
 *   4. HanaToolRequest → handleHanaRequest() in hana-adapter.ts
 */

import type { HanaToolRequest } from '../tools/hana-adapter.js';
import type { ToolName } from '../tools/registry.js';

// ── Transcript → command mapping ───────────────────────────────────────────

interface VoiceCommand {
  pattern: RegExp;
  tool: ToolName;
  extract: (match: RegExpMatchArray) => Record<string, unknown>;
}

const VOICE_COMMANDS: VoiceCommand[] = [
  {
    pattern: /^(?:open|go to|navigate to)\s+(https?:\/\/\S+)/i,
    tool: 'browser.open',
    extract: (m) => ({ url: m[1] }),
  },
  {
    pattern: /^(?:click|press|tap)\s+(.+)/i,
    tool: 'browser.click',
    extract: (m) => ({ selector: m[1].trim() }),
  },
  {
    pattern: /^(?:type|enter|write)\s+"(.+?)"\s+(?:in|into)\s+(.+)/i,
    tool: 'browser.type',
    extract: (m) => ({ text: m[1], selector: m[2].trim() }),
  },
  {
    pattern: /^(?:take a )?screenshot/i,
    tool: 'browser.screenshot',
    extract: () => ({}),
  },
  {
    pattern: /^(?:read|get|show)\s+(?:the\s+)?(?:page\s+)?text/i,
    tool: 'browser.get_text',
    extract: () => ({}),
  },
  {
    pattern: /^(?:show|get)\s+(?:the\s+)?(?:console\s+)?logs/i,
    tool: 'browser.get_console_logs',
    extract: () => ({}),
  },
  {
    pattern: /^(?:close|stop|end)\s+(?:the\s+)?browser/i,
    tool: 'browser.close',
    extract: () => ({}),
  },
  {
    pattern: /^(?:reset|restart)\s+(?:the\s+)?(?:browser\s+)?session/i,
    tool: 'browser.reset_session',
    extract: () => ({}),
  },
];

export interface ParsedVoiceCommand {
  tool: ToolName;
  params: Record<string, unknown>;
  rawTranscript: string;
}

export function parseVoiceCommand(
  transcript: string,
  sessionId: string,
): ParsedVoiceCommand | null {
  const clean = transcript.trim();
  for (const cmd of VOICE_COMMANDS) {
    const match = clean.match(cmd.pattern);
    if (match) {
      return {
        tool: cmd.tool,
        params: { ...cmd.extract(match), sessionId },
        rawTranscript: clean,
      };
    }
  }
  return null;
}

export function voiceCommandToHanaRequest(
  parsed: ParsedVoiceCommand,
  actor = 'voice',
): HanaToolRequest {
  return {
    tool: parsed.tool,
    params: parsed.params,
    actor,
  };
}

// ── Transcription adapter interface ───────────────────────────────────────
// Implement this to plug in a real transcription service.

export interface TranscriptionAdapter {
  transcribe(audioBuffer: Buffer): Promise<string>;
}

export class WebSpeechApiAdapter implements TranscriptionAdapter {
  async transcribe(_audioBuffer: Buffer): Promise<string> {
    throw new Error(
      'WebSpeechApiAdapter must be implemented in the browser frontend. ' +
      'Use the SpeechRecognition API and POST transcripts to the harness.',
    );
  }
}

// Stub for ElevenLabs Speech-to-Text (wire up when ELEVENLABS_API_KEY is available)
export class ElevenLabsAdapter implements TranscriptionAdapter {
  async transcribe(_audioBuffer: Buffer): Promise<string> {
    throw new Error('ElevenLabsAdapter: not yet implemented. Set ELEVENLABS_API_KEY and wire up the STT endpoint.');
  }
}
