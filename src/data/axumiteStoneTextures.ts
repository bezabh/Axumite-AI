export type AxumiteStoneTextureId = 
  | 'stela-granite'
  | 'ezana-trilingual'
  | 'matara-sandstone'
  | 'basalt-talisman'
  | 'birana-vellum';

export interface AxumiteStoneTexture {
  id: AxumiteStoneTextureId;
  nameEn: string;
  nameTi: string;
  descriptionEn: string;
  descriptionTi: string;
  stoneType: string;
  stoneTypeTi: string;
  era: string;
  colorPreview: string; // Tailwind/CSS preview color swatch
  borderAccent: string;
  goldAccent: string;
  badge: string;
  iconName: string;
}

export const AXUMITE_STONE_TEXTURES: AxumiteStoneTexture[] = [
  {
    id: 'stela-granite',
    nameEn: 'Axum Obelisk Granite',
    nameTi: 'ሓወልቲ ኣክሱም (ስነ-ቅርጺ ግራናይት)',
    descriptionEn: 'Monolithic stele granite with multi-story blind windows, monkey-head beam relief, and rounded stele apex.',
    descriptionTi: 'ብሓወልቲ ኣክሱም ዝተደረኸ ፍሉይ ናይ ግራናይት ቅርጺ፡ ናይ መስኮት ቅዲን ናይ ዕንጨይቲ መላግቦ ቅርጽታትን ዝሓዘ።',
    stoneType: 'Monolithic Granite',
    stoneTypeTi: 'ተሪር ግራናይት እምኒ',
    era: '3rd–4th Century AD',
    colorPreview: 'from-[#141619] via-[#202428] to-[#0D0E10]',
    borderAccent: '#94A3B8',
    goldAccent: '#FFD700',
    badge: '🏛️ Obelisk Stele',
    iconName: 'Building',
  },
  {
    id: 'ezana-trilingual',
    nameEn: 'Ezana Trilingual Basalt',
    nameTi: 'ጽሑፍ እምኒ ዒዛና (ባዛልት)',
    descriptionEn: 'Volcanic basalt tablet engraved with deep chisel scoring and monumental Sabaean-Ge\'ez royal inscriptions.',
    descriptionTi: 'ናይ ንጉሥ ዒዛና ናይ ዓወት ጽሑፍ ዝሓዘ ናይ ባዛልት ሰሌዳ፡ ብመጋዝን ብመቐስን ዝተወቕረ ቅርጺ።',
    stoneType: 'Volcanic Basalt Slab',
    stoneTypeTi: 'ናይ እሳተ-ጎመራ ባዛልት ሰሌዳ',
    era: 'c. 356 AD',
    colorPreview: 'from-[#161311] via-[#221C18] to-[#0E0C0A]',
    borderAccent: '#ECC665',
    goldAccent: '#E5C07B',
    badge: '📜 DAE IV Inscription',
    iconName: 'Scroll',
  },
  {
    id: 'matara-sandstone',
    nameEn: 'Matara Ochre Sandstone',
    nameTi: 'ሓውልቲ መተርኣ (ሑጻዊ እምኒ)',
    descriptionEn: 'Ancient warm terracotta sandstone featuring the sacred Disc-and-Crescent astronomical relief emblem.',
    descriptionTi: 'ኣብ መተርኣን ቆሓይቶን ዝርከብ ናይ ጸሓይን ወርሕን (Hawbas) ምልክታት ዝተወቕረሉ ሑጻዊ ቀይሕ እምኒ።',
    stoneType: 'Terracotta Sandstone',
    stoneTypeTi: 'ሑጻውን ማዕድናውን እምኒ',
    era: 'c. 3rd Century BC–3rd AD',
    colorPreview: 'from-[#2E1E14] via-[#3D2719] to-[#1E120A]',
    borderAccent: '#E09F67',
    goldAccent: '#FFC870',
    badge: '☀️🌙 Sun & Crescent',
    iconName: 'Sun',
  },
  {
    id: 'basalt-talisman',
    nameEn: 'Imperial Basalt Seal',
    nameTi: 'ንግሣዊ ማሕተም ባዛልት',
    descriptionEn: 'Polished midnight obsidian basalt stone with concentric sunburst engravings and royal talismanic cross medallion.',
    descriptionTi: 'ፍሉይ ጽሩይ ጸሊም ባዛልት እምኒ፡ 12-ጎኒ ዘለዎ ናይ ጸሓይ ጨንፈርን ናይ መስቀል ማሕተምን ዝተወቕረሉ።',
    stoneType: 'Polished Obsidian Basalt',
    stoneTypeTi: 'ጽሩይ ጸሊም ኦብሲድያን ባዛልት',
    era: '5th–6th Century AD',
    colorPreview: 'from-[#08080C] via-[#141522] to-[#050508]',
    borderAccent: '#818CF8',
    goldAccent: '#FFD700',
    badge: '👑 Royal Seal',
    iconName: 'Shield',
  },
  {
    id: 'birana-vellum',
    nameEn: 'Illuminated Birana Vellum',
    nameTi: 'ብራና ጥበብ (Illuminated Parchment)',
    descriptionEn: 'Aged sheepskin parchment laid over monastery altar stone with rich red cinnabar and gold Harag ribbon borders.',
    descriptionTi: 'ኣብ ልዕሊ ናይ ቤተ-መቕደስ እምኒ ዝተነጽፈ ብራና፡ ብቀይሕን ወርቅን ዝተሰለመ ናይ ሓረግ ስነ-ጥበብ።',
    stoneType: 'Vellum on Altar Stone',
    stoneTypeTi: 'ብራና ኣብ ልዕሊ እምኒ',
    era: '6th–14th Century AD',
    colorPreview: 'from-[#221A10] via-[#2E2316] to-[#161008]',
    borderAccent: '#EF4444',
    goldAccent: '#F59E0B',
    badge: '✨ Harag Ribbon',
    iconName: 'Feather',
  },
];

export function getStoneTextureById(id: AxumiteStoneTextureId): AxumiteStoneTexture {
  return AXUMITE_STONE_TEXTURES.find(t => t.id === id) || AXUMITE_STONE_TEXTURES[0];
}
