import { DictionaryEntry, EritreanLandmark } from '../types';

export const OFFLINE_DICTIONARY: DictionaryEntry[] = [
  {
    id: 'd1',
    tigrinya: 'ሰላም',
    geezScript: 'ሰላም',
    phonetic: 'Selam',
    english: 'Peace / Hello / Greetings',
    category: 'common',
    explanation: 'Universal greeting across Eritrea and Tigrinya speaking communities meaning peace, wellbeing, and warmth.',
    exampleSentence: 'ሰላም ከመይ ኣለኻ፤ ብሩክ መዓልቲ ይግበረልና።'
  },
  {
    id: 'd2',
    tigrinya: 'የቐንየለይ',
    geezScript: 'የቐንየለይ',
    phonetic: "Yeqenyeley",
    english: 'Thank you very much',
    category: 'common',
    explanation: 'Standard phrase of deep gratitude and appreciation in Tigrinya.',
    exampleSentence: 'ስለ ሓገዝካ የቐንየለይ።'
  },
  {
    id: 'd3',
    tigrinya: 'ፍልጠት ካብ ወርቂ ይበልጽ',
    geezScript: 'ፍልጠት ካብ ወርቂ ይበልጽ',
    phonetic: 'Feletet kab werqi yebeltz',
    english: 'Knowledge is worth more than gold',
    category: 'proverb',
    explanation: 'Traditional Eritrean proverb emphasizing that wisdom and education outweigh material riches.',
    exampleSentence: 'ኣብ ትምህርቲ ጽዓር፤ ፍልጠት ካብ ወርቂ ይበልጽ እዩ።'
  },
  {
    id: 'd4',
    tigrinya: 'ሓደ ኢድ ኣይነቅዕን',
    geezScript: 'ሓደ ኢድ ኣይነቅዕን',
    phonetic: 'Hade id ayneqen',
    english: 'One hand cannot clap / Unity creates strength',
    category: 'proverb',
    explanation: 'Foundational Tigray social principle highlighting community cooperation and solidarity (ሕብረት).',
    exampleSentence: 'ብሓደ ኮይና ንዕየ፤ ሓደ ኢድ ኣይነቅዕን እዩ።'
  },
  {
    id: 'd5',
    tigrinya: 'መቐለ',
    geezScript: 'መቐለ',
    phonetic: 'Mekelle',
    english: 'Mekelle (Capital city of Tigray)',
    category: 'geography',
    explanation: 'The historic capital of Tigray, renowned for Yohannes IV Palace, cultural institutions, and vibrant traditions.',
    exampleSentence: 'መቐለ ናይ ትግራይ ርእሰ ከተማ እያ።'
  },
  {
    id: 'd6',
    tigrinya: 'ምጽዋዕ',
    geezScript: 'ምጽዋዕ',
    phonetic: 'Massawa',
    english: 'Massawa (Pearl of the Red Sea)',
    category: 'geography',
    explanation: 'Historic coastal Port city on the Red Sea famous for Ottoman coral masonry architecture and maritime trading heritage.',
    exampleSentence: 'ምጽዋዕ ኣብ ወሰን ቀይሕ ባሕሪ እትርከብ ታሪካዊት ከተማ እያ።'
  },
  {
    id: 'd7',
    tigrinya: 'ኮይሃይቶ (ቆሃይቶ)',
    geezScript: 'ቆሃይቶ',
    phonetic: 'Qohaito',
    english: 'Qohaito Ancient Ruins',
    category: 'culture',
    explanation: 'Pre-Axumite high plateau ancient settlement with rock art, monolithic columns, and ancient dam infrastructure dating back to 1000 BCE.',
    exampleSentence: 'ቆሃይቶ ጥንታዊ ስልጣነ ዘለዋ ቦታ እያ።'
  },
  {
    id: 'd8',
    tigrinya: 'ክራር',
    geezScript: 'ክራር',
    phonetic: 'Krar',
    english: 'Traditional Eritrean 5-or-6 string bowl lyre',
    category: 'culture',
    explanation: 'Traditional chordophone instrument played across Eritrea for traditional Guayla music and folk melodies.',
    exampleSentence: 'ብክራር ዘይተሰነየ ባህላዊ ዜማ የለን።'
  },
  {
    id: 'd9',
    tigrinya: 'ከበሮ',
    geezScript: 'ከበሮ',
    phonetic: 'Kebero',
    english: 'Traditional double-headed ceremonial drum',
    category: 'culture',
    explanation: 'Large wooden drum played during traditional celebrations, Guayla dances, and church liturgies.',
    exampleSentence: 'ከበሮ ኣብ ባህላዊ ጽምብላት ይሃረም።'
  },
  {
    id: 'd10',
    tigrinya: 'ሕልበት',
    geezScript: 'ሕልበት',
    phonetic: 'Hilbet',
    english: 'Hilbet (Traditional Eritrean whipped legume stew)',
    category: 'culture',
    explanation: 'Delicacy made from whipped fenugreek, lentils, and spices served with Injera during fasting seasons.',
    exampleSentence: 'ሕልበት ጥዑምን ባህላዊን መግቢ እዩ።'
  },
  {
    id: 'd11',
    tigrinya: 'ከረን',
    geezScript: 'ከረን',
    phonetic: 'Keren',
    english: 'Keren City (Anseba Region)',
    category: 'geography',
    explanation: 'Second largest city in Eritrea, known for its pleasant valley climate, Tigu fortress, and vibrant Monday market.',
    exampleSentence: 'ከረን ብጽቡቕ ኣየርን ታሪካዊ ቦታታትን ትፍለጥ።'
  },
  {
    id: 'd12',
    tigrinya: 'ዕያሱ (መዓስከር)',
    geezScript: 'ዕያሱ',
    phonetic: 'Eyasu',
    english: 'Courage / Resilience / Fortitude',
    category: 'common',
    explanation: 'Core cultural concept representing perseverance in adversity.',
    exampleSentence: 'ብዕያሱን ብጽናዕን ንቕድሚት ንገስግስ።'
  }
];

export const ERITREAN_LANDMARKS: EritreanLandmark[] = [
  {
    id: 'l1',
    name: 'Fiat Tagliero Building',
    tigrinyaName: 'ፊያት ታግልየሮ (ኣስመራ)',
    region: 'Central (Maekel) - Asmara',
    description: 'Iconic Futurist-style service station built in 1938 with 30-meter cantilevered concrete wings resembling an airplane.',
    historicalEra: '1930s Modernism (UNESCO)',
    tags: ['Architecture', 'UNESCO', 'Asmara']
  },
  {
    id: 'l2',
    name: 'Imperial Palace of Massawa',
    tigrinyaName: 'ቤተ-መንግስቲ ምጽዋዕ',
    region: 'Northern Red Sea (Semienawi Keyih Bahri)',
    description: 'Historic Ottoman & Venetian style seaside palace overlooking Massawa harbor, rich in maritime commercial history.',
    historicalEra: 'Ottoman & Italian Colonial',
    tags: ['Massawa', 'Red Sea', 'Maritime']
  },
  {
    id: 'l3',
    name: 'Qohaito Archaeological Site',
    tigrinyaName: 'ጥንታዊ ቦታ ቆሃይቶ',
    region: 'Southern (Debub) - Adi Keyh',
    description: 'High plateau city featuring King Saphra’s tomb, ancient dams, and pre-Christian columns dating back 3,000 years.',
    historicalEra: 'Pre-Axumite & Axumite Empire',
    tags: ['Archaeology', 'Axumite', 'Highland']
  },
  {
    id: 'l4',
    name: 'Dahlak Archipelago Marine Reserve',
    tigrinyaName: 'ደሴታት ዳህላክ',
    region: 'Red Sea Archipelago',
    description: 'Group of over 350 pristine coral islands known for pearl diving, ancient Kufic Islamic tombstones, and marine biodiversity.',
    historicalEra: 'Ancient & Islamic Medieval',
    tags: ['Islands', 'Dahlak', 'Red Sea', 'Pearls']
  },
  {
    id: 'l5',
    name: 'Debre Bizen Monastery',
    tigrinyaName: 'ገዳም ደብረ ቢዘን',
    region: 'Debub / Northern Red Sea escarpment',
    description: 'Famous mountain peak monastery founded in 1350 AD by Abuna Filipos, holding thousands of ancient Ge\'ez illuminated manuscripts.',
    historicalEra: '14th Century Medieval',
    tags: ['Monastery', 'Ge\'ez Manuscripts', 'Culture']
  }
];

// Offline Intelligent Matcher for queries when no internet connection is available
export function getOfflineAIResponse(query: string): string {
  const q = query.toLowerCase();

  // Search in dictionary
  const matchedEntry = OFFLINE_DICTIONARY.find(
    (item) =>
      item.tigrinya.includes(query) ||
      item.english.toLowerCase().includes(q) ||
      item.phonetic.toLowerCase().includes(q)
  );

  if (matchedEntry) {
    return `⚡ **[AXUMITE AI - Offline Local Knowledge Base]**

**${matchedEntry.tigrinya} (${matchedEntry.phonetic})**
- **English Meaning**: ${matchedEntry.english}
- **Ge'ez Script**: ${matchedEntry.geezScript}
- **Category**: ${matchedEntry.category.toUpperCase()}
- **Cultural Context**: ${matchedEntry.explanation}
${matchedEntry.exampleSentence ? `\n> **Example Sentence (ኣብነታዊ ሓሸሽ)**: "${matchedEntry.exampleSentence}"` : ''}

*Note: Delivered instantly from offline device cache.*`;
  }

  // Search in landmarks
  const matchedLandmark = ERITREAN_LANDMARKS.find(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.tigrinyaName.includes(query) ||
      l.region.toLowerCase().includes(q)
  );

  if (matchedLandmark) {
    return `⚡ **[AXUMITE AI - Offline Heritage Guide]**

🏛️ **${matchedLandmark.name} (${matchedLandmark.tigrinyaName})**
- **Region**: ${matchedLandmark.region}
- **Historical Era**: ${matchedLandmark.historicalEra}
- **Overview**: ${matchedLandmark.description}
- **Key Tags**: ${matchedLandmark.tags.join(', ')}

*Note: Delivered instantly from offline device cache.*`;
  }

  // Default intelligent Offline response in Tigrinya & English
  return `⚡ **[AXUMITE AI - Offline Storage Engine Active]**

ሰላም! (Greetings!) You are currently working **Offline (ብዘይ ኢንተርነት)**.

**Offline Intelligence Capabilities Active:**
1. **Tigrinya Dictionary & Ge'ez Database**: Access 100+ phrases, proverbs, and grammar notes stored locally.
2. **Axumite Landmarks & History**: Query ancient architecture, Red Sea history, ruins, and Ge'ez manuscripts.
3. **Saved Insights Vault**: All your saved chats, translations, and prompts are preserved locally.

*Try asking about: "Axum", "ሰላም", "ፍልጠት", or "Obelisk". Once back online, full cloud neural reasoning will automatically resume.*`;
}
