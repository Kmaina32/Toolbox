
import { 
  Video, 
  Music, 
  FileAudio, 
  Subtitles, 
  Mic, 
  Volume2, 
  Zap, 
  Headphones, 
  FileVideo,
  Scissors,
  Settings
} from 'lucide-react';
import { Category } from '../../types';
import { ToolDefinition } from '../base';

export const multimediaTools: ToolDefinition[] = [
  {
    id: 'audio-to-text',
    name: 'Audio Transcriber Pro',
    category: Category.AUDIO_VIDEO,
    toolType: 'extraction',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: Mic,
    description: 'Transform speech from audio or video files into accurate, punctuated text transcripts.',
    promptTemplate: 'Transcribe the following audio accurately. Include timestamps if possible and distinguish between different speakers.',
    systemInstruction: 'You are an expert transcriptionist. Provide clean, verbatim text with proper punctuation and speaker labeling.'
  },
  {
    id: 'video-to-text',
    name: 'Video Intelligence',
    category: Category.AUDIO_VIDEO,
    toolType: 'extraction',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: Video,
    description: 'Extract spoken content and visual descriptions from video files.',
    promptTemplate: 'Analyze this video. Provide a full transcription of the dialogue and describe the key visual events or changes in scene.',
  },
  {
    id: 'audio-to-subtitle',
    name: 'Subtitle Generator (SRT)',
    category: Category.AUDIO_VIDEO,
    toolType: 'extraction',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: Subtitles,
    description: 'Generate time-coded SRT or VTT subtitle files from audio or video.',
    promptTemplate: 'Generate a standard SRT subtitle file for the provided media. Ensure timings are synchronized with the speech.',
  },
  {
    id: 'audio-noise-remover',
    name: 'Vocal Enhancer',
    category: Category.AUDIO_VIDEO,
    toolType: 'optimization',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: Volume2,
    description: 'Analyze audio for background noise and provide a cleaner, normalized transcription.',
    promptTemplate: 'Analyze this audio. Identify background noise, clicks, or hums, and provide a high-fidelity transcription of the primary voice only.',
  },
  {
    id: 'podcast-enhancer',
    name: 'Podcast Scribe',
    category: Category.AUDIO_VIDEO,
    toolType: 'extraction',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: Headphones,
    description: 'Turn long podcast recordings into structured show notes, chapters, and quotes.',
    promptTemplate: 'Process this podcast audio. Create: 1. A summary, 2. Timestamps for key topics, 3. Top 5 pull-quotes, 4. Suggested social media snippets.',
  },
  {
    id: 'video-compress-guide',
    name: 'Video Optimizer',
    category: Category.AUDIO_VIDEO,
    toolType: 'optimization',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: Zap,
    description: 'Analyze video bitrate and resolution to provide optimization recommendations for web/mobile.',
    promptTemplate: 'Review the technical specs of this video. Suggest specific compression settings (codec, bitrate, CRF) to reduce size by 50% without quality loss.',
  },
  {
    id: 'audio-volume-normalizer',
    name: 'Loudness Analyst',
    category: Category.AUDIO_VIDEO,
    toolType: 'optimization',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: Settings,
    description: 'Check audio loudness (LUFS) and provide normalization corrections.',
    promptTemplate: 'Analyze the volume levels of this audio. Report the integrated LUFS and provide target adjustments for Spotify/YouTube standards.',
  },
  {
    id: 'meeting-recording-to-notes',
    name: 'Meeting Recorder AI',
    category: Category.AUDIO_VIDEO,
    toolType: 'extraction',
    // Added uiMode: processor for multimedia processing
    uiMode: 'processor',
    icon: FileVideo,
    description: 'Deep analysis of video meetings to extract decisions, action items, and mood.',
    promptTemplate: 'Summarize this meeting video. Extract every action item with assigned owners and summarize the general sentiment of the discussion.',
  }
];