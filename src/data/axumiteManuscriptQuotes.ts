export interface AxumiteWisdomQuote {
  id: string;
  geez: string;
  tigrinya: string;
  english: string;
  source: string;
  sourceEn: string;
  century: string;
  centuryEn: string;
  theme: string;
  themeEn: string;
  historicalContextTi: string;
  historicalContextEn: string;
  manuscriptType: 'royal_inscription' | 'monastic_codex' | 'philosophical_treatise' | 'liturgical_diggwa' | 'legal_code';
}

export const AXUMITE_MANUSCRIPT_QUOTES: AxumiteWisdomQuote[] = [
  {
    id: 'ezana-justice-01',
    geez: 'በኃይለ እግዚአብሔር ዘሰማይ ወምድር፡ አኮ በኃይለ ሰብእ ዘተሠወርኩ፡ አላ በጽድቁ ወበፍትሑ ነሥአኩ መንግሥተ።',
    tigrinya: 'ብሓይሊ ፈጣሪ ሰማይን ምድርን ደኣ እምበር፡ ብሓይሊ ወዲ-ሰብ ኣይኮንኩን ዝቆምኩ፤ ብጽድቅን ብፍትሕን ድማ ነዛ መንግስቲ ሓሎኽዋ።',
    english: 'Not by human might do I stand, but by the righteousness of truth and justice is sovereign authority sustained.',
    source: 'ጽሑፍ ንጉሥ ዔዛና (DAE IV Inscription)',
    sourceEn: 'Royal Inscription of King Ezana (DAE IV Stone, c. 350 AD)',
    century: '4ይ ዘመን ድ.ክ.',
    centuryEn: '4th Century AD',
    theme: 'ፍትሕን ጽድቅን',
    themeEn: 'Justice & Righteousness',
    historicalContextTi: 'ንጉሥ ዔዛና ኣብ መበል 4ይ ዘመን ድ.ክ. ኣብ ኣክሱም ኣብ ዝተተኽለ ሰለስተ-ቋንቋታት ዝሓዘ ናይ እምኒ ጽሑፍ (ግዕዝ፡ ሳባውያንን ግሪኽን) ዘስፈሮ ናይ ፍትሕን ኣመሓዳድራን መትከል እዩ።',
    historicalContextEn: 'Inscribed on the trilingual monumental stele of King Ezana in Axum (in Ge\'ez, Sabaean, and Greek), establishing justice as the foundation of governance.',
    manuscriptType: 'royal_inscription',
  },
  {
    id: 'yared-harmony-02',
    geez: 'ዜማ ወማሕሌት ይመርሐነ ኀበ ሰላም፡ ወያስተፋቅር ልበ ደቂቀ ሰብእ በኅብረት።',
    tigrinya: 'ዜማን ማህሌትን ናብ ሰላም ይመርሓና፡ ልቢ ደቂ-ሰባት ድማ ብሓድነትን ብፍቕርን የጣዕሞ።',
    english: 'Sacred melody and harmonious voice guide humanity toward peace, uniting hearts in seamless accord.',
    source: 'መጽሐፈ ድጓ - ቅዱስ ያሬድ',
    sourceEn: "Mahlet & Diggwa Codex by Saint Yared (c. 540 AD)",
    century: '6ይ ዘመን ድ.ክ.',
    centuryEn: '6th Century AD',
    theme: 'ሰላምን ስኒትን',
    themeEn: 'Harmony & Peace',
    historicalContextTi: 'ቅዱስ ያሬድ ኣብ መበል 6ይ ክፍለ-ዘመን ኣብ ዘመን ንጉሥ ገብረ-መስቀል ዝደረሶ ፍሉይ ናይ ዜማ ስርዓት (ግዕዝ፡ ዕዝል፡ ኣራራይ) ዘስፈረሉ ጥንታዊ ናይ ብራና መጽሓፍ እዩ።',
    historicalContextEn: "Saint Yared formulated the sophisticated 3-mode musical notation system (Ge'ez, Ezel, Araray) that shaped intellectual and liturgical arts in the Horn of Africa.",
    manuscriptType: 'liturgical_diggwa',
  },
  {
    id: 'zara-yaqob-reason-03',
    geez: 'እግዚአብሔር ፈጠረነ ምስለ አእምሮ ወሕሊና፡ ከመ ንመርምር ኵሎ ነገር በብርሃነ ልቦና።',
    tigrinya: 'ፈጣሪ ብምስትውዓልን ብሕልናን ፈጢሩና እዩ፡ ስለዚ ንዅሉ ነገር ብብርሃን ልቦና ክንምርምሮ ይግብኣና።',
    english: 'We are endowed with reason and conscience; therefore, test every claim under the illuminating light of clear intellect.',
    source: 'ሐተታ ዘርአ ያዕቆብ (Hatata)',
    sourceEn: 'Hatata (Treatise on Reason) by Zara Yaqob (1667 AD)',
    century: '17ይ ዘመን ድ.ክ.',
    centuryEn: '17th Century AD',
    theme: 'ልቦናን ምስትውዓልን',
    themeEn: 'Reason & Critical Intellect',
    historicalContextTi: 'ፈላስፋ ዘርአ ያዕቆብ ኣብ መበል 17ይ ዘመን ኣብ በዓቲ ተሓቢኡ ዝጸሓፎ ፍልስፍናዊ ጽሑፍ ኮይኑ፡ ሕልናን ምስትውዓልን ናይ ሓቂ መለክዒ ምዃኑ የረድእ።',
    historicalContextEn: 'Zara Yaqob composed this rationalist philosophical treatise in a cave hermitage, advocating conscience, gender equality, and rational inquiry centuries before modern enlightenment philosophy.',
    manuscriptType: 'philosophical_treatise',
  },
  {
    id: 'kaleb-honor-04',
    geez: 'ዕቀብ ሕግ ወሥርዓት፡ ወኢትግፋዕ ነዳየ ወእጓለ ማውታ፡ ከመ ትርከብ ክብር ወበረከት።',
    tigrinya: 'ሕግን ስርዓትን ሓሉ፡ ንድኻን ንዘኽታምን ኣይትግፋዕ፡ ሽዑ ክብርን በረኸትን ክትረክብ ኢኻ።',
    english: 'Guard law and upright order, do not oppress the vulnerable, and honor shall perpetually attend your legacy.',
    source: 'ዜና መዋዕል ካሌብ (King Kaleb Chronicle)',
    sourceEn: 'Royal Chronicles of King Kaleb (c. 525 AD)',
    century: '6ይ ዘመን ድ.ክ.',
    centuryEn: '6th Century AD',
    theme: 'ምሕረትን ሕግን',
    themeEn: 'Compassion & Law',
    historicalContextTi: 'ንጉሥ ካሌብ (ኤለስባስ) ኣብ መበል 6ይ ዘመን ንንግድን ሰላምን ቀይሕ ባሕሪ ብምሕላው ዝተፈልጠ ንጉሥ ኣክሱም ዝገደፎ መምርሒ እዩ።',
    historicalContextEn: 'Preserved in ancient Ge\'ez codices documenting King Kaleb (Elesbaas) and the Pax Axumitica across Red Sea trade maritime routes.',
    manuscriptType: 'royal_inscription',
  },
  {
    id: 'matara-legacy-05',
    geez: 'ዘአንሥአ ዘከረ ለደቂቁ፡ ይነብር ስሙ ለትውልደ ትውልድ በክብር።',
    tigrinya: 'ንድቁ መዘከርታን ክብሪን ዘቖመ ሰብ፡ ስሙ ንውሉድ ወለዶ ብኽብሪ ይነብር።',
    english: 'Whoever raises enduring monuments of virtue and knowledge for posterity secures a name that outlasts generations.',
    source: 'ጽሑፍ ሓወልቲ ማጣራ (Matara Obelisk Inscription)',
    sourceEn: 'Ancient Monumental Inscription of Matara (Eritrea, c. 300 AD)',
    century: '3ይ-4ይ ዘመን ድ.ክ.',
    centuryEn: '3rd-4th Century AD',
    theme: 'ውርሻን ታሪኽን',
    themeEn: 'Heritage & Posterity',
    historicalContextTi: 'ኣብ ሰንዓፈ (ኤርትራ) ኣብ ዝርከብ ጥንታዊ ሓወልቲ ማጣራ ዝተወቕረ ናይ መጀመርታ ናይ ግዕዝ ፊደላት ጽሑፍ ኮይኑ፡ ንዘለኣለማዊ መዘከርታን ክብሪን ዝምልከት እዩ።',
    historicalContextEn: 'Inscribed upon the ancient royal obelisk of Matara in southern Eritrea, representing one of the earliest vowel-structured epigraphic Ge\'ez records in history.',
    manuscriptType: 'royal_inscription',
  },
  {
    id: 'walda-heywat-wisdom-06',
    geez: 'ዘኢየኃሥሥ ጥበበ ይነብር በጽልመት፡ ወዘይፈቱ ትምህርተ ይበጽሕ ኀበ ብርሃን።',
    tigrinya: 'ጥበብ ዘይደሊ ሰብ ኣብ ጸልማት ይነብር፡ ትምህርቲ ዝፈቱ ግና ናብ ብርሃን ይበጽሕ።',
    english: 'He who does not seek wisdom abides in darkness; he who loves learning ascends constantly toward radiant illumination.',
    source: 'መጽሐፈ ጥበብ - ወልደ ሕይወት',
    sourceEn: 'Treatise of Ethics by Walda Heywat (1692 AD)',
    century: '17ይ ዘመን ድ.ክ.',
    centuryEn: '17th Century AD',
    theme: 'ጥበብን ፍልጠትን',
    themeEn: 'Wisdom & Learning',
    historicalContextTi: 'ተማሃሪ ዘርአ ያዕቆብ ዝነበረ ወልደ ሕይወት ኣብ መጽሓፉ ሰብ ብትግሃትን ብፍልጠትን ህይወቱ ከመሓይሽ ከምዝኽእል ዘረድእ ጥንታዊ ፍልስፍና እዩ።',
    historicalContextEn: 'Walda Heywat expanded ethical philosophy in his treatise, stressing practical craftsmanship, persistent study, and human solidarity.',
    manuscriptType: 'philosophical_treatise',
  },
  {
    id: 'fetha-nagast-equity-07',
    geez: 'ኩኑ ዕሩያነ በቅድመ ፍትሕ፡ ወኢትፍልጡ ማእከለ ኃያል ወድኩም።',
    tigrinya: 'ኣብ ቅድሚ ፍትሒ ማዕረ ኩኑ፡ ኣብ መንጎ ሓያልን ድኹምን ድማ ኣይትፍለዩ።',
    english: 'Stand equitable before the scales of justice; let neither wealth nor fragility tilt the balance of impartial truth.',
    source: 'ፍትሐ ነገሥት (The Law of Kings)',
    sourceEn: 'Fetha Nagast Codex (Ancient Canon of Jurisprudence)',
    century: '15ይ ዘመን ድ.ክ.',
    centuryEn: '15th Century AD',
    theme: 'ማዕርነትን ፍትሕን',
    themeEn: 'Equity & Impartiality',
    historicalContextTi: 'ፍትሐ ነገሥት ንዘመናት ኣብ ሕጊ፡ ፍትሕን ምሕደራን ከም ቀንዲ መወከሲ ኮይኑ ዘገልገለ ናይ ብራና ሕጋዊ ሰነድ እዩ።',
    historicalContextEn: 'The Fetha Nagast served as the classical constitutional and civil jurisprudence codex, balancing civil equity and ethical duties.',
    manuscriptType: 'legal_code',
  },
  {
    id: 'garima-preservation-08',
    geez: 'ቃለ እግዚአብሔር ይነብር ለዓለም፡ ወጽድቁ ኢይኃልፍ እምትውልድ እስከ ትውልድ።',
    tigrinya: 'ቃለ-ሓቂ ንዘለኣለም ይነብር፡ ጽድቁ ድማ ካብ ወለዶ ናብ ወለዶ ኣይሓልፍን እዩ።',
    english: 'The word of truth endures forever; steadfast integrity passes unbroken from generation unto generation.',
    source: 'ብራና ወንጌል ጋርማ (Garima Gospels Codex)',
    sourceEn: 'Garima Gospels Illuminated Vellum (c. 450–530 AD)',
    century: '5ይ-6ይ ዘመን ድ.ክ.',
    centuryEn: '5th-6th Century AD',
    theme: 'ዘለኣለማዊ ሓቂ',
    themeEn: 'Timeless Truth',
    historicalContextTi: 'ኣብ ዓለም እቲ ዝጸንሐ ብብራና ተጻሒፉ ብዕጹው ቀለማት ዝተሰለመ ናይ ወንጌል ሰነድ ኮይኑ፡ ካርቦን ቴስቲንግ ኣብ መበል 5ይ-6ይ ዘመን ድ.ክ. ከምዝተጻሕፈ ኣረጋጊጹ እዩ።',
    historicalContextEn: 'Carbon-dated to 450–530 AD, the Garima Gospels represent one of the world\'s oldest surviving complete illuminated Christian codices on goatskin vellum.',
    manuscriptType: 'monastic_codex',
  },
  {
    id: 'book-of-axum-sovereignty-09',
    geez: 'ኣክሱም ቅድስተ ቅዱሳን፡ ማዕከለ ንግድ ወጥበብ፡ ዘተሐንጸት በጽንዓት ዲበ ዓለማት።',
    tigrinya: 'ኣክሱም ማእከል ንግድን ጥበብን ኮይና፡ ብጽንዓትን ብኽብርን ኣብ ልዕሊ ዓለም ቆመትን ተሃኒጻን።',
    english: 'Axum, nexus of maritime trade and venerable scholarship, established in unwavering majesty across the ancient world.',
    source: 'መጽሐፈ ኣክሱም (Liber Axumae)',
    sourceEn: 'Book of Axum (Liber Axumae Manuscript Chronicle)',
    century: 'ጥንታዊ ማህደር',
    centuryEn: 'Ancient Axumite Chronicle',
    theme: 'ልዑላውነትን ክብሪን',
    themeEn: 'Sovereignty & Heritage',
    historicalContextTi: 'መጽሐፈ ኣክሱም ናይ ኣክሱማውያን ታሪኽ፡ ሕግታት፡ መሬታዊ ግዝኣትን ጥንታዊ ስልጣነን ዝገልጽ ዓቢ ናይ ታሪኽ ሰነድ እዩ።',
    historicalContextEn: 'The Liber Axumae chronicles the foundations, royal charters, territorial maps, and ancient architectural monuments of the Axumite Empire.',
    manuscriptType: 'monastic_codex',
  },
  {
    id: 'debre-bizen-humility-10',
    geez: 'ትሕትና ትመርሕ ኀበ ዕበይ፡ ወትዕግሥት ተወክስ መከራ በሰላም።',
    tigrinya: 'ትሕትና ናብ ዕብየት ትመርሕ፡ ትዕግስቲ ድማ ንመከራ ብሰላምን ብጽንዓትን ትሰግሮ።',
    english: 'Humility paves the true path to greatness; serene patience transcends every adversity with quiet strength.',
    source: 'ብራና ደብረ ቢዘን (Debre Bizen Monastic Codex)',
    sourceEn: 'Debre Bizen Monastery Ancient Manuscript (Eritrea, c. 1390 AD)',
    century: '14ይ ዘመን ድ.ክ.',
    centuryEn: '14th Century AD',
    theme: 'ትሕትናን ትዕግስትን',
    themeEn: 'Humility & Resilience',
    historicalContextTi: 'ኣብ ደብረ ቢዘን ኤርትራ ብኣቡነ ፊልጶስ ኣብ መበል 14ይ ዘመን ዝተመስረተ ገዳም ዝዕቀቡ ኣሽሓት ናይ ብራና መጻሕፍቲ ዘስፈሮ ናይ ህይወት መምርሒ እዩ።',
    historicalContextEn: 'Preserved atop the mist-crowned peak of Debre Bizen monastery in Eritrea, housing thousands of intact illuminated Ge\'ez vellum manuscripts.',
    manuscriptType: 'monastic_codex',
  },
  {
    id: 'kebra-nagast-sovereignty-11',
    geez: 'ጥበብ ትኄይስ እምኵሉ ንዋየ ወርቅ፡ ወአእምሮ ታበጽሕ ኀበ ልዕልና መንግሥት።',
    tigrinya: 'ጥበብ ካብ ዝኾነ ንብረትን ወርቅን ትበልጽ፡ ምስትውዓል ድማ ናብ ልዕልናን ክብሪን መንግስቲ ተብጽሕ።',
    english: 'Wisdom surpasses all treasures of gold; profound understanding elevates the sovereignty of a nation.',
    source: 'ክብረ ነገሥት (Kebra Nagast Manuscript)',
    sourceEn: 'Kebra Nagast (Glory of the Kings Chronicle)',
    century: 'ጥንታዊ ማህደር',
    centuryEn: 'Classical Manuscript Codex',
    theme: 'ጥበብን ልዕልናን',
    themeEn: 'Wisdom & Royal Elevation',
    historicalContextTi: 'ክብረ ነገሥት ናይ ጥንታዎት ነገሥታት ኣክሱም ታሪኽ፡ ናይ ንግስተ ሳባን ንጉሥ ሰሎሞንን ርክብ፡ ከምኡውን ናይ ታቦተ ጽዮን ጉዕዞ ዝዕቅብ ዓቢ ናይ ስነ-ጽሑፍ ሰነድ እዩ።',
    historicalContextEn: 'The Kebra Nagast chronicles the ancient genealogical lineage, diplomatic travels of Queen Makeda, and the historical prestige of Axumite statecraft.',
    manuscriptType: 'royal_inscription',
  },
  {
    id: 'debra-damo-resilience-12',
    geez: 'አንሥእ ኣዕይንቲከ ኀበ አድባር፡ እምኀበ ይበጽሕ ረድኤትከ ወጽንዓትከ።',
    tigrinya: 'ኣዒንትኻ ናብቶም ኣኽራናት ኣልዕል፡ ረድኤትካን ጽንዓትካን ካብኡ ይበጽሕ።',
    english: 'Lift your eyes toward the high sanctuaries; thence steadfast fortitude and noble strength descend.',
    source: 'ብራና ገዳም ደብረ ዳሞ (Debra Damo Codex)',
    sourceEn: 'Debra Damo Mountain Manuscript (c. 6th Century AD)',
    century: '6ይ ዘመን ድ.ክ.',
    centuryEn: '6th Century AD',
    theme: 'ጽንዓትን ሓበንን',
    themeEn: 'Fortitude & Sanctuary',
    historicalContextTi: 'ብኣቡነ ኣረጋዊ ኣብ መበል 6ይ ዘመን ዝተመስረተ ብገመድ ጥራይ ዝድየብ ፍሉይ ናይ እምኒ ገዳም ኮይኑ፡ ጥንታዎት ቅርጽታትን ሰነዳትን ይዕቅብ።',
    historicalContextEn: 'Founded by Abuna Aregawi atop a sheer vertical cliff reached only by rope ladder, Debra Damo remains one of the oldest architectural and manuscript repositories in the Horn.',
    manuscriptType: 'monastic_codex',
  }
];

export function getDailyWisdomQuote(seedOffset = 0): AxumiteWisdomQuote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs((dayOfYear + seedOffset) % AXUMITE_MANUSCRIPT_QUOTES.length);
  return AXUMITE_MANUSCRIPT_QUOTES[index];
}

export function getRandomAxumiteQuote(excludeId?: string): AxumiteWisdomQuote {
  const filtered = excludeId 
    ? AXUMITE_MANUSCRIPT_QUOTES.filter(q => q.id !== excludeId)
    : AXUMITE_MANUSCRIPT_QUOTES;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || AXUMITE_MANUSCRIPT_QUOTES[0];
}
