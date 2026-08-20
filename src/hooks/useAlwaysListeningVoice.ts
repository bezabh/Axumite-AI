import { useState, useEffect, useRef, useCallback } from 'react';
import { AppTab } from '../types';
import { playVoiceTriggerChime, playCommandSuccessChime, playVoiceDeactivateChime } from '../utils/audioChime';

export interface AlwaysListeningVoiceActions {
  navigateTab: (tab: AppTab) => void;
  openSettings: () => void;
  openSecurity: () => void;
  openJobSearch: () => void;
  openScholarship: () => void;
  openLegalAdvisor: () => void;
  openMechanic: () => void;
  openHistory: () => void;
  openNotifications: () => void;
  openPricing: () => void;
  openDrawer: () => void;
  openVideoTranslator: () => void;
  openVoiceOverlay: () => void;
  setLanguage: (lang: 'ti' | 'en') => void;
  onSendChatMessage?: (msg: string) => void;
}

export function useAlwaysListeningVoice(actions: AlwaysListeningVoiceActions) {
  const [isAlwaysListening, setIsAlwaysListening] = useState<boolean>(() => {
    try {
      return localStorage.getItem('axumite_always_listening_voice') === 'true';
    } catch {
      return false;
    }
  });

  const [isRecognizing, setIsRecognizing] = useState(false);
  const [lastHeardPhrase, setLastHeardPhrase] = useState<string | null>(null);
  const [lastActionFeedback, setLastActionFeedback] = useState<{ title: string; desc: string } | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isEnabledRef = useRef<boolean>(isAlwaysListening);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ref synchronized
  useEffect(() => {
    isEnabledRef.current = isAlwaysListening;
    try {
      localStorage.setItem('axumite_always_listening_voice', isAlwaysListening ? 'true' : 'false');
    } catch {
      // Storage errors ignored
    }
  }, [isAlwaysListening]);

  // Match recognized spoken phrase against Axumite voice intents
  const handleRecognizedSpeech = useCallback((transcript: string) => {
    const clean = transcript.trim().toLowerCase();
    setLastHeardPhrase(transcript);

    // 1. Chat / Obelisk AI
    if (
      clean.includes('chat') || clean.includes('obelisk') || clean.includes('ai') ||
      clean.includes('ቻት') || clean.includes('ኦበሊስክ') || clean.includes('ሕተት') || clean.includes('ሕቶ')
    ) {
      actions.navigateTab('chat');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Obelisk AI Chat',
        desc: 'Opening Obelisk AI Chat Console (ናብ ቻት ይወስድ ኣሎ)',
      });
      return;
    }

    // 2. Translator
    if (
      clean.includes('translate') || clean.includes('translator') || clean.includes('ትርጉም') ||
      clean.includes('ተርጉም') || clean.includes('መተርጎሚ') || clean.includes('dictionary')
    ) {
      actions.navigateTab('translator');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Ge\'ez & Tigrinya Translator',
        desc: 'Opening AI Translator Studio (ናብ መተርጎሚ ይወስድ ኣሎ)',
      });
      return;
    }

    // 3. Calligraphy Studio
    if (
      clean.includes('calligraphy') || clean.includes('fidel') || clean.includes('mandala') ||
      clean.includes('ከሊግራፊ') || clean.includes('ፊደል') || clean.includes('ማንዳላ')
    ) {
      actions.navigateTab('calligraphy');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Ge\'ez Calligraphy',
        desc: 'Opening 4K Calligraphy Studio (ናብ ግዕዝ ከሊግራፊ ይወስድ ኣሎ)',
      });
      return;
    }

    // 4. Education & Tutoring
    if (
      clean.includes('education') || clean.includes('tutor') || clean.includes('homework') ||
      clean.includes('study') || clean.includes('ትምህርቲ') || clean.includes('መምህር') || clean.includes('ኮርስ')
    ) {
      actions.navigateTab('education');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ AI Education Platform',
        desc: 'Opening Education & AI Tutor (ናብ ትምህርቲ ይወስድ ኣሎ)',
      });
      return;
    }

    // 5. Business Hub
    if (
      clean.includes('business') || clean.includes('commerce') || clean.includes('trade') ||
      clean.includes('ንግዲ') || clean.includes('ቢዝነስ') || clean.includes('ዕዳጋ')
    ) {
      actions.navigateTab('business-hub');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Business Hub',
        desc: 'Opening Business & Trade Hub (ናብ ናይ ንግዲ ማእከል ይወስድ ኣሎ)',
      });
      return;
    }

    // 6. Cultural Explorer
    if (
      clean.includes('culture') || clean.includes('history') || clean.includes('heritage') ||
      clean.includes('ባህሊ') || clean.includes('ታሪክ') || clean.includes('ቅርሲ')
    ) {
      actions.navigateTab('cultural-explorer');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Cultural Explorer',
        desc: 'Opening Heritage & Culture (ናብ ባህልን ታሪክን ይወስድ ኣሎ)',
      });
      return;
    }

    // 7. Vision Studio
    if (
      clean.includes('vision') || clean.includes('camera') || clean.includes('image') ||
      clean.includes('ምስሊ') || clean.includes('ስእሊ') || clean.includes('ካሜራ')
    ) {
      actions.navigateTab('vision');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Multimodal Vision',
        desc: 'Opening Visual AI Studio (ናብ ናይ ምስሊ መርመራ ይወስድ ኣሎ)',
      });
      return;
    }

    // 8. Prompt Forge
    if (
      clean.includes('prompt') || clean.includes('forge') || clean.includes('midjourney') ||
      clean.includes('ፎርጅ') || clean.includes('ፕሮምፕት')
    ) {
      actions.navigateTab('prompt-forge');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Prompt Forge',
        desc: 'Opening 8K Prompt Engine (ናብ Prompt Forge ይወስድ ኣሎ)',
      });
      return;
    }

    // 9. Payment & Subscriptions
    if (
      clean.includes('payment') || clean.includes('subscribe') || clean.includes('subscription') ||
      clean.includes('billing') || clean.includes('ክፍሊት') || clean.includes('ኣባልነት')
    ) {
      actions.navigateTab('payment');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Payment & Subscriptions',
        desc: 'Opening Payment Hub (ናብ ክፍሊት ይወስድ ኣሎ)',
      });
      return;
    }

    // 10. Scholarships Modal
    if (
      clean.includes('scholarship') || clean.includes('grant') || clean.includes('fellowship') ||
      clean.includes('ስኮላርሺፕ') || clean.includes('ናጻ ትምህርቲ')
    ) {
      actions.openScholarship();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Global Scholarships',
        desc: 'Opening Scholarship Opportunities (ስኮላርሺፕ ይኽፈት ኣሎ)',
      });
      return;
    }

    // 11. Job Search Modal
    if (
      clean.includes('job') || clean.includes('career') || clean.includes('work') ||
      clean.includes('ስራሕ') || clean.includes('ዕድል ስራሕ')
    ) {
      actions.openJobSearch();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Job Search & Career',
        desc: 'Opening Career Opportunities (ናይ ስራሕ ዕድላት ይኽፈት ኣሎ)',
      });
      return;
    }

    // 12. Legal Advisor Modal
    if (
      clean.includes('legal') || clean.includes('lawyer') || clean.includes('law') ||
      clean.includes('ሕጊ') || clean.includes('ጠበቓ') || clean.includes('ፍትሒ')
    ) {
      actions.openLegalAdvisor();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Legal Advisor',
        desc: 'Opening AI Legal Consultant (ናይ ሕጊ ሓጋዚ ይኽፈት ኣሎ)',
      });
      return;
    }

    // 13. Mechanic Diagnosis Modal
    if (
      clean.includes('mechanic') || clean.includes('car') || clean.includes('obd') ||
      clean.includes('መካኒክ') || clean.includes('መኪና') || clean.includes('ሞተር')
    ) {
      actions.openMechanic();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Mechanic Diagnostic',
        desc: 'Opening Automotive AI Assistant (ናይ መካኒክ ሓጋዚ ይኽፈት ኣሎ)',
      });
      return;
    }

    // 14. Notifications Center
    if (
      clean.includes('notification') || clean.includes('alert') || clean.includes('bell') ||
      clean.includes('ምልክታ') || clean.includes('ደወል')
    ) {
      actions.openNotifications();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Notifications Center',
        desc: 'Opening Notification Alerts (ማእከል ምልክታ ይኽፈት ኣሎ)',
      });
      return;
    }

    // 15. Settings & Profile
    if (
      clean.includes('setting') || clean.includes('profile') || clean.includes('account') ||
      clean.includes('ሴቲንግ') || clean.includes('ፕሮፋይል') || clean.includes('ቅጥዕታት')
    ) {
      actions.openSettings();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Settings & Profile',
        desc: 'Opening Settings (ናብ ቅጥዕታት ይወስድ ኣሎ)',
      });
      return;
    }

    // 16. Security & Vault
    if (
      clean.includes('security') || clean.includes('vault') || clean.includes('lock') ||
      clean.includes('ደሕንነት') || clean.includes('ቫልት')
    ) {
      actions.openSecurity();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Security Vault',
        desc: 'Opening Security Vault (ናይ ደሕንነት ቫልት ይኽፈት ኣሎ)',
      });
      return;
    }

    // 17. Sovereign Tools Drawer
    if (
      clean.includes('menu') || clean.includes('drawer') || clean.includes('tools') ||
      clean.includes('ሜኑ') || clean.includes('መሳርሒታት') || clean.includes('ኩሉ')
    ) {
      actions.openDrawer();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Sovereign All-Tools Drawer',
        desc: 'Opening Navigation Drawer (ናይ ኩሎም መሳርሒታት ዝርዝር ይኽፈት ኣሎ)',
      });
      return;
    }

    // 18. Voice Overlay / HUD
    if (
      clean.includes('voice') || clean.includes('hud') || clean.includes('command') ||
      clean.includes('ድምጺ') || clean.includes('ትእዛዝ') || clean.includes('ኣክሱማዊ')
    ) {
      actions.openVoiceOverlay();
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Voice Command HUD',
        desc: 'Opening Voice HUD Console (ናይ ድምጺ HUD ይኽፈት ኣሎ)',
      });
      return;
    }

    // 19. Language Switchers
    if (clean.includes('tigrinya') || clean.includes('ትግርኛ')) {
      actions.setLanguage('ti');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Language Switched',
        desc: 'Language changed to Tigrinya (ትግርኛ ተመሪጹ)',
      });
      return;
    }

    if (clean.includes('english') || clean.includes('እንግሊዝ')) {
      actions.setLanguage('en');
      playCommandSuccessChime();
      setLastActionFeedback({
        title: '🎙️ Language Switched',
        desc: 'Language changed to English',
      });
      return;
    }
  }, [actions]);

  // Start continuous speech recognition loop
  const startListeningLoop = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported in this browser environment.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'ti-ER, ti-ET, en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsRecognizing(true);
        setMicPermissionDenied(false);
      };

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            if (transcript && transcript.trim().length > 1) {
              handleRecognizedSpeech(transcript);
            }
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermissionDenied(true);
          setIsAlwaysListening(false);
          isEnabledRef.current = false;
        }
      };

      recognition.onend = () => {
        setIsRecognizing(false);
        // Automatically restart if still in Always-Listening mode
        if (isEnabledRef.current && !micPermissionDenied) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (isEnabledRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          }, 300);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Always-listening recognition start notice:', e);
    }
  }, [handleRecognizedSpeech, micPermissionDenied]);

  // Toggle Always-Listening Mode on or off
  const toggleAlwaysListening = useCallback((targetState?: boolean) => {
    const nextState = typeof targetState === 'boolean' ? targetState : !isAlwaysListening;
    setIsAlwaysListening(nextState);
    isEnabledRef.current = nextState;

    if (nextState) {
      playVoiceTriggerChime(0.15);
      setLastActionFeedback({
        title: '🎙️ Always-Listening Activated',
        desc: 'Hands-free voice mode is active. Speak any command anytime.',
      });
      startListeningLoop();
    } else {
      playVoiceDeactivateChime(0.15);
      setLastActionFeedback({
        title: '🔇 Always-Listening Paused',
        desc: 'Hands-free voice mode disabled.',
      });
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      setIsRecognizing(false);
    }
  }, [isAlwaysListening, startListeningLoop]);

  // Manage recognition lifecycle based on state
  useEffect(() => {
    if (isAlwaysListening) {
      startListeningLoop();
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      setIsRecognizing(false);
    }

    return () => {
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [isAlwaysListening, startListeningLoop]);

  // Clear action feedback after 4 seconds
  useEffect(() => {
    if (lastActionFeedback) {
      const timer = setTimeout(() => setLastActionFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [lastActionFeedback]);

  return {
    isAlwaysListening,
    isRecognizing,
    toggleAlwaysListening,
    lastHeardPhrase,
    lastActionFeedback,
    clearFeedback: () => setLastActionFeedback(null),
    micPermissionDenied,
  };
}
