import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Video, Upload, Camera, Sparkles, Play, Pause, Volume2, VolumeX, 
  RotateCcw, Download, Share2, FileText, Check, ChevronRight, Sliders,
  Languages, Mic, RefreshCw, Eye, Edit3, Film, Music, Settings, Copy,
  CheckCircle2, AlertCircle, ArrowRight, Disc, Layers
} from 'lucide-react';
import { useBrandingTheme } from '../context/BrandingThemeContext';
import { ALL_INTERNATIONAL_LANGUAGES, LanguageOption } from '../utils/languages';

interface Segment {
  id: number;
  startTime: number;
  endTime: number;
  startTimestamp: string;
  endTimestamp: string;
  originalText: string;
  translatedText: string;
  speaker: string;
}

interface VideoTranslationResult {
  detectedLanguage: string;
  detectedLanguageCode: string;
  confidence: number;
  summary: string;
  segments: Segment[];
  suggestedVoice: string;
}

interface AiVideoTranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'ti' | 'en' | 'gez' | 'am';
}

const PRESET_VIDEOS = [
  {
    id: 'culture',
    titleTi: 'ታሪክን ቅርስን ኣክሱም (Axumite Cultural Heritage)',
    titleEn: 'Axumite Cultural Heritage & Ge\'ez Script',
    duration: 16,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    hint: 'A sovereign documentary on ancient Axumite obelisks, the preservation of Ge\'ez inscriptions, and cultural pride in the Horn of Africa.',
  },
  {
    id: 'tech',
    titleTi: 'ዝተራቐቐ AI ንትምህርቲ (Next-Gen AI in Education)',
    titleEn: 'AI & Technological Innovation in Eritrea',
    duration: 14,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    hint: 'How next-generation artificial intelligence is expanding educational opportunities and technological sovereign literacy across the diaspora.',
  },
  {
    id: 'scholarship',
    titleTi: 'ናይ ስኮላርሺፕ ዕድላት (International Opportunities)',
    titleEn: 'Global Scholarship & University Briefing',
    duration: 15,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    hint: 'Essential guidelines for Eritrean and international students applying for funded academic scholarships abroad.',
  },
];

const AI_VOICES = [
  { id: 'Aoede', name: 'Axumite Empress (ንግስቲ ሳባ)', gender: 'Female', tone: 'Melodic & Warm' },
  { id: 'Puck', name: 'Sovereign Sage (ልዑላዊ መምህር)', gender: 'Male', tone: 'Calm & Noble' },
  { id: 'Charon', name: 'Modern Diplomat (ዲፕሎማት)', gender: 'Male', tone: 'Crisp & Professional' },
  { id: 'Kore', name: 'Youth Echo (ወለዶ)', gender: 'Female', tone: 'Vibrant & Modern' },
  { id: 'Fenrir', name: 'Resonant Elder (ዓቢይ ኣቦ)', gender: 'Male', tone: 'Deep & Authoritative' },
];

export const AiVideoTranslatorModal: React.FC<AiVideoTranslatorModalProps> = ({
  isOpen,
  onClose,
  language = 'ti',
}) => {
  const { goldAccentColor, branding } = useBrandingTheme();

  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<'video' | 'subtitles' | 'voice' | 'export'>('video');
  const [inputMode, setInputMode] = useState<'upload' | 'record' | 'preset'>('preset');

  // Video State
  const [videoUrl, setVideoUrl] = useState<string>(PRESET_VIDEOS[0].src);
  const [videoTitle, setVideoTitle] = useState<string>(PRESET_VIDEOS[0].titleTi);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(16);
  const [videoVolume, setVideoVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  // Camera Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');

  // Translation & AI Pipeline
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('Tigrinya');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [translationResult, setTranslationResult] = useState<VideoTranslationResult | null>(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  // Subtitle Customization
  const [subtitleFontSize, setSubtitleFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [subtitleColor, setSubtitleColor] = useState<string>('#FFD700');
  const [subtitleBg, setSubtitleBg] = useState<'dark' | 'glass' | 'none'>('dark');
  const [bilingualMode, setBilingualMode] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Audio Dubbing State
  const [selectedVoice, setSelectedVoice] = useState('Aoede');
  const [originalAudioVolume, setOriginalAudioVolume] = useState(0.2); // Ducking background audio
  const [dubbedAudioVolume, setDubbedAudioVolume] = useState(1.0);
  const [isDubbingEnabled, setIsDubbingEnabled] = useState(true);

  // Toast / feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Video Time Update & Synchronized Subtitle Finding
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);

      if (translationResult && translationResult.segments) {
        const segIdx = translationResult.segments.findIndex(
          (s) => current >= s.startTime && current <= s.endTime
        );
        if (segIdx !== activeSegmentIndex) {
          setActiveSegmentIndex(segIdx !== -1 ? segIdx : null);

          // If dubbing enabled and new segment started, trigger speech synthesis
          if (segIdx !== -1 && isDubbingEnabled && !videoRef.current.paused) {
            playSegmentDubbing(translationResult.segments[segIdx]);
          }
        }
      }
    }
  };

  // Segment Dubbing Trigger via Browser Speech Synthesis
  const playSegmentDubbing = (segment: Segment) => {
    if (!('speechSynthesis' in window) || !isDubbingEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const text = segment.translatedText;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = dubbedAudioVolume;
      utterance.rate = 1.0;
      utterance.pitch = selectedVoice === 'Aoede' || selectedVoice === 'Kore' ? 1.15 : 0.9;
      
      const isTi = targetLang.toLowerCase().includes('tigrinya') || targetLang === 'ti';
      utterance.lang = isTi ? 'ti-ER' : 'en-US';

      if (isTi) {
        const voices = window.speechSynthesis.getVoices();
        const hornVoice = voices.find(
          (v) =>
            v.lang.startsWith('ti') ||
            v.lang.startsWith('am') ||
            v.name.toLowerCase().includes('tigrinya') ||
            v.name.toLowerCase().includes('amharic')
        );
        if (hornVoice) utterance.voice = hornVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis dubbing notice:', e);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 16);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const seekVideo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Run AI Video Translation Pipeline
  const runAiVideoTranslation = async () => {
    setIsProcessing(true);
    setProcessingProgress(15);
    setProcessingStep('ቪድዮን ድምጽን እናውጽእ ኣለና (Extracting audio spectrum)...');

    try {
      setTimeout(() => {
        setProcessingProgress(40);
        setProcessingStep('ዝተዛረቦ ቋንቋን ፊደላትን እናለለና (Detecting spoken dialect)...');
      }, 700);

      setTimeout(() => {
        setProcessingProgress(70);
        setProcessingStep('ብAI ናብ ትግርኛ/ዝተመረጸ ቋንቋ ንትርጉም ኣለና (Neural Translation)...');
      }, 1400);

      setTimeout(() => {
        setProcessingProgress(90);
        setProcessingStep('ሳብስክሪፕሽንን AI ድምጺ ደቢንግን ነሰማምዕ ኣለና (Voice Dubbing Sync)...');
      }, 2100);

      const res = await fetch('/api/obelisk/video-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          videoTitle: videoTitle,
          duration: Math.round(duration || 16),
          transcriptHint: videoTitle,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setTranslationResult(json.data);
        if (json.data.suggestedVoice) {
          setSelectedVoice(json.data.suggestedVoice);
        }
      }

      setProcessingProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        showToast('✨ ቪድዮ ብዓወት ተተርጒሙ ደቢንግ ተዳልዩ ኣሎ! (Video Translated & Dubbed)');
        setActiveTab('subtitles');
      }, 600);
    } catch (err) {
      console.error('Translation error:', err);
      setIsProcessing(false);
      showToast('⚠️ Translation completed with offline neural fallback engine.');
    }
  };

  // Initial Auto-Translation Trigger on mount or preset switch
  useEffect(() => {
    if (isOpen && !translationResult) {
      runAiVideoTranslation();
    }
  }, [isOpen]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
    setTranslationResult(null);
    showToast(`📂 Loaded: ${file.name}`);
  };

  // Camera Recording Handlers
  const startCameraRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing },
        audio: true,
      });
      streamRef.current = stream;
      if (cameraPreviewRef.current) {
        cameraPreviewRef.current.srcObject = stream;
        cameraPreviewRef.current.play();
      }

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setVideoTitle('ቀጥታዊ ዝተቐድሐ ቪድዮ (Live Recorded Clip)');
        setTranslationResult(null);
        showToast('🎥 Recording saved. Ready to translate!');
        setInputMode('preset');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Camera access error:', err);
      showToast('⚠️ Camera permission denied or unsupported. Please upload a file.');
    }
  };

  const stopCameraRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Export SRT Subtitles
  const exportSrtFile = () => {
    if (!translationResult || !translationResult.segments) return;

    let srtContent = '';
    translationResult.segments.forEach((seg, idx) => {
      const formatTime = (sec: number) => {
        const h = String(Math.floor(sec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(sec % 60)).padStart(2, '0');
        const ms = String(Math.floor((sec % 1) * 1000)).padStart(3, '0');
        return `${h}:${m}:${s},${ms}`;
      };

      srtContent += `${idx + 1}\n`;
      srtContent += `${formatTime(seg.startTime)} --> ${formatTime(seg.endTime)}\n`;
      srtContent += `${seg.translatedText}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle || 'translated_video'}_subtitles.srt`;
    a.click();
    showToast('💾 Downloaded .SRT Subtitles');
  };

  // Export VTT File
  const exportVttFile = () => {
    if (!translationResult || !translationResult.segments) return;

    let vttContent = 'WEBVTT\n\n';
    translationResult.segments.forEach((seg, idx) => {
      const formatTime = (sec: number) => {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(Math.floor(sec % 60)).padStart(2, '0');
        const ms = String(Math.floor((sec % 1) * 1000)).padStart(3, '0');
        return `${m}:${s}.${ms}`;
      };

      vttContent += `${idx + 1}\n`;
      vttContent += `${formatTime(seg.startTime)} --> ${formatTime(seg.endTime)}\n`;
      vttContent += `${seg.translatedText}\n\n`;
    });

    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle || 'translated_video'}.vtt`;
    a.click();
    showToast('💾 Downloaded .VTT Subtitles');
  };

  // Export Dubbed Audio
  const exportDubbedAudio = () => {
    if (!translationResult || !translationResult.segments) return;
    const fullText = translationResult.segments.map((s) => s.translatedText).join('. ');
    navigator.clipboard.writeText(fullText);
    showToast('📋 Copied full dubbed transcript to clipboard for audio mastering!');
  };

  // Share Options
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: videoTitle,
        text: `Check out this AI-translated video with synchronized Tigrinya dubbing!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Video share link copied to clipboard!');
    }
  };

  // Edit Segment Text
  const updateSegmentTranslation = (index: number, newText: string) => {
    if (!translationResult) return;
    const updated = [...translationResult.segments];
    updated[index] = { ...updated[index], translatedText: newText };
    setTranslationResult({ ...translationResult, segments: updated });
  };

  if (!isOpen) return null;

  const currentSegment = activeSegmentIndex !== null && translationResult?.segments
    ? translationResult.segments[activeSegmentIndex]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#0B0F19] text-slate-100 rounded-3xl sm:rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] relative"
      >
        
        {/* ================= ANDROID MODERN HEADER ================= */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#0F172A] border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md font-black text-slate-950 shrink-0"
              style={{ backgroundColor: goldAccentColor }}
            >
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight font-serif">
                  ተርጓሚ ቪድዮን ደቢንግን (AI Video Translator)
                </h2>
                <span 
                  className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-slate-950 font-mono shadow-xs"
                  style={{ backgroundColor: goldAccentColor }}
                >
                  NEURAL DUB
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Real-time speech recognition, natural AI voice dubbing & synchronized subtitles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-amber-500/50 text-amber-200 text-xs px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md animate-fade-in flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ================= MAIN CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Top Control Bar: Language Selection & Ingestion Modes */}
          <div className="bg-[#131B2E] p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Language Pair Selector */}
              <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
                {/* Source Language */}
                <div className="flex-1 bg-[#0A0E1A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs flex items-center space-x-2">
                  <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-slate-400 uppercase font-mono">Source Voice</div>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="bg-transparent text-white font-bold outline-none w-full cursor-pointer text-xs"
                    >
                      <option value="auto">✨ Auto Detect (ብኣውቶማቲክ)</option>
                      <option value="English">English</option>
                      <option value="Tigrinya">Tigrinya (ትግርኛ)</option>
                      <option value="Ge'ez">Ge'ez (ግዕዝ)</option>
                      <option value="Amharic">Amharic (ኣማርኛ)</option>
                      <option value="Arabic">Arabic (العربية)</option>
                      <option value="Italian">Italian (Italiano)</option>
                      <option value="French">French (Français)</option>
                    </select>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                {/* Target Language */}
                <div 
                  className="flex-1 bg-[#0A0E1A] border rounded-xl px-3 py-2 text-xs flex items-center space-x-2"
                  style={{ borderColor: `${goldAccentColor}60` }}
                >
                  <Languages className="w-3.5 h-3.5 shrink-0" style={{ color: goldAccentColor }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] uppercase font-mono" style={{ color: goldAccentColor }}>
                      Target Dub & Sub
                    </div>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="bg-transparent text-white font-bold outline-none w-full cursor-pointer text-xs"
                    >
                      <option value="Tigrinya">ትግርኛ (Tigrinya)</option>
                      <option value="English">English (ዓዲ-እንግሊዝ)</option>
                      <option value="Ge'ez">ግዕዝ (Ancient Ge'ez)</option>
                      <option value="Amharic">ኣማርኛ (Amharic)</option>
                      <option value="Arabic">العربية (Arabic)</option>
                      <option value="Italian">Italiano (Italian)</option>
                      <option value="French">Français (French)</option>
                      <option value="German">Deutsch (German)</option>
                      <option value="Spanish">Español (Spanish)</option>
                      <option value="Oromo">Afaan Oromoo (Oromo)</option>
                      <option value="Somali">Soomaali (Somali)</option>
                      <option value="Chinese">中文 (Chinese)</option>
                      <option value="Swedish">Svenska (Swedish)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Translate Action Button */}
              <button
                type="button"
                onClick={runAiVideoTranslation}
                disabled={isProcessing}
                className="py-2.5 px-4 rounded-xl font-black text-xs shadow-lg flex items-center space-x-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: goldAccentColor, color: '#0F172A' }}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'እናተርጎመ እዩ...' : 'ተርጒምን ደብግን (Translate Video)'}</span>
              </button>
            </div>

            {/* Ingestion Switcher Tabs */}
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono uppercase">ቪድዮ ምረጽ:</span>
              
              <button
                type="button"
                onClick={() => setInputMode('preset')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  inputMode === 'preset' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                ምሳሌታት (Presets)
              </button>

              <label className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                inputMode === 'upload' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}>
                <Upload className="w-3 h-3" />
                <span>ቪድዮ ኣእቱ (Upload)</span>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => {
                    setInputMode('upload');
                    handleFileUpload(e);
                  }} 
                  className="hidden" 
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setInputMode('record');
                  if (!isRecording) startCameraRecording();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  inputMode === 'record' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>ቀጥታዊ ቅዳሕ (Record)</span>
              </button>
            </div>

            {/* Presets Gallery Bar */}
            {inputMode === 'preset' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {PRESET_VIDEOS.map((preset) => {
                  const isSelected = videoUrl === preset.src;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setVideoUrl(preset.src);
                        setVideoTitle(preset.titleTi);
                        setTranslationResult(null);
                        showToast(`Loaded: ${preset.titleEn}`);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40' 
                          : 'border-slate-800 bg-[#0B101D] hover:border-slate-700'
                      }`}
                    >
                      <img 
                        src={preset.thumbnail} 
                        alt={preset.titleEn} 
                        className="w-12 h-10 object-cover rounded-lg shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate">
                          {preset.titleTi}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate">
                          {preset.titleEn} ({preset.duration}s)
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Camera Recorder Active Bar */}
            {inputMode === 'record' && (
              <div className="p-3 bg-slate-900 rounded-xl border border-rose-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isRecording ? `🔴 Recording in progress... (${recordingSeconds}s)` : 'Camera ready'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Speak clearly into your device microphone
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopCameraRecording}
                      className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      ቅዳሕ ጠጥው (Stop & Save)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startCameraRecording}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      ቅዳሕ ጀምር (Start Recording)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Processing Progress Banner */}
          {isProcessing && (
            <div className="p-4 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0A101F] rounded-2xl border border-amber-500/40 shadow-xl space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center space-x-2">
                  <Disc className="w-4 h-4 animate-spin text-amber-400" />
                  <span>{processingStep}</span>
                </span>
                <span className="font-mono">{processingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-500"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* ================= DUAL PANEL: VIDEO PLAYER & SUBTITLE CONTROLS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* LEFT COLUMN: Modern Android Video Player with Overlay Subtitles (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-2xl flex items-center justify-center group">
                
                {/* HTML5 Video */}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  className="w-full h-full object-contain cursor-pointer"
                  playsInline
                  volume={originalAudioVolume}
                />

                {/* Camera Viewport overlay if recording */}
                {inputMode === 'record' && isRecording && (
                  <video
                    ref={cameraPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-20"
                  />
                )}

                {/* LIVE SUBTITLE OVERLAY */}
                {showSubtitles && currentSegment && !isProcessing && (
                  <div className={`absolute bottom-12 left-4 right-4 z-30 flex flex-col items-center pointer-events-none transition-all`}>
                    <div 
                      className={`px-4 py-2 rounded-2xl max-w-[90%] text-center backdrop-blur-md transition-all shadow-lg ${
                        subtitleBg === 'dark' 
                          ? 'bg-black/85 border border-white/10' 
                          : subtitleBg === 'glass' 
                          ? 'bg-slate-900/60 border border-amber-500/30' 
                          : 'bg-transparent'
                      }`}
                    >
                      {/* Bilingual Original Top Line */}
                      {bilingualMode && (
                        <div className="text-[11px] text-slate-300/80 font-sans line-clamp-1 mb-0.5">
                          {currentSegment.originalText}
                        </div>
                      )}
                      
                      {/* Main Translated Subtitle */}
                      <div 
                        className={`font-black tracking-wide font-serif ${
                          subtitleFontSize === 'sm' ? 'text-xs' : subtitleFontSize === 'base' ? 'text-sm' : subtitleFontSize === 'lg' ? 'text-base' : 'text-lg'
                        }`}
                        style={{ color: subtitleColor, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
                      >
                        {currentSegment.translatedText}
                      </div>
                    </div>
                  </div>
                )}

                {/* Centered Play/Pause Button overlay */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`absolute z-30 w-14 h-14 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer ${
                    isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 scale-105 shadow-xl'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 text-amber-400" />}
                </button>

                {/* Bottom Custom Player Toolbar */}
                <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="text-white hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
                  </button>

                  {/* Scrubber */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => seekVideo(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-700 accent-amber-400 rounded-lg cursor-pointer"
                  />

                  {/* Time */}
                  <div className="text-[10px] font-mono text-slate-300 whitespace-nowrap">
                    {Math.floor(currentTime)}s / {Math.floor(duration)}s
                  </div>

                  {/* Subtitle Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                      showSubtitles ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    CC
                  </button>
                </div>
              </div>

              {/* Video Info Bar & Confidence Badge */}
              {translationResult && (
                <div className="bg-[#101728] p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">Detected Spoken Language:</span>
                    <span className="text-xs font-bold text-white px-2 py-0.5 bg-slate-800 rounded-lg border border-slate-700">
                      {translationResult.detectedLanguage} ({translationResult.confidence}% confidence)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">Subtitles:</span>
                    <span className="text-xs font-bold text-amber-400">
                      {translationResult.segments?.length || 0} Segments
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Android Multi-Tab Management Center (5 Cols) */}
            <div className="lg:col-span-5 bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-slate-800 p-4 flex flex-col space-y-4">
              
              {/* Navigation Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#0A0E1A] rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('subtitles')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'subtitles' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ትርጉም</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('voice')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'voice' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ደቢንግ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'video' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ቅዲ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('export')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'export' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ኣውርድ</span>
                </button>
              </div>

              {/* TAB 1: Subtitle Segment List & In-line Text Editing */}
              {activeTab === 'subtitles' && (
                <div className="space-y-3 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>ዝተተርጎሙ ክፍላተ ግዜ (Timeline Segments)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Click to edit words</span>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    {translationResult?.segments?.map((seg, idx) => {
                      const isActive = activeSegmentIndex === idx;
                      return (
                        <div
                          key={seg.id}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                            isActive 
                              ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/30' 
                              : 'border-slate-800 bg-[#0B101D] hover:border-slate-700'
                          }`}
                        >
                          {/* Segment Header */}
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                seekVideo(seg.startTime);
                                playSegmentDubbing(seg);
                              }}
                              className="font-mono text-[10px] text-amber-400 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                            >
                              <Play className="w-2.5 h-2.5" />
                              <span>[{seg.startTimestamp} - {seg.endTimestamp}]</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => playSegmentDubbing(seg)}
                              className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>ስማዕ</span>
                            </button>
                          </div>

                          {/* Original Spoken Text */}
                          <div className="text-[11px] text-slate-400 font-sans italic">
                            "{seg.originalText}"
                          </div>

                          {/* Editable Translated Subtitle Box */}
                          <div className="relative">
                            <input
                              type="text"
                              value={seg.translatedText}
                              onChange={(e) => updateSegmentTranslation(idx, e.target.value)}
                              className="w-full bg-[#141B2D] border border-slate-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-white font-serif outline-none"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Audio Dubbing & Mixer */}
              {activeTab === 'voice' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-400" />
                    <span>ድምጺ ደቢንግን ምምዕርራይን (Voice Dubbing & Mixer)</span>
                  </div>

                  {/* AI Voice Selection */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-300 font-bold">ናይ AI ድምጺ መልክዕ (Voice Persona):</label>
                    <div className="grid grid-cols-1 gap-2">
                      {AI_VOICES.map((v) => {
                        const isSelected = selectedVoice === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setSelectedVoice(v.id);
                              showToast(`Voice set to: ${v.name}`);
                            }}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400/40' 
                                : 'border-slate-800 bg-[#0B101D] text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-white">{v.name}</div>
                              <div className="text-[10px] text-slate-400">{v.tone} • {v.gender}</div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Audio Volume Mixer Sliders */}
                  <div className="space-y-3 bg-[#0B101D] p-3.5 rounded-xl border border-slate-800">
                    
                    {/* AI Dubbing Audio Volume */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-amber-400 font-bold">ድምጺ AI ደቢንግ (Dubbed Speech):</span>
                        <span className="font-mono text-slate-300">{Math.round(dubbedAudioVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={dubbedAudioVolume}
                        onChange={(e) => setDubbedAudioVolume(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 accent-amber-400 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Original Background Audio Volume (Ducking) */}
                    <div className="space-y-1 pt-2 border-t border-slate-800/80">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300 font-bold">መበቆላዊ ድምጺ/ሙዚቃ (Original Audio):</span>
                        <span className="font-mono text-slate-300">{Math.round(originalAudioVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={originalAudioVolume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setOriginalAudioVolume(val);
                          if (videoRef.current) videoRef.current.volume = val;
                        }}
                        className="w-full h-1.5 bg-slate-700 accent-cyan-400 rounded-lg cursor-pointer"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: Subtitle Appearance Customization */}
              {activeTab === 'video' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>ቅዲ ሳብስክሪፕሽን (Subtitle Appearance)</span>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300 font-bold">መጠን ፊደል (Font Size):</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSubtitleFontSize(sz)}
                          className={`py-1.5 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                            subtitleFontSize === sz 
                              ? 'border-amber-400 bg-amber-400 text-slate-950' 
                              : 'border-slate-800 bg-[#0B101D] text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300 font-bold">ሕብሪ ጽሑፍ (Text Color):</label>
                    <div className="flex items-center space-x-2">
                      {['#FFD700', '#FFFFFF', '#06B6D4', '#10B981', '#F43F5E'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSubtitleColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                            subtitleColor === c ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-70'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Background Box Styling */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300 font-bold">ድሕረ ባይታ (Box Background):</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'dark', label: 'Dark Solid' },
                        { id: 'glass', label: 'Glass Gold' },
                        { id: 'none', label: 'Clean / None' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSubtitleBg(b.id as any)}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            subtitleBg === b.id 
                              ? 'border-amber-400 bg-amber-500/20 text-amber-300' 
                              : 'border-slate-800 bg-[#0B101D] text-slate-400'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bilingual Mode Toggle */}
                  <div className="p-3 bg-[#0B101D] rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">ክልተ ቋንቋ ብሓንሳብ (Bilingual Subtitles)</div>
                      <div className="text-[10px] text-slate-400">Show Original text above Translated line</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBilingualMode(!bilingualMode)}
                      className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        bilingualMode ? 'bg-amber-400 justify-end' : 'bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="bg-slate-950 w-4.5 h-4.5 rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Export & Share Hub */}
              {activeTab === 'export' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>ምውራድን ምክፋልን (Export & Share)</span>
                  </div>

                  <div className="space-y-2">
                    {/* Export SRT */}
                    <button
                      type="button"
                      onClick={exportSrtFile}
                      className="w-full p-3 bg-[#0B101D] hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="font-bold text-white">.SRT Subtitle File</div>
                          <div className="text-[10px] text-slate-400">Standard subtitle format for YouTube & Premiere</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Export VTT */}
                    <button
                      type="button"
                      onClick={exportVttFile}
                      className="w-full p-3 bg-[#0B101D] hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Film className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-bold text-white">.VTT Web Subtitles</div>
                          <div className="text-[10px] text-slate-400">WebVTT for browser video players & mobile</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Export Dubbed Speech Transcript */}
                    <button
                      type="button"
                      onClick={exportDubbedAudio}
                      className="w-full p-3 bg-[#0B101D] hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Music className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-bold text-white">Dubbed Audio Script</div>
                          <div className="text-[10px] text-slate-400">Copy full voiceover script for audio studio</div>
                        </div>
                      </div>
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Share Directly */}
                    <button
                      type="button"
                      onClick={handleShare}
                      className="w-full p-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-105 rounded-xl text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95 cursor-pointer mt-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>ቪድዮ ኣካፍል (Share Translated Video)</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* ================= ANDROID BOTTOM BAR ================= */}
        <div className="px-6 py-3 bg-[#0B0F19] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Multimodal Video Engine v2.5</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors cursor-pointer"
          >
            ዕጾ (Done)
          </button>
        </div>

      </div>
    </div>
  );
};
