import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, Music, Sparkles, Flame, Heart, 
  Info, Volume2, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { TraditionalMusicInstrument, TraditionalAttire, CulinaryTradition } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const INSTRUMENTS_DATA: TraditionalMusicInstrument[] = [
  {
    id: 'INST-1',
    nameEn: 'Krar (Bowl Lyre)',
    nameTi: 'ክራር',
    nameDe: 'Krar (Schalenleier)',
    category: 'chordophone_string',
    stringsCount: 6,
    constructionMaterials: 'Wood bowl covered with goat parchment, wooden neck and crossbar, nylon or gut strings.',
    culturalRole: 'Central instrument in traditional Guayla dance, love poetry (Zelesegna), wedding celebrations, and modern highland folklore.',
    playingTechnique: 'Plucked with a plectrum (qinit) or strummed with finger dampening over pentatonic modes (Tizita, Bati, Ambassel, Anchihoye).',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'INST-2',
    nameEn: 'Masenqo (Single-String Bowed Lute)',
    nameTi: 'ማሰንቆ',
    nameDe: 'Masenqo (Einsaitige Spießlaute)',
    category: 'chordophone_string',
    stringsCount: 1,
    constructionMaterials: 'Diamond-shaped wooden soundbox covered in raw hide, horsehair string, and horsehair bow.',
    culturalRole: 'Used by wandering Azmari minstrels and oral historians to recite satirical, celebratory, and historical verses.',
    playingTechnique: 'Held vertically on the knee and bowed while the fingers lightly touch points on the single string without pressing it to the neck.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'INST-3',
    nameEn: 'Kebero (Double-Headed Ceremonial Drum)',
    nameTi: 'ከበሮ',
    nameDe: 'Kebero (Zeremonielle Trommel)',
    category: 'membranophone_drum',
    constructionMaterials: 'Hollowed tree trunk conical frame wrapped with twin oxhide membrane heads tied with leather thongs.',
    culturalRole: 'Sacred heartbeat of Orthodox liturgical chanting (Zema of Saint Yared) and celebratory wedding dances.',
    playingTechnique: 'Suspended by a woven sash from the shoulder and struck on both drumheads with the palms in polyrhythmic syncopation.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'INST-4',
    nameEn: 'Embilta & Wata (Flutes & Pipes)',
    nameTi: 'እምቢልታን ዋጣን',
    nameDe: 'Embilta & Wata (Flöten & Pfeifen)',
    category: 'aerophone_wind',
    constructionMaterials: 'Long hollow bamboo reed cane or animal horn without finger holes.',
    culturalRole: 'Played in sets of three at royal processions, funerals of noble heroes, and harvest festivals.',
    playingTechnique: 'Hocketing technique where each musician sounds a single pitch in turn to create a rapid melodic texture.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
  },
];

export const ATTIRE_DATA: TraditionalAttire[] = [
  {
    id: 'ATT-1',
    nameEn: 'Zuria & Tilfi (Hand-Embroidered Dress)',
    nameTi: 'ዙርያን ጥልፍን',
    nameDe: 'Zuria & Tilfi (Besticktes Festkleid)',
    gender: 'female',
    materialsUsed: 'Shemma (finely woven Ethiopian/Eritrean cotton) and vibrant colored silk/gold thread embroidery (Tilfi).',
    occasion: 'Weddings, Meskel, Timket, and cultural ceremonies.',
    significance: 'The intricate neck and hem cross patterns (Tilfi) display regional identity, artisan mastery, and family lineage.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'ATT-2',
    nameEn: 'Kuta & Netela (Woven Cotton Shawl)',
    nameTi: 'ኩታን ነጸላን',
    nameDe: 'Kuta & Netela (Gewebter Schal)',
    gender: 'unisex',
    materialsUsed: 'Lightweight double-layered white cotton with Tibeb (decorative border ribbon).',
    occasion: 'Everyday church attendance, formal elder assemblies, and holiday gatherings.',
    significance: 'The manner in which the Netela is draped over the shoulders communicates mood, mourning, respect, or joy.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'ATT-3',
    nameEn: 'Albaso & Shuruba (Braided Hairstyles)',
    nameTi: 'ኣልባሶን ሹሩባን',
    nameDe: 'Albaso & Shuruba (Traditionelle Flechtfrisuren)',
    gender: 'female',
    materialsUsed: 'Natural hair braided with organic butter (Qibe) or scented oils, adorned with amber beads.',
    occasion: 'Bridal ceremonies, coming-of-age celebrations, and cultural festivals.',
    significance: 'Distinct braid patterns (Albaso with crown rolls, Gilbich, and Chiffi) signify social status, bridehood, and regional pride.',
    imageThumbnail: '/assets/images/axumite_background_1786611272574.jpg',
  },
];

export const CULINARY_DATA: CulinaryTradition[] = [
  {
    id: 'CUL-1',
    nameEn: 'Traditional Buna (Coffee) Ceremony',
    nameTi: 'ባህላዊ ናይ ቡን ስነ-ስርዓት',
    nameDe: 'Traditionelle Kaffeezeremonie (Buna)',
    courseType: 'beverage',
    keyIngredients: ['Green Coffee Beans', 'Frankincense (Etseitan)', 'Rue herbs (Tena Adam)', 'Popcorn (Fendisha) / Himbasha bread'],
    culturalContext: 'A revered 3-brew hospitality ritual uniting family and neighbors to share news, bless the household, and bond in community peace.',
    preparationMethod: '1. Beans washed and roasted over live charcoal until fragrant. 2. Frankincense burned for blessing aroma. 3. Ground and brewed in clay Jebena. 4. Poured in continuous stream into Finjal cups.',
    regionalVariations: 'Served in three sacred rounds: Abol (1st strong round), Tona (2nd mellow round), and Bereka (3rd blessing round).',
  },
  {
    id: 'CUL-2',
    nameEn: 'Tsebhi & Injera / Tayta',
    nameTi: 'ጸብሕን ጣይታን (እንጀራ)',
    nameDe: 'Tsebhi & Injera (Sauerteig-Fladenbrot)',
    courseType: 'main',
    keyIngredients: ['Teff flour', 'Berbere spice blend', 'Niter Qibe (clarified spiced butter)', 'Lentils/Beef/Lamb'],
    culturalContext: 'The communal staple shared on a large mesob platter, symbolizing shared destiny and communal harmony (Gursha).',
    preparationMethod: 'Teff naturally fermented for 3-4 days to create spongy eyes (Ayn) on a clay Mitad griddle, topped with simmered spicy stews.',
    regionalVariations: 'Tsebhi Derho (spicy chicken stew with hard-boiled eggs), Alicha (mild turmeric curry), and Shiro (ground chickpea stew).',
  },
  {
    id: 'CUL-3',
    nameEn: 'Himbasha / Ambasha (Celebration Bread)',
    nameTi: 'ሕምባሻ',
    nameDe: 'Himbasha (Festliches Gewürzbrot)',
    courseType: 'dessert',
    keyIngredients: ['Wheat flour', 'Cardamom', 'Nigella seeds (Tikur Azmud)', 'Ginger', 'Raisins'],
    culturalContext: 'Sweet spiced ceremonial bread wheel baked for holidays, baptisms, and weddings, decorated with decorative wheel-spoke patterns.',
    preparationMethod: 'Kneaded with fragrant ground spices, scored with wheel spokes symbolizing the sun or chariot, and baked over a griddle.',
    regionalVariations: 'Often given to wedding guests and travelers as a token of goodwill and safe passage.',
  },
];

export const TraditionsAndCustoms: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'music' | 'attire' | 'culinary'>('culinary');
  const [bunaRound, setBunaRound] = useState<'abol' | 'tona' | 'bereka'>('abol');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Living Heritage, Arts & Gastronomy</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'ባህላዊ ሙዚቃ፡ ክዳውንትን ምግቢታትን' : language === 'de' ? 'Traditionen, Musik & Kulinarik' : 'Tigray & Eritrea Living Arts & Customs'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          {language === 'ti'
            ? 'ናይ ክራርን ማሰንቆን ዜማታት፡ ናይ ዙርያን ጥልፍን ጽባቐ፡ ከምኡ’ውን ናይ ቡን ስነ-ስርዓት (ኣቦል፡ ቶና፡ በረኻ) ተመሃሩ።'
            : language === 'de'
            ? 'Entdecken Sie traditionelle Musikinstrumente (Krar, Masenqo), Festtagsgewänder (Zuria) und die 3 Runden der Kaffeezeremonie.'
            : 'Experience the enduring arts: bowl lyre music, hand-woven cotton textiles, intricate hairstyles, and the revered three-round Buna coffee ritual.'}
        </p>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('culinary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'culinary' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>{language === 'ti' ? 'ስነ-ስርዓት ቡንን መግብን' : language === 'de' ? 'Kaffee & Kulinarik' : 'Buna Coffee & Culinary'}</span>
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'music' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>{language === 'ti' ? 'ባህላዊ መሳርሒ ሙዚቃ' : language === 'de' ? 'Musikinstrumente' : 'Music & Instruments'}</span>
          </button>
          <button
            onClick={() => setActiveTab('attire')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'attire' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ti' ? 'ክዳውንትን ሹሩባን' : language === 'de' ? 'Trachten & Frisuren' : 'Attire & Hairstyles'}</span>
          </button>
        </div>
      </div>

      {/* Buna & Culinary Tab */}
      {activeTab === 'culinary' && (
        <div className="space-y-6">
          {/* Interactive Coffee Ceremony Visualizer */}
          <div className="bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">LIVING HOSPITALITY RITUAL</span>
                <h4 className="text-2xl font-bold text-stone-100 mt-1">The Sacred 3-Brew Buna Coffee Ceremony</h4>
                <p className="text-stone-300 text-xs mt-0.5">ባህላዊ ናይ ቡን ስነ-ስርዓት • Three Rounds of Blessing and Kinship</p>
              </div>
              <div className="flex gap-2">
                {(['abol', 'tona', 'bereka'] as const).map((round) => (
                  <button
                    key={round}
                    onClick={() => setBunaRound(round)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      bunaRound === round
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {round === 'abol' ? '1. Abol (ኣቦል)' : round === 'tona' ? '2. Tona (ቶና)' : '3. Bereka (በረኻ)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Buna Round Spotlight Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-stone-950/80 border border-stone-800 p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  <span>1. ኣቦል (Abol) - The First Brew</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  The strongest, richest infusion brewed from freshly roasted beans. Served to elders and esteemed guests first. Sets the tone for thoughtful conversation.
                </p>
              </div>

              <div className="bg-stone-950/80 border border-stone-800 p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Coffee className="w-4 h-4" />
                  <span>2. ቶና (Tona) - The Second Brew</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Fresh spring water is added to the clay Jebena. A smoother, mellow cup where laughter, community stories, and shared memories flourish.
                </p>
              </div>

              <div className="bg-stone-950/80 border border-stone-800 p-5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Heart className="w-4 h-4" />
                  <span>3. በረኻ (Bereka) - The Blessing Brew</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  The final blessing round. Elders pray for peace, harvest prosperity, and the health of the host's children before departing.
                </p>
              </div>
            </div>
          </div>

          {/* Culinary Traditions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CULINARY_DATA.map((item) => (
              <div key={item.id} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <div>
                  <h4 className="text-lg font-bold text-stone-100">{item.nameEn}</h4>
                  <p className="text-amber-400 font-geez text-sm font-semibold">{item.nameTi}</p>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                  {item.culturalContext}
                </p>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-400 uppercase">Key Ingredients:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.keyIngredients.map((ing, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 bg-stone-800 text-stone-300 rounded">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Music & Instruments Tab */}
      {activeTab === 'music' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INSTRUMENTS_DATA.map((inst) => (
            <div key={inst.id} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h4 className="text-lg font-bold text-stone-100">{inst.nameEn}</h4>
                  <p className="text-amber-400 font-geez text-sm font-semibold">{inst.nameTi}</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                  {inst.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800">
                {inst.culturalRole}
              </p>
              <div className="text-xs text-stone-400 space-y-1.5">
                <div><span className="text-stone-300 font-semibold">Materials: </span>{inst.constructionMaterials}</div>
                <div><span className="text-stone-300 font-semibold">Technique: </span>{inst.playingTechnique}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attire & Hairstyles Tab */}
      {activeTab === 'attire' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ATTIRE_DATA.map((att) => (
            <div key={att.id} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="pb-3 border-b border-stone-800">
                <span className="text-[11px] font-mono uppercase text-amber-400">{att.gender}</span>
                <h4 className="text-lg font-bold text-stone-100 mt-1">{att.nameEn}</h4>
                <p className="text-amber-400 font-geez text-sm font-semibold">{att.nameTi}</p>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                {att.significance}
              </p>
              <div className="text-xs text-stone-400 space-y-1">
                <div><span className="text-stone-300 font-semibold">Occasion: </span>{att.occasion}</div>
                <div><span className="text-stone-300 font-semibold">Crafting: </span>{att.materialsUsed}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
