import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Quote, RefreshCw, Volume2, VolumeX, Bookmark, Check, 
  Sparkles, BookOpen, Info, Copy, ExternalLink, Download, ChevronDown, ChevronUp,
  Image as ImageIcon, Eye, Wand2, Filter, Layers, Palette
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBrandingTheme } from '../context/BrandingThemeContext';
import { 
  AxumiteWisdomQuote, 
  AXUMITE_MANUSCRIPT_QUOTES, 
  getDailyWisdomQuote, 
  getRandomAxumiteQuote 
} from '../data/axumiteManuscriptQuotes';
import { 
  AxumiteStoneTextureId, 
  AxumiteStoneTexture, 
  AXUMITE_STONE_TEXTURES, 
  getStoneTextureById 
} from '../data/axumiteStoneTextures';
import { SavedItem } from '../types';

interface DailyWisdomCardProps {
  onSaveInsight?: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  className?: string;
}

export const DailyWisdomCard: React.FC<DailyWisdomCardProps> = ({
  onSaveInsight,
  className = '',
}) => {
  const { language } = useLanguage();
  const { branding } = useBrandingTheme();
  const isHighContrast = branding.themeScheme === 'high-contrast-gold';
  const isSoftAmbient = branding.themeScheme === 'soft-ambient-gold';

  const [quote, setQuote] = useState<AxumiteWisdomQuote>(() => getDailyWisdomQuote());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTexture, setSelectedTexture] = useState<AxumiteStoneTextureId>('stela-granite');
  const [isShuffling, setIsShuffling] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [showTexturePicker, setShowTexturePicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNextRandomQuote = () => {
    setIsShuffling(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setTimeout(() => {
      let filteredQuotes = AXUMITE_MANUSCRIPT_QUOTES;
      if (selectedCategory !== 'all') {
        filteredQuotes = AXUMITE_MANUSCRIPT_QUOTES.filter(q => q.manuscriptType === selectedCategory);
      }
      
      const pool = filteredQuotes.filter(q => q.id !== quote.id);
      const nextQuote = pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : filteredQuotes[0] || AXUMITE_MANUSCRIPT_QUOTES[0];

      setQuote(nextQuote);
      setIsShuffling(false);
      setIsSaved(false);
      setShowContext(false);
      setImagePreviewUrl(null);
    }, 200);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    let pool = AXUMITE_MANUSCRIPT_QUOTES;
    if (cat !== 'all') {
      pool = AXUMITE_MANUSCRIPT_QUOTES.filter(q => q.manuscriptType === cat);
    }
    if (pool.length > 0) {
      setQuote(pool[0]);
      setIsSaved(false);
      setShowContext(false);
      setImagePreviewUrl(null);
    }
  };

  // Multi-line canvas text helper with word-wrapping
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    align: 'left' | 'center' | 'right' = 'center'
  ): number => {
    ctx.textAlign = align;
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
  };

  // =========================================================================
  // HIGH-RESOLUTION PROCEDURAL AXUMITE STONE TEXTURE CANVAS GENERATOR
  // =========================================================================
  const generateManuscriptCardCanvas = async (textureId: AxumiteStoneTextureId = selectedTexture): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const currentTexture = getStoneTextureById(textureId);

    // -----------------------------------------------------------------------
    // 1. BASE STONE GRADIENTS & PALETTES
    // -----------------------------------------------------------------------
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 720);

    if (textureId === 'stela-granite') {
      // Monolithic Obelisk Granite (Charcoal with cool nephrite undertones)
      bgGradient.addColorStop(0, '#101317');
      bgGradient.addColorStop(0.5, '#1C2128');
      bgGradient.addColorStop(1, '#0B0D10');
    } else if (textureId === 'ezana-trilingual') {
      // Volcanic Basalt Tablet (Dark mineral slate)
      bgGradient.addColorStop(0, '#151210');
      bgGradient.addColorStop(0.5, '#231C18');
      bgGradient.addColorStop(1, '#0C0A09');
    } else if (textureId === 'matara-sandstone') {
      // Warm Terracotta & Desert Ochre Sandstone
      bgGradient.addColorStop(0, '#281A10');
      bgGradient.addColorStop(0.5, '#3A2517');
      bgGradient.addColorStop(1, '#1A0F08');
    } else if (textureId === 'basalt-talisman') {
      // Polished Obsidian Basalt (Deep midnight with royal indigo luster)
      bgGradient.addColorStop(0, '#07070B');
      bgGradient.addColorStop(0.5, '#121422');
      bgGradient.addColorStop(1, '#040407');
    } else {
      // Illuminated Birana Vellum on Limestone Altar
      bgGradient.addColorStop(0, '#1F170E');
      bgGradient.addColorStop(0.5, '#2B1F13');
      bgGradient.addColorStop(1, '#140E07');
    }

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 720);

    // -----------------------------------------------------------------------
    // 2. STONE MINERAL SPECKLING & GRAIN (Procedural Chiseled Stippling)
    // -----------------------------------------------------------------------
    if (textureId === 'stela-granite') {
      // Granite quartz and feldspar micro-speckles
      for (let i = 0; i < 650; i++) {
        const sx = (i * 137.5) % 1200;
        const sy = (i * 241.3) % 720;
        const isGold = i % 5 === 0;
        const isSilver = i % 3 === 0;
        ctx.fillStyle = isGold ? 'rgba(255, 215, 0, 0.05)' : isSilver ? 'rgba(226, 232, 240, 0.04)' : 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3 === 0) ? 1.4 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (textureId === 'ezana-trilingual') {
      // Basalt porous pitting & horizontal chisel scorelines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let y = 50; y < 700; y += 22) {
        ctx.beginPath();
        ctx.moveTo(30, y + ((y * 13) % 7) - 3);
        ctx.lineTo(1170, y + ((y * 19) % 7) - 3);
        ctx.stroke();
      }
      // Ancient Sabaean monumental background watermark glyphs along border
      const sabaeanGlyphs = ['𐩱', '𐩲', '𐩦', '𐩡', '𐩥', '𐩣', '𐩧', '𐩤', '𐩨', '𐩩'];
      ctx.fillStyle = 'rgba(236, 198, 101, 0.04)';
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      for (let i = 0; i < 16; i++) {
        const gx = 80 + i * 70;
        ctx.fillText(sabaeanGlyphs[i % sabaeanGlyphs.length], gx, 58);
        ctx.fillText(sabaeanGlyphs[(i + 3) % sabaeanGlyphs.length], gx, 680);
      }
    } else if (textureId === 'matara-sandstone') {
      // Sandstone stippling & mineral banding
      for (let i = 0; i < 800; i++) {
        const sx = (i * 97.3) % 1200;
        const sy = (i * 163.7) % 720;
        ctx.fillStyle = (i % 2 === 0) ? 'rgba(224, 159, 103, 0.05)' : 'rgba(255, 200, 112, 0.035)';
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 4 === 0) ? 1.5 : 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (textureId === 'basalt-talisman') {
      // Concentric Radial Talismanic Sunburst in background
      const centerX = 600;
      const centerY = 360;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.035)';
      ctx.lineWidth = 1.2;
      for (let r = 80; r <= 420; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      // 12 Royal Radial Rays
      for (let a = 0; a < 12; a++) {
        const angle = (a * Math.PI * 2) / 12;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * 70, centerY + Math.sin(angle) * 70);
        ctx.lineTo(centerX + Math.cos(angle) * 440, centerY + Math.sin(angle) * 440);
        ctx.stroke();
      }
    } else {
      // Birana Parchment mottled organic texture
      for (let i = 0; i < 500; i++) {
        const sx = (i * 113.1) % 1200;
        const sy = (i * 191.7) % 720;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.03)';
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3 === 0) ? 2.0 : 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // -----------------------------------------------------------------------
    // 3. ARCHITECTURAL STONE CARVINGS & ILLUMINATED FRAMES
    // -----------------------------------------------------------------------
    const primaryGold = currentTexture.goldAccent;
    const borderGold = currentTexture.borderAccent;

    if (textureId === 'stela-granite') {
      // Outer Monumental Stele Frame with Arched Apex Top
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 4;
      ctx.strokeRect(26, 26, 1148, 668);

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(36, 36, 1128, 648);

      // Axum Stele Blind Windows (Left and Right Columns)
      const drawBlindWindow = (wx: number, wy: number) => {
        // Wooden beam relief frame
        ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
        ctx.fillRect(wx - 18, wy - 30, 36, 60);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(wx - 18, wy - 30, 36, 60);

        // Internal recessed step
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(wx - 12, wy - 22, 24, 44);
        ctx.strokeRect(wx - 12, wy - 22, 24, 44);

        // Protruding monkey-heads (corner round beam pegs)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(wx - 18, wy - 30, 4, 0, Math.PI * 2);
        ctx.arc(wx + 18, wy - 30, 4, 0, Math.PI * 2);
        ctx.arc(wx - 18, wy + 30, 4, 0, Math.PI * 2);
        ctx.arc(wx + 18, wy + 30, 4, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw blind windows on flanking columns
      drawBlindWindow(64, 240);
      drawBlindWindow(64, 480);
      drawBlindWindow(1136, 240);
      drawBlindWindow(1136, 480);

      // Top Monumental Arched Stele Apex Finial
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏛️', 600, 48);

    } else if (textureId === 'ezana-trilingual') {
      // Chiseled Stone Tablet Framing with Beveled Corners
      ctx.strokeStyle = '#ECC665';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(28, 28, 1144, 664);

      ctx.strokeStyle = 'rgba(236, 198, 101, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(38, 38, 1124, 644);

      // Chiseled Corner Brackets
      ctx.fillStyle = '#ECC665';
      ctx.font = 'bold 20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('𐩱', 48, 48);
      ctx.fillText('𐩱', 1152, 48);
      ctx.fillText('𐩱', 48, 672);
      ctx.fillText('𐩱', 1152, 672);

    } else if (textureId === 'matara-sandstone') {
      // Warm Terracotta Chiseled Border with Astronomical Disc-and-Crescent Crest
      ctx.strokeStyle = '#E09F67';
      ctx.lineWidth = 4;
      ctx.strokeRect(28, 28, 1144, 664);

      ctx.strokeStyle = 'rgba(255, 200, 112, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(38, 38, 1124, 644);

      // Carved Disc & Crescent Astronomical Relief at Top
      ctx.fillStyle = '#FFC870';
      ctx.beginPath();
      // Sun Disc
      ctx.arc(600, 44, 8, 0, Math.PI * 2);
      ctx.fill();
      // Crescent Moon underneath
      ctx.strokeStyle = '#FFC870';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(600, 42, 14, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();

      // Corner Petroglyph Chevrons
      ctx.fillStyle = '#FFC870';
      ctx.font = 'bold 18px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('▲', 48, 48);
      ctx.fillText('▲', 1152, 48);
      ctx.fillText('▼', 48, 672);
      ctx.fillText('▼', 1152, 672);

    } else if (textureId === 'basalt-talisman') {
      // Polished Obsidian Border with Interlaced Knotwork & Cross Finials
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(28, 28, 1144, 664);

      ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(38, 38, 1124, 644);

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❖', 48, 48);
      ctx.fillText('❖', 1152, 48);
      ctx.fillText('❖', 48, 672);
      ctx.fillText('❖', 1152, 672);

      // Royal Seal Emblem at Top Center
      ctx.fillText('👑', 600, 46);

    } else {
      // Traditional Red Cinnabar & Gold Harag Ribbon
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, 1144, 664);

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(36, 36, 1128, 648);

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✝', 48, 48);
      ctx.fillText('✝', 1152, 48);
      ctx.fillText('✝', 48, 672);
      ctx.fillText('✝', 1152, 672);
    }

    // -----------------------------------------------------------------------
    // 4. HEADER: MANUSCRIPT WISDOM & STONE TEXTURE BADGE
    // -----------------------------------------------------------------------
    ctx.fillStyle = primaryGold;
    ctx.font = '900 21px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('📜 ANCIENT AXUMITE MANUSCRIPT WISDOM | ጥበብ ኣክሱም', 600, 84);

    // Subheader: Theme & Era
    ctx.fillStyle = currentTexture.borderAccent;
    ctx.font = 'italic 17px serif';
    ctx.fillText(`— ${quote.themeEn} • ${quote.centuryEn} • ${currentTexture.nameEn} —`, 600, 116);

    // Subtle golden divider line
    const divGrad = ctx.createLinearGradient(340, 0, 860, 0);
    divGrad.addColorStop(0, 'rgba(236, 198, 101, 0)');
    divGrad.addColorStop(0.5, primaryGold);
    divGrad.addColorStop(1, 'rgba(236, 198, 101, 0)');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(340, 134);
    ctx.lineTo(860, 134);
    ctx.stroke();

    // -----------------------------------------------------------------------
    // 5. GE'EZ SCRIPT (Ancient Monumental Stone Inscription Calligraphy)
    // -----------------------------------------------------------------------
    ctx.fillStyle = '#FFF8EB';
    ctx.font = 'bold 26px "Noto Serif Ethiopic", serif';
    const geezEndY = wrapText(ctx, `« ${quote.geez} »`, 600, 195, 980, 42, 'center');

    // -----------------------------------------------------------------------
    // 6. TIGRINYA TRANSLATION
    // -----------------------------------------------------------------------
    ctx.fillStyle = '#FDE68A';
    ctx.font = '600 20px "Noto Sans Ethiopic", sans-serif';
    const tigrinyaY = Math.max(geezEndY + 20, 305);
    const tigrinyaEndY = wrapText(ctx, `ትግርኛ: ${quote.tigrinya}`, 600, tigrinyaY, 980, 34, 'center');

    // -----------------------------------------------------------------------
    // 7. ENGLISH TRANSLATION
    // -----------------------------------------------------------------------
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'italic 20px "Libre Baskerville", "Times New Roman", serif';
    const englishY = Math.max(tigrinyaEndY + 20, 415);
    const englishEndY = wrapText(ctx, `"${quote.english}"`, 600, englishY, 1000, 32, 'center');

    // -----------------------------------------------------------------------
    // 8. SOURCE & STONE TEXTURE CITATION BADGE
    // -----------------------------------------------------------------------
    const sourceY = Math.min(Math.max(englishEndY + 28, 550), 578);
    
    // Rounded Source Pill Background
    ctx.fillStyle = 'rgba(236, 198, 101, 0.12)';
    const pillWidth = 620;
    const pillHeight = 44;
    const pillX = 600 - pillWidth / 2;
    const pillY = sourceY - 28;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(236, 198, 101, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = primaryGold;
    ctx.font = 'bold 17.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏛️ ${quote.sourceEn} • ${currentTexture.stoneType}`, 600, sourceY);

    // -----------------------------------------------------------------------
    // 9. WATERMARK FOOTER
    // -----------------------------------------------------------------------
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 14px sans-serif';
    ctx.fillText('AXUMITE AI • Sovereign Cultural & Heritage Intelligence • axumite.ai', 600, 662);

    return canvas;
  };

  // Re-render preview image when texture changes
  const updateModalImagePreview = async (textureId: AxumiteStoneTextureId) => {
    setIsGeneratingImage(true);
    try {
      const canvas = await generateManuscriptCardCanvas(textureId);
      const dataUrl = canvas.toDataURL('image/png');
      setImagePreviewUrl(dataUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle direct sharing quote as an Image
  const handleShareAsImage = async () => {
    setIsGeneratingImage(true);
    showToast(language === 'ti' ? 'ስእላዊ ካርድ ይሰናዳእ ኣሎ...' : 'Rendering stone carving quote image...');

    try {
      const canvas = await generateManuscriptCardCanvas(selectedTexture);
      const dataUrl = canvas.toDataURL('image/png');
      setImagePreviewUrl(dataUrl);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast('Image render failed');
          setIsGeneratingImage(false);
          return;
        }

        const currentTex = getStoneTextureById(selectedTexture);
        const fileName = `Axumite_Wisdom_${quote.id}_${selectedTexture}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        // Try Web Share API with File
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Axumite Wisdom: ${quote.sourceEn}`,
              text: `📜 Ancient Axumite Manuscript Wisdom (${currentTex.nameEn}) | ጥበብ ኣክሱም:\n\n« ${quote.geez} »\n\n"${quote.english}"\n\n🏛️ ${quote.sourceEn} (${quote.centuryEn})\n✨ Shared via Axumite AI`,
              files: [file],
            });
            showToast(language === 'ti' ? 'ብዓወት ስእሊ ተኻፊሉ!' : 'Image quote shared successfully!');
            setIsGeneratingImage(false);
            return;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') {
              setIsGeneratingImage(false);
              return;
            }
          }
        }

        // Fallback: Copy image to clipboard if supported
        if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            showToast(language === 'ti' ? 'ስእሊ ናብ Clipboard ተቐዲሑ!' : 'Image copied to clipboard!');
          } catch (clipErr) {
            // fallback
          }
        }

        // Open share modal with interactive texture picker
        setShowShareModal(true);
        setIsGeneratingImage(false);
      }, 'image/png');
    } catch (err) {
      console.error('Image share error:', err);
      showToast('Could not create image');
      setIsGeneratingImage(false);
    }
  };

  const formattedShareText = `📜 Axumite Daily Wisdom | ጥበብ ኣክሱም:\n\n« ${quote.geez} »\n\n📜 ትግርኛ: ${quote.tigrinya}\n🇬🇧 English: "${quote.english}"\n\n🏛️ ምንጪ (Source): ${quote.sourceEn} (${quote.centuryEn})\n🏷️ Theme: ${quote.themeEn}\n🎨 Stone Style: ${getStoneTextureById(selectedTexture).nameEn}\n\n✨ Shared via Axumite AI`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Axumite Wisdom: ${quote.sourceEn}`,
          text: formattedShareText,
          url: window.location.href,
        });
        showToast(language === 'ti' ? 'ብዓወት ተኻፊሉ!' : 'Successfully shared!');
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyText = (type: 'all' | 'geez' | 'translation') => {
    let textToCopy = formattedShareText;
    if (type === 'geez') {
      textToCopy = `« ${quote.geez} »\n— ${quote.source} (${quote.century})`;
    } else if (type === 'translation') {
      textToCopy = `"${quote.english}"\n— ${quote.sourceEn} (${quote.centuryEn})`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      showToast(language === 'ti' ? 'ናብ Clipboard ተቐዲሑ!' : 'Copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveToInsights = () => {
    if (onSaveInsight) {
      onSaveInsight({
        title: `${quote.source} — ${quote.theme}`,
        category: 'Ancient Axumite Manuscripts',
        type: 'text',
        content: `Ge'ez Script:\n${quote.geez}\n\nTigrinya:\n${quote.tigrinya}\n\nEnglish Translation:\n${quote.english}\n\nStone Carving Style:\n${getStoneTextureById(selectedTexture).nameEn}\n\nHistorical Context:\n${language === 'ti' ? quote.historicalContextTi : quote.historicalContextEn}`,
        tags: ['Axumite Wisdom', quote.themeEn, quote.centuryEn, 'Manuscript', selectedTexture],
      });
      setIsSaved(true);
      showToast(language === 'ti' ? 'ኣብ ዝተዓቀቡ ተቐሚጡ!' : 'Saved to your insights collection!');
    }
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      showToast(language === 'ti' ? 'ድምጺ ኣብዚ መሳርሒ ኣይድገፍን' : 'Audio synthesis not supported on this browser');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = language === 'ti' 
      ? `${quote.tigrinya}. ምንጪ፡ ${quote.source}`
      : `${quote.english}. From the ${quote.sourceEn}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadCard = async (texId: AxumiteStoneTextureId = selectedTexture) => {
    try {
      const canvas = await generateManuscriptCardCanvas(texId);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Axumite_Wisdom_${quote.id}_${texId}.png`;
      link.href = dataUrl;
      link.click();
      showToast(language === 'ti' ? 'ስእላዊ ካርድ ተሰሪሑ ተወሪዱ!' : 'Wisdom stone image card exported!');
    } catch (e) {
      showToast('Could not generate card download');
    }
  };

  const handleTextureSelect = (texId: AxumiteStoneTextureId) => {
    setSelectedTexture(texId);
    showToast(language === 'ti' ? `ቅዲ ተቐይሩ፡ ${getStoneTextureById(texId).nameTi}` : `Texture: ${getStoneTextureById(texId).nameEn}`);
    if (showShareModal) {
      updateModalImagePreview(texId);
    }
  };

  const categories = [
    { id: 'all', labelTi: 'ኩሉ', labelEn: 'All Manuscripts' },
    { id: 'royal_inscription', labelTi: 'ናይ ነገሥታት ጽሑፋት', labelEn: 'Royal Inscriptions' },
    { id: 'monastic_codex', labelTi: 'ናይ ገዳማት ብራናታት', labelEn: 'Monastic Codices' },
    { id: 'philosophical_treatise', labelTi: 'ፍልስፍናዊ ሓተታ', labelEn: 'Philosophy' },
    { id: 'legal_code', labelTi: 'ሕግን ፍትሕን', labelEn: 'Law & Governance' },
  ];

  const currentTextureObj = getStoneTextureById(selectedTexture);

  return (
    <div className={`relative ${className}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 bg-[#0F2856] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-amber-400/40 flex items-center space-x-1.5 animate-bounce whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Parchment / Stone Card Container */}
      <div className={`rounded-3xl p-4 sm:p-5 relative overflow-hidden text-[#FFF8EB] border-2 shadow-xl transition-all ${
        selectedTexture === 'stela-granite'
          ? 'bg-gradient-to-br from-[#101317] via-[#1C2128] to-[#0B0D10] border-slate-400/60 shadow-slate-900/40'
          : selectedTexture === 'ezana-trilingual'
            ? 'bg-gradient-to-br from-[#151210] via-[#231C18] to-[#0C0A09] border-amber-500/60 shadow-amber-950/40'
            : selectedTexture === 'matara-sandstone'
              ? 'bg-gradient-to-br from-[#281A10] via-[#3A2517] to-[#1A0F08] border-[#E09F67]/60 shadow-amber-950/40'
              : selectedTexture === 'basalt-talisman'
                ? 'bg-gradient-to-br from-[#07070B] via-[#121422] to-[#040407] border-indigo-400/60 shadow-indigo-950/40'
                : 'bg-gradient-to-br from-[#1F170E] via-[#2B1F13] to-[#140E07] border-red-500/50 shadow-amber-950/40'
      }`}>
        
        {/* Subtle Stone Texture Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(#ECC665_1px,transparent_1px)] [background-size:18px_18px] opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* TOP HEADER ROW: Tag + Texture Badge + Quick Actions */}
        <div className="flex items-center justify-between gap-2 relative z-10 pb-2.5 border-b border-amber-500/20">
          
          {/* Badge & Title */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-sm shrink-0">
              <div className="w-full h-full bg-[#1A1208] rounded-[10px] flex items-center justify-center text-amber-300">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <h3 className="text-xs sm:text-[13.5px] font-black uppercase tracking-wider text-amber-300 font-mono">
                  {language === 'ti' ? 'ዕለታዊ ጥበብ ኣክሱም' : 'Daily Axumite Wisdom'}
                </h3>
                <motion.span 
                  key={`badge-century-${quote.id}`}
                  initial={{ opacity: 0, scale: 0.85, filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' }}
                  animate={{ opacity: 1, scale: 1, filter: 'drop-shadow(0 0 0px rgba(255, 215, 0, 0))' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="px-1.5 py-0.2 text-[8px] font-black uppercase bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded font-mono shrink-0"
                >
                  {language === 'ti' ? quote.century : quote.centuryEn}
                </motion.span>
                <span className="px-1.5 py-0.2 text-[8px] font-black uppercase bg-white/10 text-amber-100 border border-white/20 rounded font-mono shrink-0 hidden sm:inline-block">
                  {currentTextureObj.badge}
                </span>
              </div>
              <motion.p 
                key={`badge-theme-${quote.id}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="text-[10px] text-amber-200/80 font-medium truncate mt-0.5"
              >
                {language === 'ti' ? quote.theme : quote.themeEn}
              </motion.p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            
            {/* Audio Read Aloud */}
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse shadow-md' 
                  : 'bg-white/10 hover:bg-white/20 text-amber-200 border-amber-400/20'
              }`}
              title={isPlayingAudio ? 'Stop reading' : 'Read wisdom quote aloud'}
              aria-label="Audio readout"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Bookmark */}
            {onSaveInsight && (
              <button
                type="button"
                onClick={handleSaveToInsights}
                className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                  isSaved 
                    ? 'bg-emerald-500 text-white border-emerald-400' 
                    : 'bg-white/10 hover:bg-white/20 text-amber-200 border-amber-400/20'
                }`}
                title="Save wisdom to insights"
                aria-label="Save to insights"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Texture Selector Toggle */}
            <button
              type="button"
              onClick={() => setShowTexturePicker(!showTexturePicker)}
              className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                showTexturePicker 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' 
                  : 'bg-white/10 hover:bg-white/20 text-amber-200 border-amber-400/20'
              }`}
              title={language === 'ti' ? 'ቅዲ ቅርጺ እምኒ ምረጽ (Axumite Stone Textures)' : 'Choose Axumite Stone Carving Texture'}
              aria-label="Stone carving texture"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>

            {/* Randomize / Next Quote */}
            <button
              type="button"
              onClick={handleNextRandomQuote}
              disabled={isShuffling}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/20 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title={language === 'ti' ? 'ካልእ ጥበብ ቀይር (Randomize)' : 'Fetch another random quote from manuscripts'}
              aria-label="Randomize quote"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin text-amber-300' : ''}`} />
            </button>

            {/* PRIMARY SHARE AS IMAGE BUTTON */}
            <button
              type="button"
              id="daily-wisdom-share-image-button"
              onClick={handleShareAsImage}
              disabled={isGeneratingImage}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFD700] via-[#ECC665] to-[#D4A237] text-[#1A1206] font-extrabold text-[11px] sm:text-xs flex items-center space-x-1 shadow-md shadow-amber-900/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-amber-200/80 shrink-0"
              title={language === 'ti' ? 'ስእላዊ ጥበብ ኣካፍል / Post Quote as Image' : 'Post & Share Quote as Image Card'}
              aria-label="Post Quote as Image"
            >
              {isGeneratingImage ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span className="whitespace-nowrap">
                {isGeneratingImage ? (language === 'ti' ? 'ይሰናዳእ...' : 'Rendering...') : (language === 'ti' ? 'ስእሊ ኣካፍል' : 'Share Image')}
              </span>
            </button>

          </div>
        </div>

        {/* AXUMITE STONE CARVING TEXTURE SELECTOR (5 Distinct Textures) */}
        {showTexturePicker && (
          <div className="py-2.5 px-3 my-2 bg-black/40 rounded-2xl border border-amber-400/30 relative z-10 animate-fadeIn space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-300 flex items-center space-x-1">
                <span>🗿</span>
                <span>{language === 'ti' ? 'ቅዲ ቅርጺ እምኒ ኣክሱም (Axumite Stone Carvings)' : 'Axumite Stone Carving Backgrounds (3–5 Textures)'}</span>
              </span>
              <span className="text-[9.5px] text-amber-200/70 font-mono">
                {currentTextureObj.era}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {AXUMITE_STONE_TEXTURES.map((tex) => {
                const isSelected = selectedTexture === tex.id;
                return (
                  <button
                    key={tex.id}
                    type="button"
                    onClick={() => handleTextureSelect(tex.id)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 shadow-md ring-1 ring-amber-400 text-amber-100'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{tex.badge.split(' ')[0]}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-300 stroke-[3]" />}
                    </div>
                    <div className="text-[10px] font-bold truncate">
                      {language === 'ti' ? tex.nameTi.split(' ')[0] : tex.nameEn}
                    </div>
                    <div className="text-[8px] text-slate-400 truncate mt-0.5">
                      {tex.stoneType}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CATEGORY FILTER PILLS */}
        <div className="py-2 flex items-center space-x-1.5 overflow-x-auto no-scrollbar relative z-10 border-b border-amber-500/10">
          <Filter className="w-3 h-3 text-amber-400/70 shrink-0 mr-0.5" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white/5 hover:bg-white/10 text-amber-200/70 border border-amber-500/20'
                }`}
              >
                {language === 'ti' ? cat.labelTi : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* QUOTE BODY WITH FADING-GOLD ENTRANCE ANIMATION */}
        <div className="my-3 relative z-10 overflow-hidden">
          {/* Subtle gold radiance flash pulse behind the quote content whenever a new quote is revealed */}
          <div 
            key={`gold-aura-${quote.id}`} 
            className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-400/20 to-amber-500/0 pointer-events-none rounded-2xl animate-gold-aura-flash" 
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={quote.id}
              initial={{ 
                opacity: 0, 
                y: 10, 
                scale: 0.985,
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.85)) brightness(1.3)'
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                filter: 'drop-shadow(0 0 0px rgba(255, 215, 0, 0)) brightness(1)'
              }}
              exit={{ 
                opacity: 0, 
                y: -8, 
                scale: 0.985,
                filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.4))'
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="space-y-2.5 relative"
            >
              {/* Ge'ez Script (Ancient Manuscript Calligraphy Font) */}
              <div className="relative pl-3.5 border-l-2 border-amber-400/80 transition-all">
                <Quote className="w-4 h-4 text-amber-400/40 absolute -top-1 -left-2 fill-current" />
                <p className="font-birana-manuscript text-[14px] sm:text-base font-bold text-[#FFE6A5] leading-relaxed tracking-wide selection:bg-amber-500 selection:text-black">
                  « {quote.geez} »
                </p>
              </div>

              {/* Tigrinya Translation */}
              <div className="text-[11.5px] sm:text-[12px] text-amber-100/90 font-medium leading-relaxed bg-black/30 rounded-xl p-2.5 border border-amber-400/15 shadow-inner">
                <span className="font-bold text-amber-300 text-[10px] block font-mono uppercase tracking-wider mb-0.5">
                  {language === 'ti' ? 'ትርጉም ትግርኛ' : 'Tigrinya Meaning'}:
                </span>
                {quote.tigrinya}
              </div>

              {/* English Translation */}
              <div className="text-[11.5px] sm:text-[12px] text-slate-200 font-serif italic leading-relaxed pl-1">
                "{quote.english}"
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER: Source Citation, Context & Action Controls */}
        <div className="pt-2.5 border-t border-amber-500/20 flex flex-col gap-2 relative z-10">
          
          <div className="flex items-center justify-between text-xs gap-2">
            <motion.div 
              key={`source-${quote.id}`}
              initial={{ opacity: 0, x: -6, filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))' }}
              animate={{ opacity: 1, x: 0, filter: 'drop-shadow(0 0 0px rgba(255, 215, 0, 0))' }}
              transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
              className="flex items-center space-x-1.5 min-w-0 pr-1"
            >
              <span className="text-amber-400 text-xs shrink-0">🏛️</span>
              <span className="text-[11px] font-bold text-amber-200/90 truncate">
                {language === 'ti' ? quote.source : quote.sourceEn}
              </span>
            </motion.div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Historical Context Toggle */}
              <button
                type="button"
                onClick={() => setShowContext(!showContext)}
                className="text-[10px] font-bold text-amber-300/90 hover:text-amber-200 flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/20 transition-all cursor-pointer shrink-0"
              >
                <Info className="w-3 h-3 text-amber-400" />
                <span>{language === 'ti' ? 'ታሪኽ ቅርሲ' : 'Context'}</span>
                {showContext ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
              </button>

              {/* Text Copy button */}
              <button
                type="button"
                onClick={() => handleCopyText('all')}
                className="text-[10px] font-bold text-amber-300/90 hover:text-amber-200 flex items-center space-x-1 bg-white/10 hover:bg-white/15 px-2 py-0.5 rounded-md border border-amber-400/20 transition-all cursor-pointer shrink-0"
                title="Copy formatted quote text"
              >
                <Copy className="w-3 h-3 text-amber-300" />
                <span>{copied ? (language === 'ti' ? 'ተቐዲሑ!' : 'Copied!') : (language === 'ti' ? 'ጽሑፍ ቅዳሕ' : 'Copy Text')}</span>
              </button>
            </div>
          </div>

          {/* Expanded Historical Context */}
          {showContext && (
            <div className="bg-[#120D08]/90 rounded-xl p-3 border border-amber-400/30 text-[11px] text-amber-100/85 leading-relaxed space-y-1.5 animate-fadeIn">
              <div className="font-bold text-amber-300 flex items-center space-x-1">
                <span>📜</span>
                <span>{language === 'ti' ? 'ታሪኻዊ መበገስን ምርምርን' : 'Archaeological & Historical Context'}</span>
              </div>
              <p>
                {language === 'ti' ? quote.historicalContextTi : quote.historicalContextEn}
              </p>
              <div className="pt-1 flex items-center justify-between text-[9.5px] text-amber-300/70 font-mono">
                <span>Era: {quote.centuryEn}</span>
                <span>Type: {quote.manuscriptType.replace('_', ' ').toUpperCase()}</span>
                <span>Stone: {currentTextureObj.stoneType}</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* SHARE OPTIONS & IMAGE POST MODAL (With Live Texture Switching) */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-[#1C160F] text-[#FFF8EB] border-2 border-amber-400/50 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-3.5 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-300">
                    {language === 'ti' ? 'ጥበብ ኣክሱም ከም ስእሊ ኣካፍል' : 'Share Wisdom as Image Card'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {quote.sourceEn} • {currentTextureObj.nameEn}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stone Carving Texture Selector inside Share Modal */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-300 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ti' ? 'ቅዲ ቅርጺ እምኒ ምረጽ' : 'Select Stone Carving Texture:'}</span>
                </span>
                <span className="text-[9.5px] text-amber-200/60 font-mono">
                  {AXUMITE_STONE_TEXTURES.length} Styles
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                {AXUMITE_STONE_TEXTURES.map((tex) => {
                  const isSelected = selectedTexture === tex.id;
                  return (
                    <button
                      key={tex.id}
                      type="button"
                      onClick={() => handleTextureSelect(tex.id)}
                      className={`p-1.5 rounded-xl text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/25 border-amber-400 shadow-sm text-amber-200'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] font-bold truncate">
                        {tex.badge.split(' ')[0]} {tex.nameEn.split(' ')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generated Image Live Preview */}
            {imagePreviewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-amber-400/30 shadow-md">
                <img 
                  src={imagePreviewUrl} 
                  alt="Axumite Wisdom Image Card" 
                  className="w-full h-auto object-cover max-h-52"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded text-[9px] font-bold font-mono border border-amber-400/30">
                  {currentTextureObj.badge} • 1200x720 HD
                </div>
              </div>
            ) : (
              /* Fallback preview */
              <div className="bg-black/40 rounded-xl p-3 border border-amber-400/20 text-xs space-y-1.5 font-sans">
                <p className="font-birana-manuscript text-amber-300 font-bold text-[13px]">
                  « {quote.geez} »
                </p>
                <p className="text-slate-200 text-[11px] italic">
                  "{quote.english}"
                </p>
                <p className="text-[10px] text-amber-400/80 font-mono">
                  — {quote.sourceEn} ({quote.centuryEn})
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 text-xs">
              
              {/* Direct Download Image Card */}
              <button
                type="button"
                onClick={() => handleDownloadCard(selectedTexture)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{language === 'ti' ? `ስእላዊ ካርድ ኣውርድ (${currentTextureObj.nameEn})` : `Download ${currentTextureObj.nameEn} (PNG)`}</span>
              </button>

              {/* Copy Full Text */}
              <button
                type="button"
                onClick={() => handleCopyText('all')}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-bold border border-amber-400/30 flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (language === 'ti' ? 'ተቐዲሑ!' : 'Copied!') : (language === 'ti' ? 'ምሉእ ጽሑፍ ቅዳሕ' : 'Copy Quote Text')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
