import React, { useState } from 'react';
import { 
  ArrowLeft, X, Briefcase, Search, FileText, Sparkles, MapPin, 
  Building, DollarSign, Send, CheckCircle2, ArrowRight, Award,
  User, Check, Clock, Globe, Share2, Copy, Filter, Phone, Mail,
  ExternalLink, ChevronRight, Bookmark, BookmarkCheck, Flame, Map
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { EthiopiaTigrayJobHeatmap } from './EthiopiaTigrayJobHeatmap';

interface JobSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromptForChat?: (prompt: string) => void;
}

export interface JobListing {
  id: string;
  title: string;
  titleTi: string;
  category: string;
  categoryTi: string;
  organization: string;
  location: string;
  locationTi: string;
  region: 'tigray' | 'ethiopia' | 'eritrea' | 'diaspora' | 'middle_east' | 'remote';
  salary: string;
  salaryTi: string;
  type: string;
  typeTi: string;
  description: string;
  descriptionTi: string;
  requirements: string[];
  requirementsTi: string[];
  skills: string[];
  contactEmail: string;
  deadline: string;
  isUrgent?: boolean;
  applyUrl: string;
  companyUrl: string;
  sourcePortalName: string;
  sourcePortalUrl: string;
}

export interface JobPortalLink {
  id: string;
  name: string;
  nameTi: string;
  category: 'tigray_ethiopia' | 'humanitarian' | 'global' | 'remote' | 'gulf';
  categoryLabel: string;
  categoryLabelTi: string;
  url: string;
  badge: string;
  description: string;
  descriptionTi: string;
  iconBg: string;
  popularSearch: string;
}

export const EXTERNAL_JOB_PORTALS: JobPortalLink[] = [
  {
    id: 'ethiojobs',
    name: 'Ethiojobs.net',
    nameTi: 'ኢትዮጆብስ (Ethiojobs)',
    category: 'tigray_ethiopia',
    categoryLabel: 'Ethiopia & Regional',
    categoryLabelTi: 'ኢትዮጵያን ከባቢኣን',
    url: 'https://www.ethiojobs.net',
    badge: 'ETHIOPIA #1',
    description: "Ethiopia's premier employment recruitment portal with 1,500+ corporate, banking, NGO, and government vacancies.",
    descriptionTi: 'ቀንዲ ናይ ኢትዮጵያ መርበብ ስራሕ፡ ልዕሊ 1,500 ክፍት ስራሓት ባንክታት፣ ውልቀ ትካላትን መንግስትን።',
    iconBg: '#10B981',
    popularSearch: 'Fintech, Engineering, Health, Administration',
  },
  {
    id: 'reliefweb',
    name: 'ReliefWeb (Tigray & Horn of Africa)',
    nameTi: 'ሪሊፍዌብ ሰብኣዊ ረድኤት (ReliefWeb)',
    category: 'humanitarian',
    categoryLabel: 'Humanitarian & UN',
    categoryLabelTi: 'ሰብኣዊ ረድኤትን UNን',
    url: 'https://reliefweb.int/jobs?search=Tigray',
    badge: 'UN OCHA / NGO',
    description: 'Official UN OCHA humanitarian career board for Tigray, Mekelle, Shire, and East Africa relief & reconstruction operations.',
    descriptionTi: 'ወግዓዊ ናይ ውድብ ሕቡራት መንግስታት (UN OCHA) ሰብኣዊ ረድኤት፡ ሕክምናን ዳግመ ህንጸት ትግራይን መላግቦ ስራሕ።',
    iconBg: '#2563EB',
    popularSearch: 'WASH, Health Officers, Nutrition, Logistics',
  },
  {
    id: 'un_careers',
    name: 'United Nations Careers (UNDP/UNICEF)',
    nameTi: 'ውድብ ሕቡራት መንግስታት (UN Careers)',
    category: 'humanitarian',
    categoryLabel: 'International Agencies',
    categoryLabelTi: 'ዓለምለኸ ትካላት',
    url: 'https://careers.un.org',
    badge: 'GLOBAL UN',
    description: 'International development positions, project directors, policy advisors, and field operations across Africa.',
    descriptionTi: 'ወግዓዊ ናይ ውድብ ሕቡራት መንግስታት (UNDP, UNICEF, WHO) ዓለምለኸ ናይ ስራሕ ዕድላት።',
    iconBg: '#0284C7',
    popularSearch: 'Program Officers, Data Analysts, Translators',
  },
  {
    id: 'devex',
    name: 'Devex Global Development',
    nameTi: 'ዴቬክስ ዓለምለኸ ልምዓት (Devex)',
    category: 'humanitarian',
    categoryLabel: 'Global NGO & Development',
    categoryLabelTi: 'ልምዓትን ኢንጅነሪንግን',
    url: 'https://www.devex.com/jobs',
    badge: 'DEV & AID',
    description: 'Global community for international development professionals, USAID/EU contract openings, and NGO leads.',
    descriptionTi: 'ናይ ዓለምለኸ ልምዓት፡ ዓበይቲ ፕሮጀክትታትን ማሕበራዊ ምዕባለን መላግቦ ስራሕ።',
    iconBg: '#7C3AED',
    popularSearch: 'Civil Engineers, Project Managers, Agronomists',
  },
  {
    id: 'linkedin_jobs',
    name: 'LinkedIn East Africa & Diaspora Hub',
    nameTi: 'ሊንክድኢን ስራሓት (LinkedIn)',
    category: 'global',
    categoryLabel: 'Corporate & Networking',
    categoryLabelTi: 'ኮርፖሬትን ቴክኖሎጂን',
    url: 'https://www.linkedin.com/jobs/jobs-in-ethiopia/',
    badge: 'VERIFIED HIRING',
    description: 'Direct hiring by multinationals, embassies, regional tech hubs, telecommunications, and financial corporations.',
    descriptionTi: 'ቀጥታዊ ምልመላ ዓበይቲ ኩባንያታት፡ ባንክታት፡ ኤምባሲታትን ናይ ቴክኖሎጂ ማእከላትን።',
    iconBg: '#0A66C2',
    popularSearch: 'Software Engineers, Accountants, HR Directors',
  },
  {
    id: 'weworkremotely',
    name: 'We Work Remotely (100% Online)',
    nameTi: 'ዊ ወርክ ሪሞትሊ (We Work Remotely)',
    category: 'remote',
    categoryLabel: 'Global Remote Work',
    categoryLabelTi: 'ካብ ገዛ / ብኦንላይን',
    url: 'https://weworkremotely.com',
    badge: '100% REMOTE',
    description: 'Work from anywhere in Software, AI, Content, Customer Support, Translation, and Digital Marketing.',
    descriptionTi: 'ካብ ዝኾነ ቦታ ኮይንካ ብኦንላይን እትሰርሖም ዓለምለኸ ናይ ሶፍትዌር፡ ዲዛይንን ትርጉምን ስራሓት።',
    iconBg: '#EA580C',
    popularSearch: 'React/Python, Content Writers, Translators',
  },
  {
    id: 'bayt_gulf',
    name: 'Bayt.com (Dubai & Gulf Region)',
    nameTi: 'ባይት ናይ ወሽመጥ ሃገራት (Bayt.com)',
    category: 'gulf',
    categoryLabel: 'Middle East Careers',
    categoryLabelTi: 'ማእከላይ ምብራቕ / ዱባይ',
    url: 'https://www.bayt.com/en/uae/jobs',
    badge: 'GULF / UAE',
    description: 'Leading Middle East career board for hospitality, logistics, healthcare, engineering, and transport in UAE and KSA.',
    descriptionTi: 'ናይ ዱባይ፡ ስዑዲ ዓረብን ሃገራት ወሽመጥን መጓዓዝያ፡ ጽሬት፡ ሆቴላትን ኢንጅነሪንግን ስራሓት።',
    iconBg: '#D97706',
    popularSearch: 'Logistics Drivers, Facility Staff, Nurses',
  },
  {
    id: 'indeed_global',
    name: 'Indeed Worldwide Job Engine',
    nameTi: 'ኢንዲድ ዓለምለኸ (Indeed)',
    category: 'global',
    categoryLabel: 'Worldwide Search',
    categoryLabelTi: 'መላእ ዓለም',
    url: 'https://www.indeed.com',
    badge: 'WORLDWIDE',
    description: 'Search millions of jobs across North America, Europe, Africa, and international diaspora hubs.',
    descriptionTi: 'ኣብ ኣሜሪካ፡ ኤውሮጳ፡ ካናዳን ዓለምን ዝርከቡ ሚልዮናት ናይ ስራሕ ዕድላት።',
    iconBg: '#4338CA',
    popularSearch: 'Healthcare, Logistics, Education, Trades',
  },
];

const JOB_PROFESSION_SUGGESTIONS = [
  { id: 'doctor', label: 'Doctor', labelTi: 'ሓኪም' },
  { id: 'nurse', label: 'Nurse', labelTi: 'ነርስ' },
  { id: 'elderly_care', label: 'Elderly Care', labelTi: 'ኣላይ ኣረጋውያን' },
  { id: 'pharmacist', label: 'Pharmacist', labelTi: 'ፋርማሲስት' },
  { id: 'ngo_health', label: 'Humanitarian / NGO', labelTi: 'ሰብኣዊ ረድኤት / NGO' },
  { id: 'cleaner', label: 'Cleaning', labelTi: 'ጽሬት' },
  { id: 'teacher', label: 'Teacher / Lecturer', labelTi: 'መምህር' },
  { id: 'driver', label: 'Driver / Logistics', labelTi: 'መራሕ ማኪና' },
  { id: 'engineer', label: 'Engineer', labelTi: 'ኢንጅነር' },
  { id: 'coding', label: 'Software / IT', labelTi: 'ኮዲንግ / IT' },
  { id: 'accountant', label: 'Accountant', labelTi: 'ሒሳብ ሓላፊ' },
  { id: 'chef', label: 'Chef / Culinary', labelTi: 'ሼፍ / መብሰሊ' },
  { id: 'agriculture', label: 'Agriculture / Food', labelTi: 'ሕርሻን ቀረብ መግብን' },
  { id: 'translator', label: 'Bilingual Translator', labelTi: 'ተርጓሚ (Tigrinya/Amharic/Eng)' },
];

const JOB_LOCATION_SUGGESTIONS = [
  // Ethiopia & Tigray (Highlighted)
  { id: 'mekelle', label: 'Mekelle (Tigray)', labelTi: 'መቐለ (ትግራይ)', region: 'tigray' },
  { id: 'addis', label: 'Addis Ababa (Ethiopia)', labelTi: 'ኣዲስ ኣበባ (ኢትዮጵያ)', region: 'ethiopia' },
  { id: 'tigray_all', label: 'Tigray Region (Wide)', labelTi: 'ትግራይ (ሓፈሻዊ)', region: 'tigray' },
  { id: 'ethiopia_all', label: 'Ethiopia (Nationwide)', labelTi: 'ኢትዮጵያ (ሓፈሻዊ)', region: 'ethiopia' },
  { id: 'aksum', label: 'Aksum (Tigray)', labelTi: 'ኣክሱም (ትግራይ)', region: 'tigray' },
  { id: 'adwa', label: 'Adwa (Tigray)', labelTi: 'ዓድዋ (ትግራይ)', region: 'tigray' },
  { id: 'shire', label: 'Shire (Tigray)', labelTi: 'ሽረ (ትግራይ)', region: 'tigray' },
  { id: 'bahirdar', label: 'Bahir Dar (Ethiopia)', labelTi: 'ባህር ዳር', region: 'ethiopia' },
  { id: 'hawassa', label: 'Hawassa (Ethiopia)', labelTi: 'ሃዋሳ', region: 'ethiopia' },

  // Eritrea
  { id: 'asmara', label: 'Asmara (Eritrea)', labelTi: 'ኣስመራ (ኤርትራ)', region: 'eritrea' },
  { id: 'keren', label: 'Keren (Eritrea)', labelTi: 'ከረን (ኤርትራ)', region: 'eritrea' },

  // Middle East & Gulf
  { id: 'dubai', label: 'Dubai (UAE)', labelTi: 'ዱባይ (UAE)', region: 'middle_east' },
  { id: 'riyadh', label: 'Riyadh (KSA)', labelTi: 'ሪያድ (ስዑዲ)', region: 'middle_east' },

  // Diaspora & Global
  { id: 'dc', label: 'Washington DC (USA)', labelTi: 'ዋሽንግተን ዲሲ', region: 'diaspora' },
  { id: 'seattle', label: 'Seattle (USA)', labelTi: 'ስያትል', region: 'diaspora' },
  { id: 'london', label: 'London (UK)', labelTi: 'ሎንዶን', region: 'diaspora' },
  { id: 'frankfurt', label: 'Frankfurt (Germany)', labelTi: 'ፍራንክፈርት', region: 'diaspora' },
  { id: 'toronto', label: 'Toronto (Canada)', labelTi: 'ቶሮንቶ', region: 'diaspora' },
  { id: 'remote', label: 'Remote / Online', labelTi: 'ሪሞት / ብኦንላይን', region: 'remote' },
];

const SAMPLE_JOB_DATABASE: JobListing[] = [
  // ==========================================
  // TIGRAY & ETHIOPIA POSITIONS
  // ==========================================
  {
    id: 'job-ngo-mekelle',
    title: 'Humanitarian Health & Nutrition Program Officer',
    titleTi: 'ሓላፊ ፕሮግራም ጥዕናን ሰብኣዊ ረድኤትን (Tigray)',
    category: 'Humanitarian / NGO',
    categoryTi: 'ሰብኣዊ ረድኤት / NGO',
    organization: 'Tigray Relief & Health Development Alliance (TRHDA)',
    location: 'Mekelle, Tigray, Ethiopia',
    locationTi: 'መቐለ፡ ትግራይ፡ ኢትዮጵያ',
    region: 'tigray',
    salary: '55,000 - 75,000 ETB / mo',
    salaryTi: '55,000 - 75,000 ብር / ወርሒ',
    type: 'Full-time / NGO Contract',
    typeTi: 'ምሉእ ግዜ / ውዕል',
    description: 'Leading community health interventions, maternal care outreach, emergency nutrition distribution, and clinical data tracking across Tigray.',
    descriptionTi: 'ኣብ ውሽጢ ትግራይ ንዝካየዱ ናይ ማሕበረሰብ ጥዕና፣ ክንክን ኣደታትን ቆልዑትን፣ ረድኤት መግብን ሕክምናን ዘወሃህድ ብቑዕ ሓላፊ።',
    requirements: ['Degree in Public Health, Nursing, or related Medical field', '2+ years humanitarian or clinical experience in Ethiopia/Tigray', 'Fluency in Tigrinya and English (Amharic advantageous)'],
    requirementsTi: ['ናይ ፐብሊክ ሄልዝ (Public Health) ወይ ነርስ ዲግሪ', 'ኣብ ትግራይ/ኢትዮጵያ 2 ዓመት ናይ ስራሕ ተመኩሮ', 'ትግርኛን እንግሊዝን ብንጹር ምዝራብ'],
    skills: ['Program Management', 'Community Health', 'Nutrition Outreach', 'Emergency Logistics', 'Tigrinya'],
    contactEmail: 'careers@trhda-mekelle.org',
    deadline: 'Rolling Intake',
    isUrgent: true,
    applyUrl: 'https://reliefweb.int/jobs?search=Tigray+Health+Officer',
    companyUrl: 'https://reliefweb.int/country/eth',
    sourcePortalName: 'ReliefWeb (UN OCHA)',
    sourcePortalUrl: 'https://reliefweb.int/jobs?search=Tigray',
  },
  {
    id: 'job-fintech-addis',
    title: 'Senior Fintech & Mobile Money Software Developer (Python/React)',
    titleTi: 'ክኢላ ሶፍትዌር ባንክን ዲጂታል ክፍሊትን (Fintech)',
    category: 'Software / IT',
    categoryTi: 'ኮዲንግ / IT',
    organization: 'Addis Fintech Hub & Telebirr Integrations',
    location: 'Addis Ababa, Ethiopia (Hybrid / Remote)',
    locationTi: 'ኣዲስ ኣበባ፡ ኢትዮጵያ (ሃይብሪድ / ብኦንላይን)',
    region: 'ethiopia',
    salary: '70,000 - 110,000 ETB / mo',
    salaryTi: '70,000 - 110,000 ብር / ወርሒ',
    type: 'Full-time Hybrid',
    typeTi: 'ምሉእ ግዜ / ሃይብሪድ',
    description: 'Building secure micro-payment gateways, USSD integrations, API architectures, and mobile banking applications for East African economies.',
    descriptionTi: 'ናይ ባንክን ሞባይል ክፍሊትን (Telebirr/CBE) ዘተኣሳስር ውሑስ ሶፍትዌርን ሞባይል ኣፕሊኬሽናትን ዘማዕብል ክኢላ ፕሮግራመር።',
    requirements: ['BS in Computer Science / Software Engineering', '3+ years experience with React/Node/Python', 'Knowledge of payment APIs and database security'],
    requirementsTi: ['ናይ ኮምፒተር ሳይንስ ወይ ሶፍትዌር ኢንጅነሪንግ ዲግሪ', 'ኣብ Python/React/Node 3 ዓመት ተመኩሮ', 'ናይ ፋይናንስን ዳታቤዝን ፍልጠት'],
    skills: ['Python', 'React', 'Mobile Money', 'REST APIs', 'PostgreSQL'],
    contactEmail: 'engineering@addisfintech.et',
    deadline: 'Open Application',
    isUrgent: true,
    applyUrl: 'https://www.ethiojobs.net/browse-by-category/Information-Technology',
    companyUrl: 'https://www.ethiojobs.net',
    sourcePortalName: 'Ethiojobs.net',
    sourcePortalUrl: 'https://www.ethiojobs.net',
  },
  {
    id: 'job-reconstruct-engineer-tigray',
    title: 'WASH & Civil Reconstruction Project Engineer',
    titleTi: 'ኢንጅነር ማይን ዳግመ ህንጸት ትሕተ-ቅርጽን (Civil Engineer)',
    category: 'Engineer',
    categoryTi: 'ኢንጅነር',
    organization: 'Tigray Infrastructure & Water Rehabilitation Bureau',
    location: 'Mekelle / Aksum / Shire, Tigray',
    locationTi: 'መቐለ / ኣክሱም / ሽረ፡ ትግራይ',
    region: 'tigray',
    salary: '60,000 - 85,000 ETB / mo',
    salaryTi: '60,000 - 85,000 ብር / ወርሒ',
    type: 'Full-time Field Project',
    typeTi: 'ምሉእ ግዜ ናይ ሜዳ ስራሕ',
    description: 'Supervising water pipeline rehabilitation, solar pump installations, school/clinic reconstructions, and structural quality assurance across Tigray towns.',
    descriptionTi: 'ናይ ጽሩይ ማይ መስመራት ምሕዳስ፣ ናይ ጸሓይ ጸዓት ፓምፓት ምግጣምን ናይ ኣብያተ-ትምህርትን ክሊኒካትን ዳግመ-ህንጸት ዝቆጻጸር ኢንጅነር።',
    requirements: ['BSc in Civil, Water Resources, or Mechanical Engineering', 'CAD & Project Management proficiency', 'Field mobility across Tigray'],
    requirementsTi: ['ናይ ሲቪል ወይ ማይ ሃፍቲ ኢንጅነሪንግ ዲግሪ', 'ናይ CADን ፕሮጀክት ማኔጅመንትን ክእለት', 'ኣብ ውሽጢ ትግራይ ናይ ምንቅስቓስ ድልውነት'],
    skills: ['Civil Engineering', 'WASH Systems', 'AutoCAD', 'Site Inspection', 'Solar Pumping'],
    contactEmail: 'rebuild@tigrayinfra.gov.et',
    deadline: 'Immediate Openings',
    isUrgent: true,
    applyUrl: 'https://reliefweb.int/jobs?search=Tigray+Civil+Engineer',
    companyUrl: 'https://www.devex.com/jobs',
    sourcePortalName: 'Devex & ReliefWeb',
    sourcePortalUrl: 'https://reliefweb.int/jobs?search=Tigray',
  },
  {
    id: 'job-translator-addis',
    title: 'Senior Bilingual Translator & Communications Specialist',
    titleTi: 'ክኢላ ትርጉምን ርክባትን (ትግርኛ / ኣምሓርኛ / እንግሊዝኛ)',
    category: 'Bilingual Translator',
    categoryTi: 'ተርጓሚ (Tigrinya/Amharic/Eng)',
    organization: 'Pan-African & International Development Agency',
    location: 'Addis Ababa, Ethiopia',
    locationTi: 'ኣዲስ ኣበባ፡ ኢትዮጵያ',
    region: 'ethiopia',
    salary: '$1,600 - $2,500 / mo',
    salaryTi: '$1,600 - $2,500 / ወርሒ',
    type: 'Full-time Contract',
    typeTi: 'ምሉእ ግዜ ውዕል',
    description: 'Translating official policy documentation, reports, press briefs, and legal transcripts between Tigrinya, Amharic, and English.',
    descriptionTi: 'ወግዓውያን ሰነዳት፣ ጸብጻባትን ናይ ሕጊ ጽሑፋትን ካብን ናብን ትግርኛ፣ ኣምሓርኛን እንግሊዝኛን ብልዑል ጽሬት ዝትርጉም ክኢላ።',
    requirements: ['BA in Linguistics, Literature, or International Relations', 'Flawless written and oral fluency in Tigrinya, Amharic, and English', 'CAT tool familiarity'],
    requirementsTi: ['ናይ ቋንቋታት ወይ ስነ-ጽሑፍ ዲግሪ', 'ብትግርኛ፣ ኣምሓርኛን እንግሊዝን ምሉእ ብቕዓት ጽሑፍን ንግግርን', 'ናይ ትርጉም ሶፍትዌር ክእለት'],
    skills: ['Tigrinya', 'Amharic', 'English', 'Document Translation', 'Proofreading'],
    contactEmail: 'communications@panafricanhub.org',
    deadline: 'Next Cycle',
    isUrgent: false,
    applyUrl: 'https://careers.un.org/lbw/jobsearch.aspx',
    companyUrl: 'https://au.int/en/vacancies',
    sourcePortalName: 'UN & AU Careers',
    sourcePortalUrl: 'https://careers.un.org',
  },
  {
    id: 'job-agri-aksum',
    title: 'Sustainable Agriculture & Food Security Field Coordinator',
    titleTi: 'ክኢላ ዘላቒ ሕርሻን ድሕንነት መግብን (Agriculture)',
    category: 'Agriculture / Food',
    categoryTi: 'ሕርሻን ቀረብ መግብን',
    organization: 'Tigray Green Harvest Initiative',
    location: 'Aksum & Adwa, Tigray, Ethiopia',
    locationTi: 'ኣክሱም / ዓድዋ፡ ትግራይ፡ ኢትዮጵያ',
    region: 'tigray',
    salary: '45,000 - 62,000 ETB / mo',
    salaryTi: '45,000 - 62,000 ብር / ወርሒ',
    type: 'Full-time',
    typeTi: 'ምሉእ ግዜ',
    description: 'Empowering local farmers with modern irrigation techniques, drought-resistant seeds, crop rotation planning, and cooperative marketing.',
    descriptionTi: 'ንሓረስቶት ዘመናዊ ናይ መስኖ ቴክኖሎጂ፣ ዝተመሓየሹ ዘርእታትን ምሕደራ መሬትን ብምምሃር ናይ ምህርቲ ዓቕሚ ዘዕቢ ክኢላ ሕርሻ።',
    requirements: ['BSc in Agriculture, Agronomy, or Rural Development', 'Field experience with rural farming communities', 'Passionate about food sovereignty'],
    requirementsTi: ['ናይ ሕርሻ ወይ ገጠር ልምዓት ዲግሪ', 'ምስ ሓረስቶት ዝተገብረ ናይ ስራሕ ተመኩሮ', 'ተወፋይነት ንምዕባለ ሕርሻ'],
    skills: ['Agronomy', 'Drip Irrigation', 'Soil Management', 'Community Mobilization'],
    contactEmail: 'info@tigraygreenharvest.org',
    deadline: 'Rolling Intake',
    isUrgent: false,
    applyUrl: 'https://www.ethiojobs.net/browse-by-category/Agriculture',
    companyUrl: 'https://www.fao.org/ethiopia',
    sourcePortalName: 'Ethiojobs / FAO',
    sourcePortalUrl: 'https://www.ethiojobs.net',
  },
  {
    id: 'job-lecturer-mekelle',
    title: 'University Lecturer / STEM & Computer Science Instructor',
    titleTi: 'መምህር ዩኒቨርሲቲ STEMን ኮምፒተር ሳይንስን (Mekelle)',
    category: 'Teacher / Lecturer',
    categoryTi: 'መምህር',
    organization: 'Mekelle Institute of Technology & Higher Learning',
    location: 'Mekelle, Tigray, Ethiopia',
    locationTi: 'መቐለ፡ ትግራይ፡ ኢትዮጵያ',
    region: 'tigray',
    salary: '40,000 - 60,000 ETB / mo',
    salaryTi: '40,000 - 60,000 ብር / ወርሒ',
    type: 'Full-time Academic',
    typeTi: 'ምሉእ ግዜ ኣካዳሚክ',
    description: 'Delivering undergraduate coursework in programming, algorithms, database systems, and mentoring student senior capstone projects.',
    descriptionTi: 'ንተምሃሮ ዩኒቨርሲቲ ፕሮግራሚንግ፣ ዳታቤዝን ኣልጎሪዝምን ዘምህርን ንተመራመርቲ ፕሮጀክትታት ዘወሃህድን መምህር።',
    requirements: ['MSc or BSc in Computer Science, Software Engineering, or IT', 'Prior teaching or TA experience', 'Commitment to youth empowerment'],
    requirementsTi: ['ናይ ማስተርስ ወይ ባችለር ዲግሪ ኣብ CS/IT', 'ናይ ምምሃር ተመኩሮ', 'ንመንእሰያት ናይ ምድጋፍ ድሌት'],
    skills: ['Teaching', 'Algorithms', 'Data Structures', 'Python/Java', 'Mentorship'],
    contactEmail: 'academics@mit-mekelle.edu.et',
    deadline: 'Academic Semester Start',
    isUrgent: false,
    applyUrl: 'http://www.mu.edu.et',
    companyUrl: 'http://www.mu.edu.et',
    sourcePortalName: 'Mekelle University Portal',
    sourcePortalUrl: 'http://www.mu.edu.et',
  },
  {
    id: 'job-driver-shire',
    title: 'Emergency Relief Logistics & Heavy Fleet Driver',
    titleTi: 'መራሕ መጓዓዝያን ረድኤትን (Heavy Transport Driver)',
    category: 'Driver / Logistics',
    categoryTi: 'መራሕ ማኪና',
    organization: 'Tigray Cross-Border Logistics Consortium',
    location: 'Shire / Mekelle / Gondar Route, Tigray/Ethiopia',
    locationTi: 'ሽረ / መቐለ / መገዲ ኢትዮጵያን ትግራይን',
    region: 'tigray',
    salary: '35,000 - 50,000 ETB / mo + Per Diem',
    salaryTi: '35,000 - 50,000 ብር + መዓልታዊ ክፍሊት',
    type: 'Full-time Logistics',
    typeTi: 'ምሉእ ግዜ መጓዓዝያ',
    description: 'Safe freight and relief distribution transport across Northern Ethiopian routes with complete safety protocols and vehicle maintenance.',
    descriptionTi: 'ናይ ረድኤት ኣቕሑትን ንብረትን ብደሓን ዘመላልስ፣ ጽሩይ ናይ ምምራሕ ታሪኽን ልዑል ተመኩሮን ዘለዎ መራሕ ማኪና።',
    requirements: ['Valid Heavy Vehicle / Truck Commercial Driver License', '3+ years interstate/regional driving experience', 'Clean safety record'],
    requirementsTi: ['ናይ ከበድቲ መካይን ፍቓድ ምምራሕ', 'ኣብ ነዋሕቲ መገዲ 3 ዓመት ተመኩሮ', 'ሕጊ መገዲ ዝሕሉ'],
    skills: ['Heavy Truck Driving', 'Route Planning', 'Vehicle Inspection', 'Safety Compliance'],
    contactEmail: 'fleet@tigraylogistics.org',
    deadline: 'Immediate Openings',
    isUrgent: true,
    applyUrl: 'https://www.wfp.org/careers',
    companyUrl: 'https://www.wfp.org',
    sourcePortalName: 'WFP Logistics Hub',
    sourcePortalUrl: 'https://www.wfp.org/careers',
  },

  // ==========================================
  // ERITREA POSITIONS
  // ==========================================
  {
    id: 'job-doctor-asmara',
    title: 'General Practitioner Physician (Clinical & Diagnostics)',
    titleTi: 'ሓኪም ሓፈሻዊ ሕክምና (ክሊኒክን መርመራን)',
    category: 'Doctor',
    categoryTi: 'ሕክምናን ጥዕናን',
    organization: 'Central Regional Health Services',
    location: 'Asmara, Eritrea',
    locationTi: 'ኣስመራ፡ ኤርትራ',
    region: 'eritrea',
    salary: '25,000 - 35,000 ERN / mo',
    salaryTi: '25,000 - 35,000 ናቕፋ / ወርሒ',
    type: 'Full-time',
    typeTi: 'ምሉእ ግዜ',
    description: 'Conducting patient diagnoses, preventive medical counseling, outpatient consultations, and emergency health treatments.',
    descriptionTi: 'መርመራ ሕሙማት፣ ናይ ጥዕና ምኽሪን ናይ ህጹጽ ረድኤት ሕክምናዊ ኣገልግሎትን ዝህብ ብቑዕ ሓኪም።',
    requirements: ['Medical Degree (MD / MBBS)', 'Valid Medical Board Registration in Eritrea', 'Strong diagnostic acumen'],
    requirementsTi: ['ናይ ሕክምና ዲግሪ (MD)', 'ናይ ቦርድ ፍቓድ ምስክር', 'ጽቡቕ ናይ ምርመራ ክእለት'],
    skills: ['Diagnostics', 'Clinical Care', 'Emergency Response', 'Patient Counseling'],
    contactEmail: 'health@asmaramedical.org',
    deadline: 'Active Cycle',
    isUrgent: false,
    applyUrl: 'https://www.who.int/careers',
    companyUrl: 'https://www.afro.who.int/countries/eritrea',
    sourcePortalName: 'WHO Health Careers',
    sourcePortalUrl: 'https://www.who.int/careers',
  },

  // ==========================================
  // DIASPORA & INTERNATIONAL POSITIONS
  // ==========================================
  {
    id: 'job-nurse-dc',
    title: 'Registered Nurse (Healthcare & Geriatric Support)',
    titleTi: 'ነርስ ሓፈሻዊ ሕክምናን ክንክን ኣረጋውያንን',
    category: 'Nurse',
    categoryTi: 'ሕክምናን ጥዕናን',
    organization: 'MedStar & Community Health Alliance',
    location: 'Washington DC, USA',
    locationTi: 'ዋሽንግተን ዲሲ፡ ኣሜሪካ',
    region: 'diaspora',
    salary: '$38.00 - $48.00 / hr',
    salaryTi: '$38 - $48 / ሰዓት',
    type: 'Full-time / Part-time',
    typeTi: 'ምሉእ / ክፍሊ ግዜ',
    description: 'Providing direct patient care, medication administration, and culturally sensitive geriatric assistance for diverse community members.',
    descriptionTi: 'ንሕሙማት ምሉእ ሕክምናዊ ክንክን፣ ምምሕዳር መድሃኒትን ንኣረጋውያን ዝግበር ሰብኣዊ ሓገዝን ዝህብ ብቑዕ ነርስ።',
    requirements: ['RN License or equivalent certification', 'CPR / First Aid certification', 'Bilingual Tigrinya/English preferred'],
    requirementsTi: ['ናይ ነርስ ሰርቲፊኬት ወይ ፍቓድ', 'CPR ናይ ህጹጽ ረድኤት ምስክር ወረቐት', 'ትግርኛን እንግሊዝን ምዝራብ ተመራጺ እዩ'],
    skills: ['Patient Care', 'Medication Management', 'Geriatric Support', 'Documentation'],
    contactEmail: 'careers@medstar-health.org',
    deadline: 'Rolling Intake',
    isUrgent: true,
    applyUrl: 'https://www.medstarhealth.org/careers',
    companyUrl: 'https://www.medstarhealth.org',
    sourcePortalName: 'MedStar Portal',
    sourcePortalUrl: 'https://www.medstarhealth.org/careers',
  },
  {
    id: 'job-software-remote',
    title: 'Full-Stack Software Engineer (React / TypeScript / Python)',
    titleTi: 'ኢንጅነር ሶፍትዌር (React / Node / AI - Global)',
    category: 'Software / IT',
    categoryTi: 'ኮዲንግ / IT',
    organization: 'Sovereign Digital Systems / Remote Hub',
    location: 'Remote / Worldwide',
    locationTi: 'ሪሞት / ብኦንላይን',
    region: 'remote',
    salary: '$4,500 - $6,500 / mo',
    salaryTi: '$4,500 - $6,500 / ወርሒ',
    type: 'Full-time Remote',
    typeTi: 'ምሉእ ግዜ ብኦንላይን',
    description: 'Developing high-performance bilingual AI tools, cloud services, and scalable web interfaces for global institutions.',
    descriptionTi: 'ዓለምለኸ ደረጃ ዘለዎም ናይ AI ሶፍትዌር፣ ዌብሳይታትን ዳታቤዝን ዘማዕብል ክኢላ ፕሮግራመር።',
    requirements: ['3+ years in React, TypeScript, and Node.js', 'Experience with REST/GraphQL APIs', 'Clean code & git collaboration'],
    requirementsTi: ['ኣብ Reactን TypeScriptን 3 ዓመት ተመኩሮ', 'ናይ APIን Cloudን ፍልጠት', 'ብቑዕ ናይ ጊት (Git) ስራሕ'],
    skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AI Integration'],
    contactEmail: 'engineering@sovereigndigital.io',
    deadline: 'Within 30 Days',
    isUrgent: false,
    applyUrl: 'https://weworkremotely.com/categories/remote-front-end-programming-jobs',
    companyUrl: 'https://weworkremotely.com',
    sourcePortalName: 'We Work Remotely',
    sourcePortalUrl: 'https://weworkremotely.com',
  },
  {
    id: 'job-driver-dubai',
    title: 'Logistics & Executive Transport Chauffeur',
    titleTi: 'መራሕ ማኪና ናይ ንግድን መጓዓዝያን (Transport)',
    category: 'Driver / Logistics',
    categoryTi: 'መራሕ ማኪና',
    organization: 'Gulf Sovereign Logistics',
    location: 'Dubai, UAE',
    locationTi: 'ዱባይ፡ ሕቡራት ኢማራት',
    region: 'middle_east',
    salary: '4,500 - 6,000 AED / mo + Housing',
    salaryTi: '4,500 - 6,000 ዲርሃም + መንበሪ',
    type: 'Full-time',
    typeTi: 'ምሉእ ግዜ',
    description: 'Safe transportation of clients and freight across metropolitan UAE with GPS navigation and vehicle maintenance oversight.',
    descriptionTi: 'ኣብ ውሽጢ ዱባይን ከባቢኣን ንግስቲ መጓዓዝያ፣ ኣቕሑትን ሰባትን ብደሓን ዘመላልስ ዘተኣማምን መራሕ ማኪና።',
    requirements: ['Valid UAE Driving License (Light/Heavy)', 'Clean driving record', 'Punctual & courteous'],
    requirementsTi: ['ናይ ዱባይ/UAE ናይ ምምራሕ ፍቓድ', 'ጽሩይ ናይ ምምራሕ ታሪኽ', 'ሰዓቱ ዝሕሉ'],
    skills: ['Safe Driving', 'Route Navigation', 'Vehicle Inspection', 'Customer Service'],
    contactEmail: 'hr@gulfsovereign.ae',
    deadline: 'Rolling Intake',
    isUrgent: true,
    applyUrl: 'https://www.bayt.com/en/uae/jobs/locations/dubai/',
    companyUrl: 'https://www.bayt.com',
    sourcePortalName: 'Bayt.com UAE',
    sourcePortalUrl: 'https://www.bayt.com/en/uae/jobs',
  },
  {
    id: 'job-cleaner-london',
    title: 'Commercial & Facility Hygiene Specialist',
    titleTi: 'ናይ ትካላትን ህንጻታትን ጽሬት ክኢላ',
    category: 'Cleaning',
    categoryTi: 'ጽሬት',
    organization: 'Apex Clean Facilities UK',
    location: 'London, UK',
    locationTi: 'ሎንዶን፡ ዓዲ እንግሊዝ',
    region: 'diaspora',
    salary: '£13.50 - £16.00 / hr',
    salaryTi: '£13.50 - £16.00 / ሰዓት',
    type: 'Full-time / Flexible',
    typeTi: 'ምሉእ / ተዓጻጻፊ ግዜ',
    description: 'Maintaining pristine hygiene standards in modern commercial offices, high-traffic venues, and institutional campuses.',
    descriptionTi: 'ኣብ ዓበይቲ ህንጻታትን ቢሮታትን ልዑል ጽሬትን ጽሬታዊ ኲነታትን ዝሕሉ ጻዕረኛ ሰራሕተኛ።',
    requirements: ['Right to work in the UK', 'Reliability and punctuality', 'Basic safety compliance'],
    requirementsTi: ['ኣብ ዓዲ እንግሊዝ ናይ ምስራሕ ፍቓድ', 'ሰዓቱ ዝሕሉን እሙንን', 'ናይ ደሕንነት መምርሒታት ምኽባር'],
    skills: ['Commercial Cleaning', 'Sanitization', 'Equipment Care', 'Teamwork'],
    contactEmail: 'recruitment@apexclean.co.uk',
    deadline: 'Immediate Openings',
    isUrgent: true,
    applyUrl: 'https://www.indeed.co.uk/jobs?q=cleaner&l=London',
    companyUrl: 'https://www.indeed.co.uk',
    sourcePortalName: 'Indeed UK',
    sourcePortalUrl: 'https://www.indeed.co.uk',
  },
];

export const JobSearchModal: React.FC<JobSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPromptForChat,
}) => {
  const { language } = useLanguage();
  
  // Navigation View State
  const [currentView, setCurrentView] = useState<'search' | 'heatmap' | 'results' | 'portals' | 'cv-builder' | 'interview'>('search');
  const [showResultsHeatmap, setShowResultsHeatmap] = useState(false);
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);
  const [selectedPortalCategory, setSelectedPortalCategory] = useState<'all' | 'tigray_ethiopia' | 'humanitarian' | 'remote' | 'gulf' | 'global'>('all');
  const [portalSearchQuery, setPortalSearchQuery] = useState('');
  
  // Search Form State
  const [jobQuery, setJobQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedJobChip, setSelectedJobChip] = useState<string | null>(null);
  const [selectedLocationChip, setSelectedLocationChip] = useState<string | null>(null);
  const [activeRegionFilter, setActiveRegionFilter] = useState<'all' | 'tigray_ethiopia' | 'eritrea' | 'diaspora_global'>('all');

  // Search execution states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobListing[]>(SAMPLE_JOB_DATABASE);
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asmera_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // CV Builder State
  const [cvTargetRole, setCvTargetRole] = useState('');
  const [cvApplicantName, setCvApplicantName] = useState('');
  const [generatedCv, setGeneratedCv] = useState<string | null>(null);
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);
  const [copiedCv, setCopiedCv] = useState(false);

  // Interview Coach State
  const [interviewRole, setInterviewRole] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState<Array<{ q: string; qTi: string; tips: string; tipsTi: string }>>([]);

  if (!isOpen) return null;

  const handleSelectJobChip = (chip: typeof JOB_PROFESSION_SUGGESTIONS[0]) => {
    const value = language === 'ti' ? chip.labelTi : chip.label;
    if (selectedJobChip === chip.id) {
      setSelectedJobChip(null);
      setJobQuery('');
    } else {
      setSelectedJobChip(chip.id);
      setJobQuery(value);
    }
  };

  const handleSelectLocationChip = (chip: typeof JOB_LOCATION_SUGGESTIONS[0]) => {
    const value = language === 'ti' ? chip.labelTi : chip.label;
    if (selectedLocationChip === chip.id) {
      setSelectedLocationChip(null);
      setLocationQuery('');
    } else {
      setSelectedLocationChip(chip.id);
      setLocationQuery(value);
    }
  };

  const handleExecuteSearch = (customLocation?: string, customJobQuery?: string) => {
    setIsSearching(true);
    setCurrentView('results');

    const effectiveLocation = customLocation !== undefined ? customLocation : locationQuery;
    const effectiveJob = customJobQuery !== undefined ? customJobQuery : jobQuery;

    setTimeout(() => {
      let filtered = SAMPLE_JOB_DATABASE;

      if (effectiveJob.trim()) {
        const q = effectiveJob.toLowerCase();
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(q) ||
          j.titleTi.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.categoryTi.toLowerCase().includes(q) ||
          j.skills.some(s => s.toLowerCase().includes(q))
        );
      }

      if (effectiveLocation.trim()) {
        const loc = effectiveLocation.toLowerCase();
        
        // Intelligent Regional & Country Synonyms Mapping
        const isTigraySearch = loc.includes('tigray') || loc.includes('ትግራይ') || loc.includes('mekelle') || loc.includes('መቐለ') || loc.includes('aksum') || loc.includes('ኣክሱም') || loc.includes('adwa') || loc.includes('ዓድዋ') || loc.includes('shire') || loc.includes('ሽረ') || loc.includes('abi adi') || loc.includes('ዓቢ ዓዲ') || loc.includes('tembien') || loc.includes('ተምቤን');
        const isEthiopiaSearch = loc.includes('ethiopia') || loc.includes('ኢትዮጵያ') || loc.includes('addis') || loc.includes('ኣዲስ') || loc.includes('bahir') || loc.includes('ባህር') || loc.includes('hawassa') || loc.includes('ሃዋሳ') || isTigraySearch;
        const isEritreaSearch = loc.includes('eritrea') || loc.includes('ኤርትራ') || loc.includes('asmara') || loc.includes('ኣስመራ') || loc.includes('keren') || loc.includes('ከረን');

        filtered = filtered.filter(j => {
          const directMatch = j.location.toLowerCase().includes(loc) || j.locationTi.toLowerCase().includes(loc);
          if (directMatch) return true;

          if (isTigraySearch && j.region === 'tigray') return true;
          if (isEthiopiaSearch && (j.region === 'ethiopia' || j.region === 'tigray')) return true;
          if (isEritreaSearch && j.region === 'eritrea') return true;

          return false;
        });
      }

      // If no match found, show all database with top relevancy
      if (filtered.length === 0) {
        filtered = SAMPLE_JOB_DATABASE;
      }

      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectLocationFromHeatmap = (locationName: string) => {
    setLocationQuery(locationName);
    setSelectedLocationChip(null);
    handleExecuteSearch(locationName);
  };

  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const updated = prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId];
      try {
        localStorage.setItem('asmera_saved_jobs', JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });
  };

  const handleCopyJobLink = (job: JobListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      navigator.clipboard.writeText(job.applyUrl || window.location.href);
      setCopiedJobId(job.id);
      setTimeout(() => setCopiedJobId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenDirectApply = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenCvBuilderForJob = (job: JobListing) => {
    setCvTargetRole(language === 'ti' ? job.titleTi : job.title);
    setCurrentView('cv-builder');
  };

  const handleOpenInterviewCoachForJob = (job: JobListing) => {
    setInterviewRole(language === 'ti' ? job.titleTi : job.title);
    setInterviewQuestions([
      {
        q: `Can you walk us through your background and why you are suited for the ${job.title} role at ${job.organization}?`,
        qTi: `ናይ ስራሕ ተመኩሮኻን ስለምንታይ ነዚ ኣብ ${job.organization} ዘሎ ${job.titleTi} ዘድሊ ብቕዓት ከም ዘለካን ክትገልጸልና ትኽእል፧`,
        tips: `Highlight measurable field accomplishments, localized communication skills, and commitment to institutional impact.`,
        tipsTi: `ዘካየድካዮም ዓበይቲ ፕሮጀክትታት፣ ናይ ማሕበረሰብ ርክብን ተወፋይነትካን ብንጹር ኣጉልሕ።`,
      },
      {
        q: `How do you adapt to dynamic field conditions or operational deadlines?`,
        qTi: `ኣብ ግዜ ተቐያያሪ ኲነታትን ጸቕጢ ስራሕን ብኸመይ ትዋጻእ፧`,
        tips: `Use the STAR method: Situation, Task, Action, Result. Emphasize calm problem-solving and collaboration.`,
        tipsTi: `ብህድኣት ፍታሕ ምንዳይ፣ ቀዳምነታት ምሓዝን ብግልጺ ምርድዳእን ከም ቀንዲ ሜላኻ ግለጽ።`,
      },
      {
        q: `What motivated you to apply for work in ${job.location}?`,
        qTi: `ኣብ ${job.locationTi} ንምስራሕ እንታይ ደሪኹካ፧`,
        tips: `Demonstrate your cultural familiarity and genuine dedication to community progress in this location.`,
        tipsTi: `ነቲ ከባቢ ዘለካ ፍቕርን ንህዝቢ ንምግልጋል ዘለካ ድልውነትን ብልቢ ግለጽ።`,
      },
    ]);
    setCurrentView('interview');
  };

  const handleGenerateCv = () => {
    setIsGeneratingCv(true);
    setTimeout(() => {
      const name = cvApplicantName.trim() || (language === 'ti' ? 'ዮናስ ተስፋይ' : 'Yonas Tesfay');
      const role = cvTargetRole.trim() || (language === 'ti' ? 'ክኢላ ስራሕ' : 'Professional Specialist');

      const template = language === 'ti'
        ? `📄 **ሞያዊ CV (Resume) - ${name}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **ዒላማ ሞያ**: ${role}
📍 **ቦታ**: ኢትዮጵያ / ትግራይ / ኤርትራ / ዲያስፖራ
📧 **ኢመይል**: ${name.toLowerCase().replace(/\s+/g, '')}@gmail.com | 📱 +251 91 123 4567

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ **ሞያዊ መግለጺ (Professional Summary)**
ውፉይ፣ ጻዕረኛን ኣብ ${role} ልዑል ተመኩሮን ዘለዎ ሰብ ሞያ። ንስራሕ ብቕልጡፍ ናይ ምልማድን ኣብ ጉጅለ ብውጽኢታዊ ኣገባብ ናይ ምስራሕ ክእለት ዘለዎ።

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 **ናይ ስራሕ ተመኩሮ (Work Experience)**
• **ቀንዲ ሰብ ሞያ (${role})** | 2021 – ሕጂ
  - መዓልታዊ ዕማማት ብልዑል ጽሬትን ቅልጣፈን ምፍጻም።
  - ናይ ተጠቃሚ/ሕሙም/ዓሚል ዕግበት ብ 95% ምዕባይ።
  - ምስ ሓለፍቲ ስራሕ ብምውህሃድ ናይ ስራሕ ውጽኢት ምዕባይ።

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 **ትምህርትን ስልጠናን (Education & Certifications)**
• ባችለር ዲግሪ / ዲፕሎማ ኣብ ዝምልከቶ ዓውዲ
• ወግዓዊ ናይ ሞያን ደሕንነትን ምስክር ወረቐት (Certified & Licensed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ **ቀንዲ ክእለታት (Key Core Skills)**
• ቋንቋታት: ትግርኛ (ዓፍራ) | ኣምሓርኛ (ብቑዕ) | እንግሊዝኛ (ብቑዕ)
• ግዜ ምሕደራን ጸገማት ምፍታሕን
• ናይ ቴክኖሎጂን ኮምፒተርን ኣጠቓቕማ`
        : `📄 **PROFESSIONAL RESUME (CV) - ${name}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **Target Role**: ${role}
📍 **Location**: Ethiopia / Tigray / Eritrea / Global Remote
📧 **Email**: ${name.toLowerCase().replace(/\s+/g, '')}@example.com | 📱 +251 91 123 4567

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ **PROFESSIONAL SUMMARY**
Results-driven, adaptable, and dedicated professional with proven expertise in ${role}. Known for exceptional work ethic, clear multilingual communication, and high-impact execution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 **WORK EXPERIENCE**
• **Senior Specialist - ${role}** | 2021 – Present
  - Executed daily operations with 99% accuracy and compliance to industry standards.
  - Streamlined team workflow reducing turnaround time by 25%.
  - Mentored junior staff and maintained outstanding client/stakeholder satisfaction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 **EDUCATION & CERTIFICATIONS**
• Bachelor's Degree / Accredited Professional Diploma
• Professional Industry Licensing & Safety Certifications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ **CORE COMPETENCIES**
• Multilingual: English (Fluent), Tigrinya (Native), Amharic (Fluent)
• Crisis & Time Management
• Quality Assurance & Workflow Optimization`;

      setGeneratedCv(template);
      setIsGeneratingCv(false);
    }, 900);
  };

  const handleCopyCv = () => {
    if (generatedCv) {
      navigator.clipboard.writeText(generatedCv);
      setCopiedCv(true);
      setTimeout(() => setCopiedCv(false), 2000);
    }
  };

  const handleSendJobToAiChat = (job: JobListing) => {
    if (onSelectPromptForChat) {
      const prompt = language === 'ti'
        ? `እባክኻ ንስራሕ "${job.titleTi}" (${job.organization} ኣብ ${job.locationTi}) ከመይ ጌረ ከም ዘመልክት፣ ዘድልዩ ሰነዳትን ናይ ቃለ-መሕትት ምኽርን ብትግርኛን እንግሊዝን ኣዳልወለይ።`
        : `Please give me a complete application blueprint for the position: "${job.title}" at ${job.organization} in ${job.location}. Include customized resume bullet points, cover letter, and interview tips.`;
      onSelectPromptForChat(prompt);
      onClose();
    }
  };

  // Filter suggestion locations based on active region tab
  const displayedLocationChips = JOB_LOCATION_SUGGESTIONS.filter(chip => {
    if (activeRegionFilter === 'all') return true;
    if (activeRegionFilter === 'tigray_ethiopia') return chip.region === 'tigray' || chip.region === 'ethiopia';
    if (activeRegionFilter === 'eritrea') return chip.region === 'eritrea';
    if (activeRegionFilter === 'diaspora_global') return chip.region === 'diaspora' || chip.region === 'middle_east' || chip.region === 'remote';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] border border-slate-200 dark:border-[#8E6D28]/60 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[94vh] transition-all">
        
        {/* ========================================================================= */}
        {/* TOP NAVIGATION BAR MATCHING SCREENSHOT                                    */}
        {/* ========================================================================= */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0F1423] flex items-center justify-between sticky top-0 z-20">
          
          {/* Back button with circle */}
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'search') {
                setCurrentView('search');
              } else {
                onClose();
              }
            }}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered Title */}
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              {language === 'ti' ? 'ስራሕ ድለ' : 'Job Search'}
            </h2>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
              {language === 'ti' ? 'ትግራይ • ኢትዮጵያ • ኤርትራ • ዓለምለኸ' : 'Tigray • Ethiopia • Eritrea • Global'}
            </div>
          </div>

          {/* Close button on right */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-xs transition-all cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-[#0C101C] p-1.5 gap-1 text-xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setCurrentView('search')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'search'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'ti' ? 'ምድላይ' : 'Search'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('heatmap')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap relative ${
              currentView === 'heatmap'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-300 shadow-xs'
                : 'text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{language === 'ti' ? 'ካርታ ዕድላት' : 'Heatmap'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </button>
          
          <button
            type="button"
            onClick={() => setCurrentView('results')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'results'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{language === 'ti' ? 'ስራሓት' : 'Jobs'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              {searchResults.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('portals')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap relative ${
              currentView === 'portals'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-300 shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'ti' ? 'መላግቦታት' : 'Links & Portals'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('cv-builder')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'cv-builder'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'ti' ? 'ምድላው CV' : 'AI Resume'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('interview')}
            className={`flex-1 py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              currentView === 'interview'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'ti' ? 'ቃለ-መሕትት' : 'Coach'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: SEARCH SCREEN (MATCHING USER SCREENSHOT EXACTLY)                   */}
        {/* ========================================================================= */}
        {currentView === 'search' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
            
            {/* White Rounded Hero Card matching screenshot */}
            <div className="bg-white dark:bg-[#121626] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs text-center relative overflow-hidden">
              
              {/* Briefcase Icon in Circular Container */}
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
                <Briefcase className="w-7 h-7" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {language === 'ti' ? 'ኣክሱማይት AI ሓጋዚ ስራሕ' : 'Axumite AI Career & Job Search'}
              </h3>

              {/* Paragraph text */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                {language === 'ti' 
                  ? "እንታይ ዓይነት ስራሕን ኣብየናይ ቦታን (ትግራይ፣ ኢትዮጵያ፣ ኤርትራ ወይ ዲያስፖራ) ከም እትደሊ ን 'ኣክሱማይት AI' ንገሮ። ንሱ ድማ በቲ ዓሚቝ ናይ ምድላይ ክእለቱ ተጠቒሙ፡ ንዓኻ ዝሰማማዕን ኣብ ከባቢኻ ዝርከብን ክፍት ናይ ስራሕ ዕድላት ከናድየልካ እዩ።"
                  : "Tell 'Axumite AI' what type of work and location (Tigray, Ethiopia, Eritrea, or Diaspora) you are looking for. Powered by intelligent search, it will locate matching job openings and vacancies."}
              </p>
            </div>

            {/* Field 1: Job Type / Profession (ዓይነት ስራሕ / ሞያ) */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 px-1">
                {language === 'ti' ? 'ዓይነት ስራሕ / ሞያ' : 'Job Type / Profession'}
              </label>

              {/* Input container with User icon */}
              <div className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={jobQuery}
                  onChange={(e) => {
                    setJobQuery(e.target.value);
                    setSelectedJobChip(null);
                  }}
                  placeholder={language === 'ti' ? 'ንኣብነት፡ ጽሬት, ሓኪም, መምህር, NGO, ኢንጅነር...' : 'e.g. Doctor, Nurse, NGO Officer, Engineer, Cleaner...'}
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                />
                {jobQuery && (
                  <button
                    type="button"
                    onClick={() => { setJobQuery(''); setSelectedJobChip(null); }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Profession Suggestion Chips Row */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {JOB_PROFESSION_SUGGESTIONS.map((chip) => {
                  const isSelected = selectedJobChip === chip.id || jobQuery.toLowerCase() === (language === 'ti' ? chip.labelTi : chip.label).toLowerCase();
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleSelectJobChip(chip)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      {language === 'ti' ? chip.labelTi : chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 2: Location / City (ቦታ / ከተማ) with Ethiopia & Tigray Support */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ti' ? 'ቦታ / ከተማ' : 'Location / City'}
                </label>
                
                {/* Region Filter Chips */}
                <div className="flex items-center space-x-1 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setActiveRegionFilter('all')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      activeRegionFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {language === 'ti' ? 'ኩሉ' : 'All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRegionFilter('tigray_ethiopia')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      activeRegionFilter === 'tigray_ethiopia'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {language === 'ti' ? 'ትግራይን ኢትዮጵያን' : 'Tigray & Ethiopia'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRegionFilter('eritrea')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      activeRegionFilter === 'eritrea'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {language === 'ti' ? 'ኤርትራ' : 'Eritrea'}
                  </button>
                </div>
              </div>

              {/* Input container with MapPin icon */}
              <div className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex items-center space-x-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setSelectedLocationChip(null);
                  }}
                  placeholder={language === 'ti' ? 'ንኣብነት፡ መቐለ, ኣዲስ ኣበባ, ትግራይ, ኣስመራ, ሎንዶን...' : 'e.g. Mekelle, Addis Ababa, Tigray, Asmara, London...'}
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                />
                {locationQuery && (
                  <button
                    type="button"
                    onClick={() => { setLocationQuery(''); setSelectedLocationChip(null); }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Location Suggestion Chips Row */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {displayedLocationChips.map((chip) => {
                  const isSelected = selectedLocationChip === chip.id || locationQuery.toLowerCase() === (language === 'ti' ? chip.labelTi : chip.label).toLowerCase();
                  const isTigrayOrEthio = chip.region === 'tigray' || chip.region === 'ethiopia';
                  
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleSelectLocationChip(chip)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : isTigrayOrEthio
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500'
                            : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {language === 'ti' ? chip.labelTi : chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Search Button */}
            <div className="pt-3 space-y-3">
              <button
                type="button"
                onClick={() => handleExecuteSearch()}
                className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:brightness-110 text-white font-black text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>{language === 'ti' ? 'ስራሕ ድለ' : 'Search Jobs'}</span>
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Geo-Spatial Heatmap Teaser Card */}
              <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 dark:from-amber-950/30 dark:via-emerald-950/20 dark:to-blue-950/30 border border-amber-500/30 dark:border-amber-500/20 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {language === 'ti' ? 'ካርታ ዕድላት ስራሕ (ኢትዮጵያን ትግራይን)' : 'Interactive Job Heatmap & Geo-Overlay'}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                        HOTSPOTS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {language === 'ti' 
                        ? 'ኣብ መቐለ፣ ኣክሱም፣ ዓድዋ፣ ሽረ፣ ኣዲስ ኣበባን ካልኦትን ዘለዉ ክፍት ስራሓትን ጽዓት ዕድላትን ብካርታ ተመልከቱ።' 
                        : 'Explore geographical opportunity density across Tigray hubs and Ethiopian industrial zones.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView('heatmap')}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>{language === 'ti' ? 'ካርታ ርአ' : 'Explore Map'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct Job Portal Links Teaser */}
              <div className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {language === 'ti' ? 'ቀጥታዊ ናይ ስራሕ መላግቦታት (Job Portals)' : 'Direct Application Portals & Job Links'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView('portals')}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{language === 'ti' ? 'ኩሎም ርአ' : 'View all'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EXTERNAL_JOB_PORTALS.slice(0, 4).map((portal) => (
                    <a
                      key={portal.id}
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                          {portal.name}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                      </div>
                      <span className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
                        {portal.badge}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: DEDICATED REGIONAL JOB HEATMAP & GEO OVERLAY                        */}
        {/* ========================================================================= */}
        {currentView === 'heatmap' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
            <EthiopiaTigrayJobHeatmap
              onSelectLocation={handleSelectLocationFromHeatmap}
              onSelectPromptForChat={onSelectPromptForChat}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SEARCH RESULTS & JOB LISTINGS                                      */}
        {/* ========================================================================= */}
        {currentView === 'results' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
            
            {/* Filter Summary & Change Query Bar */}
            <div className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-2 shadow-xs flex-wrap">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {jobQuery ? `"${jobQuery}"` : (language === 'ti' ? 'ኩሎም ስራሓት' : 'All Roles')}
                    {locationQuery ? ` • ${locationQuery}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ti' ? `${searchResults.length} ዝተረኽቡ ክፍት ስራሓት` : `${searchResults.length} Matching Vacancies Found`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowResultsHeatmap(!showResultsHeatmap)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
                    showResultsHeatmap
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ti' ? (showResultsHeatmap ? 'ካርታ ሕባእ' : 'ካርታ ርአ') : (showResultsHeatmap ? 'Hide Map' : 'Show Map')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('search')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 cursor-pointer"
                >
                  {language === 'ti' ? 'ቀይር' : 'Modify'}
                </button>
              </div>
            </div>

            {/* Optional Collapsible Heatmap Overlay above results */}
            {showResultsHeatmap && (
              <div className="animate-in fade-in duration-300">
                <EthiopiaTigrayJobHeatmap
                  onSelectLocation={handleSelectLocationFromHeatmap}
                  onSelectPromptForChat={onSelectPromptForChat}
                />
              </div>
            )}

            {/* Results Listings */}
            <div className="space-y-3">
              {searchResults.map((job) => {
                const isSaved = savedJobs.includes(job.id);
                const isTigrayOrEthio = job.region === 'tigray' || job.region === 'ethiopia';

                return (
                  <div
                    key={job.id}
                    className={`bg-white dark:bg-[#121626] border ${
                      isTigrayOrEthio ? 'border-emerald-200/80 dark:border-emerald-900/50' : 'border-slate-200/90 dark:border-slate-800'
                    } rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3 relative group`}
                  >
                    {/* Header: Title & Salary */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isTigrayOrEthio 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          }`}>
                            {language === 'ti' ? job.categoryTi : job.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {language === 'ti' ? job.typeTi : job.type}
                          </span>
                          {job.sourcePortalName && (
                            <a
                              href={job.sourcePortalUrl || job.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50/90 dark:bg-blue-950/70 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                              title={`Source Portal: ${job.sourcePortalName}`}
                            >
                              <Globe className="w-2.5 h-2.5 text-blue-500 dark:text-sky-400" />
                              <span>{job.sourcePortalName}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
                            </a>
                          )}
                          {job.isUrgent && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                              {language === 'ti' ? 'ህጹጽ ክፍት ስራሕ' : 'Urgent Hiring'}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                          {language === 'ti' ? job.titleTi : job.title}
                        </h4>

                        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap gap-y-1">
                          <span className="flex items-center space-x-1 font-medium">
                            <Building className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{job.organization}</span>
                          </span>
                          {job.companyUrl && (
                            <a
                              href={job.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center space-x-1 text-[11px] text-blue-600 dark:text-sky-400 hover:underline"
                            >
                              <Globe className="w-3 h-3" />
                              <span>{language === 'ti' ? 'ዌብሳይት' : 'Website'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{language === 'ti' ? job.locationTi : job.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Salary & Bookmark */}
                      <div className="flex flex-col items-end space-y-1.5 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black whitespace-nowrap ${
                          isTigrayOrEthio
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {language === 'ti' ? job.salaryTi : job.salary}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSaveJob(job.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                          title={isSaved ? "Remove from saved" : "Save Job"}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {language === 'ti' ? job.descriptionTi : job.description}
                    </p>

                    {/* Requirements & Skills Tags */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {language === 'ti' ? 'ቀንዲ ረቋሒታት:' : 'Key Requirements:'}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(language === 'ti' ? job.requirementsTi : job.requirements).map((req, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{req}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar with Links & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{job.deadline}</span>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        {/* Direct Apply Button with External Link */}
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                          title={language === 'ti' ? 'ናብ ወግዓዊ መመልከቲ መላግቦ ኺድ' : 'Open official application portal'}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{language === 'ti' ? 'ተወከስ / ኣመልክት' : 'Apply Online'}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>

                        {/* Copy Link button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyJobLink(job, e)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                          title={language === 'ti' ? 'ናይ ስራሕ መላግቦ ቅዳሕ' : 'Copy Job Link'}
                        >
                          {copiedJobId === job.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{language === 'ti' ? 'ተቐዲሑ!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline">{language === 'ti' ? 'ቅዳሕ' : 'Copy'}</span>
                            </>
                          )}
                        </button>

                        {/* Direct Email HR button if email available */}
                        {job.contactEmail && (
                          <a
                            href={`mailto:${job.contactEmail}?subject=${encodeURIComponent(`Application: ${job.title} (${job.organization}) - via Axumite AI`)}`}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                            title={`Send Email to ${job.contactEmail}`}
                          >
                            <Mail className="w-3.5 h-3.5 text-blue-500" />
                            <span className="hidden sm:inline">{language === 'ti' ? 'ኢመይል' : 'Email'}</span>
                          </a>
                        )}

                        {/* Draft CV button */}
                        <button
                          type="button"
                          onClick={() => handleOpenCvBuilderForJob(job)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">{language === 'ti' ? 'ብ AI CV ኣዳልው' : 'Draft CV'}</span>
                        </button>

                        {/* Interview Coach button */}
                        <button
                          type="button"
                          onClick={() => handleOpenInterviewCoachForJob(job)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">{language === 'ti' ? 'ቃለ-መሕትት' : 'Coach'}</span>
                        </button>

                        {/* Send to AI Chat */}
                        <button
                          type="button"
                          onClick={() => handleSendJobToAiChat(job)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{language === 'ti' ? 'ምስ AI' : 'Ask AI'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: DEDICATED OFFICIAL JOB PORTALS & DIRECT LINKS DIRECTORY              */}
        {/* ========================================================================= */}
        {currentView === 'portals' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
            
            {/* Portals Hero Header */}
            <div className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-blue-600/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/40 border border-emerald-500/30 dark:border-emerald-500/20 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'ወግዓውያን ናይ ስራሕ ፖርታላትን ቀጥታዊ መላግቦታትን' : 'Official Job Portals & Application Links'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {language === 'ti' 
                      ? 'ንትግራይ፣ ኢትዮጵያ፣ ኤርትራ፣ ሕቡራት መንግስታት (UN/NGO) ከምኡ’ውን ዓለምለኸ ሪሞት ስራሓት ዝኸውን ዝተረጋገጹ ናይ ስራሕ መርበባት ሓበሬታ።'
                      : 'Curated direct links to verified job boards across Tigray, Ethiopia, NGO/Humanitarian platforms, and global remote marketplaces.'}
                  </p>
                </div>
              </div>

              {/* Portal Category Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                {[
                  { id: 'all', label: 'All Portals', labelTi: 'ኩሎም ፖርታላት' },
                  { id: 'tigray_ethiopia', label: 'Tigray & Ethiopia', labelTi: 'ትግራይን ኢትዮጵያን' },
                  { id: 'humanitarian', label: 'UN & Humanitarian', labelTi: 'UN / NGO / ረድኤት' },
                  { id: 'remote', label: 'Global Remote', labelTi: 'ናይ ርሑቕ (Remote)' },
                  { id: 'gulf', label: 'Middle East & Gulf', labelTi: 'ማእከላይ ምብራቕ / ገልፍ' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedPortalCategory(cat.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedPortalCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {language === 'ti' ? cat.labelTi : cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Portal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {EXTERNAL_JOB_PORTALS
                .filter(portal => {
                  if (selectedPortalCategory === 'all') return true;
                  return portal.category === selectedPortalCategory;
                })
                .map((portal) => (
                  <div
                    key={portal.id}
                    className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 font-black text-sm">
                            {portal.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {portal.name}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {portal.badge}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          portal.category === 'tigray_ethiopia' 
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200'
                            : portal.category === 'humanitarian'
                              ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {language === 'ti' ? portal.categoryLabelTi : portal.categoryLabel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {language === 'ti' ? portal.descriptionTi : portal.description}
                      </p>
                    </div>

                    {/* Direct Launch Link Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono truncate max-w-[170px] sm:max-w-[210px]">
                        {portal.url.replace(/^https?:\/\//, '')}
                      </span>

                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <span>{language === 'ti' ? 'መላግቦ ክፈት' : 'Visit Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                ))}
            </div>

            {/* Quick Action Box: Custom Job Search in AI Chat */}
            <div className="bg-white dark:bg-[#121626] border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'ፍሉይ ናይ ስራሕ መላግቦ ትደሊ ኣለኻ፧' : 'Looking for a specific employer or agency link?'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ti' 
                      ? 'ን "ኣክሱማይት AI" ዝኾነ ኩባንያ፣ ትካል ረድኤት ወይ ናይ ስራሕ ዓውዲ ሕተቶ።'
                      : 'Ask Axumite AI for direct career page links, application deadlines, and contact details.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectPromptForChat) {
                    const prompt = language === 'ti'
                      ? 'እባክኻ ኣብ ትግራይ፣ ኢትዮጵያን ዓለምለኸን ዘለዉ ወግዓውያን ናይ ስራሕ መላግቦታት (Job Application Links) ንሞያይ ዝሰማምዑ ጸርገልና።'
                      : 'Please provide direct job application links and recruitment portals matching my field in Tigray, Ethiopia, and international remote positions.';
                    onSelectPromptForChat(prompt);
                    onClose();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ti' ? 'ምስ AI ተወከስ' : 'Ask AI in Chat'}</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: AI RESUME & COVER LETTER BUILDER                                   */}
        {/* ========================================================================= */}
        {currentView === 'cv-builder' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
            
            <div className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'AI ናይ ሲቪ (CV) መምህርን ኣዳላውን' : 'AI Career CV & Resume Builder'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'ti' 
                      ? 'ንትግራይ፣ ኢትዮጵያ፣ ኤርትራ ወይ ዓለምለኸ ኩባንያታት ዝኸውን ዓለምለኸ ደረጃ ዘለዎ CV ብትግርኛን እንግሊዝን ብቕጽበት ኣዳልዉ።' 
                      : 'Generate a polished bilingual resume tailored for local and international job applications.'}
                  </p>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ti' ? 'ስምካ / ምሉእ ስም' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    value={cvApplicantName}
                    onChange={(e) => setCvApplicantName(e.target.value)}
                    placeholder={language === 'ti' ? 'ንኣብነት፡ ዮናስ ተስፋይ' : 'e.g. Yonas Tesfay'}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ti' ? 'ዒላማ ስራሕ / ሞያ' : 'Target Job Position'}
                  </label>
                  <input
                    type="text"
                    value={cvTargetRole}
                    onChange={(e) => setCvTargetRole(e.target.value)}
                    placeholder={language === 'ti' ? 'ንኣብነት፡ NGO Health Officer, Software Dev, Engineer...' : 'e.g. NGO Health Officer, Software Engineer, Teacher...'}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateCv}
                disabled={isGeneratingCv}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingCv ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'ti' ? 'CV የዳልው ኣሎ...' : 'Drafting Resume with AI...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ti' ? 'ሞያዊ CV ብ AI ኣዳልው' : 'Generate Tailored Resume'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated CV Output */}
            {generatedCv && (
              <div className="bg-white dark:bg-[#121626] border border-blue-500/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {language === 'ti' ? 'ዝተዳለወ ናይ CV ቅዳሕ' : 'Generated Resume Preview'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCv}
                    className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold flex items-center space-x-1.5 cursor-pointer border border-blue-200 dark:border-blue-800"
                  >
                    {copiedCv ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCv ? (language === 'ti' ? 'ተቐዲሑ!' : 'Copied!') : (language === 'ti' ? 'ቅዳሕ' : 'Copy')}</span>
                  </button>
                </div>

                <pre className="text-xs sm:text-sm font-sans text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {generatedCv}
                </pre>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: INTERVIEW COACH PRACTICE                                          */}
        {/* ========================================================================= */}
        {currentView === 'interview' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
            
            <div className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'ti' ? 'ናይ ቃለ-መሕትት ልምምድ (Interview Coach)' : 'AI Interview Practice Coach'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {interviewRole 
                      ? `${language === 'ti' ? 'ንሞያ' : 'For position'}: ${interviewRole}` 
                      : (language === 'ti' ? 'ልሙዳት ሕቶታትን ብቑዕ መልስታትን ንምልምማድ' : 'Common questions, strategic sample answers, and winning interview tactics.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {(interviewQuestions.length > 0 ? interviewQuestions : [
                {
                  q: "Tell me about your previous experience and why you are interested in this position.",
                  qTi: "ብዛዕባ ናይ ስራሕ ተመኩሮኻን ስለምንታይ ኣብዚ ስራሕ ክትሰርሕ ከም ዝደለኻን ክትገልጸልና ትኽእል፧",
                  tips: "Structure your response: 1. Relevant Background, 2. Key Achievements, 3. Future Value you bring to this team.",
                  tipsTi: "መልስኻ ኣብ 3 ክፋል ግበሮ: 1. ዘለካ ተመኩሮ፣ 2. ዝዓተርካዮም ዓወታት፣ 3. ንዚ ትካል እተምጽኦ ረብሓ።",
                },
                {
                  q: "How do you navigate community relations and local language needs in diverse environments?",
                  qTi: "ምስ ዝተፈላለዩ ማሕበረሰባትን ቋንቋታትን ብኸመይ ብውጽኢታዊ ኣገባብ ትረዳዳእ፧",
                  tips: "Highlight your multilingual capabilities (Tigrinya, Amharic, English) and deep cultural respect.",
                  tipsTi: "ናይ ቋንቋታት ክእለትካን (ትግርኛ፡ ኣምሓርኛ፡ እንግሊዝኛ) ንባህልን ህዝብን ዘለካ ኣኽብሮት ግለጽ።",
                },
                {
                  q: "What are your core strengths when facing challenging deadlines?",
                  qTi: "ኣብ እዋን ጸገማትን ሓጸርቲ ግዜያትን ቀንዲ ጥንካረኻ እንታይ እዩ፧",
                  tips: "Mention prioritization, structured task management, and remaining calm under pressure.",
                  tipsTi: "ቀዳምነታት ምፍላይ፣ ግዜ ምሕደራን ብህድኣት ጸገማት ምፍታሕን ጥቐስ።",
                }
              ]).map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#121626] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'ti' ? item.qTi : item.q}
                    </h4>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{language === 'ti' ? 'ናይ AI ምኽሪ: ' : 'AI Strategy Tip: '}</span>
                      <span>{language === 'ti' ? item.tipsTi : item.tips}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Practice in Chat button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onSelectPromptForChat) {
                    const prompt = language === 'ti'
                      ? `እባክኻ ንስራሕ "${interviewRole || 'ክፍት ስራሕ'}" ዝኸውን ናይ ቃለ-መሕትት ልምምድ (Mock Interview) ሕቶታት ብምሕታት ኣለማምደኒ።`
                      : `Please conduct a mock interview with me for the role of "${interviewRole || 'General Job'}". Ask me one question at a time and evaluate my answers.`;
                    onSelectPromptForChat(prompt);
                    onClose();
                  }
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ti' ? 'ብቀጥታ ምስ AI ቃለ-መሕትት ተላመድ' : 'Start Live Mock Interview in AI Chat'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
