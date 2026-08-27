export type Language = 'ti' | 'ti_tg' | 'en' | 'de';

export interface TranslationDictionary {
  // Tabs & Navigation
  tabPremiere: string;
  tabChat: string;
  tabAssistance: string;
  tabPayment: string;
  tabVision: string;
  tabPromptForge: string;
  tabTranslator: string;
  tabCalligraphy: string;
  tabEducation: string;
  tabBusinessHub: string;
  tabCulturalExplorer: string;
  tabMediaArchive: string;
  tabAnalytics: string;
  tabSaved: string;
  tabManagement: string;
  tabHome: string;
  tabChats: string;
  tabHistory: string;
  tabProfile: string;

  // Premiere View Main Titles & Prompts
  premiereGreetingLine1: string;
  premiereGreetingLine2: string;
  yourNameLabel: string;
  userTypeLabel: string;
  standardUser: string;
  premiumUser: string;
  welcomeBack: string;
  hello: string;
  aiAssistantCardTitle: string;
  chatWithAi: string;

  // Voice Hero Card
  voiceHeroTitle: string;
  voiceHeroSubtitle: string;
  startVoiceBtn: string;

  // 10 AI Tools Matrix
  toolAiChatTitle: string;
  toolAiChatDesc: string;
  toolSmartAssistantTitle: string;
  toolSmartAssistantDesc: string;
  toolDocumentAiTitle: string;
  toolDocumentAiDesc: string;
  toolAiWriterTitle: string;
  toolAiWriterDesc: string;
  toolSpeechToTextTitle: string;
  toolSpeechToTextDesc: string;
  toolTextToSpeechTitle: string;
  toolTextToSpeechDesc: string;
  toolImageGenTitle: string;
  toolImageGenDesc: string;
  toolImageAnalyzerTitle: string;
  toolImageAnalyzerDesc: string;
  toolTranslatorTitle: string;
  toolTranslatorDesc: string;
  toolAiLearningTitle: string;
  toolAiLearningDesc: string;

  // Business & Cultural Features
  businessCopilotTitle: string;
  businessCopilotDesc: string;
  culturalExplorerTitle: string;
  culturalExplorerDesc: string;
  mediaArchiveTitle: string;
  mediaArchiveDesc: string;

  // Upgrade Banner
  upgradePremiumTitle: string;
  upgradePremiumDesc: string;
  goPremiumBtn: string;

  // Navbar
  navStartScreen: string;
  navSettings: string;
  navDeveloper: string;
  navSecurity: string;
  navAuth: string;
  navWelcome: string;
  navGuide: string;
  navOffline: string;
  navOnline: string;

  // Language Switcher
  langTigrinya: string;
  langTigrayTigrinya: string;
  langEnglish: string;
  langGerman: string;
  selectLanguage: string;
  switchLangShort: string;

  // Chat
  chatPlaceholder: string;
  send: string;
  clearChat: string;
  copyText: string;
  copied: string;
  saveInsight: string;
  savedSuccess: string;
  speakText: string;
  stopVoice: string;
  deepReasoning: string;
  ancientScript: string;
  creativeMode: string;
  generalMode: string;

  // Voice Assistant
  voiceListening: string;
  voiceTapToSpeak: string;
  voiceProcessing: string;

  // Payments
  paymentHeader: string;
  telebirr: string;
  cbeBirr: string;
  commercialBank: string;
  amount: string;
  sendMoney: string;

  // Vision
  uploadImage: string;
  analyzeImage: string;
  ocrExtractedText: string;

  // Saved Vault
  savedInsightsTitle: string;
  noSavedItems: string;
  deleteItem: string;

  // Modals
  close: string;
  save: string;
  cancel: string;
  login: string;
  signup: string;
  logout: string;
  verified: string;
  notVerified: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ti: {
    // Tabs & Navigation
    tabPremiere: 'ቀንዲ መእተዊ',
    tabChat: 'ምስ AI ምዕላል',
    tabAssistance: 'AI ሓጋዚ',
    tabPayment: 'ክፍሊት',
    tabVision: 'ምስሊ መርማሪ',
    tabPromptForge: 'AI ፕሮምፕት',
    tabTranslator: 'ተርጓሚ ቋንቋታት',
    tabCalligraphy: 'ግእዝ ካሊግራፊ',
    tabEducation: 'ናይ ትምህርቲ ማእከል',
    tabBusinessHub: 'ናይ ንግዲ ማእከል (Business Hub)',
    tabCulturalExplorer: 'ባህላዊ መርማሪ (Tigray & Eritrea)',
    tabMediaArchive: 'ዲጂታል ታሪኽ መዝገብ',
    tabAnalytics: 'ስታቲስቲክስ',
    tabSaved: 'ዝተዓቀቡ',
    tabManagement: 'ምሕደራ',
    tabHome: 'ቀንዲ ገጽ',
    tabChats: 'ዕላላት',
    tabHistory: 'ታሪኽ',
    tabProfile: 'ፕሮፋይል',

    // Premiere View Main Titles & Prompts
    premiereGreetingLine1: 'ሰላም፡ ብደሓን መጻእኹም ናብ',
    premiereGreetingLine2: 'ኣክሱማይት AI (AXUMITE AI)',
    yourNameLabel: 'ስምኩም',
    userTypeLabel: 'ደረጃ ተጠቃሚ',
    standardUser: 'ተጠቃሚ',
    premiumUser: 'ልዑላዊ ኣባል (Pro)',
    welcomeBack: 'እንቋዕ ብደሓን ተመለስኩም',
    hello: 'ሰላም',
    aiAssistantCardTitle: 'AI ሓጋዚ',
    chatWithAi: 'ምስ AI ምዕላል',

    // Voice Hero Card
    voiceHeroTitle: 'ብድምጺ ምዝርራብ',
    voiceHeroSubtitle: 'ብትግርኛ፡ እንግሊዝኛ ወይ ጀርመን ብድምጺ ተዛረቡ',
    startVoiceBtn: 'ብድምጺ ጀምር',

    // 10 AI Tools Matrix
    toolAiChatTitle: 'ምስ AI ምዕላል',
    toolAiChatDesc: 'ብትግርኛ፡ እንግሊዝኛን ጀርመንን ምስ AI ብድምጽን ጽሑፍን ተዛረቡ።',
    toolSmartAssistantTitle: 'AI ሓጋዚ',
    toolSmartAssistantDesc: 'ዝኾነ ሕቶታት ሕተቱ፡ ንዕለታዊ ስራሕኩምን ምርምርኩምን ሓገዝ ርከቡ።',
    toolDocumentAiTitle: 'ሰነድ መርማሪ (Doc AI)',
    toolDocumentAiDesc: 'PDF፡ Word፡ ሰነዳት ብምስዳድ ጽሟቕን ትንታነን ርከቡ።',
    toolAiWriterTitle: 'AI ጸሓፊ',
    toolAiWriterDesc: 'ኢሜይል፡ ጽሑፋት፡ ጸብጻባት ብAI ብቅልጡፍ ኣዳልዉ።',
    toolSpeechToTextTitle: 'ድምጺ ናብ ጽሑፍ',
    toolSpeechToTextDesc: 'ዝተዛረብክምዎ ድምጺ ብልክዕ ናብ ጽሑፍ ይቕየር።',
    toolTextToSpeechTitle: 'ጽሑፍ ናብ ድምጺ',
    toolTextToSpeechDesc: 'መልስታት AI ብጥዑም ተፈጥሮኣዊ ድምጺ ስምዑ።',
    toolImageGenTitle: 'ምስሊ ፈጣሪ',
    toolImageGenDesc: 'ብጽሑፍ ዝገለጽኩምዎ ሓሳብ ናብ ብሉጽ ስእሊ ይቕየር።',
    toolImageAnalyzerTitle: 'ምስሊ መርማሪ',
    toolImageAnalyzerDesc: 'ስእሊ ብምስዳድ ትሕዝቶኡን ዝርዝሩን ብAI ተረዱ።',
    toolTranslatorTitle: 'ተርጓሚ ቋንቋታት',
    toolTranslatorDesc: 'ትግርኛ፡ ግእዝ፡ እንግሊዝኛ፡ ጀርመንን ካልኦትን ብልክዕ ተርጒሙ።',
    toolAiLearningTitle: 'ትምህርትን ኣካዳምን',
    toolAiLearningDesc: 'STEM፡ ቋንቋ፡ ናይ ገዛ ዕዮ ፍታሕን ምስክር ወረቐትን ብAI ተማሃሩ።',

    // Business & Cultural Features
    businessCopilotTitle: 'AI ናይ ንግዲ መሻርኽቲ',
    businessCopilotDesc: 'ናይ ንግዲ መደብ፡ ዕዳጋ ትንታነ፡ ፋይናንስ፡ ሰነዳትን ዓማዊል ምሕደራን።',
    culturalExplorerTitle: 'ባህላዊ መዝገብ ትግራይን ኤርትራን',
    culturalExplorerDesc: 'ታሪኽ፡ ጥንታዊ ውርሻታት፡ ምስላታት፡ ሙዚቃ፡ ባህላዊ ክዳውንትን ዛንታታትን።',
    mediaArchiveTitle: 'ዲጂታል ታሪኽን ውርሻን መዝገብ',
    mediaArchiveDesc: 'ስእልታት፡ ናይ ኣበው ቃል-ታሪኽን ጥንታዊ ሰነዳትን ምዕቃብ።',

    // Upgrade Banner
    upgradePremiumTitle: 'ናብ ፕሪምየም ክብ ኣብሉ',
    upgradePremiumDesc: 'ንኹሉ ፍሉይ ናይ AI ኣገልግሎታት ብዘይ ገደብ ተጠቐሙ።',
    goPremiumBtn: 'ፕሪምየም ውሰዱ',

    // Navbar
    navStartScreen: '▶ መእተዊ ገጽ',
    navSettings: 'ቅጥዕታት',
    navDeveloper: 'ደቨሎፐር',
    navSecurity: 'ውሕስነት',
    navAuth: 'ምእታው / ምምዝጋብ',
    navWelcome: 'መቐበሊ',
    navGuide: 'መርሒ',
    navOffline: 'ኦፍላይን',
    navOnline: 'ኦንላይን',

    // Language Switcher
    langTigrinya: 'ትግርኛ (Tigrinya)',
    langTigrayTigrinya: 'ትግርኛ (Tigrinya)',
    langEnglish: 'English',
    langGerman: 'Deutsch (German)',
    selectLanguage: 'ቋንቋ ምረጹ',
    switchLangShort: 'ትግርኛ',

    // Chat
    chatPlaceholder: 'ሕቶኹም ብትግርኛ፡ እንግሊዝኛ ወይ ጀርመን ጽሓፉ ወይ ብድምጺ ተዛረቡ...',
    send: 'ስደድ',
    clearChat: 'ኣጽሪ',
    copyText: 'ቅዳሕ',
    copied: 'ተቐዲሑ!',
    saveInsight: 'ዓቅብ',
    savedSuccess: 'ብዓወት ተዓቒቡ!',
    speakText: 'ስማዕ',
    stopVoice: 'ኣቋርጽ',
    deepReasoning: 'ዕሙቕ ትንታነ',
    ancientScript: 'ግእዝ ፊደላት',
    creativeMode: 'ፈጠራዊ',
    generalMode: 'ሓፈሻዊ',

    // Voice Assistant
    voiceListening: 'ድምጽኹም ይስማዕ ኣሎ...',
    voiceTapToSpeak: 'ንምዝራብ ጠውቑ',
    voiceProcessing: 'ድምጺ ይምርመር ኣሎ...',

    // Payments
    paymentHeader: 'ኤርትራውን ኣህጉራውን ናይ ክፍሊት ስርዓት',
    telebirr: 'ናቕፋ ዲጂታል ክፍሊት',
    cbeBirr: 'ናይ ኤርትራ ንግዲ ባንክ',
    commercialBank: 'ናይ ኤርትራ ንግዲ ባንክ',
    amount: 'መጠን ገንዘብ',
    sendMoney: 'ክፍሊት ፈጽም',

    // Vision
    uploadImage: 'ምስሊ ኣእትዉ',
    analyzeImage: 'ምስሊ መርምር',
    ocrExtractedText: 'ዝተነበበ ጽሑፍ',

    // Saved Vault
    savedInsightsTitle: 'ዝተዓቀቡ ትንታነታትን ታሪኽን',
    noSavedItems: 'ዝተዓቀበ ነገር የለን',
    deleteItem: 'ደምስስ',

    // Modals
    close: 'ዕጾ',
    save: 'ዓቅብ',
    cancel: 'ሰርዝ',
    login: 'እቶ',
    signup: 'ተመዝገብ',
    logout: 'ውጻእ',
    verified: 'ዝተረጋገጸ',
    notVerified: 'ዘይተረጋገጸ',
  },
  ti_tg: {
    // Tabs & Navigation - Tigrinya
    tabPremiere: 'ቀንዲ መእተዊ ገጽ',
    tabChat: 'ምስ AI ምዕላል',
    tabAssistance: 'AI ረዳኢ / ሓጋዚ',
    tabPayment: 'ክፍሊትን ኣባልነትን',
    tabVision: 'ምስሊ መርማሪ ስቱድዮ',
    tabPromptForge: 'AI ፕሮምፕት ፎርጅ',
    tabTranslator: 'ተርጓሚ ቋንቋታት',
    tabCalligraphy: 'ግእዝ ካሊግራፊ',
    tabEducation: 'ናይ ትምህርቲ ማእከል (ኣካዳሚ)',
    tabBusinessHub: 'ናይ ንግዲ ማእከል (Business Hub)',
    tabCulturalExplorer: 'ባህላዊ መርማሪ (ትግራይን ኤርትራን)',
    tabMediaArchive: 'ዲጂታል ታሪኽን ውርሻን መዝገብ',
    tabAnalytics: 'ስታቲስቲክስን ጸብጻብን',
    tabSaved: 'ዝተዓቀቡ ትንታነታት',
    tabManagement: 'ስርዓተ-ምሕደራ',
    tabHome: 'ቀንዲ ገጽ',
    tabChats: 'ዕላላት',
    tabHistory: 'ታሪኽ',
    tabProfile: 'ፕሮፋይል',

    // Premiere View Main Titles & Prompts
    premiereGreetingLine1: 'እንቋዕ ብደሓን መጻእኹም ናብ',
    premiereGreetingLine2: 'ኣክሱማይት AI (AXUMITE AI)',
    yourNameLabel: 'ስምኩም',
    userTypeLabel: 'ደረጃ ተጠቃሚ',
    standardUser: 'ተጠቃሚ',
    premiumUser: 'ልዑላዊ ኣባል (Pro)',
    welcomeBack: 'እንቋዕ ብደሓን መጻእኹም',
    hello: 'ሰላም ከመይ ኣለኹም',
    aiAssistantCardTitle: 'AI ረዳኢ / ሓጋዚ',
    chatWithAi: 'ምስ AI ምዕላል',

    // Voice Hero Card
    voiceHeroTitle: 'ብድምጺ ምዝርራብ',
    voiceHeroSubtitle: 'ብትግርኛ፡ እንግሊዝኛ ወይ ጀርመን ብድምጺ ተዛረቡ',
    startVoiceBtn: 'ብድምጺ ጀምር',

    // 10 AI Tools Matrix
    toolAiChatTitle: 'ምስ AI ምዕላል',
    toolAiChatDesc: 'ብትግርኛ፡ እንግሊዝኛን ጀርመንን ምስ AI ብድምጽን ጽሑፍን ተዛረቡ።',
    toolSmartAssistantTitle: 'ብልሒ ዘለዎ AI ረዳኢ',
    toolSmartAssistantDesc: 'ዝኾነ ሕቶ ሕተቱ፡ ንዕለታዊ ስራሕኩምን ምርምርኩምን ሓገዝ ርከቡ።',
    toolDocumentAiTitle: 'ሰነድ መርማሪ (Doc AI)',
    toolDocumentAiDesc: 'PDF፡ Word፡ ሰነዳት ብምስዳድ ጽሟቕን ትንታነን ርከቡ።',
    toolAiWriterTitle: 'AI ጸሓፊ',
    toolAiWriterDesc: 'ደብዳበታት፡ ጽሑፋት፡ ጸብጻባት ብAI ብቅልጡፍ ኣዳልዉ።',
    toolSpeechToTextTitle: 'ድምጺ ናብ ጽሑፍ',
    toolSpeechToTextDesc: 'ዝተዛረብኩምዎ ድምጺ ብልክዕ ናብ ጽሑፍ ይቕየር።',
    toolTextToSpeechTitle: 'ጽሑፍ ናብ ድምጺ',
    toolTextToSpeechDesc: 'መልስታት AI ብጥዑም ተፈጥሮኣዊ ድምጺ ስምዑ።',
    toolImageGenTitle: 'ምስሊ ፈጣሪ',
    toolImageGenDesc: 'ብጽሑፍ ዝገለጽኩምዎ ሓሳብ ናብ ብሉጽ ስእሊ ይቕየር።',
    toolImageAnalyzerTitle: 'ምስሊ መርማሪ',
    toolImageAnalyzerDesc: 'ስእሊ ብምስዳድ ትሕዝቶኡን ዝርዝሩን ብAI ተረዱ።',
    toolTranslatorTitle: 'ተርጓሚ ቋንቋታት',
    toolTranslatorDesc: 'ትግርኛ፡ ግእዝ፡ እንግሊዝኛ፡ ጀርመንን ካልኦትን ብልክዕ ተርጒሙ።',
    toolAiLearningTitle: 'ትምህርትን ኣካዳምን',
    toolAiLearningDesc: 'STEM፡ ቋንቋታት፡ ናይ ገዛ ዕዮ ፍታሕን ምስክር ወረቐትን ብAI ተማሃሩ።',

    // Business & Cultural Features
    businessCopilotTitle: 'AI ናይ ንግዲ መሻርኽቲ',
    businessCopilotDesc: 'ናይ ንግዲ መደብ፡ ዕዳጋ ትንታነ፡ ፋይናንስ፡ ሰነዳትን ዓማዊል ምሕደራን።',
    culturalExplorerTitle: 'ባህላዊ መዝገብ ትግራይን ኤርትራን',
    culturalExplorerDesc: 'ታሪኽ ኣክሱም፡ ጥንታዊ ውርሻታት፡ ምስላታት፡ ሙዚቃ፡ ባህላዊ ክዳውንትን ዛንታታትን።',
    mediaArchiveTitle: 'ዲጂታል ታሪኽን ውርሻን መዝገብ',
    mediaArchiveDesc: 'ስእልታት፡ ናይ ኣበው ቃል-ታሪኽን ጥንታዊ ሰነዳትን ምዕቃብ።',

    // Upgrade Banner
    upgradePremiumTitle: 'ናብ ፕሪምየም ክብ ኣብሉ',
    upgradePremiumDesc: 'ንኹሉ ፍሉይ ናይ AI ኣገልግሎታት ብዘይ ገደብ ተጠቐሙ።',
    goPremiumBtn: 'ፕሪምየም ውሰዱ',

    // Navbar
    navStartScreen: '▶ መእተዊ ገጽ',
    navSettings: 'ቅጥዕታት',
    navDeveloper: 'ደቨሎፐር',
    navSecurity: 'ውሕስነት',
    navAuth: 'ምእታው / ምምዝጋብ',
    navWelcome: 'መቐበሊ',
    navGuide: 'መርሒ',
    navOffline: 'ኦፍላይን',
    navOnline: 'ኦንላይን',

    // Language Switcher
    langTigrinya: 'ትግርኛ (Tigrinya)',
    langTigrayTigrinya: 'ትግርኛ (Tigrinya)',
    langEnglish: 'English',
    langGerman: 'Deutsch (German)',
    selectLanguage: 'ቋንቋ ምረጹ',
    switchLangShort: 'ትግርኛ',

    // Chat
    chatPlaceholder: 'ሕቶኹም ብትግርኛ፡ እንግሊዝኛ ወይ ጀርመን ጽሓፉ ወይ ብድምጺ ተዛረቡ...',
    send: 'ስደድ',
    clearChat: 'ኣጽሪ',
    copyText: 'ቅዳሕ',
    copied: 'ተቐዲሑ!',
    saveInsight: 'ዓቅብ',
    savedSuccess: 'ብዓወት ተዓቒቡ!',
    speakText: 'ስማዕ',
    stopVoice: 'ኣቋርጽ',
    deepReasoning: 'ዕሙቕ ትንታነ',
    ancientScript: 'ግእዝ ፊደላት',
    creativeMode: 'ፈጠራዊ',
    generalMode: 'ሓፈሻዊ',

    // Voice Assistant
    voiceListening: 'ድምጽኹም ይስማዕ ኣሎ...',
    voiceTapToSpeak: 'ንምዝራብ ጠውቑ',
    voiceProcessing: 'ድምጺ ይምርመር ኣሎ...',

    // Payments
    paymentHeader: 'ናይ ክፍሊት ስርዓት (Telebirr, CBE, ዓለምለኸ)',
    telebirr: 'ቴሌብር (Telebirr)',
    cbeBirr: 'ኢትዮጵያ ንግዲ ባንክ (CBE Birr)',
    commercialBank: 'ናይ ንግዲ ባንክ',
    amount: 'መጠን ገንዘብ',
    sendMoney: 'ክፍሊት ፈጽም',

    // Vision
    uploadImage: 'ምስሊ ኣእትዉ',
    analyzeImage: 'ምስሊ መርምር',
    ocrExtractedText: 'ዝተነበበ ጽሑፍ',

    // Saved Vault
    savedInsightsTitle: 'ዝተዓቀቡ ትንታነታትን ታሪኽን',
    noSavedItems: 'ዝተዓቀበ ነገር የለን',
    deleteItem: 'ደምስስ',

    // Modals
    close: 'ዕጾ',
    save: 'ዓቅብ',
    cancel: 'ሰርዝ',
    login: 'እቶ',
    signup: 'ተመዝገብ',
    logout: 'ውጻእ',
    verified: 'ዝተረጋገጸ',
    notVerified: 'ዘይተረጋገጸ',
  },
  en: {
    // Tabs & Navigation
    tabPremiere: 'Premiere Hub',
    tabChat: 'AI Obelisk Chat',
    tabAssistance: 'AI Copilot',
    tabPayment: 'Payments & Subscriptions',
    tabVision: 'Vision Studio',
    tabPromptForge: 'Prompt Forge',
    tabTranslator: 'Translation Studio',
    tabCalligraphy: 'Ge\'ez Calligraphy',
    tabEducation: 'AI Education & Academy',
    tabBusinessHub: 'AI Business Hub',
    tabCulturalExplorer: 'Cultural AI (Tigray & Eritrea)',
    tabMediaArchive: 'Digital Heritage Archive',
    tabAnalytics: 'Analytics',
    tabSaved: 'Saved Vault',
    tabManagement: 'Management',
    tabHome: 'Home',
    tabChats: 'Chats',
    tabHistory: 'History',
    tabProfile: 'Profile',

    // Premiere View Main Titles & Prompts
    premiereGreetingLine1: 'Welcome to the sovereign',
    premiereGreetingLine2: 'AXUMITE AI Intelligence',
    yourNameLabel: 'Your Name',
    userTypeLabel: 'User Tier',
    standardUser: 'Standard Explorer',
    premiumUser: 'Sovereign Pro Member',
    welcomeBack: 'Welcome Back',
    hello: 'Hello',
    aiAssistantCardTitle: 'AI Smart Assistant',
    chatWithAi: 'Chat with AI',

    // Voice Hero Card
    voiceHeroTitle: 'Voice Conversation Hub',
    voiceHeroSubtitle: 'Speak naturally in Tigrinya, English, or German with AI audio feedback',
    startVoiceBtn: 'Start Voice Conversation',

    // 10 AI Tools Matrix
    toolAiChatTitle: 'AI Chat Assistant',
    toolAiChatDesc: 'Chat via text or voice in Tigrinya, English, and German with deep reasoning.',
    toolSmartAssistantTitle: 'Smart Assistant',
    toolSmartAssistantDesc: 'Ask questions, solve problems, and get personalized advice across domains.',
    toolDocumentAiTitle: 'Document AI',
    toolDocumentAiDesc: 'Upload and analyze PDFs, Word, TXT files and get structured summaries.',
    toolAiWriterTitle: 'AI Writer',
    toolAiWriterDesc: 'Write emails, business plans, articles, reports, and marketing copy.',
    toolSpeechToTextTitle: 'Speech to Text',
    toolSpeechToTextDesc: 'Convert your speech into accurate text instantly with dialect recognition.',
    toolTextToSpeechTitle: 'Text to Speech',
    toolTextToSpeechDesc: 'Listen to AI responses in natural human-like voice synthesis.',
    toolImageGenTitle: 'Image Generator',
    toolImageGenDesc: 'Create 8K photorealistic luxury artwork and cultural illustrations.',
    toolImageAnalyzerTitle: 'Image Analyzer',
    toolImageAnalyzerDesc: 'Upload images, receipts, or artifacts for AI deep visual analysis.',
    toolTranslatorTitle: 'Translator Studio',
    toolTranslatorDesc: 'Translate between Tigrinya, Ge\'ez, English, German & 100+ languages.',
    toolAiLearningTitle: 'AI Education & Academy',
    toolAiLearningDesc: 'Socratic AI tutoring, STEM homework solver, quizzes, and certificates.',

    // Business & Cultural Features
    businessCopilotTitle: 'AI Business Assistant',
    businessCopilotDesc: 'Business plans, market research, financial forecasts, proposals, and CRM.',
    culturalExplorerTitle: 'Tigray & Eritrea Cultural AI',
    culturalExplorerDesc: 'Heritage matrix, ancient sites, proverbs, poetry, music, attire, and stories.',
    mediaArchiveTitle: 'Digital Heritage Vault',
    mediaArchiveDesc: 'Preserve community photos, oral histories, family artifacts, and manuscripts.',

    // Upgrade Banner
    upgradePremiumTitle: 'Upgrade to Sovereign Pro',
    upgradePremiumDesc: 'Unlock unlimited AI chat, 4K Ge\'ez generation, video dubbing & business tools.',
    goPremiumBtn: 'Upgrade Now',

    // Navbar
    navStartScreen: '▶ Start Screen',
    navSettings: 'Settings',
    navDeveloper: 'Developer',
    navSecurity: 'Security',
    navAuth: 'Sign In / Register',
    navWelcome: 'Welcome',
    navGuide: 'Guide',
    navOffline: 'Offline',
    navOnline: 'Online',

    // Language Switcher
    langTigrinya: 'ትግርኛ (Tigrinya)',
    langTigrayTigrinya: 'ትግርኛ (Tigrinya)',
    langEnglish: 'English (US/UK)',
    langGerman: 'Deutsch (German)',
    selectLanguage: 'Select Language',
    switchLangShort: 'English',

    // Chat
    chatPlaceholder: 'Ask anything in Tigrinya, English, or German by voice or text...',
    send: 'Send',
    clearChat: 'Clear Chat',
    copyText: 'Copy',
    copied: 'Copied!',
    saveInsight: 'Save',
    savedSuccess: 'Saved successfully!',
    speakText: 'Listen',
    stopVoice: 'Stop',
    deepReasoning: 'Deep Reasoning',
    ancientScript: 'Ge\'ez Script',
    creativeMode: 'Creative',
    generalMode: 'General',

    // Voice Assistant
    voiceListening: 'Listening to voice...',
    voiceTapToSpeak: 'Tap to Speak',
    voiceProcessing: 'Processing Audio...',

    // Payments
    paymentHeader: 'Eritrean & International Payment System',
    telebirr: 'Nakfa Digital Pay',
    cbeBirr: 'Commercial Bank of Eritrea',
    commercialBank: 'Commercial Bank of Eritrea',
    amount: 'Amount',
    sendMoney: 'Execute Payment',

    // Vision
    uploadImage: 'Upload Image',
    analyzeImage: 'Analyze Image',
    ocrExtractedText: 'Extracted OCR Text',

    // Saved Vault
    savedInsightsTitle: 'Saved Insights & History',
    noSavedItems: 'No saved items found in vault',
    deleteItem: 'Delete',

    // Modals
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    login: 'Sign In',
    signup: 'Sign Up',
    logout: 'Sign Out',
    verified: 'Verified',
    notVerified: 'Unverified',
  },
  de: {
    // Tabs & Navigation
    tabPremiere: 'Premiere-Zentrum',
    tabChat: 'KI-Obelisk-Chat',
    tabAssistance: 'KI-Assistent',
    tabPayment: 'Zahlungen & Abonnements',
    tabVision: 'Vision-Studio',
    tabPromptForge: 'Prompt-Schmiede',
    tabTranslator: 'Übersetzungsstudio',
    tabCalligraphy: 'Ge\'ez-Kalligrafie',
    tabEducation: 'KI-Bildungsakademie',
    tabBusinessHub: 'KI-Business-Hub',
    tabCulturalExplorer: 'Kultur-KI (Tigray & Eritrea)',
    tabMediaArchive: 'Digitales Kulturerbe-Archiv',
    tabAnalytics: 'Analysen',
    tabSaved: 'Gespeicherte Daten',
    tabManagement: 'Verwaltung',
    tabHome: 'Startseite',
    tabChats: 'Chats',
    tabHistory: 'Verlauf',
    tabProfile: 'Profil',

    // Premiere View Main Titles & Prompts
    premiereGreetingLine1: 'Willkommen bei der souveränen',
    premiereGreetingLine2: 'AXUMITE KI-Intelligenz',
    yourNameLabel: 'Ihr Name',
    userTypeLabel: 'Benutzerstufe',
    standardUser: 'Standard-Entdecker',
    premiumUser: 'Souveränes Pro-Mitglied',
    welcomeBack: 'Willkommen zurück',
    hello: 'Hallo',
    aiAssistantCardTitle: 'Intelligenter KI-Assistent',
    chatWithAi: 'Mit KI chatten',

    // Voice Hero Card
    voiceHeroTitle: 'Sprachkonversations-Hub',
    voiceHeroSubtitle: 'Sprechen Sie natürlich auf Tigrinya, Englisch oder Deutsch mit KI-Sprachausgabe',
    startVoiceBtn: 'Sprachkonversation starten',

    // 10 AI Tools Matrix
    toolAiChatTitle: 'KI-Chat-Assistent',
    toolAiChatDesc: 'Chatten Sie per Text oder Sprache auf Tigrinya, Englisch und Deutsch.',
    toolSmartAssistantTitle: 'Intelligenter Assistent',
    toolSmartAssistantDesc: 'Stellen Sie Fragen, lösen Sie Probleme und erhalten Sie Expertenrat.',
    toolDocumentAiTitle: 'Dokumenten-KI',
    toolDocumentAiDesc: 'Laden Sie PDFs, Word- und TXT-Dateien hoch für strukturierte Zusammenfassungen.',
    toolAiWriterTitle: 'KI-Autor',
    toolAiWriterDesc: 'Erstellen Sie professionelle E-Mails, Businesspläne, Berichte und Marketingtexte.',
    toolSpeechToTextTitle: 'Sprache zu Text',
    toolSpeechToTextDesc: 'Wandeln Sie gesprochene Sprache präzise in Text um mit Dialekterkennung.',
    toolTextToSpeechTitle: 'Text zu Sprache',
    toolTextToSpeechDesc: 'Hören Sie KI-Antworten in natürlicher, lebendiger Sprachsynthese.',
    toolImageGenTitle: 'Bildgenerator',
    toolImageGenDesc: 'Erstellen Sie fotorealistische 8K-Luxuskunstwerke und kulturelle Illustrationen.',
    toolImageAnalyzerTitle: 'Bildanalysator',
    toolImageAnalyzerDesc: 'Laden Sie Bilder oder Dokumente für eine detaillierte KI-Analyse hoch.',
    toolTranslatorTitle: 'Übersetzungsstudio',
    toolTranslatorDesc: 'Übersetzen Sie zwischen Tigrinya, Ge\'ez, Englisch, Deutsch und 100+ Sprachen.',
    toolAiLearningTitle: 'KI-Bildung & Akademie',
    toolAiLearningDesc: 'Sokratisches KI-Tutoring, MINT-Hausaufgabenhilfe, Tests und Zertifikate.',

    // Business & Cultural Features
    businessCopilotTitle: 'KI-Business-Assistent',
    businessCopilotDesc: 'Businesspläne, Marktforschung, Finanzprognosen, Angebote und CRM.',
    culturalExplorerTitle: 'Kultur-KI (Tigray & Eritrea)',
    culturalExplorerDesc: 'Kulturerbe, historische Stätten, Sprichwörter, Poesie, Musik und Bräuche.',
    mediaArchiveTitle: 'Digitales Kulturerbe-Archiv',
    mediaArchiveDesc: 'Bewahren Sie Fotos, mündliche Überlieferungen und historische Dokumente.',

    // Upgrade Banner
    upgradePremiumTitle: 'Auf Pro upgraden',
    upgradePremiumDesc: 'Unbegrenzter Zugriff auf KI-Chat, 4K-Kalligrafie, Videodubbing & Business-Tools.',
    goPremiumBtn: 'Jetzt upgraden',

    // Navbar
    navStartScreen: '▶ Startbildschirm',
    navSettings: 'Einstellungen',
    navDeveloper: 'Entwickler',
    navSecurity: 'Sicherheit',
    navAuth: 'Anmelden / Registrieren',
    navWelcome: 'Willkommen',
    navGuide: 'Anleitung',
    navOffline: 'Offline',
    navOnline: 'Online',

    // Language Switcher
    langTigrinya: 'ትግርኛ (Tigrinya)',
    langTigrayTigrinya: 'ትግርኛ (Tigrinya)',
    langEnglish: 'English (Englisch)',
    langGerman: 'Deutsch (German)',
    selectLanguage: 'Sprache wählen',
    switchLangShort: 'Deutsch',

    // Chat
    chatPlaceholder: 'Fragen Sie auf Tigrinya, Englisch oder Deutsch per Sprache oder Text...',
    send: 'Senden',
    clearChat: 'Chat leeren',
    copyText: 'Kopieren',
    copied: 'Kopiert!',
    saveInsight: 'Speichern',
    savedSuccess: 'Erfolgreich gespeichert!',
    speakText: 'Anhören',
    stopVoice: 'Stopp',
    deepReasoning: 'Tiefes Nachdenken',
    ancientScript: 'Ge\'ez-Schrift',
    creativeMode: 'Kreativ',
    generalMode: 'Allgemein',

    // Voice Assistant
    voiceListening: 'Höre zu...',
    voiceTapToSpeak: 'Tippen zum Sprechen',
    voiceProcessing: 'Audio wird verarbeitet...',

    // Payments
    paymentHeader: 'Eritreisches & Internationales Zahlungssystem',
    telebirr: 'Nakfa Digital Pay',
    cbeBirr: 'Commercial Bank of Eritrea',
    commercialBank: 'Commercial Bank of Eritrea',
    amount: 'Betrag',
    sendMoney: 'Zahlung ausführen',

    // Vision
    uploadImage: 'Bild hochladen',
    analyzeImage: 'Bild analysieren',
    ocrExtractedText: 'Extrahierter OCR-Text',

    // Saved Vault
    savedInsightsTitle: 'Gespeicherte Erkenntnisse & Verlauf',
    noSavedItems: 'Keine gespeicherten Einträge gefunden',
    deleteItem: 'Löschen',

    // Modals
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    login: 'Anmelden',
    signup: 'Registrieren',
    logout: 'Abmelden',
    verified: 'Verifiziert',
    notVerified: 'Nicht verifiziert',
  },
};
