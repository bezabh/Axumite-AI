export type AppTab = 
  | 'chat' 
  | 'assistance' 
  | 'payment' 
  | 'vision' 
  | 'prompt-forge' 
  | 'translator' 
  | 'calligraphy'
  | 'education'
  | 'business-hub'
  | 'cultural-explorer'
  | 'media-archive'
  | 'saved' 
  | 'brand-manifesto' 
  | 'premiere' 
  | 'analytics'
  | 'management'
  | 'user-management'
  | 'payment-management'
  | 'customer-management'
  | 'admin-config';

export type QueryMode = 'general' | 'deep-reasoning' | 'ancient-script' | 'creative';

export type UserRole = 
  | 'Creator'
  | 'Admin' 
  | 'Axumite Sovereign Scholar' 
  | 'ኤርትራዊ AI Pro' 
  | 'Free Member'
  | 'Guest'
  | 'Suspended';

export interface UserPrivileges {
  canUseChat: boolean;
  canUseVision: boolean;
  canUsePromptForge: boolean;
  canUseGeezTranslator: boolean;
  canUseAssistance: boolean;
  canUseProClick: boolean;
  canManageUsers: boolean;
  canManagePayments: boolean;
  canManageCRM: boolean;
  canConfigureApp: boolean;
  canExportData: boolean;
  canBypassMaintenance: boolean;
  canManagePrivileges: boolean;
}

export interface AppSystemConfig {
  appName: string;
  appSubtitle: string;
  defaultLanguage: 'ti-ER' | 'ti-ET' | 'gez' | 'en';
  maintenanceMode: boolean;
  maintenanceNotice: string;
  publicSignUp: boolean;
  enableGuestMode: boolean;
  enableVoiceSynthesis: boolean;
  enableImageRecognition: boolean;
  enablePromptForge: boolean;
  enableProClickEarning: boolean;
  defaultModel: string;
  aiTemperature: number;
  maxOutputTokens: number;
  systemPromptBase: string;
  tokenLimits: {
    free: number;
    pro: number;
    scholar: number;
    admin: number;
  };
  security: {
    enforce2FA: boolean;
    sessionTimeoutMinutes: number;
    maxFailedAttempts: number;
    allowExportCSV: boolean;
    ipGeofenceEnabled: boolean;
  };
  ui: {
    primaryTheme: 'gold' | 'cyan' | 'obsidian' | 'ruby';
    showWelcomeOverlayOnStartup: boolean;
    rollingBackgroundDefault: boolean;
    enableCursorGuide: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  avatar: string; // icon identifier or url
  role: UserRole;
  preferredLanguage: 'ti-ER' | 'ti-ET' | 'gez' | 'en';
  isLoggedIn: boolean;
  joinedDate: string;
  offlineAccessEnabled: boolean;
  savedInsightsCount: number;
  privileges?: Partial<UserPrivileges>;
  customPrivilegesEnabled?: boolean;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  role: UserRole;
  status: 'Active' | 'Pending Verification' | 'Suspended';
  tokensUsed: number;
  tokensQuota: number;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  joinedDate: string;
  lastActive: string;
  avatarUrl?: string;
  privileges?: Partial<UserPrivileges>;
  customPrivilegesEnabled?: boolean;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  billingCycle: 'Monthly' | 'Annual' | 'One-time';
  amount: number;
  currency: 'ERN' | 'ETB' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF';
  paymentMethod: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  timestamp: string;
  tokensCredited: number;
  invoiceNumber: string;
  notes?: string;
  receiptUrl?: string;
  failureReason?: string;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'ERN' | 'ETB' | 'JPY' | 'CHF';

export interface DatabaseUserAccount {
  id: string;
  name: string;
  email: string;
  account_type: 'free' | 'premium' | 'enterprise' | 'lifetime';
  created_at: string;
  stripe_customer_id?: string;
  role?: string;
}

export interface DatabaseSubscriptionRecord {
  id: string;
  user_id: string;
  user_email: string;
  provider_customer_id: string;
  provider_subscription_id: string;
  plan: 'free' | 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly' | 'lifetime_pass';
  plan_name: string;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'expired';
  billing_cycle: 'monthly' | 'yearly' | 'one_time' | 'free';
  amount: number;
  currency: SupportedCurrency;
  start_date: string;
  end_date: string;
  renewal_date: string;
  cancel_at_period_end: boolean;
  trial_end_date?: string | null;
  created_at: string;
  updated_at: string;
  entitlement_signature?: string;
}

export interface DatabasePaymentRecord {
  id: string;
  user_id: string;
  user_email: string;
  provider_payment_id: string;
  amount: number;
  currency: SupportedCurrency;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  payment_date: string;
  receipt_url: string;
  plan_id: string;
  invoice_number: string;
  payment_method_label: string;
  card_last4?: string;
  failure_reason?: string;
  refund_amount?: number;
  refund_date?: string;
  created_at: string;
}

export interface AdminPaymentMetrics {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  successfulPayments: number;
  failedPayments: number;
  totalRevenueUSD: number;
  totalRefundsUSD: number;
  recentTransactions: DatabasePaymentRecord[];
}

export interface PaymentTestResult {
  id: string;
  testName: string;
  description: string;
  passed: boolean;
  latencyMs: number;
  details: string;
  responseSnippet?: string;
  timestamp: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  companyOrOrganization?: string;
  tier: 'Free' | 'Pro' | 'Enterprise' | 'VIP Scholar';
  lifecycleStage: 'Lead' | 'Trial' | 'Active Customer' | 'At Risk' | 'VIP';
  totalSpendUSD: number;
  tokensUsed: number;
  healthScore: 'Excellent' | 'Good' | 'Fair' | 'At Risk';
  totalInquiries: number;
  satisfactionRating: number; // 1-5
  lastContactDate: string;
  assignedManager: string;
  tags: string[];
  notes: string[];
}

export interface CustomerTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: 'Billing & Payments' | 'AI Model Query' | 'Ge\'ez Script Support' | 'Account Access' | 'Feature Request';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
  lastResponse: string;
}

export interface DictionaryEntry {
  id: string;
  tigrinya: string;
  geezScript: string;
  phonetic: string;
  english: string;
  category: 'common' | 'proverb' | 'culture' | 'geography' | 'grammar';
  explanation: string;
  exampleSentence?: string;
}

export interface EritreanLandmark {
  id: string;
  name: string;
  tigrinyaName: string;
  region: string;
  description: string;
  historicalEra: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  mode?: QueryMode;
  audioBase64?: string;
  isPlayingAudio?: boolean;
  isOfflineFallback?: boolean;
}

export interface PromptForgeResult {
  title: string;
  promptText: string;
  negativePrompt: string;
  aspectRatioSuggestion: string;
  styleNotes: string[];
  sampleTags: string[];
}

export interface WordBreakdown {
  originalWord: string;
  translatedWord: string;
  phonetic: string;
  meaning: string;
}

export interface TranslationResult {
  translatedText: string;
  transliteration: string;
  scriptName: string;
  wordBreakdown: WordBreakdown[];
  culturalContext: string;
}

export interface SavedItem {
  id: string;
  title: string;
  type: 'chat' | 'vision' | 'prompt' | 'translation' | 'payment' | 'assistance' | 'calligraphy';
  content: string;
  tags: string[];
  createdAt: string;
  metadata?: any;
}

export interface PaymentReceipt {
  transactionId: string;
  planName: string;
  amountPaid: string;
  currency: string;
  paymentMethod: string;
  billing: string;
  tokensGranted: string;
  customerEmail: string;
  timestamp: string;
  receiptUrl: string;
  status: string;
}

export interface ProClickTask {
  id: string;
  title: string;
  titleTigrinya?: string;
  description: string;
  tokenReward: number;
  clickUrl?: string;
  category: 'daily' | 'social' | 'learning' | 'partner';
  isClaimed?: boolean;
  cooldownHours?: number;
}

export interface ProClickDailyMetric {
  day: string;
  date: string;
  clicks: number;
  dailyTokens: number;
  referralBonus: number;
  totalDaily: number;
  cumulativeTokens: number;
  usdValue: number;
}

export interface UserSubscription {
  activePlan: 'free' | 'neural-pass' | 'sovereign-tier';
  planName: string;
  tokensRemaining: number;
  renewalDate: string;
  history: PaymentReceipt[];
  totalClickEarnings?: number;
  referralCode?: string;
  referralClicksCount?: number;
}

export interface AxumiteMilestone {
  id: string;
  period: string;
  yearCentury: string;
  title: string;
  titleGeez: string;
  category: 'architecture' | 'coinage' | 'rulers' | 'religion' | 'maritime';
  summary: string;
  details: string;
  significance: string;
  keyArtifacts: string[];
  tags: string[];
  keyFact: string;
}

export interface CommunityLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  handle: string;
  location: string;
  countryCode: string;
  proClickStatus: 'Pro Click Gold Sovereign' | 'Pro Click Diamond Champion' | 'Pro Click Master' | 'Pro Click Elite' | 'Pro Click Pioneer';
  badgeStyle: 'gold-sovereign' | 'diamond-champion' | 'gold-master' | 'gold-elite' | 'gold-pioneer';
  totalTokensEarned: number;
  tasksCompleted: number;
  referralsCount: number;
  streakDays: number;
  upvotes: number;
  joinedDate: string;
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

export interface AppNotification {
  id: string;
  titleTi: string;
  titleEn: string;
  bodyTi: string;
  bodyEn: string;
  category: 'scholarship' | 'system_update' | 'security' | 'feature' | 'payment_failed' | 'payment';
  timestamp: string;
  isoDate: string;
  read: boolean;
  urgency: 'urgent' | 'important' | 'info';
  scholarshipId?: string;
  actionUrl?: string;
  actionLabelTi?: string;
  actionLabelEn?: string;
  badgeText?: string;
  icon?: string;
  actionType?: 'navigate_tab' | 'external_url' | 'open_scholarship' | 'open_system_status' | 'open_payment';
  targetTab?: string;
  paymentDetails?: {
    planName?: string;
    amount?: number;
    currency?: string;
    failureReason?: string;
    invoiceNumber?: string;
    last4?: string;
    paymentMethod?: string;
  };
}

export interface NotificationPreferences {
  enableWebPush: boolean;
  enableScholarships: boolean;
  enableSystemUpdates: boolean;
  enablePaymentAlerts: boolean;
  enableAudioChime: boolean;
  preferredLanguage: 'bilingual' | 'ti' | 'en';
}

// =========================================================================
// AI EDUCATIONAL PLATFORM TYPES & INTERFACES
// =========================================================================

export type CourseCategory = 
  | 'stem' 
  | 'computer_science' 
  | 'geez_language' 
  | 'tigrinya_grammar' 
  | 'medicine' 
  | 'business' 
  | 'history_heritage' 
  | 'scholarships_prep' 
  | 'general_ai';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

export interface LessonResource {
  id: string;
  title: string;
  titleTi: string;
  type: 'pdf' | 'code' | 'cheatsheet' | 'link';
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleTi: string;
  durationMinutes: number;
  videoUrl: string;
  summaryEn: string;
  summaryTi: string;
  contentMarkdownEn: string;
  contentMarkdownTi: string;
  keyTakeawaysEn: string[];
  keyTakeawaysTi: string[];
  isFreePreview: boolean;
  resources?: LessonResource[];
  quizQuestionIds?: string[];
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionTi: string;
  optionsEn: string[];
  optionsTi: string[];
  correctAnswerIndex: number;
  explanationEn: string;
  explanationTi: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topicTag?: string;
}

export interface Course {
  id: string;
  title: string;
  titleTi: string;
  slug: string;
  descriptionEn: string;
  descriptionTi: string;
  instructorName: string;
  instructorTitle: string;
  instructorTitleTi: string;
  instructorAvatar: string;
  thumbnailUrl: string;
  category: CourseCategory;
  level: DifficultyLevel;
  isPremium: boolean;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  durationHours: number;
  certificateEligible: boolean;
  tags: string[];
  lessons: Lesson[];
  quizzes: QuizQuestion[];
  finalExam: QuizQuestion[];
  createdDate: string;
  updatedDate: string;
  featured?: boolean;
}

export interface StudentEnrollment {
  courseId: string;
  studentId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  quizScores: Record<string, number>; // quizId/questionId -> score %
  finalExamScore?: number;
  isCompleted: boolean;
  certificateId?: string;
  certificateIssuedDate?: string;
  lastAccessedAt: string;
  currentLessonId?: string;
  notes: Record<string, string>; // lessonId -> user notes
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitleEn: string;
  courseTitleTi: string;
  instructorName: string;
  issueDate: string;
  scorePercent: number;
  verificationUrl: string;
  badgeLevel: 'Distinction' | 'Merit' | 'Completion';
}

export interface Flashcard {
  id: string;
  topic: string;
  frontEn: string;
  backEn: string;
  frontTi: string;
  backTi: string;
  category: string;
  isMastered: boolean;
  reviewCount: number;
}

export interface HomeworkAnalysis {
  id: string;
  problemText: string;
  subject: string;
  stepByStepSolutionEn: string;
  stepByStepSolutionTi: string;
  hintsEn: string[];
  hintsTi: string[];
  formulasUsed: string[];
  keyConceptsEn: string[];
  keyConceptsTi: string[];
  createdDate: string;
}

export interface LearningPathMilestone {
  id: string;
  weekNumber: number;
  titleEn: string;
  titleTi: string;
  descriptionEn: string;
  descriptionTi: string;
  recommendedCourseId?: string;
  completed: boolean;
  actionItemEn: string;
  actionItemTi: string;
}

export interface PersonalizedLearningPath {
  id: string;
  studentId: string;
  targetGoalEn: string;
  targetGoalTi: string;
  fieldOfStudy: string;
  currentSkillLevel: DifficultyLevel;
  totalWeeks: number;
  weeklyHours: number;
  milestones: LearningPathMilestone[];
  generatedDate: string;
  progressPercent: number;
}

export interface StudentDashboardStats {
  totalCoursesEnrolled: number;
  completedCoursesCount: number;
  totalStudyHours: number;
  currentStreakDays: number;
  certificatesEarnedCount: number;
  averageQuizScore: number;
  flashcardsMasteredCount: number;
}

export interface TeacherCourseDraft {
  title: string;
  titleTi: string;
  descriptionEn: string;
  descriptionTi: string;
  category: CourseCategory;
  level: DifficultyLevel;
  isPremium: boolean;
  priceUsd: number;
  thumbnailUrl: string;
  lessons: {
    title: string;
    titleTi: string;
    videoUrl: string;
    durationMinutes: number;
    summaryEn: string;
    summaryTi: string;
    contentMarkdownEn: string;
    contentMarkdownTi: string;
    isFreePreview: boolean;
  }[];
}

// =========================================================================
// AI BUSINESS ASSISTANT TYPES
// =========================================================================

export type BusinessIndustry = 
  | 'technology_software'
  | 'agribusiness_coffee'
  | 'tourism_hospitality'
  | 'import_export_logistics'
  | 'retail_ecommerce'
  | 'renewable_energy'
  | 'healthcare_pharmacy'
  | 'construction_realestate'
  | 'diaspora_remittance_fintech'
  | 'creative_media_design';

export type BusinessStage = 'idea' | 'seed_startup' | 'sme_growth' | 'scaling_enterprise';

export interface BusinessPlan {
  id: string;
  title: string;
  industry: BusinessIndustry;
  stage: BusinessStage;
  targetRegion: string;
  currency: string;
  executiveSummary: string;
  executiveSummaryTi?: string;
  executiveSummaryDe?: string;
  problemStatement: string;
  solutionValueProp: string;
  targetMarket: {
    demographics: string;
    tamSamSom: { tam: string; sam: string; som: string };
    customerPainPoints: string[];
  };
  competitiveAdvantage: string[];
  marketingStrategy: {
    channels: string[];
    customerAcquisitionCost: string;
    pricingModel: string;
  };
  operationalPlan: string[];
  financialHighlights: {
    startupCapitalRequired: number;
    year1Revenue: number;
    year2Revenue: number;
    year3Revenue: number;
    breakEvenMonths: number;
    profitMarginPercent: number;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  createdDate: string;
}

export interface MarketAnalysisReport {
  id: string;
  query: string;
  industry: BusinessIndustry;
  region: string;
  marketOverview: string;
  marketOverviewTi?: string;
  marketOverviewDe?: string;
  keyTrends: string[];
  competitorMatrix: {
    competitorName: string;
    marketShare: string;
    strengths: string;
    vulnerabilities: string;
    pricingStrategy: string;
  }[];
  customerPersonas: {
    name: string;
    archetype: string;
    budget: string;
    primaryNeeds: string[];
    recommendedApproach: string;
  }[];
  riskFactors: string[];
  strategicRecommendations: string[];
  generatedDate: string;
}

export interface MarketingCampaign {
  id: string;
  campaignTitle: string;
  objective: 'brand_awareness' | 'lead_generation' | 'sales_conversion' | 'event_launch';
  targetAudience: string;
  platform: 'facebook_instagram' | 'tiktok' | 'linkedin' | 'email_newsletter' | 'billboard_local';
  adCopies: {
    headlineEn: string;
    headlineTi: string;
    headlineDe?: string;
    bodyEn: string;
    bodyTi: string;
    bodyDe?: string;
    callToAction: string;
    hashtags: string[];
  }[];
  contentCalendarDays: {
    day: number;
    theme: string;
    postType: string;
    hook: string;
  }[];
  slogans: string[];
  estimatedBudgetUsd: number;
  createdDate: string;
}

export interface FinancialCalculatorModel {
  startupCosts: number;
  monthlyFixedCosts: number;
  unitCostOfGoods: number;
  unitSellingPrice: number;
  expectedMonthlySales: number;
  grossMarginPerUnit: number;
  grossMarginPercent: number;
  monthlyBreakEvenUnits: number;
  monthlyBreakEvenRevenue: number;
  projectedMonthlyProfit: number;
  annualNetProfit: number;
  runwayMonthsWithCapital: number;
}

export interface BusinessDocument {
  id: string;
  documentType: 'invoice' | 'proposal' | 'contract_nda' | 'pitch_deck_outline' | 'executive_report' | 'business_email';
  title: string;
  recipientName: string;
  recipientOrg?: string;
  senderName: string;
  senderOrg?: string;
  date: string;
  totalAmount?: number;
  currency?: string;
  contentMarkdownEn: string;
  contentMarkdownTi?: string;
  contentMarkdownDe?: string;
  status: 'draft' | 'finalized' | 'sent';
}

export interface CrmLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  dealSizeUsd: number;
  pipelineStage: 'lead' | 'contacted' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high';
  lastContact: string;
  notes: string;
}

export interface BusinessTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  category: 'strategy' | 'marketing' | 'sales' | 'finance' | 'operations';
}

// =========================================================================
// TIGRAY & ERITREA CULTURAL AI TYPES
// =========================================================================

export type HeritageEra = 
  | 'ancient_pre_axumite_dmt'
  | 'axumite_empire_golden_age'
  | 'medieval_zagwe_solomonic'
  | 'coastal_red_sea_ottoman'
  | 'modern_italian_art_deco'
  | 'contemporary_living_heritage';

export type EvidenceType = 'archaeological_documented' | 'monumental_inscribed' | 'living_oral_tradition' | 'sacred_manuscript';

export interface CulturalHeritageSite {
  id: string;
  nameEn: string;
  nameTi: string;
  nameDe?: string;
  region: 'Tigray' | 'Eritrea' | 'Cross-Border Heritage Basin';
  nearestCity: string;
  coordinates: { lat: number; lng: number };
  era: HeritageEra;
  evidenceType: EvidenceType;
  unescoStatus?: 'UNESCO World Heritage Site' | 'Tentative List' | 'National Monument';
  summaryEn: string;
  summaryTi: string;
  summaryDe?: string;
  historicalSignificance: string;
  architecturalStyle: string;
  imageThumbnail: string;
  keyArtifactsOrFeatures: string[];
  visitingGuideNotes: string;
}

export interface CulturalProverb {
  id: string;
  proverbTi: string;
  transliterationLatin: string;
  literalTranslationEn: string;
  moralMeaningEn: string;
  literalTranslationDe?: string;
  moralMeaningDe?: string;
  category: 'wisdom' | 'perseverance' | 'community_unity' | 'caution' | 'hospitality' | 'truth_justice';
  traditionalContext: string;
  audioPronunciationAvailable?: boolean;
}

export interface CulturalStory {
  id: string;
  titleEn: string;
  titleTi: string;
  titleDe?: string;
  targetAudience: 'children' | 'youth' | 'adults' | 'all_ages';
  theme: 'wisdom_folklore' | 'ancient_legends' | 'courage_heroism' | 'nature_animals' | 'diaspora_roots';
  storyTextTi: string;
  storyTextEn: string;
  storyTextDe?: string;
  moralLessonTi: string;
  moralLessonEn: string;
  moralLessonDe?: string;
  culturalVocabulary: { wordTi: string; transliteration: string; meaningEn: string; meaningDe?: string }[];
  narrationDurationMinutes: number;
}

export interface CulinaryTradition {
  id: string;
  nameTi: string;
  nameEn: string;
  nameDe?: string;
  category?: 'main_dish' | 'sauce_tsebhi' | 'bread_injera' | 'traditional_beverage' | 'coffee_ritual';
  courseType?: string;
  descriptionEn?: string;
  descriptionTi?: string;
  descriptionDe?: string;
  keyIngredients: string[];
  culturalCeremonyRole?: string;
  culturalContext?: string;
  preparationSteps?: string[];
  preparationMethod?: string;
  regionalVariations?: string;
  imageUrl?: string;
}

export interface MusicInstrumentCultural {
  id: string;
  nameTi: string;
  nameEn: string;
  nameDe?: string;
  category: string;
  descriptionEn?: string;
  descriptionTi?: string;
  descriptionDe?: string;
  historicalOrigins?: string;
  traditionalRole?: string; // weddings, spiritual hymns, folklore
  culturalRole?: string;
  tuningOrPlayingStyle?: string;
  playingTechnique?: string;
  stringsCount?: number;
  constructionMaterials?: string;
  imageThumbnail?: string;
  audioDemoNote?: string;
  imageUrl?: string;
}

export type TraditionalMusicInstrument = MusicInstrumentCultural;

export interface TraditionalAttireItem {
  id: string;
  nameTi: string;
  nameEn: string;
  nameDe?: string;
  gender: 'women' | 'men' | 'unisex' | 'female' | 'male';
  category?: string;
  descriptionEn?: string;
  descriptionTi?: string;
  descriptionDe?: string;
  materialsUsed?: string;
  occasion?: string;
  significance?: string;
  embroiderySignificance?: string;
  occasionsWorn?: string[];
  imageThumbnail?: string;
  imageUrl?: string;
}

export type TraditionalAttire = TraditionalAttireItem;

export interface MediaArchiveItem {
  id: string;
  title: string;
  titleTi?: string;
  mediaType: 'historical_photo' | 'audio_oral_history' | 'manuscript_document' | 'family_artifact' | 'traditional_song' | string;
  contributorName: string;
  contributorLocation: string;
  dateUploaded?: string;
  era?: string;
  tags: string[];
  description: string;
  descriptionTi?: string;
  evidenceStatus?: 'verified_historical' | 'community_archive' | 'pending_scholarly_review' | string;
  urlOrPath?: string;
  verifiedAuthenticity?: boolean;
}

export type ArchiveContributionItem = MediaArchiveItem;

export interface TigrinyaProverb {
  id: string;
  textTi: string;
  textGeez?: string;
  transliteration: string;
  englishTranslation: string;
  germanTranslation?: string;
  meaningAndContext: string;
  category: string;
  moralLesson: string;
  audioPronunciationAvailable?: boolean;
}

export interface CulturalPoem {
  id: string;
  titleTi: string;
  titleEn: string;
  titleDe?: string;
  author: string;
  period: string;
  poemTextTi: string;
  poemTextEn: string;
  poemTextDe?: string;
  genre: 'Mesele' | 'Zelesegna' | 'Kine' | 'Guayla' | 'Historical' | string;
  historicalContext: string;
  literaryStructure: string;
}

export type FileCategory = 'document' | 'image' | 'audio' | 'geez_script' | 'video' | 'other';

export interface UserFileRecord {
  id: string;
  userId: string;
  userEmail: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string; // mime type (e.g. application/pdf, image/jpeg, text/plain)
  category: FileCategory;
  downloadUrl?: string; // Firebase Storage download URL
  storagePath?: string; // Storage path in bucket (e.g. users/{userId}/files/{fileId}_{fileName})
  fileData?: string; // base64 or Data URL for preview and download
  description?: string;
  uploadDate: string; // ISO String
  updatedAt?: string;
  tags?: string[];
  isEncrypted?: boolean;
}

export interface UserStorageStats {
  usedBytes: number;
  quotaBytes: number;
  fileCount: number;
  categoryBreakdown: {
    document: number;
    image: number;
    audio: number;
    geez_script: number;
    video: number;
    other: number;
  };
}



