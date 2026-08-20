export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  category: 'Horn of Africa & Semitic' | 'European' | 'Asian & Middle Eastern' | 'African' | 'Classical & Ancient';
  flag?: string;
  script?: string;
}

export const ALL_INTERNATIONAL_LANGUAGES: LanguageOption[] = [
  // 1. Horn of Africa & Semitic
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', category: 'Horn of Africa & Semitic', flag: '🇪🇷', script: 'Ge\'ez Fidel' },
  { code: 'gez', name: 'Ge\'ez', nativeName: 'ግዕዝ (Ancient Ethiopic)', category: 'Horn of Africa & Semitic', flag: '🏛️', script: 'Ge\'ez Fidel' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', category: 'Horn of Africa & Semitic', flag: '🇪🇹', script: 'Ge\'ez Fidel' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', category: 'Horn of Africa & Semitic', flag: '🇪🇹', script: 'Latin' },
  { code: 'so', name: 'Somali', nativeName: 'Af-Soomaali', category: 'Horn of Africa & Semitic', flag: '🇸🇴', script: 'Latin' },
  { code: 'aa', name: 'Afar', nativeName: 'Qafaraf', category: 'Horn of Africa & Semitic', flag: '🇩🇯', script: 'Latin' },
  { code: 'ssy', name: 'Saho', nativeName: 'Saho', category: 'Horn of Africa & Semitic', flag: '🇪🇷', script: 'Latin' },
  { code: 'byn', name: 'Bilen', nativeName: 'ብሊን (Bilen)', category: 'Horn of Africa & Semitic', flag: '🇪🇷', script: 'Ge\'ez / Latin' },
  { code: 'tig', name: 'Tigre', nativeName: 'ትግረ (Tigre)', category: 'Horn of Africa & Semitic', flag: '🇪🇷', script: 'Ge\'ez / Arabic' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', category: 'Horn of Africa & Semitic', flag: '🇸🇦', script: 'Arabic' },
  { code: 'he', name: 'Hebrew', nativeName: 'עבריት', category: 'Horn of Africa & Semitic', flag: '🇮🇱', script: 'Hebrew' },
  { code: 'syc', name: 'Syriac / Aramaic', nativeName: 'ܣܘܪܝܝܐ (Classical Aramaic)', category: 'Horn of Africa & Semitic', flag: '📜', script: 'Syriac' },

  // 2. European Languages
  { code: 'en', name: 'English', nativeName: 'English (US / UK)', category: 'European', flag: '🇬🇧', script: 'Latin' },
  { code: 'fr', name: 'French', nativeName: 'Français', category: 'European', flag: '🇫🇷', script: 'Latin' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', category: 'European', flag: '🇩🇪', script: 'Latin' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', category: 'European', flag: '🇮🇹', script: 'Latin' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', category: 'European', flag: '🇪🇸', script: 'Latin' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', category: 'European', flag: '🇵🇹', script: 'Latin' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', category: 'European', flag: '🇳🇱', script: 'Latin' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', category: 'European', flag: '🇸🇪', script: 'Latin' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', category: 'European', flag: '🇳🇴', script: 'Latin' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', category: 'European', flag: '🇩🇰', script: 'Latin' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', category: 'European', flag: '🇫🇮', script: 'Latin' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', category: 'European', flag: '🇬🇷', script: 'Greek' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', category: 'European', flag: '🇷🇺', script: 'Cyrillic' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', category: 'European', flag: '🇺🇦', script: 'Cyrillic' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', category: 'European', flag: '🇵🇱', script: 'Latin' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', category: 'European', flag: '🇨🇿', script: 'Latin' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', category: 'European', flag: '🇷🇴', script: 'Latin' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', category: 'European', flag: '🇭🇺', script: 'Latin' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', category: 'European', flag: '🇹🇷', script: 'Latin' },

  // 3. Asian & Middle Eastern
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', category: 'Asian & Middle Eastern', flag: '🇨🇳', script: 'Hanzi' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', category: 'Asian & Middle Eastern', flag: '🇹🇼', script: 'Hanzi' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', category: 'Asian & Middle Eastern', flag: '🇯🇵', script: 'Kanji / Kana' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', category: 'Asian & Middle Eastern', flag: '🇰🇷', script: 'Hangul' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', category: 'Asian & Middle Eastern', flag: '🇮🇳', script: 'Devanagari' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', category: 'Asian & Middle Eastern', flag: '🇵🇰', script: 'Perso-Arabic' },
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', category: 'Asian & Middle Eastern', flag: '🇮🇷', script: 'Persian' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', category: 'Asian & Middle Eastern', flag: '🇧🇩', script: 'Bengali' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', category: 'Asian & Middle Eastern', flag: '🇮🇳', script: 'Gurmukhi' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', category: 'Asian & Middle Eastern', flag: '🇮🇳', script: 'Tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', category: 'Asian & Middle Eastern', flag: '🇮🇳', script: 'Telugu' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', category: 'Asian & Middle Eastern', flag: '🇻🇳', script: 'Latin' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', category: 'Asian & Middle Eastern', flag: '🇹🇭', script: 'Thai' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', category: 'Asian & Middle Eastern', flag: '🇮🇩', script: 'Latin' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', category: 'Asian & Middle Eastern', flag: '🇲🇾', script: 'Latin' },
  { code: 'tl', name: 'Filipino (Tagalog)', nativeName: 'Wikang Filipino', category: 'Asian & Middle Eastern', flag: '🇵🇭', script: 'Latin' },

  // 4. African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', category: 'African', flag: '🇰🇪', script: 'Latin' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', category: 'African', flag: '🇳🇬', script: 'Latin / Ajami' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', category: 'African', flag: '🇳🇬', script: 'Latin' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', category: 'African', flag: '🇳🇬', script: 'Latin' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', category: 'African', flag: '🇿🇦', script: 'Latin' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', category: 'African', flag: '🇿🇦', script: 'Latin' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', category: 'African', flag: '🇿🇦', script: 'Latin' },

  // 5. Classical & Ancient
  { code: 'la', name: 'Latin', nativeName: 'Lingua Latina', category: 'Classical & Ancient', flag: '🏛️', script: 'Latin' },
  { code: 'grc', name: 'Ancient Greek', nativeName: 'Ἀρχαία Ἑλληνική', category: 'Classical & Ancient', flag: '🏛️', script: 'Greek' },
  { code: 'san', name: 'Sanskrit', nativeName: 'संस्कृतम्', category: 'Classical & Ancient', flag: '📜', script: 'Devanagari' },
];

export const POPULAR_LANGUAGE_PAIRS = [
  { source: 'English', target: 'Tigrinya', label: 'English ➔ ትግርኛ (Tigrinya)' },
  { source: 'Tigrinya', target: 'English', label: 'ትግርኛ ➔ English' },
  { source: 'English', target: 'Ge\'ez', label: 'English ➔ ግዕዝ (Ge\'ez Script)' },
  { source: 'Tigrinya', target: 'Ge\'ez', label: 'ትግርኛ ➔ ግዕዝ (Ge\'ez)' },
  { source: 'Tigrinya', target: 'German', label: 'ትግርኛ ➔ Deutsch (German)' },
  { source: 'Tigrinya', target: 'Italian', label: 'ትግርኛ ➔ Italiano (Italian)' },
  { source: 'Tigrinya', target: 'Arabic', label: 'ትግርኛ ➔ العربية (Arabic)' },
  { source: 'Tigrinya', target: 'French', label: 'ትግርኛ ➔ Français (French)' },
  { source: 'Tigrinya', target: 'Swedish', label: 'ትግርኛ ➔ Svenska (Swedish)' },
  { source: 'Tigrinya', target: 'Norwegian', label: 'ትግርኛ ➔ Norsk (Norwegian)' },
  { source: 'Tigrinya', target: 'Dutch', label: 'ትግርኛ ➔ Nederlands (Dutch)' },
  { source: 'Amharic', target: 'Tigrinya', label: 'አማርኛ ➔ ትግርኛ' },
];
