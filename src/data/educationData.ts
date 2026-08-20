import { Course, Flashcard, LearningPathMilestone } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-stem-101',
    title: 'Advanced Calculus & Neural Mathematics',
    titleTi: 'ዝለዓለ ካልኩለስን ኒውራል ሒሳብን',
    slug: 'advanced-calculus-neural-math',
    descriptionEn: 'Master multivariate differentiation, gradient descent optimization, and vector calculus designed for machine learning and scientific simulations.',
    descriptionTi: 'ንማሽን ለርኒንግን ሳይንሳዊ ምርምርን ዝጠቅም መልቲ-ቫርያብል ካልኩለስ፡ ግራድየንት ዲሰንት ስሌትን ቬክተር ኣልጀብራን ብዕምቆት ምምሃር።',
    instructorName: 'Dr. Tekeste Berhane',
    instructorTitle: 'Senior Theoretical Physicist & AI Fellow',
    instructorTitleTi: 'ላዕለዋይ ናይ ፊዚክስን AIን ተመራማሪ',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    category: 'stem',
    level: 'intermediate',
    isPremium: false,
    priceUsd: 0,
    rating: 4.9,
    reviewCount: 342,
    enrolledCount: 1840,
    durationHours: 6.5,
    certificateEligible: true,
    tags: ['Math', 'Calculus', 'AI Math', 'Derivatives', 'Optimization'],
    featured: true,
    createdDate: '2026-01-10',
    updatedDate: '2026-03-01',
    lessons: [
      {
        id: 'stem-101-l1',
        title: 'Limits, Continuity & Partial Derivatives',
        titleTi: 'ወሰናት (Limits)፡ ቀጻልነትን ፓርሻል ደሪቫቲቭስን',
        durationMinutes: 24,
        videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM',
        summaryEn: 'Introduction to multidimensional functions, contour maps, and calculating partial gradients.',
        summaryTi: 'ናይ ብዙሕ-ኣንፈታዊ ፋንክሽናት መእተዊ፡ ናይ ኮንቱር ካርታታትን ፓርሻል ግራድየንት ምሕሳብን።',
        contentMarkdownEn: `### Understanding Multivariate Functions
When transitioning from single-variable calculus $f(x)$ to multi-variable systems $f(x, y)$, changes occur in orthogonal dimensional space.

#### Partial Derivative Formula:
$$\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h, y) - f(x, y)}{h}$$

#### Core Properties:
1. Treat other variables as constants during differentiation.
2. The directional derivative points toward the steepest ascent.
3. Used everywhere in Backpropagation for training neural networks.`,
        contentMarkdownTi: `### ናይ ብዙሕ-ተለዋዋጢ ፋንክሽናት ምርዳእ
ካብ ሓደ ተለዋዋጢ $f(x)$ ናብ ብዙሓት $f(x, y)$ ምስ እንሰጋገር፡ ለውጥታት ኣብ ዝተፈላለየ ኣንፈት ይኽሰት።

#### ናይ ፓርሻል ደሪቫቲቭ ፎርሙላ:
$$\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h, y) - f(x, y)}{h}$$

#### ቀንዲ መትከላትን ኣጠቓቕማን:
1. ኣብ እዋን ደሪቬሽን ካልኦት ተለዋወጥቲ ከም ቋሚ (constant) ጌርካ ይውሰዱ።
2. ግራድየንት ናብቲ ዝለዓለ ናይ ዕቤት ኣንፈት የመልክት።
3. ኣብ ስልጠና ኒውራል ኔትወርክ (Backpropagation) ብሰፊሑ ይትግበር።`,
        keyTakeawaysEn: [
          'Partial derivatives measure directional rates of change.',
          'Gradient vector $\\nabla f$ points in the direction of steepest increase.',
          'Jacobian and Hessian matrices represent first and second-order spatial derivatives.'
        ],
        keyTakeawaysTi: [
          'ፓርሻል ደሪቫቲቭስ ናይ ኣንፈታዊ ለውጢ ፍጥነት ይልክዕ።',
          'ናይ ግራድየንት ቬክተር $\\nabla f$ ናብ ዝለዓለ ዕቤት የመልክት።',
          'ጃኮብያንን ሄስያንን ማትሪክስ ናይ ቀዳማይን ካልኣይን ደረጃ ደሪቫቲቭስ ይውክሉ።'
        ],
        isFreePreview: true,
      },
      {
        id: 'stem-101-l2',
        title: 'Gradient Descent & Loss Optimization in AI',
        titleTi: 'ግራድየንት ዲሰንትን ምምሕያሽ ኪሳራን ኣብ AI',
        durationMinutes: 32,
        videoUrl: 'https://www.youtube.com/embed/IHZwWFHWa-w',
        summaryEn: 'How weights in deep neural architectures are iteratively updated using stochastic gradient descent.',
        summaryTi: 'ኣብ ዲፕ ለርኒንግ ሚዛናት (weights) ብኸመይ ብግራድየንት ዲሰንት ከም ዝመሓየሹ።',
        contentMarkdownEn: `### Gradient Descent Weight Update Rule
To minimize error $L(\\theta)$, parameters are adjusted opposite to the gradient:

$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)$$

Where:
- $\\eta$ is the learning rate (step size)
- $\\nabla L$ is the loss gradient vector`,
        contentMarkdownTi: `### ናይ ግራድየንት ዲሰንት ሕጊ ምዕጣቕ
ጌጋ $L(\\theta)$ ንምንካይ፡ ፓራሜተራት ብተጻራሪ ግራድየንት ይስተኻኸሉ:

$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta L(\\theta_t)$$

ዝውከሉ ኣምራት:
- $\\eta$: ናይ ምምሃር ፍጥነት (learning rate)
- $\\nabla L$: ናይ ኪሳራ ግራድየንት ቬክተር`,
        keyTakeawaysEn: [
          'Learning rate determines convergence stability.',
          'Momentum accelerates descent in ravine-like loss landscapes.',
          'Adam optimizer adapts learning rates per parameter automatically.'
        ],
        keyTakeawaysTi: [
          'ናይ ምምሃር ፍጥነት (learning rate) ምርግጋእ ውጽኢት ይውስን።',
          'ሞመንተም ኣብ ጸቢብ ስፍራታት ቅልጡፍ ምንካይ ይፈጥር።',
          'ኣዳም (Adam) ኦፕቲማይዘር ንነፍሲ ወከፍ ፓራሜተር ብቕዓት ይህብ።'
        ],
        isFreePreview: true,
      }
    ],
    quizzes: [
      {
        id: 'q-stem-1',
        questionEn: 'In what direction does the gradient vector ∇f point?',
        questionTi: 'ናይ ግራድየንት ቬክተር ∇f ናበይ ኣንፈት የመልክት?',
        optionsEn: [
          'Direction of maximum rate of increase',
          'Direction perpendicular to the tangent plane',
          'Direction of maximum rate of decrease',
          'Random orthogonal direction'
        ],
        optionsTi: [
          'ናብቲ ዝለዓለ ናይ ዕቤት ፍጥነት ዘለዎ ኣንፈት',
          'ናብቲ ታንጀንት ፕሌን ፐርፐንዲኩላር ዝኾነ ኣንፈት',
          'ናብቲ ዝለዓለ ናይ ምጉዳል ፍጥነት ዘለዎ ኣንፈት',
          'ናብ ዘይተፈልጠ ቀጥታዊ ኣንፈት'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'The gradient vector always points in the direction of the greatest rate of increase of the function.',
        explanationTi: 'ናይ ግራድየንት ቬክተር ኩሉ ግዜ ናብቲ ዝለዓለ ናይ ዕቤት መጠን ዘለዎ ኣንፈት የመልክት።',
      }
    ],
    finalExam: [
      {
        id: 'fe-stem-1',
        questionEn: 'What happens if the learning rate η in Gradient Descent is set excessively high?',
        questionTi: 'ኣብ ግራድየንት ዲሰንት ናይ ምምሃር ፍጥነት (learning rate η) ካብ መጠን ንላዕሊ እንተዓብዩ እንታይ ይፍጠር?',
        optionsEn: [
          'The optimization will diverge or oscillate wildly without finding the minimum',
          'The model will immediately reach global zero error',
          'The gradient becomes strictly zero',
          'Computational memory overflows instantly'
        ],
        optionsTi: [
          'እቲ ስሌት ዝተሓተ ደረጃ (minimum) ከይረኸበ ይፈናጨል ወይ ይናወጽ',
          'እቲ ሞዴል ብቕጽበት ናብ ዜሮ ጌጋ ይበጽሕ',
          'ግራድየንት ብቐጥታ ዜሮ ይኸውን',
          'ናይ ኮምፒዩተር ሜሞሪ ብቕጽበት ይመልእ'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'An oversized learning rate causes the algorithm to overshoot the valley and diverge uncontrollably.',
        explanationTi: 'ዓቢ ናይ ምምሃር ፍጥነት ነቲ ዝተሓተ ቦታ ዘሊሉ ናብ ዘይረግእ ምፍንጫል ይመርሕ።',
      }
    ]
  },
  {
    id: 'course-geez-201',
    title: "Ancient Ge'ez Script, Grammar & Epigraphy",
    titleTi: 'ጥንታዊ ቋንቋ ግእዝ፡ ሰዋስውን ቅርጺ ፊደላትን',
    slug: 'ancient-geez-grammar-epigraphy',
    descriptionEn: 'Comprehensive philological mastery of Ge\'ez (Ethiopic) grammar, nominal morphology, verb conjugations, and royal inscriptions of the Kingdom of Aksum.',
    descriptionTi: 'ናይ ጥንታዊ ግእዝ ቋንቋ ሰዋስው፡ ኣሰራርዓ ግሲታት፡ ናይ ስም ምምዕባልን ኣብ ሓወልትታት ኣክሱም ዝተወቕሩ ታሪኻዊ ጽሑፋትን ብዕምቆት ምምሃር።',
    instructorName: 'Prof. Yonas Zerai',
    instructorTitle: 'Chair of Semitic Philology & Ancient Epigraphy',
    instructorTitleTi: 'ፕሮፌሰር ሴማውያን ቋንቋታትን ጥንታዊ ቅርጽን',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    category: 'geez_language',
    level: 'beginner',
    isPremium: false,
    priceUsd: 0,
    rating: 5.0,
    reviewCount: 512,
    enrolledCount: 3100,
    durationHours: 8.0,
    certificateEligible: true,
    tags: ["Ge'ez", 'Script', 'Grammar', 'Ancient History', 'Aksum', 'Tigrinya'],
    featured: true,
    createdDate: '2026-01-15',
    updatedDate: '2026-02-28',
    lessons: [
      {
        id: 'geez-201-l1',
        title: 'The 7 Orders of Fidel & Phonetic Acoustics',
        titleTi: 'ሸውዓተ ናይ ግእዝ ኣገባባት (ግእዝ፡ ካዕብ፡ ሳልስ...)',
        durationMinutes: 28,
        videoUrl: 'https://www.youtube.com/embed/j61_Z4sJ0bU',
        summaryEn: 'Understanding the matrix structure of the 26 primary consonants across 7 vocalic modifications.',
        summaryTi: 'ናይ 26 መሰረታዊ ፊደላት ግእዝ ኣብ ውሽጢ ሸውዓተ ድምጽታት ዘለዎም ስነ-ድምጻዊ ቅርጺ።',
        contentMarkdownEn: `### The Seven Vocalic Orders of Ge'ez
1. **ግእዝ (Ge'ez)** - First order (ä vowel, e.g., ሀ /hä/)
2. **ካዕብ (Ka'eb)** - Second order (u vowel, e.g., ሁ /hu/)
3. **ሳልስ (Salis)** - Third order (i vowel, e.g., ሂ /hi/)
4. **ራብዕ (Rabi)** - Fourth order (a long vowel, e.g., ሃ /ha/)
5. **ኃምስ (Hamis)** - Fifth order (e vowel, e.g., ሄ /he/)
6. **ሳድስ (Sadis)** - Sixth order (ə vowel / vowelless, e.g., ህ /hə/)
7. **ሳብዕ (Sabi)** - Seventh order (o vowel, e.g., ሆ /ho/)`,
        contentMarkdownTi: `### ሸውዓተ ናይ ግእዝ ኣገባባት
1. **ግእዝ (Ge'ez)** - ቀዳማይ ድምጺ (ንኣብነት: ሀ)
2. **ካዕብ (Ka'eb)** - ካልኣይ ድምጺ (ንኣብነት: ሁ)
3. **ሳልስ (Salis)** - ሳልሳይ ድምጺ (ንኣብነት: ሂ)
4. **ራብዕ (Rabi)** - ራብዓይ ድምጺ (ንኣብነት: ሃ)
5. **ኃምስ (Hamis)** - ሓምሻይ ድምጺ (ንኣብነት: ሄ)
6. **ሳድስ (Sadis)** - ሻድሻይ ድምጺ (ንኣብነት: ህ)
7. **ሳብዕ (Sabi)** - ሻብዓይ ድምጺ (ንኣብነት: ሆ)`,
        keyTakeawaysEn: [
          'Ge\'ez is an Abugida writing system where vowel markings are attached directly to consonant graphemes.',
          'Sadis (6th order) functions both as the vowel /ə/ and as a pure vowelless consonant in syllables.',
          'Aksumite royal stelae preserve the transition from unvocalized to fully vocalized script under King Ezana.'
        ],
        keyTakeawaysTi: [
          'ግእዝ ኣቡጊዳ (Abugida) ዝበሃል ናይ ጽሕፈት ስርዓት ኮይኑ፡ ድምጸ-ኣጽሓፍቲ ምስ ተነባቢ ፊደል ይጣመሩ።',
          'ሳድስ (6ይ ድምጺ) ከም /ə/ ድምጺ ወይ ድማ ጽሩይ ተነባቢ ኮይኑ የገልግል።',
          'ንጉስ ኢዛና ኣብ ዝነበረሉ ዘመን ፊደላት ግእዝ ድምጸ-ኣጽሓፍቲ ረኺቦም ተማሊኦም።'
        ],
        isFreePreview: true,
      }
    ],
    quizzes: [
      {
        id: 'q-geez-1',
        questionEn: 'Which order in Ge\'ez script represents the long vowel sound /a/?',
        questionTi: 'ኣብ ፊደላት ግእዝ ነቲ ነዊሕ ናይ /a/ ድምጺ ዝውክል ኣየናይ ድምጺ እዩ?',
        optionsEn: ['ራብዕ (Rabi / 4th order)', 'ግእዝ (1st order)', 'ሳድስ (6th order)', 'ሳልስ (3rd order)'],
        optionsTi: ['ራብዕ (4ይ ድምጺ)', 'ግእዝ (1ይ ድምጺ)', 'ሳድስ (6ይ ድምጺ)', 'ሳልስ (3ይ ድምጺ)'],
        correctAnswerIndex: 0,
        explanationEn: 'The 4th order (ራብዕ) produces the open long /a/ vowel (e.g., ሃ, ለ, ሐ).',
        explanationTi: 'ራብዕ (4ይ ድምጺ) ነቲ ክፉትን ነዊሕን ናይ /a/ ድምጺ ይውክል (ንኣብነት: ሃ፡ ላ፡ ሓ)።',
      }
    ],
    finalExam: [
      {
        id: 'fe-geez-1',
        questionEn: 'How are verb conjugations categorized in standard Ge\'ez grammar?',
        questionTi: 'ኣብ ናይ ግእዝ ሰዋስው ናይ ግሲታት መደብ (Conjugations) ብኸመይ ይኽፈል?',
        optionsEn: [
          'ቀተለ (Qatala), ቀደሰ (Qaddasa), and ባረከ (Baraka) root paradigms',
          'Latin irregular noun conjugations',
          'Unary tense markers without prefixes',
          'Purely tonal inflections'
        ],
        optionsTi: [
          'ቀተለ፡ ቀደሰ፡ ባረከ ዝብሉ ሰለስተ ቀንዲ ናይ ግሲ ዓውድታት',
          'ናይ ላቲን ስማዊ መደባት',
          'ብዘይ ቅድመ-ጥብቆ ዝቖሙ ቃላት',
          'ድምጻዊ ጥራይ ዝኾነ ለውጢ'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'Ge\'ez verbs follow three principal triliteral paradigms: Qatala (basic), Qaddasa (intensive geminated), and Baraka (long first vowel).',
        explanationTi: 'ግሲታት ግእዝ ብቀንዲ ኣብ ሰለስተ መደባት ይኽፈሉ: ቀተለ (መሰረታዊ)፡ ቀደሰ (ዝተደጋገመ/ጸቒጥካ ዝንበብ)፡ ባረከ (ነዊሕ ቀዳማይ ድምጺ)።',
      }
    ]
  },
  {
    id: 'course-ai-301',
    title: 'Full-Stack AI Engineering & Gemini SDK Masterclass',
    titleTi: 'ናይ AI ኢንጂነሪንግን ጀሚናይ (Gemini) ምሉእ ስልጠናን',
    slug: 'fullstack-ai-engineering-gemini',
    descriptionEn: 'Build production-ready AI applications, autonomous agents, RAG architectures, and multimodal computer vision pipelines using Google GenAI SDK.',
    descriptionTi: 'ብጉግል ጀሚናይ SDK ተጠቒምካ ዘመናዊ ናይ AI ኣፕሊኬሽናት፡ ርእሰ-ምሕደራ ዘለዎም ኤጀንትስ (Autonomous Agents)፡ RAG ሲስተማትን ኮምፒዩተር ቪዥንን ምህናጽ።',
    instructorName: 'Eng. Rahel Woldu',
    instructorTitle: 'Principal AI Architect & Distributed Systems Lead',
    instructorTitleTi: 'ቀንዲ ናይ AI ኣርክቴክትን ስርዓታት መራሒትን',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    category: 'computer_science',
    level: 'advanced',
    isPremium: true,
    priceUsd: 29.99,
    rating: 4.95,
    reviewCount: 680,
    enrolledCount: 2450,
    durationHours: 12.0,
    certificateEligible: true,
    tags: ['AI', 'Gemini', 'TypeScript', 'React', 'Full-Stack', 'Agents'],
    featured: true,
    createdDate: '2026-01-20',
    updatedDate: '2026-03-05',
    lessons: [
      {
        id: 'ai-301-l1',
        title: 'Architecting Server-Side Gemini API Pipelines',
        titleTi: 'ናይ ሰርቨር-ሳይድ ጀሚናይ API ኣሰራርዓ ምህናጽ',
        durationMinutes: 38,
        videoUrl: 'https://www.youtube.com/embed/8-WgyE5_uYc',
        summaryEn: 'Security best practices: isolating API keys in Express, handling streaming tokens, and JSON schemas.',
        summaryTi: 'ናይ ጸጥታ ውሕስነት: API ቁልፊታት ኣብ ሰርቨር ምዕቃብ፡ ስትሪሚንግ ቶከን ምክትታልን JSON ፎርማት ምቁጽጻርን።',
        contentMarkdownEn: `### Clean Server-Side AI Gateway Pattern
Never expose Gemini API keys to client browsers. Always route requests through dedicated Express endpoints.

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDeepReasoning(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: [{ text: prompt }],
    config: {
      temperature: 0.2,
      systemInstruction: 'You are an authoritative engineering tutor.'
    }
  });
  return response.text;
}
\`\`\``,
        contentMarkdownTi: `### ጽፉፍ ናይ ሰርቨር AI ኣሰራርዓ
ቁልፊታት Gemini API ናብ ናይ ዓማዊል ብራውዘር ፈጺምካ ክወጽእ የብሉን። ኩሉ ግዜ ብኤክስፕረስ (Express) ሰርቨር ኣቢልካ ይሕለፍ።`,
        keyTakeawaysEn: [
          'Secrets must remain protected behind server-side middleware.',
          'Use structured JSON schemas with responseMimeType for guaranteed data models.',
          'Implement rate limiting and token consumption telemetry.'
        ],
        keyTakeawaysTi: [
          'ምስጢራዊ ቁልፍታት ኣብ ሰርቨር ተሓብኦም ክቕመጡ ኣለዎም።',
          'ንጹር ዳታ ንምርካብ structured JSON schema ምጥቃም የድሊ።',
          'ናይ ምጥቃም ዓቐንን ቶከንን ዝከታተል ስርዓት ምትካል ኣገዳሲ እዩ።'
        ],
        isFreePreview: false,
      }
    ],
    quizzes: [
      {
        id: 'q-ai-1',
        questionEn: 'Why should Gemini API keys never be declared with VITE_ prefixes in client-side bundles?',
        questionTi: 'ስለምንታይ እዮም ቁልፊታት Gemini API ብ VITE_ ፕሪፊክስ ኣብ ክላይንት ክጸሓፉ ዘይብሎም?',
        optionsEn: [
          'Because VITE_ variables are bundled and publicly visible in browser DevTools',
          'Because Vite will fail to compile the app',
          'Because Gemini only accepts HTTP/2 headers',
          'Because of CORS restrictions on WebSockets'
        ],
        optionsTi: [
          'ምኽንያቱ VITE_ ዝተባህሉ ቃላት ኣብ ብራውዘር ንዝኾነ ሰብ ብግህዶ ስለዝረኣዩ',
          'ቪተ (Vite) ነቲ ኣፕ ምድላው ስለዝኣብዮ',
          'ጀሚናይ HTTP/2 ጥራይ ስለዝቕበል',
          'ናይ ዌብሶኬት ደረት ስለዘለዎ'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'Any environment variable prefixed with VITE_ is embedded into client JavaScript bundles and can be stolen by malicious actors.',
        explanationTi: 'ብ VITE_ ዝተሰየመ ዝኾነ ምስጢር ኣብ ናይ ብራውዘር ኮድ ስለዝሕወስ ብቐሊሉ ክፍለጥ ይኽእል።',
      }
    ],
    finalExam: [
      {
        id: 'fe-ai-1',
        questionEn: 'What is the primary benefit of Retrieval-Augmented Generation (RAG)?',
        questionTi: 'ናይ RAG (Retrieval-Augmented Generation) ቀንዲ ጥቕሚ እንታይ እዩ?',
        optionsEn: [
          'Grounds generative models in up-to-date, verified private documents to prevent hallucinations',
          'Reduces model parameter weights to 1-bit quantization',
          'Replaces all vector embeddings with static regular expressions',
          'Bypasses all API cost limits'
        ],
        optionsTi: [
          'ነቲ ሞዴል ኣብ ጭቡጥን እዋናውን ሰነዳት ብምምስራት ዘይቅኑዕ ሓበሬታ (hallucination) የውግድ',
          'ናይ ሞዴል ሚዛን ናብ 1-ቢት የውርዶ',
          'ናይ ቬክተር ስሌት ብቐሊል ጽሑፍ ይትክኦ',
          'ናይ ክፍሊት ደረት ይስዕር'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'RAG dynamically pulls relevant factual context into the prompt, ensuring factual precision on private or recent knowledge.',
        explanationTi: 'RAG ቅኑዕን እዋናውን ሓበሬታ ብቐጥታ ካብ ሰነዳት ኣምጺኡ ንሞዴል ብምሃብ ልክዕነት ዘለዎ መልሲ የውጽእ።',
      }
    ]
  },
  {
    id: 'course-med-401',
    title: 'Clinical Diagnostics, Pharmacology & Human Physiology',
    titleTi: 'ናይ ሕክምና መርመራ፡ ፋርማኮሎጂን ስነ-ህይወት ሰብነትን',
    slug: 'clinical-diagnostics-pharmacology',
    descriptionEn: 'High-yield clinical review of cardiovascular pathology, antibiotic classification, metabolic biochemistry, and USMLE/PLAB style reasoning.',
    descriptionTi: 'ናይ ልቢ ሕማማት፡ መድሓኒታት (antibiotics)፡ ሜታቦሊዝምን ክሊኒካዊ ናይ ሕክምና ምርመራታትን ብዓለምለኸ ደረጃ ምምሃር።',
    instructorName: 'Dr. Senait Haile, MD',
    instructorTitle: 'Consultant Cardiologist & Medical Educator',
    instructorTitleTi: 'ላዕለወይቲ ሓኪም ልብን መምህር ሕክምናን',
    instructorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    category: 'medicine',
    level: 'intermediate',
    isPremium: true,
    priceUsd: 19.99,
    rating: 4.92,
    reviewCount: 420,
    enrolledCount: 1620,
    durationHours: 10.5,
    certificateEligible: true,
    tags: ['Medicine', 'Pharmacology', 'Physiology', 'Diagnostics', 'Health'],
    featured: false,
    createdDate: '2026-02-01',
    updatedDate: '2026-03-02',
    lessons: [
      {
        id: 'med-401-l1',
        title: 'Cardiovascular Electrophysiology & ECG Interpretation',
        titleTi: 'ኤሌክትሪክ ናይ ልቢ ምንቅስቓስን ንባብ ኢሲጂን (ECG)',
        durationMinutes: 35,
        videoUrl: 'https://www.youtube.com/embed/RYZ4daFwMa8',
        summaryEn: 'Deconstructing the P-Q-R-S-T wave complex and identifying cardiac arrhythmias and ischemia.',
        summaryTi: 'ናይ P-Q-R-S-T ሞገድ ምፍላይን ናይ ልቢ ሕማማትን ናይ ደም ምሕጻርን ብኢሲጂ ምልላይ።',
        contentMarkdownEn: `### Systematic 5-Step ECG Interpretation
1. **Rate**: 300 / number of large boxes between R-R waves
2. **Rhythm**: Regular vs Irregular
3. **Axis**: Lead I and aVF quadrant check
4. **Hypertrophy**: Left ventricular voltage criteria (Sokolow-Lyon)
5. **Infarction**: ST elevation, pathologic Q waves, T wave inversions`,
        contentMarkdownTi: `### 5-ደረጃ ናይ ECG ንባብ
1. **ፍጥነት (Rate)**: 300 ብብዝሒ ዓበይቲ ሳንዱቓት ኣብ መንጎ R-R ተመቒሉ
2. **ምትእስሳር (Rhythm)**: ስሩዕ ወይ ዘይስሩዕ
3. **ኣንፈት (Axis)**: Lead I ከምኡ ውን aVF መርመራ
4. **ምዕባይ ልቢ (Hypertrophy)**: ናይ ጸጋማይ ክፍሊ ልቢ ቮልቴጅ
5. **ናይ ልቢ ምጉዳእ (Infarction)**: ST ክብ ምባልን ናይ T ማዕበል ምግልባጥን`,
        keyTakeawaysEn: [
          'P wave reflects atrial depolarization.',
          'QRS complex reflects ventricular depolarization.',
          'ST elevation indicates acute transmural myocardial infarction.'
        ],
        keyTakeawaysTi: [
          'P ማዕበል ናይ ላዕለዋይ ክፍሊ ልቢ (atrial) ምንቅስቓስ ይሕብር።',
          'QRS ማዕበል ናይ ታሕተዋይ ክፍሊ ልቢ (ventricular) ምንቅስቓስ ይሕብር።',
          'ST ክብ ምባል ቅልጡፍ ናይ ልቢ መጥቃዕቲ (myocardial infarction) የመልክት።'
        ],
        isFreePreview: false,
      }
    ],
    quizzes: [
      {
        id: 'q-med-1',
        questionEn: 'Which ECG wave corresponds to ventricular repolarization?',
        questionTi: 'ኣብ ኢሲጂ (ECG) ናይ ታሕተዋይ ክፍሊ ልቢ ዕረፍቲ/ዳግመ-ምድላው (repolarization) ዝውክል ኣየናይ ማዕበል እዩ?',
        optionsEn: ['T wave', 'P wave', 'QRS complex', 'U wave'],
        optionsTi: ['T ማዕበል', 'P ማዕበል', 'QRS ማዕበል', 'U ማዕበል'],
        correctAnswerIndex: 0,
        explanationEn: 'The T wave represents ventricular repolarization (recovery of ventricular cardiomyocytes).',
        explanationTi: 'T ማዕበል ናይ ታሕተዋይ ልቢ ጭዋዳታት ዳግመ-ምድላው (ventricular repolarization) ይውክል እዩ።',
      }
    ],
    finalExam: [
      {
        id: 'fe-med-1',
        questionEn: 'What is the first-line medication for anaphylactic shock?',
        questionTi: 'ንኸቢድ ናይ ኣለርጂ ድንጋጸ (Anaphylactic Shock) ዝወሃብ ቀዳማይ ህጹጽ መድሓኒት እንታይ እዩ?',
        optionsEn: [
          'Intramuscular Epinephrine (Adrenaline)',
          'Oral Paracetamol',
          'Intravenous Furosemide',
          'Sublingual Nitroglycerin'
        ],
        optionsTi: [
          'ኣብ ጭዋዳ ዝውጋእ ኤፒነፍሪን / ኣድሬናሊን (Epinephrine)',
          'ፓራሲታሞል',
          'ፉሮሰማይድ (Furosemide)',
          'ናይ ትሕቲ መልሓስ ናይትሮግሊሰሪን'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'Intramuscular epinephrine into the anterolateral thigh is the undisputed first-line treatment for anaphylaxis.',
        explanationTi: 'ኣብ ጭዋዳ ሰላፍ ዝውጋእ ኤፒነፍሪን (Epinephrine) ንህይወት ዘድሕን ቀዳማይ ሕክምና ኣናፊላክሲስ እዩ።',
      }
    ]
  },
  {
    id: 'course-schol-501',
    title: 'Global Master & PhD Scholarship Application Mastery',
    titleTi: 'ናይ ማስተርስን ዶክተሬትን ዓለምለኸ ስኮላርሺፕ ዓወት',
    slug: 'global-master-phd-scholarships-mastery',
    descriptionEn: 'Step-by-step masterclass on winning Erasmus Mundus, Fulbright, Chevening, DAAD, and Swedish Institute scholarships with winning SOPs and research proposals.',
    descriptionTi: 'ናይ ኤራስመስ ሙንዱስ፡ ፉልብራይት፡ ቼቨኒንግን ዳኣድን ምሉእ ስኮላርሺፕ ንምዕዋት ዘድልዩ ናይ ድራኸ ወረቐት (SOP)፡ CVን ናይ ምርምር ፕሮፖዛልን ኣጸሓሕፋ።',
    instructorName: 'Mebrahtu Gebre, MSc',
    instructorTitle: 'Erasmus Mundus Scholar & Global Admissions Mentor',
    instructorTitleTi: 'ናይ ኤራስመስ ሙንዱስ ስኮላርን ናይ ትምህርቲ ኣማኻርን',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    category: 'scholarships_prep',
    level: 'all_levels',
    isPremium: false,
    priceUsd: 0,
    rating: 4.98,
    reviewCount: 920,
    enrolledCount: 4800,
    durationHours: 5.0,
    certificateEligible: true,
    tags: ['Scholarship', 'Erasmus', 'Fulbright', 'SOP', 'Admissions', 'Global'],
    featured: true,
    createdDate: '2026-01-05',
    updatedDate: '2026-02-25',
    lessons: [
      {
        id: 'schol-501-l1',
        title: 'Writing Winning Statements of Purpose (SOP)',
        titleTi: 'ተሰማዕነት ዘለዎ ናይ ድራኸ ወረቐት (SOP) ምጽሓፍ',
        durationMinutes: 30,
        videoUrl: 'https://www.youtube.com/embed/Pj1e_xT5sV4',
        summaryEn: 'How to structure your academic narrative, articulate impact, and align with university priorities.',
        summaryTi: 'ናይ ትምህርቲ ታሪኽካ ብኸመይ ከም እትገልጽን ምስ ናይቲ ዩኒቨርስቲ ሸቶታት ብኸመይ ከም እተዛምዶን።',
        contentMarkdownEn: `### The 4-Pillar SOP Framework
1. **Hook & Academic Genesis**: Why this exact field matters to you.
2. **Demonstrated Competence**: Concrete research projects, GPA, technical contributions.
3. **Why This Program**: Specific professors, laboratories, and curriculum alignment.
4. **Future Vision & Return on Investment**: How you will deploy your knowledge to solve real-world challenges.`,
        contentMarkdownTi: `### 4 ቀንዲ ኣዕኑድ ናይ ጽፉፍ SOP
1. **መእተዊ ድራኸ**: ስለምንታይ እዚ ዓውዲ ንዓኻ ከምዘገድሰካ።
2. **ዝተረጋገጸ ብቕዓት**: ዝሰራሕካዮም ፕሮጀክታት፡ ውጽኢትካን ፍልጠትካን።
3. **ስለምንታይ እዚ ዩኒቨርስቲ**: ፍሉያት ፕሮፌሰራት፡ ላቦራቶሪታትን ናይ ትምህርቲ መደባትን።
4. **ናይ መጻኢ ራእይ**: ትምህርትኻ ወዲእካ ንማሕበረሰብካ ብኸመይ ከም እተገልግል።`,
        keyTakeawaysEn: [
          'Avoid generic clichés; show tangible evidence instead of mere assertions.',
          'Directly cite 2-3 faculty members whose research directly mirrors your interests.',
          'Emphasize leadership, resilience, and diaspora/community impact.'
        ],
        keyTakeawaysTi: [
          'ልሙድ ቃላት ምጥቃም ምውጋድ፡ ኣብ ክንድኡ ጭቡጥ ስራሓትካ ምርኣይ።',
          'ኣብቲ ዩኒቨርስቲ ዘለው ፍሉያት መማህራንን ምርምሮምን ብስም ምጥቃስ።',
          'መሪሕነትካ፡ ጽንዓትካን ንማሕበረሰብካ ዘለካ ተወፋይነትን ምጉላሕ።'
        ],
        isFreePreview: true,
      }
    ],
    quizzes: [
      {
        id: 'q-schol-1',
        questionEn: 'What is the most critical mistake students make when submitting an SOP for competitive European scholarships?',
        questionTi: 'ተመሃሮ ንናይ ኤውሮጳ ስኮላርሺፕ SOP ኣብ ዝጽሕፉሉ እዋን ዝፍጽምዎ ዝዓበየ ጌጋ እንታይ እዩ?',
        optionsEn: [
          'Writing a generic essay without tailoring it to the specific consortium universities',
          'Listing too many verified research publications',
          'Submitting certified transcripts too early',
          'Formatting in standard PDF'
        ],
        optionsTi: [
          'ንሓደ ዩኒቨርስቲ ጥራይ ከይኮነስ ሓፈሻዊ ናይ ኩሉ ዝኾነ ቅዳሕ ምልኣኽ',
          'ብዙሕ ዝተሓትሙ ምርምራት ምጥቃስ',
          'ናይ ትምህርቲ ማስረጃታት ኣቐዲምካ ምልኣኽ',
          'ብ PDF ፎርማት ምድላው'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'Generic statements that fail to explain why the specific curriculum matters are rejected in preliminary screening.',
        explanationTi: 'ንፍሉይ ናይቲ ፕሮግራም ትሕዝቶ ዘይጠቅስ ሓፈሻዊ ጽሑፍ ኣብ ቀዳማይ መጻረዪ ይወድቕ እዩ።',
      }
    ],
    finalExam: [
      {
        id: 'fe-schol-1',
        questionEn: 'What is the core funding package of the Erasmus Mundus Joint Masters Scholarship?',
        questionTi: 'ናይ ኤራስመስ ሙንዱስ ጆይንት ማስተርስ (Erasmus Mundus) ናይ ስኮላርሺፕ ሽፋን እንታይ ዘጠቓልል እዩ?',
        optionsEn: [
          '100% Tuition waiver + ~€1,400 monthly living allowance + full travel and health insurance',
          'Only 50% discount on flight tickets',
          'A partial loan that must be repaid within 2 years',
          'Hostel accommodation only without food'
        ],
        optionsTi: [
          '100% ናይ ትምህርቲ ክፍሊት ነጻ + ~€1,400 ናይ ወርሒ መነባበሪ + ናይ በረራ ትኬትን ናይ ጥዕና ውሕስነትን',
          '50% ናይ በረራ ትኬት ቅናሽ ጥራይ',
          'ኣብ ውሽጢ 2 ዓመት ዝኽፈል ልቓሕ',
          'ናይ መደቀሲ ቦታ ጥራይ ብዘይ መግቢ'
        ],
        correctAnswerIndex: 0,
        explanationEn: 'Erasmus Mundus provides complete full-ride coverage including tuition, high monthly stipend, travel, and global mobility between at least 2 European nations.',
        explanationTi: 'ኤራስመስ ሙንዱስ ምሉእ ናይ ትምህርቲ ክፍሊት፡ ልዑል ናይ ወርሒ ገንዘብ፡ መገሻን ኣብ ዝተፈላለያ ሃገራት ኤውሮጳ ናይ ምምሃር ዕድልን ይህብ።',
      }
    ]
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    topic: "Ge'ez Fidel Fundamentals",
    frontEn: "What is the 3rd order of the consonant letter 'መ'?",
    backEn: "'ሚ' (/mi/) - Formed by adding a horizontal stroke to the right leg.",
    frontTi: "ናይ 'መ' ሳልሳይ ድምጺ እንታይ እዩ?",
    backTi: "'ሚ' (/mi/) - ኣብ የማናይ እግሩ መስመር ብምውሳኽ ይፍጠር።",
    category: 'geez_language',
    isMastered: false,
    reviewCount: 0,
  },
  {
    id: 'fc-2',
    topic: 'Machine Learning',
    frontEn: 'What is Overfitting in Artificial Intelligence?',
    backEn: 'When a model learns training noise rather than the underlying pattern, resulting in high training accuracy but poor generalization to test data.',
    frontTi: 'ኣብ AI ኦቨርፊቲንግ (Overfitting) እንታይ ማለት እዩ?',
    backTi: 'ሓደ ሞዴል ንመሰረታዊ ሕጊ ኣብ ክንዲ ዝምሃር ንጌጋታትን ጫውጫውን ናይቲ ዝተዋህቦ ዳታ ጥራይ ምስ ዝሸምድድ፡ ኣብ ሓዲሽ ፈተና ድኹም ውጽኢት የርኢ።',
    category: 'computer_science',
    isMastered: true,
    reviewCount: 3,
  },
  {
    id: 'fc-3',
    topic: 'Mathematics & Calculus',
    frontEn: 'What is the derivative of f(x) = ln(x)?',
    backEn: "f'(x) = 1/x for x > 0.",
    frontTi: "ናይ f(x) = ln(x) ደሪቫቲቭ እንታይ እዩ?",
    backTi: "f'(x) = 1/x (ን x > 0 ዝኾነ)።",
    category: 'stem',
    isMastered: false,
    reviewCount: 1,
  },
  {
    id: 'fc-4',
    topic: 'Medical Physiology',
    frontEn: 'What is the normal physiological glomerular filtration rate (GFR) in a healthy adult?',
    backEn: 'Approximately 90 to 120 mL/min/1.73 m².',
    frontTi: 'ኣብ ሓደ ጥዑይ ሰብ ናይ ኩሊት ምጽራይ መጠን (GFR) ክንደይ እዩ?',
    backTi: 'ኣስታት 90 ክሳብ 120 mL/min/1.73 m² እዩ።',
    category: 'medicine',
    isMastered: false,
    reviewCount: 0,
  }
];

export const FIDEL_ALPHABET_MATRIX = [
  { base: 'ሀ', name: 'Hoy', translit: 'H', orders: ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ'] },
  { base: 'ለ', name: 'Lawe', translit: 'L', orders: ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ'] },
  { base: 'ሐ', name: 'Hawt', translit: 'H', orders: ['ሐ', 'ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ'] },
  { base: 'መ', name: 'May', translit: 'M', orders: ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ'] },
  { base: 'ረ', name: 'Rees', translit: 'R', orders: ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ'] },
  { base: 'ሰ', name: 'Sat', translit: 'S', orders: ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ'] },
  { base: 'ቀ', name: 'Qaf', translit: 'Q', orders: ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ'] },
  { base: 'በ', name: 'Bet', translit: 'B', orders: ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ'] },
  { base: 'ተ', name: 'Taw', translit: 'T', orders: ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ'] },
  { base: 'ነ', name: 'Nehas', translit: 'N', orders: ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ'] },
  { base: 'አ', name: 'Alf', translit: 'A', orders: ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ'] },
  { base: 'ከ', name: 'Kaf', translit: 'K', orders: ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ'] },
  { base: 'ወ', name: 'Wawe', translit: 'W', orders: ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ'] },
  { base: 'ዐ', name: 'Ayn', translit: '‘A', orders: ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ'] },
  { base: 'ዘ', name: 'Zay', translit: 'Z', orders: ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ'] },
  { base: 'የ', name: 'Yaman', translit: 'Y', orders: ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ'] },
  { base: 'ደ', name: 'Dent', translit: 'D', orders: ['ደ', 'ዱ', 'ዲ', 'ዳ', 'ዴ', 'ድ', 'ዶ'] },
  { base: 'ገ', name: 'Gaml', translit: 'G', orders: ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ'] },
  { base: 'ጠ', name: 'Tayt', translit: 'T’', orders: ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ'] },
  { base: 'ጸ', name: 'Sade', translit: 'S’', orders: ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ'] },
  { base: 'ፈ', name: 'Af', translit: 'F', orders: ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ'] },
  { base: 'ፐ', name: 'Psa', translit: 'P', orders: ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ'] }
];
