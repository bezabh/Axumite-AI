import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, ShieldCheck, BookOpen, MapPin, Eye, 
  ExternalLink, Sparkles, Filter, CheckCircle2, Info 
} from 'lucide-react';
import { CulturalHeritageSite, HeritageEra, EvidenceType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const HERITAGE_SITES_DATA: CulturalHeritageSite[] = [
  {
    id: 'SITE-1',
    nameEn: 'Great Stelae & Obelisks of Aksum',
    nameTi: 'ሓወልትታት ኣክሱም',
    nameDe: 'Große Stelen und Obelisken von Aksum',
    region: 'Tigray',
    nearestCity: 'Aksum',
    coordinates: { lat: 14.1311, lng: 38.7183 },
    era: 'axumite_empire_golden_age',
    evidenceType: 'monumental_inscribed',
    unescoStatus: 'UNESCO World Heritage Site',
    summaryEn: 'Monolithic granite obelisks towering up to 33 meters carved to represent multi-story palace architecture over royal burial chambers, dating from 1st to 4th century CE.',
    summaryTi: 'ክሳብ 33 ሜትሮ ዝቑመቱ ብሓንቲ ከውሒ ዝተሰርሑ ድንቂ ሓወልትታት ኣክሱም፡ ጥንታዊ ናይ ስነ-ህንጻን ንግስነትን ታሪኽ ዘንጸባርቑ እዮም።',
    summaryDe: 'Monolithische Granitstelen von bis zu 33 Metern Höhe, die mehrstöckige Palastarchitektur über königlichen Grabkammern darstellen.',
    historicalSignificance: 'Capital of the ancient Axumite Empire, naval trade hub between the Roman Empire and India, and mint of gold coinage.',
    architecturalStyle: 'Monolithic dry-quarried syenite granite with false windows and beam headers.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Ezana Royal Inscription Stela', 'Great Fallen Obelisk (33m)', 'Tomb of the False Door', 'Gudit Stelae Field'],
    visitingGuideNotes: 'Respectful behavior is required around sacred burial grounds. Professional local guides provide multilingual historical context.',
  },
  {
    id: 'SITE-2',
    nameEn: 'Temple of Yeha (Great Moon Temple)',
    nameTi: 'ቤተ-መቕደስ ይሓ',
    nameDe: 'Tempel von Yeha',
    region: 'Tigray',
    nearestCity: 'Yeha / Adwa',
    coordinates: { lat: 14.2889, lng: 39.0167 },
    era: 'ancient_pre_axumite_dmt',
    evidenceType: 'archaeological_documented',
    unescoStatus: 'Tentative List',
    summaryEn: 'The oldest standing stone structure in Sub-Saharan Africa, constructed around the 8th century BCE without mortar using monumental dressed limestone blocks.',
    summaryTi: 'ኣብ ደቡብ ሳህራ ኣፍሪቃ ካብ ዝርከቡ ጥንታውያን ናይ እምኒ ህንጻታት እቲ ዝቐደመ ኮይኑ፡ ቅድሚ ልደተ ክርስቶስ ኣብ 8ይ ክፍለዘመን ብዘይ ጭቃ ዝተሃንጸ እዩ።',
    summaryDe: 'Das älteste stehende Steingebäude in Subsahara-Afrika, erbaut um das 8. Jahrhundert v. Chr. ohne Mörtel aus monumentalem Kalkstein.',
    historicalSignificance: 'Capital of the kingdom of D’mt, holding South Arabian and Ge’ez inscriptions and early metal smelting evidence.',
    architecturalStyle: 'Dry-stone dressed megalithic masonry with south-facing monumental portal.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Ibex engravings', 'Sabaean inscriptions', 'Abba Aftse Monastery museum with 6th-century Ge’ez manuscripts'],
    visitingGuideNotes: 'Preservation zone; touching ancient limestone friezes is restricted.',
  },
  {
    id: 'SITE-3',
    nameEn: 'Metera (Matara) Archaeological Site & Balaw Kalaw',
    nameTi: 'ጥንታዊት ከተማ መተራ (በለው ከለው)',
    nameDe: 'Archäologische Stätte von Metera (Matara)',
    region: 'Eritrea',
    nearestCity: 'Senafe',
    coordinates: { lat: 14.6853, lng: 39.4219 },
    era: 'axumite_empire_golden_age',
    evidenceType: 'archaeological_documented',
    unescoStatus: 'National Monument',
    summaryEn: 'A major ancient urban center and trade crossroads linking the Red Sea port of Adulis to the highland interior, renowned for the 5-meter Hawulti of Metera bearing archaic Ge\'ez script.',
    summaryTi: 'ካብ ወደብ ዓዱሊስ ናብ ደጋዊ ከባቢታት ዘራኽብ ዝነበረ ዓቢ ጥንታዊ ናይ ንግዲ ከተማን፡ ጥንታዊ ግእዝ ጽሑፍ ዝሓዘ ሓወልቲ መተራን።',
    summaryDe: 'Bedeutendes antikes Handelszentrum, das den Hafen Adulis mit dem Hochland verband, berühmt für die Stele mit alt-Ge\'ez-Inschrift.',
    historicalSignificance: 'Excavations revealed tiered residential palaces, royal tombs, and bronze coinage spanning over 1,000 years of continuous civilization.',
    architecturalStyle: 'Terraced stone masonry with stepped palace foundations and subterranean crypts.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Hawulti Obelisk with solar disc and Ge’ez dedication', 'Royal Palace complex', 'Pre-Christian burial chambers'],
    visitingGuideNotes: 'Located south of Senafe near Mount Emba Soira. Archaeological supervision recommended.',
  },
  {
    id: 'SITE-4',
    nameEn: 'Qohaito (Kohaito) Ancient Plateau',
    nameTi: 'ጥንታዊ ቅርስታት ቆሓይቶ',
    nameDe: 'Antike Hochebene von Qohaito',
    region: 'Eritrea',
    nearestCity: 'Adi Keyh',
    coordinates: { lat: 14.8833, lng: 39.4333 },
    era: 'axumite_empire_golden_age',
    evidenceType: 'archaeological_documented',
    unescoStatus: 'Tentative List',
    summaryEn: 'Spectacular highland plateau city spanning 2.5 km by 15 km, featuring the Temple of Mariam Wakiro, the Safra Dam (reservoir), and prehistoric rock art caves.',
    summaryTi: 'ኣብ ደጋዊ ስንጭሮ ዝርከብ ሰፊሕ ጥንታዊ ቆሓይቶ፡ ጥንታዊ ግድብ ሳፍራ፡ ቤተ-መቕደስ ማርያም ዋቂሮን ስእልታት በዓትታትን ዝሓዘ እዩ።',
    summaryDe: 'Spektakuläre Hochplateau-Stadt mit dem Mariam-Wakiro-Tempel, dem antiken Safra-Damm und prähistorischen Felsmalereien.',
    historicalSignificance: 'Summer capital and mercantile storage hub for caravans traveling between Adulis and the Axumite hinterlands.',
    architecturalStyle: 'Axumite stepped stone masonry and monumental engineering reservoirs.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Safra Dam (ancient stone-walled reservoir)', 'Egyptian Tomb', 'Adi Alauti cave rock paintings'],
    visitingGuideNotes: 'Offers breathtaking cliff views into the Great Rift Valley escarpment.',
  },
  {
    id: 'SITE-5',
    nameEn: 'Asmara: Modernist & Art Deco City',
    nameTi: 'ኣስመራ፡ ናይ ኣርት ዲኮን ሞደርኒዝምን ውርሻ',
    nameDe: 'Asmara: Modernistische & Art-Déco-Stadt',
    region: 'Eritrea',
    nearestCity: 'Asmara',
    coordinates: { lat: 15.3229, lng: 38.9251 },
    era: 'modern_italian_art_deco',
    evidenceType: 'monumental_inscribed',
    unescoStatus: 'UNESCO World Heritage Site',
    summaryEn: 'An extraordinarily intact 20th-century modernist architectural capital, featuring Futurist buildings like Fiat Tagliero, Art Deco cinemas (Cinema Impero), and harmonious urban planning.',
    summaryTi: 'ዩኔስኮ ዘመዝገቦ ፍሉይ ናይ 20 ክፍለዘመን ናይ ሞደርኒዝምን ኣርት ዲኮን ስነ-ህንጻ ከተማ፡ ከም ፊያት ታግሌሮን ሲነማ ኢምፔሮን።',
    summaryDe: 'Außergewöhnlich gut erhaltene modernistische Architekturmetropole des 20. Jahrhunderts mit futuristischen Ikonen wie Fiat Tagliero.',
    historicalSignificance: 'Recognized globally as UNESCO World Heritage for its architectural synthesis of European rationalism within an African highland landscape.',
    architecturalStyle: 'Italian Rationalism, Futurism, Art Deco, and Novecento.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Fiat Tagliero Service Station (winged structure)', 'Cinema Impero', 'Enda Mariam Orthodox Cathedral', 'Great Mosque of Al-Khulafa Al-Rashiudin'],
    visitingGuideNotes: 'Walking tours across Harnet Avenue and Sematat Avenue allow full appreciation of preserved facades.',
  },
  {
    id: 'SITE-6',
    nameEn: 'Gheralta Rock-Hewn Cliff Churches',
    nameTi: 'ናይ ገራልታ ፍሉያት ኣብ ከውሒ ዝተወቕሩ ኣብያተ-ክርስቲያናት',
    nameDe: 'Felsenkirchen von Gheralta',
    region: 'Tigray',
    nearestCity: 'Hawzen / Wukro',
    coordinates: { lat: 13.9833, lng: 39.3833 },
    era: 'medieval_zagwe_solomonic',
    evidenceType: 'sacred_manuscript',
    unescoStatus: 'Tentative List',
    summaryEn: 'A cluster of over 35 cliff-top and cavern rock-hewn monolithic churches carved into sandstone pinnacles, featuring 8th-15th century Byzantine-Axumite fresco murals.',
    summaryTi: 'ኣብ በሪኽ ገደላት ዝተወቕሩ ልዕሊ 35 ጥንታውያን ኣብያተ-ክርስቲያናት፡ ከም ኣቡነ የማኣታ ጉሕን ደብረ ማርያም ቆርቆርን።',
    summaryDe: 'Über 35 spektakulär in steile Sandsteinfelsen gehauene Felsenkirchen mit byzantinisch-axumitischen Fresken.',
    historicalSignificance: 'Sacred mountain sanctuaries preserving ancient Ge’ez manuscripts, hand-painted vellum gospels, and monastic traditions.',
    architecturalStyle: 'Hypogeum rock-cut monolithic basilica with cruciform columns and barrel-vaulted domes.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Abuna Yemata Guh (clifftop pinnacle church)', 'Maryam Korkor', 'Debre Tsion (Veneration of the Cross)'],
    visitingGuideNotes: 'Requires steep climbing with local harness guides. Sacred etiquette strictly observed.',
  },
  {
    id: 'SITE-7',
    nameEn: 'Massawa Ottoman & Italian Coral Architecture',
    nameTi: 'ባጽዕ (ምጽዋዕ)፡ ናይ ሳግላ ከውሒ ስነ-ህንጻ',
    nameDe: 'Massawa: Korallenstein-Architektur',
    region: 'Eritrea',
    nearestCity: 'Massawa',
    coordinates: { lat: 15.6097, lng: 39.4678 },
    era: 'coastal_red_sea_ottoman',
    evidenceType: 'monumental_inscribed',
    summaryEn: 'Ancient Red Sea port city renowned for Ottoman mashrabiya latticework balconies, Venetian porticos, and buildings crafted from coral stone blocks.',
    summaryTi: 'ቀይሕ ባሕሪ ወደብ ከተማ፡ ብናይ ሳግላ ከውሒ፡ ቱርካውን ጣልያናውን ስነ-ህንጻታት ዝተሰርሑ ፍሉያት ቅርጽታት ዘለዋ።',
    summaryDe: 'Historische Hafenstadt am Roten Meer, bekannt für Korallensteinbauten, osmanische Holzbalkone und venezianische Bogengänge.',
    historicalSignificance: 'Centuries-old gateway for maritime spice, silk, and pearl trade connecting Africa, Arabia, and the Mediterranean.',
    architecturalStyle: 'Red Sea Coastal architecture utilizing fossil coral blocks and wooden tie-beams.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Sheikh Hanafi Mosque (15th century)', 'Imperial Palace', 'Old Portico Arcade', 'Twalot Island causes'],
    visitingGuideNotes: 'Evening strolls through the historic old island streets offer the best view of coral masonry.',
  },
  {
    id: 'SITE-8',
    nameEn: 'Al-Nejashi Mosque & Royal Companion Tombs',
    nameTi: 'መስጊድ ኣል-ነጃሺ',
    nameDe: 'Al-Nejashi-Moschee',
    region: 'Tigray',
    nearestCity: 'Negash / Wukro',
    coordinates: { lat: 13.8333, lng: 39.6000 },
    era: 'axumite_empire_golden_age',
    evidenceType: 'archaeological_documented',
    summaryEn: 'Historic site of the First Hijra (migration) in Islam (615 CE), where King Ashama (Al-Najashi) granted refuge to the early companions of Prophet Muhammad.',
    summaryTi: 'ኣብ ዓለም ካብ ዘለዉ ቀዳሞት ናይ ምስልምና ታሪኻውያን ማእከላት ሓደ ኮይኑ፡ ንጉስ ኣክሱም ንተኸተልቲ ነቢይ መሓመድ ዕቝባ ዝሃበሉ ታሪኻዊ ቦታ።',
    summaryDe: 'Historische Stätte der Ersten Hidschra (615 n. Chr.), an der der axumitische König den ersten Gefährten des Propheten Zuflucht gewährte.',
    historicalSignificance: 'Symbol of ancient interfaith tolerance, sanctuary diplomacy, and the oldest documented Islamic settlement in Africa.',
    architecturalStyle: 'Domed mausoleum complex and historic courtyard sanctuary.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
    keyArtifactsOrFeatures: ['Tombs of the 15 Sahaba (companions)', 'Historic minaret', 'Ancient inscription tablets'],
    visitingGuideNotes: 'Sanctuary of peace and mutual respect. Visitors remove footwear before entering the shrine.',
  },
];

export const HeritageMatrix: React.FC = () => {
  const { language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'Tigray' | 'Eritrea'>('all');
  const [selectedSite, setSelectedSite] = useState<CulturalHeritageSite | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = HERITAGE_SITES_DATA.filter((site) => {
    const matchesRegion = selectedRegion === 'all' || site.region === selectedRegion;
    const matchesSearch = site.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.nameTi.includes(searchQuery) ||
                          site.nearestCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Landmark className="w-4 h-4" />
          <span>Archaeological & Living Heritage Matrix</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'ጥንታዊ ውርሻታትን ታሪኻዊ ቅርጽታትን' : language === 'de' ? 'Archäologische & Historische Stätten' : 'Tigray & Eritrea Cultural Heritage Matrix'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          {language === 'ti'
            ? 'ካብ ጥንታዊት ስልጣነ ኣክሱምን ይሓን፡ ክሳብ ቆሓይቶ፡ መተራ፡ ባጽዕን ሞደርኒዝም ኣስመራን ብጭቡጥ ስነ-ጥንታዊ መርትዖታት ተመራመሩ።'
            : language === 'de'
            ? 'Erforschen Sie die antiken Stätten von Aksum, Yeha, Qohaito, Metera, Massawa und Asmara mit archäologischen Belegen.'
            : 'Explore the monumental monuments, palaces, inscriptions, and sacred sanctuaries of the Axumite Basin with rigorous archaeological provenance.'}
        </p>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRegion === 'all' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              All Regions (ኩሉ ዞባታት)
            </button>
            <button
              onClick={() => setSelectedRegion('Tigray')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRegion === 'Tigray' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              Tigray Sites
            </button>
            <button
              onClick={() => setSelectedRegion('Eritrea')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRegion === 'Eritrea' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              Eritrea Sites
            </button>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search site, monument, city..."
              className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSites.map((site) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all shadow-lg flex flex-col group"
          >
            {/* Card Banner */}
            <div className="p-5 bg-stone-950/80 border-b border-stone-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">
                  {site.region} • {site.nearestCity}
                </span>
                {site.unescoStatus && (
                  <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full font-medium">
                    {site.unescoStatus}
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                {language === 'ti' ? site.nameTi : language === 'de' && site.nameDe ? site.nameDe : site.nameEn}
              </h4>
              <div className="text-xs text-amber-400/90 font-geez font-medium">
                {site.nameTi}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 space-y-3 text-xs text-stone-300 leading-relaxed">
              <p>{language === 'ti' ? site.summaryTi : language === 'de' && site.summaryDe ? site.summaryDe : site.summaryEn}</p>

              {/* Badges */}
              <div className="pt-2 border-t border-stone-800/60 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 bg-stone-800 text-emerald-400 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {site.evidenceType.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 bg-stone-800 text-stone-400 rounded">
                  {site.era.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Card Footer Action */}
            <div className="p-4 bg-stone-950/60 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-500">
                {site.coordinates.lat.toFixed(2)}°N, {site.coordinates.lng.toFixed(2)}°E
              </span>
              <button
                onClick={() => setSelectedSite(site)}
                className="flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:text-amber-300 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Deep Heritage Details</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deep Detail Modal */}
      <AnimatePresence>
        {selectedSite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between pb-4 border-b border-stone-800">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">{selectedSite.id} • {selectedSite.region}</span>
                  <h3 className="text-2xl font-bold text-stone-100 mt-1">{selectedSite.nameEn}</h3>
                  <p className="text-amber-300 font-geez text-sm">{selectedSite.nameTi}</p>
                </div>
                <button
                  onClick={() => setSelectedSite(null)}
                  className="p-1.5 bg-stone-800 text-stone-400 hover:text-stone-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Historical Significance */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Historical & Cultural Significance</h4>
                <p className="text-sm text-stone-200 leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800">
                  {selectedSite.historicalSignificance}
                </p>
              </div>

              {/* Architecture & Engineering */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Architectural & Masonry Style</h4>
                <p className="text-sm text-stone-300 leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800">
                  {selectedSite.architecturalStyle}
                </p>
              </div>

              {/* Key Artifacts & Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Key Artifacts & Inscriptions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSite.keyArtifactsOrFeatures.map((feat, i) => (
                    <div key={i} className="bg-stone-950/80 p-3 rounded-lg border border-stone-800 text-xs text-stone-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visiting & Preservation Notes */}
              <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-1.5 text-xs text-amber-200/90">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Info className="w-4 h-4" />
                  <span>Preservation & Visitor Protocol</span>
                </div>
                <p>{selectedSite.visitingGuideNotes}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
