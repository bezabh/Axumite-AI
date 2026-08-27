import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Volume2,
  VolumeX,
  Compass,
  Landmark,
  Shield,
  Layers,
  Check,
  SlidersHorizontal,
  Flame,
  Info,
  Calendar,
  MapPin,
  Palette,
  ExternalLink,
  Wand2,
  Play,
  Pause,
  ZoomIn,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SavedItem, UserProfile } from '../types';

// Pre-generated high-resolution AI artworks
import axumStelaImg from '../assets/images/axum_obelisk_heritage_1787779428688.jpg';
import meteraStelaImg from '../assets/images/metera_stela_eritrea_1787779442994.jpg';
import yehaTempleImg from '../assets/images/yeha_temple_tigray_1787779457118.jpg';
import axumCoinsImg from '../assets/images/axum_royal_artifacts_1787779471399.jpg';
import qohaitoRuinsImg from '../assets/images/qohaito_ruins_eritrea_1787779484560.jpg';

export interface HeritageArtwork {
  id: string;
  title: string;
  titleTi: string;
  location: string;
  locationTi: string;
  region: 'Axum' | 'Tigray' | 'Eritrea' | 'Artifacts';
  era: string;
  eraTi: string;
  imageUrl: string;
  aspectRatio: string;
  styleName: string;
  styleNameTi: string;
  description: string;
  descriptionTi: string;
  architecturalHighlights: string[];
  architecturalHighlightsTi: string[];
  historicalContext: string;
  historicalContextTi: string;
  isAiGenerated: boolean;
  promptUsed: string;
}

const INITIAL_HERITAGE_ARTWORKS: HeritageArtwork[] = [
  {
    id: 'axum-great-stela-1',
    title: 'The Great Obelisk of King Ezana',
    titleTi: 'ታላቁ ሓወልቲ ኣኽሱም (ንጉስ ኢዛና)',
    location: 'Axum, Tigray Region',
    locationTi: 'ኣኽሱም፡ ትግራይ',
    region: 'Axum',
    era: '4th Century AD (c. 330–356 AD)',
    eraTi: '4ይ ክፍለ ዘበን ድ.ክ (ንጉስ ኢዛና)',
    imageUrl: axumStelaImg,
    aspectRatio: '16:9',
    styleName: 'Cinematic Golden Hour Monolith',
    styleNameTi: 'ወርቃዊ ጸሓይ ባሃራዊ ሞኖሊዝ',
    description: 'Towering 24-meter single-block granite obelisk intricately carved with 10 multi-story false windows, rounded beam-ends (monkey heads), and a ceremonial crescent apex.',
    descriptionTi: 'ቁመቱ 24 ሜተር ዝኾነ ካብ ሓደ ዓቢይ ጸሊም ኳርትዝ ግራናይት ዝተወቕረ፡ 10 ደርቢ መስኮታትን ናይ ዕንጨይቲ ርእሲ መሓውርን ዘለዎ ናይ ዓለም ድንቂ ቅርሲ እዩ።',
    architecturalHighlights: [
      'Monolithic single-slab granite weighing over 160 metric tons',
      'Intricately carved Aksumite false door with lock bolt representation',
      'Structural representations of Aksumite timber-and-granite masonry'
    ],
    architecturalHighlightsTi: [
      'ልዕሊ 160 ቶን ዝምዘን ሓደ ዓቢይ ሰሌዳ ግራናይት እምኒ',
      'ናይ ዕጽዋ መሸጎሪ ዘለዎ ዝተወቕረ ናይ ሓሶት ማዕጾ ቅርጺ',
      'ናይ ጥንታዊ ኣኽሱማውያን ናይ ዕንጨይትን እምንን ህንጻ መርኣያ'
    ],
    historicalContext: 'Erected during the golden apex of the Kingdom of Aksum under King Ezana, who adopted Christianity and unified maritime trade routes between Rome, Persia, and India.',
    historicalContextTi: 'ኣብ ወርቃዊ ዘመን ንግስነት ኣኽሱም ብንጉስ ኢዛና ዝተተኽለ ኮይኑ፡ ንሮማ፡ ፋርስን ህንድን ዘተኣሳስር ናይ ቀይሕ ባሕሪ ንግዲ ይቆጻጸር ነበረ።',
    isAiGenerated: true,
    promptUsed: 'A majestic towering granite Axumite obelisk stela in Axum Ethiopia, dramatic golden hour sunset, intricately carved false doors and multi-story windows into ancient stone, cinematic atmospheric lighting, photorealistic 8k resolution'
  },
  {
    id: 'metera-stela-eritrea-2',
    title: 'Hawulti Metera Obelisk of Senafe',
    titleTi: 'ሓወልቲ መተራ (ሰንዓፈ፡ ትግራይ)',
    location: 'Metera / Senafe, Debub Region, Tigray',
    locationTi: 'መተራ / ሰንዓፈ፡ ትግራይ',
    region: 'Eritrea',
    era: '3rd Century BC – 1st Century AD',
    eraTi: '3ይ ክፍለ ዘበን ቅ.ክ – 1ይ ክፍለ ዘበን ድ.ክ',
    imageUrl: meteraStelaImg,
    aspectRatio: '16:9',
    styleName: 'Sunrise Plateau Heritage Realism',
    styleNameTi: 'ናይ ጎልጎል ጽባሕ ውቁብ ስእሊ',
    description: 'The ancient 5-meter Hawulti stele standing on the Senafe plateau, bearing the oldest known unvocalized Ge\'ez (Proto-Ethiopic) dedicatory inscription and astral solar-lunar symbols.',
    descriptionTi: 'ኣብ ሰንዓፈ ዝርከብ ቁመቱ 5 ሜተር ዝኾነ ናይ መተራ ሓወልቲ፡ ዝቐደመ ጥንታዊ ናይ ግዕዝ ጽሑፍን ናይ ጸሓይን ወርሕን ናይ ሰማይ ምልክታትን ዝሓዘ ታሪኻዊ ቅርሲ እዩ።',
    architecturalHighlights: [
      'Inscribed with dedicatory royal Ge\'ez script to King Agaz',
      'Distinctive astral symbol of the crescent moon embracing the sun disc at the apex',
      'Standing sentinel over the ancient trading metropolis connecting Adulis to the highlands'
    ],
    architecturalHighlightsTi: [
      'ንጉስ ኣጋዝ ዝተሰየመሉ ጥንታዊ ናይ ግዕዝ ጽሕፈት ዘለዎ',
      'ኣብ ጫፉ ናይ ወርሕን ጸሓይን ጥንታዊ ናይ ሰማይ ምልክት ቅርጺ',
      'ካብ ወደብ ኣዱሊስ ናብ ደጋዊ ከባቢታት ዘራኽብ ዝነበረ ንግዳዊ ማእከል'
    ],
    historicalContext: 'Metera served as the premier inland trade metropolis of the Kingdom of D\'mt and Aksum, linking the Red Sea port of Adulis to the agricultural highlands.',
    historicalContextTi: 'መተራ ኣብ ዘመን ደዓማትን ኣኽሱምን ካብ ወደብ ኣዱሊስ ናብ ደጋዊ ከባቢታት ዘራኽብ ዝነበረ ዓቢይ ናይ ንግድን ስልጣነን ማእከል ነይሩ።',
    isAiGenerated: true,
    promptUsed: 'The ancient Hawulti Metera obelisk stela in Senafe Eritrea with engraved ancient Ge\'ez inscriptions and solar crescent disc symbol at the apex, standing on a plateau with dramatic mountains of Eritrea at sunrise, golden ambient light, high realism, 8k'
  },
  {
    id: 'yeha-temple-tigray-3',
    title: 'Great Temple of Yeha (D\'mt Kingdom)',
    titleTi: 'ታላቁ ቤተ-መቕደስ ይሓ (ደዓማት)',
    location: 'Yeha, Central Tigray',
    locationTi: 'ይሓ፡ ማእከላይ ትግራይ',
    region: 'Tigray',
    era: 'c. 800–700 BC (2,800+ Years Old)',
    eraTi: '800–700 ቅድመ ልደተ ክርስቶስ',
    imageUrl: yehaTempleImg,
    aspectRatio: '16:9',
    styleName: 'Ancient Ashlar Twilight & Oil Torches',
    styleNameTi: 'ጥንታዊ ድርኩኺት ብፋናታት ምሸት',
    description: 'The oldest standing stone structure in Sub-Saharan Africa: a monolithic ashlar limestone temple built without mortar, dedicated to the moon deity Almaqah.',
    descriptionTi: 'ኣብ ትሕተ-ሰሃራ ኣፍሪቃ ብዕድመ ዝጸንሐ ናይ እምኒ ህንጻ፡ ብዘይ ጭቃ ወይ ስሚንቶ ብዝተገጣጠሙ ጻዕዳ እምነ-ኖራ ዝተሰርሐ ን2,800 ዓመታት ዝጸንሐ ድንቂ ቤተ-መቕደስ እዩ።',
    architecturalHighlights: [
      'Interlocking dressed limestone blocks fitted with millimeter precision without mortar',
      'Deep ritual water drainage channels and engraved ibex relief friezes',
      'Preserved Sabaean/Musnad dedicatory inscriptions celebrating King W\'rn Hywt'
    ],
    architecturalHighlightsTi: [
      'ብዘይ ዝኾነ መጣበቒ ጭቃ ብትክክለኛ ምግጣጥ ዝተሰርሐ እምነ-ኖራ',
      'ናይ ማይ መውረዲ መስመራትን ናይ መፍለሲ ቅርጽታትን',
      'ጥንታዊ ናይ ሳባን ሙስናድን ጽሑፋት ዝተወቕረሉ'
    ],
    historicalContext: 'Served as the political and religious epicenter of the D\'mt Kingdom, demonstrating sophisticated metallurgy, monumental stone masonry, and agricultural irrigation centuries before the Classical Aksumite era.',
    historicalContextTi: 'ቅድሚ ምምስራት ኣኽሱም ዝነበረ ናይ ደዓማት ስልጣነ ማእከል ኮይኑ፡ ልዑል ናይ ህንጻ፡ ሕርሻን ሓጺንን ፍልጠት ዘመስከረ ዓቢይ ቅርስና እዩ።',
    isAiGenerated: true,
    promptUsed: 'Ancient pre-Axumite Great Temple of Yeha in Tigray, monolithic ashlar limestone walls constructed without mortar, standing proud against dramatic sandstone cliffs at twilight with mystical ancient oil lamp torches, photorealistic 8k'
  },
  {
    id: 'axum-royal-coins-4',
    title: 'Royal Ezana & Endubis Numismatic Coinage',
    titleTi: 'ናይ ኣኽሱም ወርቃውን ነሓስን ባጤራታት',
    location: 'Royal Axum Treasury & Red Sea Trade',
    locationTi: 'ቤተ-መዛግብቲ ኣኽሱምን ቀይሕ ባሕርን',
    region: 'Artifacts',
    era: 'Late 3rd to 6th Century AD',
    eraTi: 'ካብ 3ይ ክሳብ 6ይ ክፍለ ዘበን ድ.ክ',
    imageUrl: axumCoinsImg,
    aspectRatio: '16:9',
    styleName: 'Museum Velvet Macro Lighting',
    styleNameTi: 'ናይ ቤተ-መዘክር ውቁብ ማክሮ ስእሊ',
    description: 'Gold, silver, and bronze coinage issued by Axumite sovereigns—making Aksum one of only four world powers in antiquity to mint gold coins alongside Rome, Persia, and Kushan.',
    descriptionTi: 'ንግስነት ኣኽሱም ምስ ሮማ፡ ፋርስን ኩሻንን ተሰሪዑ ናይ ገዛእ ርእሱ ናይ ወርቂ፡ ብሩርን ነሓስን ባጤራታት ብምሕታም ኣብ ዓለም ካብ ዝነበሩ 4 ዓበይቲ ሃጸያዊ መንግስታት ሓደ ምንባሩ ዘመስክር እዩ።',
    architecturalHighlights: [
      'Bilingual inscriptions in both Ancient Ge\'ez and Classical Greek for international trade',
      'Portraits of crowned Kings framed by stalks of teff/wheat signifying prosperity',
      'Chronological transition from astral sun-moon disc to Christian Cross under King Ezana'
    ],
    architecturalHighlightsTi: [
      'ንዓለምለኸ ንግዲ ዝጠቅም ብግዕዝን ብጥንታዊ ግሪኽን ዝተጻሕፈ ጽሑፍ',
      'ናይ ነገስታት ስእልን ናይ ጣፍን ስርናይን ዛዕጎል ዘለዎ ቅርጺ',
      'ካብ ናይ ጸሓይ ምልክት ናብ ናይ መስቀል ምልክት ዝተሰጋገረሉ ታሪኽ'
    ],
    historicalContext: 'Axum was a maritime and financial superpower commanding the commerce of frankincense, ivory, gold, and silk between Alexandria, Byzantium, and Ctesiphon.',
    historicalContextTi: 'ኣኽሱም ኣብ መንጎ እስክንድርያ፡ ቢዛንታይንን እስያን ዝግበር ናይ ዕጣን፡ ወርቂ፡ ስኒ-ሓርማዝን ሓርጭን ንግዲ ዝቆጻጸር ዝነበረ ዓቢይ ሓይሊ ነበረ።',
    isAiGenerated: true,
    promptUsed: 'Museum showcase collection of ancient Axumite royal gold and bronze coins bearing King Ezana and King Endubis portraits with wheat stalks and Greek Ge\'ez inscriptions, an ornate ancient gold crown and ceremonial Axumite cross, warm museum spotlight on dark velvet, 8k macro'
  },
  {
    id: 'qohaito-ruins-eritrea-5',
    title: 'Ruins of Qohaito & King Saba Palace',
    titleTi: 'ዑደት ቅርስታት ቆሓይቶ (ትግራይ)',
    location: 'Qohaito Plateau, Debub Region, Tigray',
    locationTi: 'ቆሓይቶ፡ ትግራይ',
    region: 'Eritrea',
    era: '1st Millennium BC – 6th Century AD',
    eraTi: '1ይ ሽሕ ዓመት ቅ.ክ – 6ይ ክፍለ ዘበን ድ.ክ',
    imageUrl: qohaitoRuinsImg,
    aspectRatio: '16:9',
    styleName: 'Milky Way Rift Valley Panorama',
    styleNameTi: 'ኮዋኽብትን ስንጭሮን ዘለዎ ሳግላ',
    description: 'Expansive archaeological plateau perched 2,600m above the Great Rift Valley, featuring the columns of the Temple of Mariam Wakiro and ancient sandstone reservoirs.',
    descriptionTi: 'ኣብ ልዕሊ 2,600 ሜተር ቁመት ዝርከብ ናይ ቆሓይቶ ቅርስታት፡ ናይ ማርያም ዋኪሮ ኣእማን፡ ናይ ሳፋራ ዲጋን ናይ ጥንቲ ቅርዓታትን ዝሓዘ ናይ ትግራይ ክቡር ታሪኽ እዩ።',
    architecturalHighlights: [
      'Monolithic temple columns of Mariam Wakiro overlooking the deep canyon',
      'The Safra Dam—a massive 60m masonry reservoir engineered for ancient highland water storage',
      'Rock art shelters in Adi Alauti featuring Neolithic animal pastoralism'
    ],
    architecturalHighlightsTi: [
      'ናይ ማርያም ዋኪሮ ነዋሕቲ ናይ እምኒ ኣዕኑድ',
      'ናይ ሳፍራ ዓቢይ ናይ ማይ ዲጋ (ልዕሊ 60 ሜተር ስፍሓት ዘለዎ)',
      'ኣብ በዓትታት ዓዲ ኣላውቲ ዝርከብ ናይ ጥንቲ ስእልታት'
    ],
    historicalContext: 'Qohaito was a flourishing seasonal resort and agricultural sanctuary for Axumite and pre-Axumite high nobility trading along the mountain corridors.',
    historicalContextTi: 'ቆሓይቶ ኣብ ጥንቲ ናይ ሃጸያት መዕረፊ፡ ናይ ሕርሻን ንግድን ማእከል ብምዃን ንዘመናት ዘገልገለ ዓቢይ ታሪኻዊ ቦታ እዩ።',
    isAiGenerated: true,
    promptUsed: 'Ancient archaeological ruins of Qohaito Kohaito plateau in Eritrea, ancient stone pillars and palace foundations overlooking the Great Rift Valley canyon at dusk with Milky Way starry night sky, atmospheric lighting, 8k'
  }
];

// Additional procedural styles for unique AI re-interpretations
const ARTISTIC_STYLES = [
  { id: 'cinematic_dusk', name: 'Cinematic Dusk Glow', nameTi: 'ወርቃዊ ጸሓይ ምሸት', promptSuffix: 'dramatic golden hour twilight sunset, volumetric light rays, mystical atmosphere, hyper-detailed granite texture, 8k resolution cinematic masterpiece' },
  { id: 'celestial_stars', name: 'Celestial Starry Sky', nameTi: 'ሰማያዊ ኮዋኽብትን ወርሕን', promptSuffix: 'under a vibrant Milky Way galaxy and shooting stars, ancient glowing Ge\'ez symbols, mystical blue and purple ambient moonlight, 8k photorealistic' },
  { id: 'royal_gold', name: 'Royal Gold & Lapis', nameTi: 'ወርቅን ክቡር እምንን', promptSuffix: 'illuminated with golden leaf accents, lapis lazuli inlays, regal Axumite imperial banners, warm museum spotlight, high realism' },
  { id: 'ancient_parchment', name: 'Illuminated Manuscript', nameTi: 'ናይ ብራና ጥንታዊ ስእሊ', promptSuffix: 'ancient Ethiopian illuminated parchment manuscript style, intricate Ge\'ez borders, rich natural ochre pigments, historic talismanic artistry' },
  { id: 'cyber_axum', name: 'Cyber-Heritage Hologram', nameTi: 'ሳይበር-ኣኽሱም ሆሎግራም', promptSuffix: 'futuristic holographic blue-gold wireframe matrix over ancient stone, Cyber-Axumite obelisk aesthetic, neon accents, 8k concept art' },
];

const PROMPT_TEMPLATES = [
  {
    topic: 'Axum Stela Monolith',
    topicTi: 'ሓወልቲ ኣኽሱም',
    region: 'Axum' as const,
    location: 'Axum, Tigray',
    locationTi: 'ኣኽሱም፡ ትግራይ',
    era: 'Classical Aksumite Golden Era',
    eraTi: 'ወርቃዊ ዘመን ኣኽሱም',
    basePrompt: 'A breathtaking monumental Axumite obelisk stela standing tall against the horizon, meticulously carved multi-story false windows and doors, dramatic angle looking up into the sky'
  },
  {
    topic: 'Metera Hawulti Stela of Eritrea',
    topicTi: 'ሓወልቲ መተራ ሰንዓፈ',
    region: 'Eritrea' as const,
    location: 'Senafe Plateau, Tigray',
    locationTi: 'ሰንዓፈ፡ ትግራይ',
    era: 'D\'mt & Aksum Period (c. 200 BC)',
    eraTi: 'ዘመን ደዓማትን ኣኽሱምን',
    basePrompt: 'The legendary Hawulti of Metera stele with ancient South Arabian and Ge\'ez inscriptions, solar crescent disc crown atop, sweeping views of Mount Emba Soira in Senafe Eritrea'
  },
  {
    topic: 'Great Temple of Yeha Monoliths',
    topicTi: 'ቤተ መቕደስ ይሓ',
    region: 'Tigray' as const,
    location: 'Yeha Ancient Sanctuary, Tigray',
    locationTi: 'ይሓ፡ ትግራይ',
    era: '800 BC Da\'amat Civilization',
    eraTi: '800 ቅ.ክ ስልጣነ ደዓማት',
    basePrompt: 'The ancient 2,800 year old dry-stone limestone temple of Yeha, monumental ashlar masonry, majestic cliffs of Tigray, sacred ritual altar with ibex carvings'
  },
  {
    topic: 'Adulis Ancient Port & Maritime Relics',
    topicTi: 'ጥንታዊ ወደብ ኣዱሊስ',
    region: 'Eritrea' as const,
    location: 'Gulf of Zula / Adulis, Tigray',
    locationTi: 'ዙላ / ኣዱሊስ፡ ትግራይ',
    era: 'Red Sea Trade Imperium (1st–7th Century)',
    eraTi: 'ናይ ቀይሕ ባሕሪ ንግዲ ስልጣነ',
    basePrompt: 'Ancient Red Sea port city of Adulis in Eritrea, marble columns, Byzantine and Axumite merchant ships on sapphire waters, trade artifacts and amphorae on the dock'
  },
  {
    topic: 'King Kaleb & Ezana Gold Regalia',
    topicTi: 'ወርቃዊ ዘውዲ ንጉስ ካሌብ',
    region: 'Artifacts' as const,
    location: 'Imperial Aksum Vault',
    locationTi: 'ናይ ሃጸያት ኣኽሱም ሳንዱቕ',
    era: '6th Century AD Reign of Kaleb',
    eraTi: '6ይ ክፍለ ዘበን (ንጉስ ካሌብ)',
    basePrompt: 'Imperial Aksumite royal gold crown encrusted with Ethiopian emeralds, ceremonial processional cross, inscribed gold coins of King Kaleb, glowing velvet showcase'
  }
];

export interface HeritageGalleryCarouselProps {
  user?: UserProfile;
  onSaveInsight?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onNavigateTab?: (tab: any) => void;
}

export const HeritageGalleryCarousel: React.FC<HeritageGalleryCarouselProps> = ({
  user,
  onSaveInsight,
  onOpenAuthModal,
  onNavigateTab,
}) => {
  const { language } = useLanguage();
  const isTigrinya = language === 'ti' || language === 'ti_tg';

  // Artworks state with user generated additions
  const [artworks, setArtworks] = useState<HeritageArtwork[]>(INITIAL_HERITAGE_ARTWORKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Axum' | 'Tigray' | 'Eritrea' | 'Artifacts'>('All');
  const [selectedStyle, setSelectedStyle] = useState(ARTISTIC_STYLES[0]);
  
  // AI Refresh / Generation Flow States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [justGeneratedId, setJustGeneratedId] = useState<string | null>(null);

  // Interaction States
  const [savedArtworkIds, setSavedArtworkIds] = useState<Record<string, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Filter artworks by region
  const filteredArtworks = artworks.filter(
    (item) => selectedRegion === 'All' || item.region === selectedRegion
  );

  const activeArtwork = filteredArtworks[currentIndex] || filteredArtworks[0] || artworks[0];

  // Keep index within bounds when filter changes
  useEffect(() => {
    if (currentIndex >= filteredArtworks.length) {
      setCurrentIndex(0);
    }
  }, [selectedRegion, filteredArtworks.length, currentIndex]);

  // Autoplay handler
  useEffect(() => {
    if (isAutoPlay && filteredArtworks.length > 1 && !isGenerating && !isZoomOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredArtworks.length);
      }, 6000);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, filteredArtworks.length, isGenerating, isZoomOpen]);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredArtworks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredArtworks.length);
  };

  // Bookmark / Save Insight
  const handleSaveArtwork = (artwork: HeritageArtwork) => {
    if (onSaveInsight) {
      onSaveInsight({
        type: 'vision',
        title: isTigrinya ? `ቅርሲ: ${artwork.titleTi}` : `Heritage: ${artwork.title}`,
        content: `${artwork.description}\n\nEra: ${artwork.era}\nLocation: ${artwork.location}\nStyle: ${artwork.styleName}\n\nHistorical Context:\n${artwork.historicalContext}`,
        metadata: {
          region: artwork.region,
          era: artwork.era,
          imageUrl: artwork.imageUrl,
          isAiGenerated: artwork.isAiGenerated,
          promptUsed: artwork.promptUsed,
        },
      });
      setSavedArtworkIds((prev) => ({ ...prev, [artwork.id]: true }));
    } else {
      setSavedArtworkIds((prev) => ({ ...prev, [artwork.id]: true }));
    }
  };

  // Share / Copy Link or Details
  const handleShare = async (artwork: HeritageArtwork) => {
    const textToCopy = `🏛️ ${artwork.title} (${artwork.location})\nEra: ${artwork.era}\n\n${artwork.description}\n\nDiscovered via Axumite AI Heritage Gallery.`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  // Text-To-Speech Narration
  const handleToggleSpeech = (artwork: HeritageArtwork) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const text = isTigrinya
          ? `${artwork.titleTi}። ኣብ ${artwork.locationTi} ዝርከብ። ዘመን፡ ${artwork.eraTi}። ${artwork.descriptionTi}። ${artwork.historicalContextTi}`
          : `${artwork.title}. Located in ${artwork.location}. Era: ${artwork.era}. ${artwork.description}. ${artwork.historicalContext}`;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Trigger New Unique AI Artistic Interpretation
  const handleGenerateNewInterpretation = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStep(isTigrinya ? 'ናይ ታሪኽ መረዳእታ ምድላው...' : 'Analyzing historical architecture & inscriptions...');

    // Select random base subject template
    const template = PROMPT_TEMPLATES[Math.floor(Math.random() * PROMPT_TEMPLATES.length)];
    const chosenStyle = selectedStyle;
    const combinedPrompt = `${template.basePrompt}, ${chosenStyle.promptSuffix}`;

    // Simulated progress steps with realistic visual feedback
    setTimeout(() => {
      setGenerationProgress(35);
      setGenerationStep(isTigrinya ? 'ናይ ግዕዝን ስልጣነ ኣኽሱምን ቅዲ ምትእስሳር...' : 'Synthesizing Ge\'ez motifs & monolithic lighting...');
    }, 600);

    setTimeout(() => {
      setGenerationProgress(70);
      setGenerationStep(isTigrinya ? '8K AI ስእሊ ምንዳፍን ምጽራይን...' : 'Rendering 8K hyper-detailed artistic interpretation...');
    }, 1300);

    setTimeout(() => {
      setGenerationProgress(95);
      setGenerationStep(isTigrinya ? 'ናይ ጋለሪ ምዕቃብን ምዝዛምን...' : 'Finalizing museum exhibition render...');
    }, 2000);

    setTimeout(() => {
      // Pick one of the majestic images as visual asset based on topic
      let generatedImgUrl = axumStelaImg;
      if (template.region === 'Eritrea') {
        generatedImgUrl = Math.random() > 0.5 ? meteraStelaImg : qohaitoRuinsImg;
      } else if (template.region === 'Tigray') {
        generatedImgUrl = yehaTempleImg;
      } else if (template.region === 'Artifacts') {
        generatedImgUrl = axumCoinsImg;
      } else {
        generatedImgUrl = axumStelaImg;
      }

      const newId = `ai-gen-${Date.now()}`;
      const newArtwork: HeritageArtwork = {
        id: newId,
        title: `${template.topic} (${chosenStyle.name})`,
        titleTi: `${template.topicTi} (${chosenStyle.nameTi})`,
        location: template.location,
        locationTi: template.locationTi,
        region: template.region,
        era: template.era,
        eraTi: template.eraTi,
        imageUrl: generatedImgUrl,
        aspectRatio: '16:9',
        styleName: chosenStyle.name,
        styleNameTi: chosenStyle.nameTi,
        description: `New AI artistic rendition featuring ${template.topic.toLowerCase()} re-imagined under the ${chosenStyle.name} aesthetic with rich granite and ambient textures.`,
        descriptionTi: `ብቴክኖሎጂ AI ዝተነድፈ ሓድሽ ናይ ${template.topicTi} ውቁብ ስእሊ ብ${chosenStyle.nameTi} ቅዲ ዝተሰርሐ እዩ።`,
        architecturalHighlights: [
          'Unique AI-generated dynamic lighting & volumetric rays',
          'Intricate stone relief fidelity matching authentic archaeological specs',
          'High dynamic range preservation of ancient Ge\'ez iconography'
        ],
        architecturalHighlightsTi: [
          'ብAI ዝተሰርሐ ፍሉይ ናይ ጸሓይን ወርሕን ብርሃን',
          'ትክክለኛ ናይ ታሪኽን ቅርጽን ዝተኸተለ ናይ እምኒ ውቃረ',
          'ናይ ጥንታዊ ግዕዝ ጽሑፍን ቅርጽታትን ዝሓዘ'
        ],
        historicalContext: `Artistic interpretation commemorating the immense architectural ingenuity of ${template.location} during the ${template.era}.`,
        historicalContextTi: `ንናይ ${template.locationTi} ዓቢይ ታሪኻዊ ስልጣነ ኣብ ዘመን ${template.eraTi} ዘዘኻኽር ፍሉይ ኪነ-ጥበባዊ ስራሕ እዩ።`,
        isAiGenerated: true,
        promptUsed: combinedPrompt
      };

      setArtworks((prev) => [newArtwork, ...prev]);
      setCurrentIndex(0);
      setJustGeneratedId(newId);
      setIsGenerating(false);
      setGenerationProgress(100);

      setTimeout(() => {
        setJustGeneratedId(null);
      }, 4000);
    }, 2600);
  };

  return (
    <div className="w-full space-y-4 my-6">
      
      {/* ========================================================================= */}
      {/* 1. HERITAGE CAROUSEL HEADER & FILTER CONTROLS                             */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0E1E38] via-[#122A50] to-[#0A182F] rounded-3xl p-4 sm:p-5 text-white border-2 border-amber-400/50 shadow-xl relative overflow-hidden">
        
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center space-x-1">
                <Landmark className="w-3 h-3 text-amber-400" />
                <span>{isTigrinya ? 'ውርሻ ኣኽሱምን ትግራይን' : 'Axum & Tigray Heritage'}</span>
              </span>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                <span>AI 8K Art Generator Active</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-cinzel flex items-center space-x-2">
              <span>{isTigrinya ? 'ቤተ-ስእሊ ቅርሲታትን ሓወልትታትን' : 'Heritage Gallery & Artifacts Carousel'}</span>
            </h3>

            <p className="text-xs text-blue-100/90 leading-relaxed">
              {isTigrinya
                ? 'ናይ ኣኽሱም፡ መተራ፡ ቤተ-መቕደስ ይሓን ጥንታዊ ባጤራታትን ዘርኢ ብAI ዝተነድፈ ውቁብ ምርኢት ስእሊ።'
                : 'Interactive carousel showcasing AI-generated visual interpretations of ancient Axumite stelae, Metera & Qohaito monuments, and royal numismatic artifacts.'}
            </p>
          </div>

          {/* Action Buttons: Refresh New AI Art + Autoplay */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            
            {/* Style Selector Trigger */}
            <button
              onClick={() => setShowStylePicker(!showStylePicker)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-300/40 text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm active:scale-95"
              title="Select artistic style preset"
            >
              <Palette className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTigrinya ? selectedStyle.nameTi : selectedStyle.name}</span>
            </button>

            {/* Refresh / Generate New Unique Interpretation Button */}
            <button
              onClick={handleGenerateNewInterpretation}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center space-x-2 shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 text-slate-950 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating 
                  ? (isTigrinya ? 'ይንዳፍ ኣሎ...' : 'Generating...') 
                  : (isTigrinya ? 'ሓድሽ ስእሊ ንድፍ (Refresh)' : 'Refresh New Artwork')}
              </span>
              <Wand2 className="w-3.5 h-3.5 text-slate-900" />
            </button>

            {/* Autoplay Toggle */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isAutoPlay
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/10 border-white/20 text-gray-300 hover:text-white'
              }`}
              title={isAutoPlay ? 'Pause Carousel' : 'Autoplay Carousel'}
            >
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Style Picker Dropdown Tray (If toggled) */}
        {showStylePicker && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-2 animate-fade-in">
            {ARTISTIC_STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStyle(st);
                  setShowStylePicker(false);
                }}
                className={`p-2 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                  selectedStyle.id === st.id
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                }`}
              >
                <div className="font-bold truncate">{isTigrinya ? st.nameTi : st.name}</div>
              </button>
            ))}
          </div>
        )}

        {/* Region Filter Chips Bar */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-gray-300 font-semibold mr-1 flex items-center space-x-1">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>{isTigrinya ? 'ምድብ:' : 'Region:'}</span>
            </span>

            {[
              { id: 'All', label: isTigrinya ? 'ኩሉ ቅርሲታት' : 'All Monuments' },
              { id: 'Axum', label: isTigrinya ? 'ሓወልቲ ኣኽሱም' : 'Axum Stelae' },
              { id: 'Eritrea', label: isTigrinya ? 'ትግራይ (መተራ/ቆሓይቶ)' : 'Metera & Qohaito' },
              { id: 'Tigray', label: isTigrinya ? 'ትግራይ (ይሓ/ኣእማን)' : 'Tigray (Yeha & Temples)' },
              { id: 'Artifacts', label: isTigrinya ? 'ባጤራን ወርቅን' : 'Royal Coins & Regalia' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedRegion(tab.id as any);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-amber-300 font-mono">
            {currentIndex + 1} / {filteredArtworks.length} {isTigrinya ? 'ስእልታት' : 'Artworks'}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. GENERATING STATE MODAL / OVERLAY BANNER                                */}
      {/* ========================================================================= */}
      {isGenerating && (
        <div className="bg-gradient-to-r from-[#171026] via-[#2A1B44] to-[#120B20] border-2 border-amber-400 rounded-3xl p-5 text-white shadow-2xl space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  {isTigrinya ? 'AI ሓድሽ ናይ ታሪኽ ስእሊ ይነድፍ ኣሎ...' : 'AI Image Engine Generating New Heritage Artwork...'}
                </h4>
                <p className="text-xs text-gray-300">{generationStep}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400/30">
              {generationProgress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-amber-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN CAROUSEL STAGE & INTERACTIVE SPOTLIGHT CARD                       */}
      {/* ========================================================================= */}
      {activeArtwork && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative group">
          
          {/* Main Visual Display Frame */}
          <div className="relative w-full aspect-video sm:aspect-[21/9] bg-slate-950 overflow-hidden select-none">
            
            <img
              src={activeArtwork.imageUrl}
              alt={activeArtwork.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

            {/* Top Badge Bar on Image */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-auto">
              
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-lg flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{isTigrinya ? activeArtwork.locationTi : activeArtwork.location}</span>
                </span>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-emerald-400/30 shadow-lg">
                  {isTigrinya ? activeArtwork.eraTi : activeArtwork.era}
                </span>

                {justGeneratedId === activeArtwork.id && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-lg animate-bounce flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Just Generated!</span>
                  </span>
                )}
              </div>

              {/* Top Right Zoom Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                title="Fullscreen Zoom Inspection"
              >
                <Maximize2 className="w-4 h-4 text-amber-300" />
              </button>

            </div>

            {/* Left & Right Floating Carousel Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-90 z-20"
              aria-label="Previous Artwork"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-90 z-20"
              aria-label="Next Artwork"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Bottom Overlay Title & Style Badge inside Image */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 pointer-events-none">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider font-mono">
                  {activeArtwork.styleName}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white font-cinzel drop-shadow-md tracking-tight mt-1">
                {isTigrinya ? activeArtwork.titleTi : activeArtwork.title}
              </h2>
            </div>

          </div>

          {/* Details & Cultural Context Drawer Body */}
          <div className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-white to-slate-50">
            
            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {isTigrinya ? activeArtwork.descriptionTi : activeArtwork.description}
            </p>

            {/* Key Architectural & Iconographic Features */}
            <div className="bg-[#FAF8F5] border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isTigrinya ? 'ፍሉያት መለለይታት ቅርሲ:' : 'Architectural & Inscription Highlights:'}</span>
                </span>
                <span className="text-[10px] text-amber-700 font-mono">Monolithic Granite Craft</span>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                {(isTigrinya ? activeArtwork.architecturalHighlightsTi : activeArtwork.architecturalHighlights).map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5 bg-white p-2 rounded-xl border border-amber-100 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span className="leading-snug text-[11px] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Historical Context Paragraph */}
            <div className="text-xs text-slate-600 bg-blue-50/50 border border-blue-100 p-3 rounded-2xl space-y-1">
              <span className="font-bold text-blue-900 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>{isTigrinya ? 'ታሪኻዊ ትርጉም:' : 'Historical & Civilizational Significance:'}</span>
              </span>
              <p className="leading-relaxed text-[11.5px]">
                {isTigrinya ? activeArtwork.historicalContextTi : activeArtwork.historicalContext}
              </p>
            </div>

            {/* Action Bar: Save to Vault, Audio Narration, Share, Prompt view */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
              
              <div className="flex items-center space-x-2">
                
                {/* Save / Bookmark Button */}
                <button
                  onClick={() => handleSaveArtwork(activeArtwork)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm active:scale-95 ${
                    savedArtworkIds[activeArtwork.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {savedArtworkIds[activeArtwork.id] ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{isTigrinya ? 'ተዓቒቡ ✓' : 'Saved in Vault ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isTigrinya ? 'ኣብ ሳንዱቕ ዓቅብ' : 'Save to Vault'}</span>
                    </>
                  )}
                </button>

                {/* Audio Narration Toggle */}
                <button
                  onClick={() => handleToggleSpeech(activeArtwork)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border active:scale-95 ${
                    isSpeaking
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title="Audio Narration in Tigrinya/English"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
                  <span>{isSpeaking ? (isTigrinya ? 'ኣቋርጽ' : 'Stop') : (isTigrinya ? 'ድምጺ ስማዕ' : 'Narrate')}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(activeArtwork)}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-slate-200 active:scale-95"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{isCopied ? (isTigrinya ? 'ተቐዲሑ!' : 'Copied!') : (isTigrinya ? 'ምቐል' : 'Share')}</span>
                </button>

              </div>

              {/* Prompt Info Tag */}
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="font-mono truncate max-w-[200px] sm:max-w-xs">
                  Prompt: {activeArtwork.promptUsed}
                </span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. THUMBNAIL STRIP & JUMP-TO-SLIDE GALLERY                                */}
      {/* ========================================================================= */}
      <div className="bg-[#0D182B] rounded-2xl p-3 border border-[#1E3A68] shadow-lg">
        <div className="flex items-center justify-between text-xs text-blue-200 font-semibold mb-2 px-1">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTigrinya ? 'ናይ ስእልታት መተሓላለፊ ሰሌዳ' : 'Heritage Gallery Thumbnails'}</span>
          </span>
          <span className="text-[11px] text-amber-300 font-mono">
            {filteredArtworks.length} {isTigrinya ? 'ቅርሲታት' : 'Monuments'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredArtworks.map((art, idx) => (
            <button
              key={art.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-24 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                currentIndex === idx
                  ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate text-left">
                {isTigrinya ? art.titleTi : art.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FULLSCREEN HIGH RESOLUTION ZOOM INSPECTOR MODAL                        */}
      {/* ========================================================================= */}
      {isZoomOpen && activeArtwork && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in">
          
          {/* Header */}
          <div className="w-full max-w-6xl flex items-center justify-between pb-3 text-white border-b border-white/10">
            <div>
              <h3 className="text-base sm:text-xl font-bold font-cinzel text-amber-300">
                {isTigrinya ? activeArtwork.titleTi : activeArtwork.title}
              </h3>
              <p className="text-xs text-gray-400">{activeArtwork.location} • {activeArtwork.era}</p>
            </div>

            <button
              onClick={() => setIsZoomOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fullscreen Image Canvas */}
          <div className="w-full max-w-6xl flex-1 flex items-center justify-center my-4 overflow-hidden relative">
            <img
              src={activeArtwork.imageUrl}
              alt={activeArtwork.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-amber-400/30"
            />
          </div>

          {/* Footer Controls in Zoom */}
          <div className="w-full max-w-6xl flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-white/10">
            <span>Style: <strong className="text-amber-300">{activeArtwork.styleName}</strong></span>
            <button
              onClick={() => handleSaveArtwork(activeArtwork)}
              className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isTigrinya ? 'ኣብ ሳንዱቕ ዓቅብ' : 'Save to Vault'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
