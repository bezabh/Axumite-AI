import React, { useState, useMemo } from 'react';
import { 
  MapPin, Flame, Layers, Sparkles, Briefcase, TrendingUp, Building2,
  DollarSign, Users, ChevronRight, Eye, RefreshCw, Compass, CheckCircle2,
  ArrowRight, ShieldAlert, Award, Globe, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { JobListing } from './JobSearchModal';

export interface GeoLocationCluster {
  id: string;
  name: string;
  nameTi: string;
  region: 'tigray' | 'ethiopia' | 'eritrea' | 'regional';
  regionLabel: string;
  regionLabelTi: string;
  // Percentage coordinates on map (0-100)
  x: number; 
  y: number;
  openingsCount: number;
  intensity: 'high' | 'medium' | 'emerging';
  topSectors: { en: string; ti: string }[];
  avgSalary: string;
  avgSalaryTi: string;
  activeOpportunities: string[];
  keyHighlights: string[];
  keyHighlightsTi: string[];
  isHotspot?: boolean;
}

export const REGIONAL_GEO_CLUSTERS: GeoLocationCluster[] = [
  // ==========================================
  // TIGRAY REGION HUBS
  // ==========================================
  {
    id: 'mekelle',
    name: 'Mekelle',
    nameTi: 'መቐለ',
    region: 'tigray',
    regionLabel: 'Tigray Regional Capital',
    regionLabelTi: 'ርእሰ ከተማ ክልል ትግራይ',
    x: 48,
    y: 22,
    openingsCount: 18,
    intensity: 'high',
    topSectors: [
      { en: 'Humanitarian & NGOs', ti: 'ሰብኣዊ ረድኤትን NGOን' },
      { en: 'Healthcare & Nutrition', ti: 'ሕክምናን ጥዕናን' },
      { en: 'STEM & Higher Ed', ti: 'STEMን ትምህርትን' }
    ],
    avgSalary: '50,000 - 85,000 ETB / mo',
    avgSalaryTi: '50,000 - 85,000 ብር / ወርሒ',
    activeOpportunities: [
      'Humanitarian Health & Nutrition Officer (TRHDA)',
      'University STEM & CS Lecturer (MIT Mekelle)',
      'WASH & Infrastructure Project Engineer'
    ],
    keyHighlights: [
      'Hub for 40+ active international NGO missions and UN agencies',
      'High demand for bilingual health coordinators and engineers',
      'Mekelle University & MIT technical talent recruitment center'
    ],
    keyHighlightsTi: [
      'ማእከል 40+ ዓለምለኸ ትካላት ረድኤትን ሕቡራት መንግስታትን',
      'ንሰብ ሞያ ጥዕና፣ መሃንድሳትን ተርጎምትን ልዑል ድሌት',
      'ናይ ዩኒቨርሲቲ መቐለን MITን ናይ ቴክኒክ ሰራሕተኛታት ማእከል'
    ],
    isHotspot: true,
  },
  {
    id: 'aksum',
    name: 'Aksum',
    nameTi: 'ኣክሱም',
    region: 'tigray',
    regionLabel: 'Central Tigray / Heritage Hub',
    regionLabelTi: 'ማእከላይ ትግራይ / ታሪኻዊት ከተማ',
    x: 40,
    y: 17,
    openingsCount: 9,
    intensity: 'medium',
    topSectors: [
      { en: 'Sustainable Agriculture', ti: 'ዘላቒ ሕርሻን መስኖን' },
      { en: 'Heritage & Hospitality', ti: 'ቱሪዝምን ባህልን' },
      { en: 'Reconstruction Engineering', ti: 'ዳግመ ህንጸት' }
    ],
    avgSalary: '45,000 - 65,000 ETB / mo',
    avgSalaryTi: '45,000 - 65,000 ብር / ወርሒ',
    activeOpportunities: [
      'Sustainable Agriculture Field Coordinator',
      'Civil & Water Rehabilitation Specialist',
      'Vocational Skills Trainer'
    ],
    keyHighlights: [
      'Rapid agricultural recovery projects & modern irrigation initiatives',
      'Heritage preservation and civic infrastructure redevelopment',
      'Solar energy and community health clinics rollout'
    ],
    keyHighlightsTi: [
      'ናይ ሕርሻ ልምዓትን ዘመናዊ ናይ መስኖ ፕሮጀክትታትን',
      'ናይ ቅርስን ታሪኽን ሓለዋን ዳግመ-ህንጸት ትሕተ-ቅርጽን',
      'ናይ ጸሓይ ጸዓትን ማሕበረሰብ ክሊኒካትን ምስፍሕፋሕ'
    ],
    isHotspot: true,
  },
  {
    id: 'adwa',
    name: 'Adwa',
    nameTi: 'ዓድዋ',
    region: 'tigray',
    regionLabel: 'Central Tigray / Industry Corridor',
    regionLabelTi: 'ማእከላይ ትግራይ / ኢንዱስትሪ',
    x: 43,
    y: 15,
    openingsCount: 7,
    intensity: 'medium',
    topSectors: [
      { en: 'Textile & Manufacturing', ti: 'ጨርቃ-ጨርቅን ፋብሪካን' },
      { en: 'Primary Healthcare', ti: 'ናይ ከባቢ ክሊኒካዊ ጥዕና' },
      { en: 'Community Logistics', ti: 'ስርገትን መጓዓዝያን' }
    ],
    avgSalary: '40,000 - 60,000 ETB / mo',
    avgSalaryTi: '40,000 - 60,000 ብር / ወርሒ',
    activeOpportunities: [
      'Agro-Processing Supervisor',
      'Community Health Outreach Nurse',
      'Logistics Dispatch Coordinator'
    ],
    keyHighlights: [
      'Re-activation of manufacturing and agro-processing facilities',
      'Crucial transit link for Northern trade corridors',
      'High growth in technical trade and mechanical apprenticeships'
    ],
    keyHighlightsTi: [
      'ናይ ፋብሪካታትን መስርሒ ፍርያት ሕርሻን ምብርባር',
      'ናይ ሰሜናዊ ንግዲ መስመራት ወሳኒ መተሓላለፊ',
      'ናይ ኢደ-ጥበብን ሜካኒካል ሞያን ዕቤት'
    ],
  },
  {
    id: 'shire',
    name: 'Shire (Inda Selassie)',
    nameTi: 'ሽረ (እንዳስላሰ)',
    region: 'tigray',
    regionLabel: 'North-Western Tigray Logistics Hub',
    regionLabelTi: 'ሰሜን ምዕራብ ትግራይ / መጓዓዝያ',
    x: 34,
    y: 18,
    openingsCount: 11,
    intensity: 'high',
    topSectors: [
      { en: 'Emergency Relief Logistics', ti: 'ናይ ረድኤት መጓዓዝያ' },
      { en: 'WASH & Water Systems', ti: 'ጽሩይ ማይን ጽሬትን' },
      { en: 'Supply Chain Management', ti: 'ምሕደራ ንብረት' }
    ],
    avgSalary: '45,000 - 70,000 ETB / mo',
    avgSalaryTi: '45,000 - 70,000 ብር / ወርሒ',
    activeOpportunities: [
      'Cross-Border Logistics Fleet Supervisor',
      'WASH Installation Field Engineer',
      'Emergency Warehouse Administrator'
    ],
    keyHighlights: [
      'Major logistics and distribution gateway for Western & North-Western zones',
      'Urgent requirements for commercial heavy-duty drivers and warehouse managers',
      'Extensive international NGO humanitarian presence'
    ],
    keyHighlightsTi: [
      'ናይ ምዕራብን ሰሜን ምዕራብን ዞባታት ናይ ረድኤት ማእከል',
      'ናይ ከበድቲ መካይን መራሕትን መኽዘን ሓለፍትን ህጹጽ ድሌት',
      'ልዑል ናይ ዓለምለኸ ትካላት ረድኤት ምንቅስቓስ'
    ],
    isHotspot: true,
  },
  {
    id: 'abi_adi',
    name: 'Abi Adi / Tembien',
    nameTi: 'ዓቢ ዓዲ / ተምቤን',
    region: 'tigray',
    regionLabel: 'Central Tigray Agro-Ecological Zone',
    regionLabelTi: 'ማእከላይ ትግራይ / ናይ ሕርሻ ዞባ',
    x: 44,
    y: 25,
    openingsCount: 5,
    intensity: 'emerging',
    topSectors: [
      { en: 'Apiculture (Honey) & Farming', ti: 'ናይ ንህቢ መፍረን ሕርሻን' },
      { en: 'Rural Clinic Nursing', ti: 'ገጠር ክሊኒካዊ ነርሲንግ' },
      { en: 'Renewable Solar Tech', ti: 'ናይ ጸሓይ ጸዓት' }
    ],
    avgSalary: '38,000 - 52,000 ETB / mo',
    avgSalaryTi: '38,000 - 52,000 ብር / ወርሒ',
    activeOpportunities: [
      'Cooperative Honey Production Lead',
      'Maternal Care Field Nurse'
    ],
    keyHighlights: [
      'World-famous White Honey production agro-enterprises',
      'Expanding decentralized rural micro-solar grids'
    ],
    keyHighlightsTi: [
      'ዓለምለኸ ፍሉጥ ጻዕዳ መዓር ዘፍርዩ ናይ ሓባር ትካላት',
      'ናይ ገጠር ጸሓይ ጸዓት መብራህቲ ምስፍሕፋሕ'
    ]
  },

  // ==========================================
  // ETHIOPIA NATIONWIDE HUBS
  // ==========================================
  {
    id: 'addis_ababa',
    name: 'Addis Ababa',
    nameTi: 'ኣዲስ ኣበባ',
    region: 'ethiopia',
    regionLabel: 'Capital of Ethiopia & African Union HQ',
    regionLabelTi: 'ርእሰ ከተማ ኢትዮጵያን ማእከል ሕብረት ኣፍሪቃን',
    x: 52,
    y: 58,
    openingsCount: 34,
    intensity: 'high',
    topSectors: [
      { en: 'Fintech & Telebirr/Banking', ti: 'ባንክን ዲጂታል ፋይናንስን' },
      { en: 'Software & Cloud Tech', ti: 'ሶፍትዌርን ITን' },
      { en: 'Trilingual Diplomacy & Translation', ti: 'ዲፕሎማሲን ትርጉምን' },
      { en: 'Corporate Management', ti: 'ኮርፖሬት ምሕደራ' }
    ],
    avgSalary: '70,000 - 130,000 ETB / mo',
    avgSalaryTi: '70,000 - 130,000 ብር / ወርሒ',
    activeOpportunities: [
      'Senior Fintech Developer (React/Python)',
      'Bilingual Policy Translator (Tigrinya/Amharic/Eng)',
      'Telecommunications Network Architect'
    ],
    keyHighlights: [
      'Dominant technological & corporate hub of the Horn of Africa',
      'Over 200 international embassies, NGO global regional bureaus, and AU headquarters',
      'Leading digital payment startups, AI ventures, and financial services'
    ],
    keyHighlightsTi: [
      'ቀንዲ ናይ ቴክኖሎጂን ቢዝነስን ማእከል ቀርኒ ኣፍሪቃ',
      'ልዕሊ 200 ኤምባሲታት፣ ዓለምለኸ ትካላትን ሕብረት ኣፍሪቃን',
      'ናይ ዲጂታል ክፍሊት፣ AIን ባንክታትን ዝዓበየ ዕዳጋ'
    ],
    isHotspot: true,
  },
  {
    id: 'bahir_dar',
    name: 'Bahir Dar',
    nameTi: 'ባህር ዳር',
    region: 'ethiopia',
    regionLabel: 'Amhara Region / Lake Tana Corridor',
    regionLabelTi: 'ዞባ ጣና / ንግድን ቱሪዝምን',
    x: 42,
    y: 44,
    openingsCount: 10,
    intensity: 'medium',
    topSectors: [
      { en: 'Agri-Business & Fisheries', ti: 'ሕርሻን ዓሳ ሃፍትን' },
      { en: 'Water Resource Management', ti: 'ምሕደራ ማይ' },
      { en: 'Education & Research', ti: 'ትምህርትን ምርምርን' }
    ],
    avgSalary: '45,000 - 68,000 ETB / mo',
    avgSalaryTi: '45,000 - 68,000 ብር / ወርሒ',
    activeOpportunities: [
      'Agro-Export Logistics Specialist',
      'Hydro-Geology Technician',
      'Hospital Quality Inspector'
    ],
    keyHighlights: [
      'Thriving Blue Nile basin agricultural processing zone',
      'Expanding commercial universities and research institutes'
    ],
    keyHighlightsTi: [
      'ናይ ጣና ዞባ ናይ ሕርሻ ፍርያት መስርሒ ማእከል',
      'ናይ ምርምርን ላዕለዎት ትካላት ትምህርትን ምንቅስቓስ'
    ]
  },
  {
    id: 'hawassa',
    name: 'Hawassa',
    nameTi: 'ሃዋሳ',
    region: 'ethiopia',
    regionLabel: 'Sidama Region / Industrial Park',
    regionLabelTi: 'ዞባ ሲዳማ / ኢንዱስትሪ ፓርክ',
    x: 54,
    y: 76,
    openingsCount: 14,
    intensity: 'high',
    topSectors: [
      { en: 'Textile & Apparel Export', ti: 'ጨርቃ-ጨርቅን ሰደድ ንግድን' },
      { en: 'Coffee Processing & Trade', ti: 'ምስንዳእ ቡንን ንግድን' },
      { en: 'Industrial Engineering', ti: 'ኢንዱስትሪያል ኢንጅነሪንግ' }
    ],
    avgSalary: '50,000 - 80,000 ETB / mo',
    avgSalaryTi: '50,000 - 80,000 ብር / ወርሒ',
    activeOpportunities: [
      'Industrial Quality Control Manager',
      'Supply Chain Lead (Hawassa Eco-Park)',
      'Agronomy Coffee Agronomist'
    ],
    keyHighlights: [
      'Largest eco-industrial park in Africa with hundreds of global manufacturers',
      'Massive export market for premium organic coffee and textiles'
    ],
    keyHighlightsTi: [
      'ኣብ ኣፍሪቃ እቲ ዝዓበየ ናይ ከባቢ-ተስማማዒ ኢንዱስትሪ ፓርክ',
      'ናይ ቡንን ሰደድ ፍርያትን ዓቢ ዕዳጋ'
    ],
    isHotspot: true,
  },

  // ==========================================
  // ERITREA & CORRIDOR
  // ==========================================
  {
    id: 'asmara',
    name: 'Asmara',
    nameTi: 'ኣስመራ',
    region: 'eritrea',
    regionLabel: 'Regional Commercial Hub',
    regionLabelTi: 'ናይ ቀጠናዊ ማእከል',
    x: 46,
    y: 8,
    openingsCount: 12,
    intensity: 'medium',
    topSectors: [
      { en: 'Clinical Medicine & Pharmacy', ti: 'ሕክምናን ፋርማሲን' },
      { en: 'Education & Secondary Teaching', ti: 'መምህርነትን ትምህርትን' },
      { en: 'Public Infrastructure', ti: 'ህዝባዊ ትሕተ-ቅርጺ' }
    ],
    avgSalary: '25,000 - 40,000 ETB / mo',
    avgSalaryTi: '25,000 - 40,000 ብር / ወርሒ',
    activeOpportunities: [
      'General Medical Practitioner',
      'Hospital Clinical Pharmacist',
      'Secondary STEM Instructor'
    ],
    keyHighlights: [
      'Central healthcare administration and referral hospital networks',
      'National education and teacher development opportunities'
    ],
    keyHighlightsTi: [
      'ማእከል ሓፈሻዊ ሕክምናን ሆስፒታላትን',
      'ናይ ትምህርትን መምህራንን ልምዓት'
    ]
  },
];

interface EthiopiaTigrayJobHeatmapProps {
  onSelectLocation: (locationName: string) => void;
  onFilterByRegion?: (region: 'all' | 'tigray' | 'ethiopia' | 'eritrea') => void;
  onSelectPromptForChat?: (prompt: string) => void;
}

export const EthiopiaTigrayJobHeatmap: React.FC<EthiopiaTigrayJobHeatmapProps> = ({
  onSelectLocation,
  onFilterByRegion,
  onSelectPromptForChat
}) => {
  const { language } = useLanguage();

  const [selectedCluster, setSelectedCluster] = useState<GeoLocationCluster | null>(REGIONAL_GEO_CLUSTERS[0]);
  const [activeLayer, setActiveLayer] = useState<'all' | 'tigray' | 'ethiopia' | 'eritrea'>('all');
  const [showHeatGlow, setShowHeatGlow] = useState(true);
  const [showSectorTags, setShowSectorTags] = useState(true);
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);

  const filteredClusters = useMemo(() => {
    if (activeLayer === 'all') return REGIONAL_GEO_CLUSTERS;
    return REGIONAL_GEO_CLUSTERS.filter(c => c.region === activeLayer);
  }, [activeLayer]);

  const totalVacancies = useMemo(() => {
    return filteredClusters.reduce((acc, c) => acc + c.openingsCount, 0);
  }, [filteredClusters]);

  const handleClusterClick = (cluster: GeoLocationCluster) => {
    setSelectedCluster(cluster);
  };

  const handleSearchInCity = (cluster: GeoLocationCluster) => {
    const cityName = language === 'ti' ? cluster.nameTi : cluster.name;
    onSelectLocation(cityName);
  };

  const handleRequestAiCareerInsight = (cluster: GeoLocationCluster) => {
    if (onSelectPromptForChat) {
      const cityName = language === 'ti' ? cluster.nameTi : cluster.name;
      const prompt = language === 'ti'
        ? `እባክኻ ኣብ ${cityName} (${cluster.regionLabelTi}) ዘሎ ናይ ስራሕ ዕዳጋ፣ ዝደልዩ ሞያታት፣ ናይ መነባብሮ ወጻኢን ከመይ ጌረ ውጽኢታዊ ኣመልክታ ከም ዝገብርን ዝርዝር ናይ AI ምኽሪ ሃበኒ።`
        : `Please provide a strategic local employment roadmap for ${cluster.name} (${cluster.regionLabel}). Detail top hiring organizations, in-demand technical & NGO skills, salary negotiations in ETB/USD, and cost-of-living recommendations.`;
      onSelectPromptForChat(prompt);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-[#8E6D28]/40 rounded-3xl overflow-hidden shadow-md flex flex-col">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & INTERACTIVE MAP CONTROLS                                      */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#121829] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 shrink-0">
            <Flame className="w-5 h-5 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'ti' ? 'ካርታ ዕድላት ስራሕ (ኢትዮጵያን ትግራይን)' : 'Horn of Africa Job Heatmap & Geo-Overlay'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                LIVE METRICS
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'ti' 
                ? 'ኣብ መቐለ፣ ኣክሱም፣ ዓድዋ፣ ሽረ፣ ኣዲስ ኣበባን ካልኦትን ዘለዉ ክፍት ስራሓትን ጽዓት ዕድላትን'
                : 'Interactive vacancy density across Tigray hubs, Addis Ababa, and regional industrial corridors'}
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 flex-wrap bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveLayer('all');
              if (onFilterByRegion) onFilterByRegion('all');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {language === 'ti' ? 'ኩሉ (All)' : 'All Regions'}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveLayer('tigray');
              if (onFilterByRegion) onFilterByRegion('tigray');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              activeLayer === 'tigray'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <span>{language === 'ti' ? 'ትግራይ (Tigray)' : 'Tigray Focus'}</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveLayer('ethiopia');
              if (onFilterByRegion) onFilterByRegion('ethiopia');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLayer === 'ethiopia'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            {language === 'ti' ? 'ኢትዮጵያ (Addis/All)' : 'Ethiopia Focus'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS BAR SUMMARY                                                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-[#0B0F1D] text-center divide-x divide-slate-200 dark:divide-slate-800 text-xs">
        <div className="p-2.5">
          <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
            {language === 'ti' ? 'ዝተረጋገጹ ክፍት ስራሓት' : 'Active Vacancies'}
          </div>
          <div className="text-base sm:text-lg font-black text-blue-600 dark:text-sky-400 mt-0.5">
            {totalVacancies}+ <span className="text-[11px] font-normal text-slate-500">Roles</span>
          </div>
        </div>

        <div className="p-2.5">
          <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
            {language === 'ti' ? 'ቀንዲ ዝደልዩ ዓውድታት' : 'Top In-Demand'}
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5 px-1">
            {language === 'ti' ? 'ሰብኣዊ ረድኤት • IT • ሕክምና' : 'NGOs • IT • Health'}
          </div>
        </div>

        <div className="p-2.5">
          <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
            {language === 'ti' ? 'ማእከላይ ደሞዝ (ወርሓዊ)' : 'Avg Salary Benchmark'}
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            45K – 110K+ ETB
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN MAP & HEATMAP CANVAS CONTAINER                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[380px]">
        
        {/* SVG Interactive Canvas Column */}
        <div className="lg:col-span-7 relative bg-gradient-to-b from-[#0A0F1D] via-[#0E1528] to-[#070B14] p-4 flex flex-col justify-between overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-slate-800">
          
          {/* Map Grid Background Styling */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Compass Rose Accent */}
          <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] text-slate-300 backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
            <span className="font-mono font-bold">N 13.49° E 39.47°</span>
          </div>

          {/* Map Layer Controls Toggles (Floating on Top Right) */}
          <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 text-[10.5px] text-slate-300">
            <button
              type="button"
              onClick={() => setShowHeatGlow(!showHeatGlow)}
              className={`px-2 py-0.5 rounded-lg font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                showHeatGlow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{language === 'ti' ? 'ሙቐት' : 'Heatmap'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSectorTags(!showSectorTags)}
              className={`px-2 py-0.5 rounded-lg font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                showSectorTags ? 'bg-blue-500/20 text-sky-300 border border-blue-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3 text-sky-400" />
              <span>{language === 'ti' ? 'ዓውድታት' : 'Sectors'}</span>
            </button>
          </div>

          {/* SVG Cartographic Horn of Africa & Tigray Region Map */}
          <div className="relative w-full h-[320px] sm:h-[350px] my-auto">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full overflow-visible drop-shadow-2xl"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Heatmap Radial Gradients */}
                <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#10B981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatMedium" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatEmerging" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </radialGradient>

                {/* Grid pattern */}
                <linearGradient id="mapBoundary" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Stylized Boundary of Ethiopia & Tigray (Horn of Africa Territory) */}
              <path
                d="M 30,5 
                   C 42,4 50,7 58,10 
                   C 66,13 72,20 78,30 
                   C 84,40 88,52 82,65 
                   C 76,78 68,90 55,95 
                   C 45,98 35,92 28,82 
                   C 20,72 16,58 20,44 
                   C 24,30 22,16 30,5 Z"
                fill="url(#mapBoundary)"
                stroke="#334155"
                strokeWidth="0.8"
                strokeDasharray="2,2"
                className="opacity-75"
              />

              {/* Tigray Region Dedicated Boundary Highlight (Northern Zone) */}
              <path
                d="M 28,12 
                   C 36,10 46,11 54,14 
                   C 58,18 56,26 52,32 
                   C 46,36 38,34 30,30 
                   C 25,24 24,16 28,12 Z"
                fill="#F59E0B"
                fillOpacity="0.08"
                stroke="#F59E0B"
                strokeWidth="1.2"
                strokeDasharray="1,1"
              />

              {/* Tigray Region Watermark Label */}
              <text
                x="44"
                y="12"
                fill="#FBBF24"
                fontSize="3.2"
                fontWeight="900"
                letterSpacing="0.6"
                textAnchor="middle"
                opacity="0.9"
              >
                TIGRAY (ትግራይ)
              </text>

              {/* Central Ethiopia Watermark Label */}
              <text
                x="52"
                y="52"
                fill="#94A3B8"
                fontSize="3.0"
                fontWeight="800"
                letterSpacing="0.4"
                textAnchor="middle"
                opacity="0.6"
              >
                ETHIOPIA (ኢትዮጵያ)
              </text>

              {/* Eritrea Corridor Watermark Label */}
              <text
                x="46"
                y="4"
                fill="#38BDF8"
                fontSize="2.6"
                fontWeight="800"
                letterSpacing="0.4"
                textAnchor="middle"
                opacity="0.7"
              >
                REGIONAL (ቀጠና)
              </text>

              {/* Transit & Trade Route Connectors (Dotted Logistics Lines) */}
              <line x1="48" y1="22" x2="52" y2="58" stroke="#38BDF8" strokeWidth="0.6" strokeDasharray="1,1.5" opacity="0.4" />
              <line x1="48" y1="22" x2="40" y2="17" stroke="#F59E0B" strokeWidth="0.6" strokeDasharray="1,1" opacity="0.5" />
              <line x1="40" y1="17" x2="34" y2="18" stroke="#F59E0B" strokeWidth="0.6" strokeDasharray="1,1" opacity="0.5" />
              <line x1="48" y1="22" x2="46" y2="8" stroke="#38BDF8" strokeWidth="0.6" strokeDasharray="1,1.5" opacity="0.4" />
              <line x1="52" y1="58" x2="54" y2="76" stroke="#10B981" strokeWidth="0.6" strokeDasharray="1,1.5" opacity="0.4" />
              <line x1="52" y1="58" x2="42" y2="44" stroke="#10B981" strokeWidth="0.6" strokeDasharray="1,1.5" opacity="0.4" />

              {/* ========================================================= */}
              {/* HEATMAP GLOW OVERLAYS                                     */}
              {/* ========================================================= */}
              {showHeatGlow && filteredClusters.map((cluster) => {
                const radius = cluster.intensity === 'high' ? 14 : cluster.intensity === 'medium' ? 10 : 7;
                const gradId = cluster.intensity === 'high' ? 'url(#heatHigh)' : cluster.intensity === 'medium' ? 'url(#heatMedium)' : 'url(#heatEmerging)';

                return (
                  <g key={`glow-${cluster.id}`} className="pointer-events-none transition-all">
                    <circle
                      cx={cluster.x}
                      cy={cluster.y}
                      r={radius}
                      fill={gradId}
                      className="animate-pulse"
                      style={{ animationDuration: cluster.intensity === 'high' ? '2.5s' : '4s' }}
                    />
                  </g>
                );
              })}

              {/* ========================================================= */}
              {/* INTERACTIVE MARKER NODES & PINS                           */}
              {/* ========================================================= */}
              {filteredClusters.map((cluster) => {
                const isSelected = selectedCluster?.id === cluster.id;
                const isHovered = hoveredClusterId === cluster.id;
                const markerColor = cluster.region === 'tigray' 
                  ? '#F59E0B' 
                  : cluster.region === 'ethiopia' 
                  ? '#10B981' 
                  : '#38BDF8';

                return (
                  <g
                    key={`marker-${cluster.id}`}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => handleClusterClick(cluster)}
                    onMouseEnter={() => setHoveredClusterId(cluster.id)}
                    onMouseLeave={() => setHoveredClusterId(null)}
                  >
                    {/* Ripple Ring for Hotspots */}
                    {cluster.isHotspot && (
                      <circle
                        cx={cluster.x}
                        cy={cluster.y}
                        r={isSelected ? 6.5 : 4.8}
                        fill="none"
                        stroke={markerColor}
                        strokeWidth="0.6"
                        className="animate-ping"
                        style={{ animationDuration: '2s' }}
                      />
                    )}

                    {/* Outer Selection Highlight Ring */}
                    {isSelected && (
                      <circle
                        cx={cluster.x}
                        cy={cluster.y}
                        r={5.5}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                        strokeDasharray="1,1"
                      />
                    )}

                    {/* Core Node Circle */}
                    <circle
                      cx={cluster.x}
                      cy={cluster.y}
                      r={isSelected ? 3.6 : isHovered ? 3.2 : 2.6}
                      fill={markerColor}
                      stroke="#0F172A"
                      strokeWidth="0.8"
                      className="transition-all duration-200"
                    />

                    {/* Inner Center Dot */}
                    <circle
                      cx={cluster.x}
                      cy={cluster.y}
                      r={1.0}
                      fill="#FFFFFF"
                    />

                    {/* City Name Label */}
                    <text
                      x={cluster.x}
                      y={cluster.y - 4.5}
                      fill={isSelected ? '#FFFFFF' : '#E2E8F0'}
                      fontSize={isSelected ? '3.0' : '2.5'}
                      fontWeight={isSelected ? '900' : '700'}
                      textAnchor="middle"
                      className="drop-shadow-md select-none"
                    >
                      {language === 'ti' ? cluster.nameTi : cluster.name}
                    </text>

                    {/* Vacancy Count Badge on Marker */}
                    <rect
                      x={cluster.x - 3.8}
                      y={cluster.y + 3.2}
                      width="7.6"
                      height="3.2"
                      rx="1.6"
                      fill="#0F172A"
                      stroke={markerColor}
                      strokeWidth="0.5"
                    />
                    <text
                      x={cluster.x}
                      y={cluster.y + 5.5}
                      fill="#FFFFFF"
                      fontSize="1.8"
                      fontWeight="900"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {cluster.openingsCount} jobs
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend on Bottom */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-[10.5px] text-slate-400 bg-slate-900/80 backdrop-blur-xs p-2 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-xs" />
                <span className="text-slate-300 font-bold">{language === 'ti' ? 'ትግራይ' : 'Tigray'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs" />
                <span className="text-slate-300 font-bold">{language === 'ti' ? 'ኢትዮጵያ' : 'Ethiopia'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shadow-xs" />
                <span className="text-slate-300 font-bold">{language === 'ti' ? 'ትግራይ (ቀጠና)' : 'Regional'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <Flame className="w-3 h-3 text-red-400" />
              <span>{language === 'ti' ? 'ቀያሕ/ብርቱዕ = ልዑል ድሌት' : 'Red/Amber = High Demand'}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. SELECTED CITY / REGION DETAIL DRAWER PANEL                              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-white dark:bg-[#0E1322]">
          {selectedCluster ? (
            <div className="space-y-4">
              
              {/* City Title & Region Badge */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white shadow-sm ${
                      selectedCluster.region === 'tigray' 
                        ? 'bg-gradient-to-br from-amber-500 to-amber-700' 
                        : selectedCluster.region === 'ethiopia' 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-700' 
                        : 'bg-gradient-to-br from-sky-500 to-blue-700'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {language === 'ti' ? selectedCluster.nameTi : selectedCluster.name}
                      </h3>
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {language === 'ti' ? selectedCluster.regionLabelTi : selectedCluster.regionLabel}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                      {selectedCluster.openingsCount} {language === 'ti' ? 'ስራሓት' : 'openings'}
                    </span>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      {selectedCluster.intensity === 'high' ? '🔥 High Demand' : '⭐ Active Hiring'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary & Economic Benchmark Card */}
              <div className="bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{language === 'ti' ? 'ማእከላይ ወርሓዊ ክፍሊት' : 'Local Monthly Compensation'}</span>
                  </span>
                  <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                    {language === 'ti' ? selectedCluster.avgSalaryTi : selectedCluster.avgSalary}
                  </span>
                </div>
              </div>

              {/* Top In-Demand Sectors */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {language === 'ti' ? 'ቀንዲ ዝደልዩ ዓውድታት (Top Hiring Industries)' : 'In-Demand Hiring Industries'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCluster.topSectors.map((sector, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      {language === 'ti' ? sector.ti : sector.en}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Location Market Highlights */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {language === 'ti' ? 'ናይ ከባቢ ገምጋምን ፍሉይ ረብሓን' : 'Regional Economic Insights'}
                </label>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {(language === 'ti' ? selectedCluster.keyHighlightsTi : selectedCluster.keyHighlights).map((item, i) => (
                    <div key={i} className="flex items-start space-x-2 bg-slate-50/60 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Vacancy Samples in City */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {language === 'ti' ? 'ኣብዛ ከተማ ዘለዉ ናሙና ስራሓት' : 'Sample Open Vacancies'}
                </label>
                <div className="space-y-1 text-xs">
                  {selectedCluster.activeOpportunities.map((op, i) => (
                    <div key={i} className="flex items-center space-x-2 text-blue-600 dark:text-sky-300 font-medium">
                      <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{op}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Regional Portal Links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>{language === 'ti' ? 'ቀጥታዊ ናይ ስራሕ መላግቦታት' : 'External Application Portals'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  <a
                    href={
                      selectedCluster.region === 'tigray'
                        ? 'https://reliefweb.int/jobs?search=Tigray'
                        : selectedCluster.region === 'eritrea'
                          ? 'https://careers.un.org'
                          : 'https://www.ethiojobs.net'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 flex items-center justify-between transition-colors font-medium"
                  >
                    <span className="truncate">
                      {selectedCluster.region === 'tigray' ? 'ReliefWeb Tigray' : selectedCluster.region === 'eritrea' ? 'UN Careers' : 'Ethiojobs Network'}
                    </span>
                    <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                  </a>
                  <a
                    href="https://www.linkedin.com/jobs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-900 dark:text-blue-200 flex items-center justify-between transition-colors font-medium"
                  >
                    <span className="truncate">LinkedIn Jobs</span>
                    <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">{language === 'ti' ? 'ከተማ ንምርኣይ ካብ ካርታ ጠውቕ' : 'Click any marker on the map to inspect regional jobs'}</p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedCluster && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleSearchInCity(selectedCluster)}
                className="flex-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>{language === 'ti' ? `ኣብ ${selectedCluster.nameTi} ዘለዉ ስራሓት ድለ` : `Filter Jobs in ${selectedCluster.name}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleRequestAiCareerInsight(selectedCluster)}
                className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-300 dark:border-slate-700 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Get AI Career Strategy for this City"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'ti' ? 'AI ምኽሪ' : 'AI Advice'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
