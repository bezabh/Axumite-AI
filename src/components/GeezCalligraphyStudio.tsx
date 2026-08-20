import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Download, Copy, Share2, BookmarkCheck, RotateCcw, 
  Play, Pause, ZoomIn, ZoomOut, Maximize2, Shuffle, Palette, 
  Layers, Sliders, Type, Grid, Check, ShieldCheck, Eye, 
  RefreshCw, Info, ChevronRight, Wand2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SavedItem, UserProfile } from '../types';

export type CalligraphyStyle = 
  | 'talisman'    // Axumite Talismanic Seal (ማኅተም ኣክሱም)
  | 'manuscript'  // Illuminated Birana Manuscript (ብራና ጥበብ)
  | 'mandala'     // Radial Fidel Mandala (መንደላ ፊደላት)
  | 'stela'       // Sovereign Obelisk Pillar (ሓወልቲ ኦበሊስክ)
  | 'wave'        // Golden Calligraphic Wave (ወርቃዊ ማዕበል)
  | 'crest';      // Imperial Cross & Crown Crest (ናይ ንግስነት ማዕተብ)

export type ColorTheme = 
  | 'axum-gold'
  | 'crimson-gold'
  | 'lapis-silver'
  | 'sanctuary-emerald'
  | 'solar-ochre'
  | 'cyber-neon'
  | 'ancient-vellum';

export type AspectRatio = '1:1' | '9:16' | '16:9' | '3:4';
export type BackgroundMode = 'theme' | 'parchment' | 'dark-basalt' | 'clean-white' | 'transparent';
export type CenterIcon = 'cross' | 'lion' | 'stela' | 'sun' | 'eye' | 'lotus' | 'none';

interface GeezCalligraphyStudioProps {
  user?: UserProfile;
  onSaveInsight?: (item: SavedItem) => void;
  onNavigateTab?: (tab: string) => void;
}

const PRESET_WORDS = [
  { ti: 'ሰላም', en: 'Peace (Selam)', subtitle: 'ሰላም ንኹሉ ዓለም' },
  { ti: 'ፍቕሪ', en: 'Love (Fiqri)', subtitle: 'ፍቕሪ ሓይሊ እዩ' },
  { ti: 'ጥበብ', en: 'Wisdom (Tibeb)', subtitle: 'ጥበብ ናይ ኣቦታትና' },
  { ti: 'ብርሃን', en: 'Light (Birhan)', subtitle: 'ብርሃን ሓቂ' },
  { ti: 'ኣክሱም', en: 'Axum (Aksum)', subtitle: 'ታሪኻዊ ስልጣነ' },
  { ti: 'ኤርትራ', en: 'Eritrea (Ertra)', subtitle: 'ሃገር ጽንዓትን ሓርነትን' },
  { ti: 'ሓርነት', en: 'Freedom (Harnet)', subtitle: 'ክብሪ ሓርነት' },
  { ti: 'በረኸት', en: 'Blessing (Bereket)', subtitle: 'በረኸት ኣብ ገዛኹም' },
  { ti: 'ልዑላዊ', en: 'Sovereignty (Lulawi)', subtitle: 'ልዑላዊ መንነት' },
  { ti: 'ቅዱስ', en: 'Sacred (Qidus)', subtitle: 'ቅዱስ ኪነ-ጥበብ' },
  { ti: 'ጽንዓት', en: 'Resilience (Tsinaat)', subtitle: 'ጽንዓት ኣብ መከራ' },
  { ti: 'ማኅተም', en: 'Imperial Seal (Mahtem)', subtitle: 'ማኅተም ናይ ጥንቲ' },
];

const GEEZ_KEYBOARD_FIDELS = [
  // Frequently used
  'ሀ', 'ለ', 'ሐ', 'መ', 'ሠ', 'ረ', 'ሰ', 'ሸ', 'ቀ', 'በ', 'ተ', 'ቸ',
  'ኀ', 'ነ', 'ኘ', 'አ', 'ከ', 'ኸ', 'ወ', 'ዐ', 'ዘ', 'ዠ', 'የ', 'ደ',
  'ጀ', 'ገ', 'ጠ', 'ጨ', 'ጰ', 'ጸ', 'ፀ', 'ፈ', 'ፐ',
  // Traditional Numerals
  '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺', '፻',
  // Sacred Punctuation & Harag Marks
  '፡', '፣', '፤', '፥', '፦', '፧', '፨', '፠'
];

export const GeezCalligraphyStudio: React.FC<GeezCalligraphyStudioProps> = ({
  user,
  onSaveInsight,
  onNavigateTab,
}) => {
  const { language } = useLanguage();

  // Canvas State
  const [word, setWord] = useState('ሰላም');
  const [subtitle, setSubtitle] = useState('AXUMITE SACRED CALLIGRAPHY');
  const [style, setStyle] = useState<CalligraphyStyle>('talisman');
  const [theme, setTheme] = useState<ColorTheme>('axum-gold');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [bgMode, setBgMode] = useState<BackgroundMode>('theme');
  const [centerIcon, setCenterIcon] = useState<CenterIcon>('cross');

  // Fine-tuning parameters
  const [symmetryFolds, setSymmetryFolds] = useState<number>(8);
  const [concentricRings, setConcentricRings] = useState<number>(4);
  const [glyphScale, setGlyphScale] = useState<number>(1.0);
  const [haragDensity, setHaragDensity] = useState<number>(80);
  const [glowIntensity, setGlowIntensity] = useState<number>(75);
  const [stardustCount, setStardustCount] = useState<number>(50);
  const [showPunctuationBorder, setShowPunctuationBorder] = useState(true);

  // Animation and viewport state
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [activePanel, setActivePanel] = useState<'style' | 'text' | 'palette' | 'geometry' | 'export'>('style');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResolution, setExportResolution] = useState<'hd' | '2k' | '4k'>('2k');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Color Palette Definitions
  const getThemeColors = useCallback((t: ColorTheme) => {
    switch (t) {
      case 'axum-gold':
        return {
          bgStart: '#141829',
          bgEnd: '#04060C',
          primary: '#F59E0B',
          secondary: '#F3E5AB',
          accent: '#D97706',
          highlight: '#FFF4D0',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: '#FFF4D0',
          border: '#D4AF37',
        };
      case 'crimson-gold':
        return {
          bgStart: '#4A051A',
          bgEnd: '#140106',
          primary: '#E11D48',
          secondary: '#FDE047',
          accent: '#BE123C',
          highlight: '#FFFBEB',
          glow: 'rgba(225, 29, 72, 0.45)',
          text: '#FEF08A',
          border: '#E11D48',
        };
      case 'lapis-silver':
        return {
          bgStart: '#0F2557',
          bgEnd: '#020617',
          primary: '#38BDF8',
          secondary: '#E2E8F0',
          accent: '#0284C7',
          highlight: '#FFFFFF',
          glow: 'rgba(56, 189, 248, 0.45)',
          text: '#F0F9FF',
          border: '#38BDF8',
        };
      case 'sanctuary-emerald':
        return {
          bgStart: '#063B2C',
          bgEnd: '#01150F',
          primary: '#10B981',
          secondary: '#FCD34D',
          accent: '#059669',
          highlight: '#ECFDF5',
          glow: 'rgba(16, 185, 129, 0.45)',
          text: '#A7F3D0',
          border: '#10B981',
        };
      case 'solar-ochre':
        return {
          bgStart: '#542008',
          bgEnd: '#180701',
          primary: '#F97316',
          secondary: '#FDE68A',
          accent: '#C2410C',
          highlight: '#FFF7ED',
          glow: 'rgba(249, 115, 22, 0.4)',
          text: '#FED7AA',
          border: '#F97316',
        };
      case 'cyber-neon':
        return {
          bgStart: '#1E1035',
          bgEnd: '#070312',
          primary: '#06B6D4',
          secondary: '#F43F5E',
          accent: '#A855F7',
          highlight: '#FFFFFF',
          glow: 'rgba(6, 182, 212, 0.5)',
          text: '#E0E7FF',
          border: '#A855F7',
        };
      case 'ancient-vellum':
        return {
          bgStart: '#FBF3DD',
          bgEnd: '#E4D1A7',
          primary: '#854D0E',
          secondary: '#713F12',
          accent: '#B45309',
          highlight: '#451A03',
          glow: 'rgba(133, 77, 14, 0.25)',
          text: '#291404',
          border: '#854D0E',
        };
    }
  }, []);

  // Compute Canvas Pixel Dimensions based on Aspect Ratio
  const getCanvasDimensions = (aspect: AspectRatio, res: 'hd' | '2k' | '4k' = '2k') => {
    let base = res === '4k' ? 3840 : res === '2k' ? 2048 : 1200;
    switch (aspect) {
      case '1:1':
        return { width: base, height: base };
      case '9:16':
        return { width: Math.round(base * 0.5625), height: base };
      case '16:9':
        return { width: base, height: Math.round(base * 0.5625) };
      case '3:4':
        return { width: Math.round(base * 0.75), height: base };
    }
  };

  // Helper to draw procedural Harag (ሓረግ) interwoven knotwork border
  const drawHaragBorder = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: ReturnType<typeof getThemeColors>,
    margin: number,
    complexity: number
  ) => {
    if (complexity <= 0) return;

    ctx.save();
    const w = width - margin * 2;
    const h = height - margin * 2;
    const ribbonWidth = Math.max(4, width * 0.009);

    // Outer double guideline rectangle
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = Math.max(2, width * 0.002);
    ctx.strokeRect(margin, margin, w, h);
    ctx.strokeRect(margin + ribbonWidth * 1.8, margin + ribbonWidth * 1.8, w - ribbonWidth * 3.6, h - ribbonWidth * 3.6);

    // Procedural Sine/Interlaced Ribbons along the 4 edges
    const drawInterlacedRibbon = (x1: number, y1: number, x2: number, y2: number, isHorizontal: boolean) => {
      const length = isHorizontal ? Math.abs(x2 - x1) : Math.abs(y2 - y1);
      const step = Math.max(16, width * 0.035);
      const segments = Math.floor(length / step);

      ctx.lineWidth = Math.max(2, width * 0.0035);

      // Primary Gold Ribbon Wave
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const offset = Math.sin(t * Math.PI * (segments / 2)) * (ribbonWidth * 0.9);
        const curX = isHorizontal ? x1 + (x2 - x1) * t : x1 + offset;
        const curY = isHorizontal ? y1 + offset : y1 + (y2 - y1) * t;

        if (i === 0) ctx.moveTo(curX, curY);
        else ctx.lineTo(curX, curY);
      }
      ctx.strokeStyle = colors.primary;
      ctx.stroke();

      // Intersecting Counter-Wave (Crimson / Secondary Accent)
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const offset = -Math.sin(t * Math.PI * (segments / 2)) * (ribbonWidth * 0.9);
        const curX = isHorizontal ? x1 + (x2 - x1) * t : x1 + offset;
        const curY = isHorizontal ? y1 + offset : y1 + (y2 - y1) * t;

        if (i === 0) ctx.moveTo(curX, curY);
        else ctx.lineTo(curX, curY);
      }
      ctx.strokeStyle = colors.secondary;
      ctx.stroke();

      // Beads / Golden Dots at Node Crossings
      ctx.fillStyle = colors.highlight;
      for (let i = 0; i <= segments; i += 2) {
        const t = i / segments;
        const curX = isHorizontal ? x1 + (x2 - x1) * t : x1;
        const curY = isHorizontal ? y1 : y1 + (y2 - y1) * t;
        ctx.beginPath();
        ctx.arc(curX, curY, Math.max(2, width * 0.003), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const topY = margin + ribbonWidth;
    const btmY = height - margin - ribbonWidth;
    const leftX = margin + ribbonWidth;
    const rightX = width - margin - ribbonWidth;

    drawInterlacedRibbon(leftX, topY, rightX, topY, true);
    drawInterlacedRibbon(leftX, btmY, rightX, btmY, true);
    drawInterlacedRibbon(leftX, topY, leftX, btmY, false);
    drawInterlacedRibbon(rightX, topY, rightX, btmY, false);

    // Ornate Corner Ethiopian Cross Rosettes
    const drawCornerKnot = (cx: number, cy: number) => {
      const radius = ribbonWidth * 2.2;
      ctx.save();
      ctx.translate(cx, cy);

      ctx.fillStyle = colors.primary;
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = Math.max(1.5, width * 0.002);

      // Central diamond
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.lineTo(radius, 0);
      ctx.lineTo(0, radius);
      ctx.lineTo(-radius, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 4 circular lobe florets (Traditional Harag finials)
      const lobes = [
        [0, -radius * 1.1],
        [radius * 1.1, 0],
        [0, radius * 1.1],
        [-radius * 1.1, 0],
      ];
      lobes.forEach(([lx, ly]) => {
        ctx.beginPath();
        ctx.arc(lx, ly, radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = colors.secondary;
        ctx.fill();
        ctx.strokeStyle = colors.highlight;
        ctx.stroke();
      });

      // Center gold pearl
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = colors.highlight;
      ctx.fill();

      ctx.restore();
    };

    drawCornerKnot(margin + ribbonWidth, margin + ribbonWidth);
    drawCornerKnot(width - margin - ribbonWidth, margin + ribbonWidth);
    drawCornerKnot(margin + ribbonWidth, height - margin - ribbonWidth);
    drawCornerKnot(width - margin - ribbonWidth, height - margin - ribbonWidth);

    ctx.restore();
  };

  // Helper to draw the center sacred talisman symbol
  const drawCenterIcon = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    icon: CenterIcon,
    colors: ReturnType<typeof getThemeColors>
  ) => {
    if (icon === 'none') return;
    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = Math.max(2, size * 0.04);
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = Math.max(6, size * 0.2);

    if (icon === 'cross') {
      // Ornate Axumite Lalibela Interlaced Cross
      const arm = size * 0.45;
      const thick = size * 0.16;

      ctx.beginPath();
      // Vertical bar
      ctx.rect(-thick / 2, -arm, thick, arm * 2);
      // Horizontal bar
      ctx.rect(-arm, -thick / 2, arm * 2, thick);
      ctx.fill();
      ctx.stroke();

      // Cross finial circles
      [
        [0, -arm],
        [0, arm],
        [-arm, 0],
        [arm, 0],
      ].forEach(([fx, fy]) => {
        ctx.beginPath();
        ctx.arc(fx, fy, thick * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = colors.secondary;
        ctx.fill();
        ctx.stroke();
      });

      // Center gem
      ctx.beginPath();
      ctx.arc(0, 0, thick * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = colors.highlight;
      ctx.fill();
    } else if (icon === 'sun') {
      // Radiating 12-point Sunburst
      const rays = 12;
      ctx.beginPath();
      for (let i = 0; i < rays * 2; i++) {
        const r = i % 2 === 0 ? size * 0.45 : size * 0.22;
        const a = (i * Math.PI) / rays;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = colors.highlight;
      ctx.fill();
    } else if (icon === 'stela') {
      // Axum Obelisk Silhouette
      const w = size * 0.28;
      const h = size * 0.8;
      ctx.beginPath();
      ctx.moveTo(-w * 0.6, h * 0.5);
      ctx.lineTo(w * 0.6, h * 0.5);
      ctx.lineTo(w * 0.45, -h * 0.4);
      // Stela apex rounded crown
      ctx.arc(0, -h * 0.4, w * 0.45, 0, Math.PI, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tiered window engravings
      for (let i = 0; i < 4; i++) {
        const wy = -h * 0.25 + i * (h * 0.18);
        ctx.fillStyle = colors.bgEnd;
        ctx.fillRect(-w * 0.25, wy, w * 0.5, h * 0.08);
      }
    } else if (icon === 'eye') {
      // Sacred Talismanic Eye
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.45, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fillStyle = colors.highlight;
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, size * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = colors.bgStart;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(-size * 0.04, -size * 0.04, size * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    } else if (icon === 'lotus') {
      // Sacred Rosette Flower
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.22, size * 0.12, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? colors.primary : colors.secondary;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = colors.highlight;
      ctx.fill();
    } else if (icon === 'lion') {
      // Imperial Crown Emblem
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, size * 0.2);
      ctx.lineTo(-size * 0.35, -size * 0.2);
      ctx.lineTo(-size * 0.15, 0);
      ctx.lineTo(0, -size * 0.35);
      ctx.lineTo(size * 0.15, 0);
      ctx.lineTo(size * 0.35, -size * 0.2);
      ctx.lineTo(size * 0.4, size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  };

  // Master Render Engine (Works for on-screen canvas and full 4K export canvas)
  const renderCanvas = useCallback((
    targetCanvas: HTMLCanvasElement,
    width: number,
    height: number,
    isExport = false
  ) => {
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    targetCanvas.width = width;
    targetCanvas.height = height;

    const colors = getThemeColors(theme);
    const cx = width / 2;
    const cy = height / 2;
    const minDim = Math.min(width, height);
    const baseRadius = minDim * 0.42;

    // 1. Clear & Background
    ctx.clearRect(0, 0, width, height);

    if (bgMode !== 'transparent') {
      if (bgMode === 'clean-white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      } else if (bgMode === 'dark-basalt') {
        const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.7);
        bgGrad.addColorStop(0, '#1E2333');
        bgGrad.addColorStop(1, '#080A10');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (bgMode === 'parchment' || theme === 'ancient-vellum') {
        // Ancient Birana Parchment with Aged Vignette
        const parchGrad = ctx.createRadialGradient(cx, cy, minDim * 0.2, cx, cy, minDim * 0.8);
        parchGrad.addColorStop(0, '#FFF9E6');
        parchGrad.addColorStop(0.7, '#F2E4C4');
        parchGrad.addColorStop(1, '#CDB07B');
        ctx.fillStyle = parchGrad;
        ctx.fillRect(0, 0, width, height);

        // Distressed aging vignette
        ctx.fillStyle = 'rgba(78, 48, 12, 0.08)';
        for (let i = 0; i < 400; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          const rsize = Math.random() * 3 + 1;
          ctx.fillRect(rx, ry, rsize, rsize);
        }
      } else {
        // Default Theme Radial Glow Background
        const grad = ctx.createRadialGradient(cx, cy, minDim * 0.1, cx, cy, minDim * 0.75);
        grad.addColorStop(0, colors.bgStart);
        grad.addColorStop(1, colors.bgEnd);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // 2. Cosmic Stardust / Golden Leaf Sparkles
    if (stardustCount > 0 && bgMode !== 'transparent') {
      ctx.save();
      for (let i = 0; i < stardustCount; i++) {
        // Pseudo-random deterministic placement
        const seed = (i * 9301 + 49297) % 233280;
        const randX = (seed / 233280) * width;
        const randY = (((i * 12345 + 6789) % 233280) / 233280) * height;
        const pRadius = (((i * 54321) % 100) / 100) * (minDim * 0.003) + 1;
        const alpha = 0.2 + (((i * 777) % 100) / 100) * 0.6;

        ctx.beginPath();
        ctx.arc(randX, randY, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = colors.highlight;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = pRadius * 3;
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Draw Harag (ሓረግ) Knotwork Outer Border
    const margin = minDim * 0.05;
    drawHaragBorder(ctx, width, height, colors, margin, haragDensity);

    // 4. Center Coordinates with optional Animation Rotation
    ctx.save();
    ctx.translate(cx, cy);
    if (!isExport && isAnimating) {
      ctx.rotate(rotationAngle);
    }

    const effectivePulse = !isExport && isAnimating ? Math.sin(pulsePhase) * 0.03 : 0;
    const scaleFactor = (1 + effectivePulse) * glyphScale;

    // =========================================================================
    // STYLE 1: AXUMITE TALISMANIC SEAL (ማኅተም ኣክሱም)
    // =========================================================================
    if (style === 'talisman') {
      // Concentric Talisman Rings
      for (let r = 1; r <= concentricRings; r++) {
        const radius = (baseRadius * (r / concentricRings)) * scaleFactor;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = r === concentricRings ? colors.primary : colors.secondary;
        ctx.lineWidth = r === concentricRings ? Math.max(3, width * 0.004) : Math.max(1.5, width * 0.002);
        ctx.stroke();

        // Inner micro-ring beads
        if (r > 1) {
          const beadCount = symmetryFolds * 4;
          for (let b = 0; b < beadCount; b++) {
            const angle = (b * Math.PI * 2) / beadCount;
            const bx = Math.cos(angle) * (radius - minDim * 0.015);
            const by = Math.sin(angle) * (radius - minDim * 0.015);
            ctx.beginPath();
            ctx.arc(bx, by, Math.max(1.5, minDim * 0.0025), 0, Math.PI * 2);
            ctx.fillStyle = colors.highlight;
            ctx.fill();
          }
        }
      }

      // Radiating Geometric Sunburst Rays
      ctx.save();
      for (let s = 0; s < symmetryFolds; s++) {
        const angle = (s * Math.PI * 2) / symmetryFolds;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * baseRadius * scaleFactor, Math.sin(angle) * baseRadius * scaleFactor);
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = Math.max(1, width * 0.0018);
        ctx.globalAlpha = 0.45;
        ctx.stroke();
      }
      ctx.restore();

      // Circular Text Inscription along Inner Ring
      const textRadius = baseRadius * 0.72 * scaleFactor;
      const textToRepeat = `${word} ፨ ${word} ፨ ${word} ፨ ${word} ፨ `;
      const chars = textToRepeat.split('');
      const charAngleStep = (Math.PI * 2) / chars.length;

      ctx.save();
      ctx.font = `bold ${Math.max(16, minDim * 0.045 * scaleFactor)}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 15;

      chars.forEach((char, i) => {
        const charAngle = i * charAngleStep;
        ctx.save();
        ctx.rotate(charAngle);
        ctx.translate(0, -textRadius);
        ctx.fillText(char, 0, 0);
        ctx.restore();
      });
      ctx.restore();

      // Primary Center Inscription
      ctx.save();
      const primaryFontSize = Math.max(28, minDim * 0.13 * scaleFactor);
      ctx.font = `black ${primaryFontSize}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 3D Drop Shadow effect for Ge'ez characters
      ctx.fillStyle = colors.secondary;
      ctx.fillText(word, 2, 4);

      ctx.fillStyle = colors.highlight;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 25;
      ctx.fillText(word, 0, 0);

      // Subtitle below center word
      if (subtitle) {
        ctx.font = `600 ${Math.max(10, minDim * 0.024 * scaleFactor)}px 'Cinzel', sans-serif`;
        ctx.fillStyle = colors.secondary;
        ctx.shadowBlur = 0;
        ctx.fillText(subtitle, 0, primaryFontSize * 0.75);
      }

      // Ornamental Header & Footer Ge'ez Punctuation rosettes
      if (showPunctuationBorder) {
        ctx.font = `bold ${Math.max(18, minDim * 0.05 * scaleFactor)}px serif`;
        ctx.fillStyle = colors.primary;
        ctx.fillText('፠ ፨ ፠', 0, -primaryFontSize * 0.75);
      }
      ctx.restore();

      // Center Icon
      drawCenterIcon(ctx, 0, 0, minDim * 0.22 * scaleFactor, centerIcon, colors);
    }

    // =========================================================================
    // STYLE 2: ILLUMINATED BIRANA MANUSCRIPT (ብራና ጥበብ)
    // =========================================================================
    else if (style === 'manuscript') {
      const frameW = minDim * 0.75 * scaleFactor;
      const frameH = minDim * 0.75 * scaleFactor;

      // Illuminated Cartouche Outer Oval / Diamond
      ctx.save();
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = Math.max(3, width * 0.005);
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 18;

      ctx.beginPath();
      ctx.ellipse(0, 0, frameW * 0.5, frameH * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Interlaced Knotwork Ring
      ctx.beginPath();
      ctx.ellipse(0, 0, frameW * 0.42, frameH * 0.42, 0, 0, Math.PI * 2);
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = Math.max(2, width * 0.003);
      ctx.stroke();

      // 8 Radiant Manuscript Rosettes around boundary
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8;
        const rx = Math.cos(a) * (frameW * 0.5);
        const ry = Math.sin(a) * (frameH * 0.5);
        ctx.save();
        ctx.translate(rx, ry);
        ctx.fillStyle = colors.highlight;
        ctx.beginPath();
        ctx.arc(0, 0, minDim * 0.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // Center Massive Ge'ez Illuminated Letter/Word
      ctx.save();
      const mainSize = Math.max(36, minDim * 0.16 * scaleFactor);
      ctx.font = `black ${mainSize}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Gold Leaf Emboss
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = Math.max(4, width * 0.008);
      ctx.strokeText(word, 0, 0);

      ctx.fillStyle = colors.highlight;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 30;
      ctx.fillText(word, 0, 0);

      // Subtitle Scroll Banner
      if (subtitle) {
        ctx.font = `bold ${Math.max(12, minDim * 0.028 * scaleFactor)}px 'Cinzel', sans-serif`;
        ctx.fillStyle = colors.primary;
        ctx.fillText(`፦ ${subtitle} ፦`, 0, mainSize * 0.85);
      }

      ctx.font = `bold ${Math.max(20, minDim * 0.06 * scaleFactor)}px serif`;
      ctx.fillStyle = colors.secondary;
      ctx.fillText('፨ ፠ ፨', 0, -mainSize * 0.85);
      ctx.restore();

      drawCenterIcon(ctx, 0, -frameH * 0.28, minDim * 0.16 * scaleFactor, centerIcon, colors);
    }

    // =========================================================================
    // STYLE 3: RADIAL FIDEL MANDALA (መንደላ ፊደላት)
    // =========================================================================
    else if (style === 'mandala') {
      const letters = word.split('');
      const folds = symmetryFolds;

      // Symmetrical Petal Rings
      for (let layer = 1; layer <= concentricRings; layer++) {
        const ringRadius = (baseRadius * (layer / concentricRings)) * scaleFactor;
        const letter = letters[(layer - 1) % letters.length] || word;

        ctx.save();
        ctx.font = `bold ${Math.max(18, minDim * 0.06 * (layer / concentricRings) * scaleFactor)}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = layer % 2 === 0 ? colors.primary : colors.secondary;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = (glowIntensity / 100) * 15;

        for (let f = 0; f < folds; f++) {
          const angle = (f * Math.PI * 2) / folds;
          const x = Math.cos(angle) * ringRadius;
          const y = Math.sin(angle) * ringRadius;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle + Math.PI / 2);
          ctx.fillText(letter, 0, 0);
          ctx.restore();

          // Connective sacred lattice lines
          if (layer > 1) {
            const innerRadius = (baseRadius * ((layer - 1) / concentricRings)) * scaleFactor;
            const inX = Math.cos(angle) * innerRadius;
            const inY = Math.sin(angle) * innerRadius;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(inX, inY);
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = Math.max(1, width * 0.0015);
            ctx.globalAlpha = 0.35;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // Center Mandala Core
      drawCenterIcon(ctx, 0, 0, minDim * 0.28 * scaleFactor, centerIcon, colors);

      // Primary Center Title
      ctx.save();
      ctx.font = `black ${Math.max(24, minDim * 0.08 * scaleFactor)}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
      ctx.fillStyle = colors.highlight;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 20;
      ctx.fillText(word, 0, minDim * 0.28 * scaleFactor);

      if (subtitle) {
        ctx.font = `bold ${Math.max(10, minDim * 0.022 * scaleFactor)}px 'Cinzel', sans-serif`;
        ctx.fillStyle = colors.secondary;
        ctx.fillText(subtitle, 0, minDim * 0.34 * scaleFactor);
      }
      ctx.restore();
    }

    // =========================================================================
    // STYLE 4: SOVEREIGN OBELISK & STELA (ሓወልቲ ኦበሊስክ)
    // =========================================================================
    else if (style === 'stela') {
      const stelaW = minDim * 0.32 * scaleFactor;
      const stelaH = minDim * 0.82 * scaleFactor;

      // Stela Pillar Granite Silhouette
      ctx.save();
      const stelaGrad = ctx.createLinearGradient(-stelaW / 2, 0, stelaW / 2, 0);
      stelaGrad.addColorStop(0, colors.secondary);
      stelaGrad.addColorStop(0.5, colors.highlight);
      stelaGrad.addColorStop(1, colors.secondary);

      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = Math.max(3, width * 0.005);
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 20;

      // Architectural Stela Profile
      ctx.beginPath();
      ctx.moveTo(-stelaW * 0.55, stelaH * 0.45);
      ctx.lineTo(stelaW * 0.55, stelaH * 0.45);
      ctx.lineTo(stelaW * 0.42, -stelaH * 0.42);
      ctx.arc(0, -stelaH * 0.42, stelaW * 0.42, 0, Math.PI, true);
      ctx.closePath();
      ctx.stroke();

      // Tiered Stone Carved Windows
      const tiers = 6;
      for (let t = 0; t < tiers; t++) {
        const ty = -stelaH * 0.3 + t * (stelaH * 0.12);
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = Math.max(1.5, width * 0.002);
        ctx.strokeRect(-stelaW * 0.28, ty, stelaW * 0.56, stelaH * 0.06);
      }

      // Vertical Calligraphic Glyphs inscribed inside the Stela
      const chars = word.split('');
      const charStep = (stelaH * 0.55) / (chars.length || 1);
      ctx.font = `black ${Math.max(20, minDim * 0.08 * scaleFactor)}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colors.highlight;

      chars.forEach((c, idx) => {
        const cyPos = -stelaH * 0.22 + idx * charStep;
        ctx.fillText(c, 0, cyPos);
      });

      // Stela Apex Sunburst Crown
      drawCenterIcon(ctx, 0, -stelaH * 0.42, minDim * 0.18 * scaleFactor, 'sun', colors);

      // Base Inscription
      if (subtitle) {
        ctx.font = `bold ${Math.max(11, minDim * 0.024 * scaleFactor)}px 'Cinzel', sans-serif`;
        ctx.fillStyle = colors.primary;
        ctx.fillText(subtitle, 0, stelaH * 0.48);
      }
      ctx.restore();
    }

    // =========================================================================
    // STYLE 5: GOLDEN CALLIGRAPHIC WAVE (ወርቃዊ ማዕበል)
    // =========================================================================
    else if (style === 'wave') {
      const waveCount = 5;
      ctx.save();

      for (let wIdx = 0; wIdx < waveCount; wIdx++) {
        const wRadius = (baseRadius * ((wIdx + 1) / waveCount)) * scaleFactor;
        ctx.beginPath();

        const points = 120;
        for (let p = 0; p <= points; p++) {
          const angle = (p / points) * Math.PI * 2;
          const harmonic = Math.sin(angle * symmetryFolds + wIdx) * (minDim * 0.04);
          const r = wRadius + harmonic;
          const wx = Math.cos(angle) * r;
          const wy = Math.sin(angle) * r;

          if (p === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.closePath();
        ctx.strokeStyle = wIdx % 2 === 0 ? colors.primary : colors.secondary;
        ctx.lineWidth = Math.max(2, width * 0.003);
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = (glowIntensity / 100) * 12;
        ctx.stroke();
      }

      // Word along central flow ribbon
      ctx.font = `black ${Math.max(32, minDim * 0.14 * scaleFactor)}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colors.highlight;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 30;
      ctx.fillText(word, 0, 0);

      if (subtitle) {
        ctx.font = `bold ${Math.max(12, minDim * 0.026 * scaleFactor)}px 'Cinzel', sans-serif`;
        ctx.fillStyle = colors.secondary;
        ctx.fillText(`~ ${subtitle} ~`, 0, minDim * 0.12 * scaleFactor);
      }

      drawCenterIcon(ctx, 0, -minDim * 0.22 * scaleFactor, minDim * 0.16 * scaleFactor, centerIcon, colors);
      ctx.restore();
    }

    // =========================================================================
    // STYLE 6: IMPERIAL CROSS & CROWN CREST (ናይ ንግስነት ማዕተብ)
    // =========================================================================
    else if (style === 'crest') {
      const crestR = baseRadius * 0.85 * scaleFactor;

      ctx.save();
      // Outer Medallion Beaded Ring
      ctx.beginPath();
      ctx.arc(0, 0, crestR, 0, Math.PI * 2);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = Math.max(4, width * 0.006);
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 20;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, crestR * 0.88, 0, Math.PI * 2);
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = Math.max(2, width * 0.003);
      ctx.stroke();

      // Top Imperial Crown
      drawCenterIcon(ctx, 0, -crestR * 0.9, minDim * 0.24 * scaleFactor, 'lion', colors);

      // Central Imperial Cross Backdrop
      drawCenterIcon(ctx, 0, 0, minDim * 0.35 * scaleFactor, 'cross', colors);

      // Upper Arched Inscription: Word
      ctx.font = `black ${Math.max(28, minDim * 0.11 * scaleFactor)}px 'Cinzel', 'Noto Sans Ethiopic', serif`;
      ctx.fillStyle = colors.highlight;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = (glowIntensity / 100) * 25;
      ctx.fillText(word, 0, minDim * 0.18 * scaleFactor);

      // Lower Ribbon: Subtitle
      if (subtitle) {
        ctx.font = `bold ${Math.max(11, minDim * 0.024 * scaleFactor)}px 'Cinzel', sans-serif`;
        ctx.fillStyle = colors.secondary;
        ctx.fillText(`★ ${subtitle} ★`, 0, minDim * 0.26 * scaleFactor);
      }
      ctx.restore();
    }

    ctx.restore(); // restore center translation
  }, [
    word, subtitle, style, theme, bgMode, centerIcon, symmetryFolds,
    concentricRings, glyphScale, haragDensity, glowIntensity, stardustCount,
    showPunctuationBorder, isAnimating, rotationAngle, pulsePhase, getThemeColors
  ]);

  // Redraw canvas when parameters update
  useEffect(() => {
    if (!canvasRef.current) return;
    const { width, height } = getCanvasDimensions(aspectRatio, '2k');
    renderCanvas(canvasRef.current, width, height, false);
  }, [renderCanvas, aspectRatio]);

  // Animation Loop handler
  useEffect(() => {
    if (!isAnimating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setRotationAngle((prev) => (prev + dt * 0.15) % (Math.PI * 2));
      setPulsePhase((prev) => (prev + dt * 2.0) % (Math.PI * 2));

      if (canvasRef.current) {
        const { width, height } = getCanvasDimensions(aspectRatio, '2k');
        renderCanvas(canvasRef.current, width, height, false);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAnimating, aspectRatio, renderCanvas]);

  // High-Resolution Image Export (Lossless PNG / JPEG)
  const handleExportImage = async (format: 'png' | 'jpeg' = 'png') => {
    setIsExporting(true);
    try {
      const { width, height } = getCanvasDimensions(aspectRatio, exportResolution);
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;

      // Render crisp masterpiece at requested export resolution
      renderCanvas(offscreenCanvas, width, height, true);

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = offscreenCanvas.toDataURL(mimeType, 0.98);

      const a = document.createElement('a');
      const filenameWord = (word || 'geez').replace(/\s+/g, '_');
      a.download = `AXUMITE_Geez_Calligraphy_${filenameWord}_${exportResolution.toUpperCase()}_${Date.now()}.${format}`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(`✨ High-Resolution ${exportResolution.toUpperCase()} ${format.toUpperCase()} downloaded successfully!`);
    } catch (err: any) {
      console.error('Export failed:', err);
      showToast('⚠️ Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyToClipboard = async () => {
    try {
      const { width, height } = getCanvasDimensions(aspectRatio, 'hd');
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      renderCanvas(offscreenCanvas, width, height, true);

      offscreenCanvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Blob generation failed');
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('📋 Calligraphic masterpiece copied to clipboard!');
      }, 'image/png');
    } catch (err) {
      console.warn('Clipboard copy error:', err);
      showToast('⚠️ Could not copy image directly. Use Download instead.');
    }
  };

  // Save to Axumite Insights Library
  const handleSaveToInsights = () => {
    if (!canvasRef.current) return;
    try {
      const { width, height } = getCanvasDimensions(aspectRatio, 'hd');
      const offscreenCanvas = document.createElement('canvas');
      renderCanvas(offscreenCanvas, width, height, true);
      const thumbData = offscreenCanvas.toDataURL('image/jpeg', 0.85);

      const newItem: SavedItem = {
        id: `geez_art_${Date.now()}`,
        title: `Ge'ez Calligraphy: ${word} (${style.toUpperCase()})`,
        type: 'calligraphy',
        content: `Artistic Ge'ez Calligraphic Pattern\nWord: "${word}"\nSubtitle: "${subtitle}"\nStyle: ${style}\nTheme: ${theme}\nSymmetry: ${symmetryFolds}-fold`,
        tags: ['geez', 'calligraphy', 'canvas-art', style, theme],
        createdAt: new Date().toISOString(),
        metadata: {
          word,
          subtitle,
          style,
          theme,
          aspectRatio,
          thumbnailUrl: thumbData,
        }
      };

      if (onSaveInsight) {
        onSaveInsight(newItem);
      } else {
        // Fallback to local storage persistence
        const existing = JSON.parse(localStorage.getItem('axumite_saved_insights') || '[]');
        localStorage.setItem('axumite_saved_insights', JSON.stringify([newItem, ...existing]));
      }

      showToast('🔖 Masterpiece saved to your Saved Vault!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  // Randomize / Shuffle Generator
  const handleShuffleRandomize = () => {
    const styles: CalligraphyStyle[] = ['talisman', 'manuscript', 'mandala', 'stela', 'wave', 'crest'];
    const themes: ColorTheme[] = ['axum-gold', 'crimson-gold', 'lapis-silver', 'sanctuary-emerald', 'solar-ochre', 'cyber-neon', 'ancient-vellum'];
    const icons: CenterIcon[] = ['cross', 'lion', 'stela', 'sun', 'eye', 'lotus'];
    const randomPreset = PRESET_WORDS[Math.floor(Math.random() * PRESET_WORDS.length)];

    setWord(randomPreset.ti);
    setSubtitle(randomPreset.subtitle);
    setStyle(styles[Math.floor(Math.random() * styles.length)]);
    setTheme(themes[Math.floor(Math.random() * themes.length)]);
    setCenterIcon(icons[Math.floor(Math.random() * icons.length)]);
    setSymmetryFolds([4, 6, 8, 12, 16][Math.floor(Math.random() * 5)]);
    setConcentricRings(Math.floor(Math.random() * 4) + 2);
    setGlowIntensity(Math.floor(Math.random() * 40) + 60);

    showToast(`🎲 Generated: "${randomPreset.ti}" (${randomPreset.en})`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 px-3 sm:px-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#161B2E] border border-amber-400 text-amber-200 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-2xl flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#181105] via-[#2F1F0A] to-[#120B03] border-2 border-[#C5A059]/60 shadow-[0_0_35px_rgba(197,160,89,0.2)] text-white">
        <div className="absolute top-0 right-0 w-96 h-full bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 flex-wrap mb-1.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-[#F3E5AB] border border-amber-400/40 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>SACRED SCRIPT STUDIO • ኪነ-ጽሕፈት ግዕዝ</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                4K UHD Canvas Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-cinzel tracking-tight metallic-gold-shimmer leading-tight">
              {language === 'ti' ? 'ኪነ-ጽሕፈትን ቅርጽን ግዕዝ' : "Ge'ez Calligraphic Pattern Studio"}
            </h1>
            <p className="text-xs sm:text-sm text-[#F3E5AB]/80 mt-1 max-w-2xl">
              {language === 'ti' 
                ? 'ካብ ዝመረጽኩምዎ ቃላት ውቁብ ናይ ጥንቲ ማኅተም፣ ናይ ብራና ሓረግን መንደላን ብናይ Canvas ቴክኖሎጂ ብሉጽ 4K ስእሊ ኣመንጭዉ።'
                : 'Transform any word into breathtaking Axumite talismanic seals, illuminated manuscript Harag knotworks, and radial mandalas with exportable 4K ultra-high resolution.'}
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShuffleRandomize}
              className="px-3.5 py-2.5 rounded-xl bg-[#251A0D] border border-amber-500/50 hover:border-amber-300 text-amber-200 hover:text-white text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95"
              title="Generate random artwork"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{language === 'ti' ? 'ተዘዋዋሪ ፍጠር' : 'Shuffle Random'}</span>
            </button>

            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                isAnimating 
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30' 
                  : 'bg-[#1C2033] border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
              title="Toggle smooth animation rotation"
            >
              {isAnimating ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isAnimating ? 'ደው ኣብል' : (language === 'ti' ? 'ኣንቀሳቕስ' : 'Animate')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Canvas Viewport | Right Control Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: INTERACTIVE CANVAS VIEWPORT                                  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          {/* Canvas Card Container */}
          <div className="relative rounded-3xl p-4 sm:p-6 bg-[#080A12] border border-[#C5A059]/40 shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[420px] sm:min-h-[520px]">
            
            {/* Ambient gold glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-black/40 pointer-events-none" />

            {/* Canvas Element */}
            <div 
              className="relative transition-transform duration-200 flex items-center justify-center shadow-[0_15px_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <canvas
                ref={canvasRef}
                className="max-h-[500px] w-auto max-w-full object-contain rounded-2xl"
                style={{
                  aspectRatio: aspectRatio.replace(':', '/'),
                }}
              />
            </div>

            {/* Viewport Floating Zoom & Ratio Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              
              {/* Aspect Ratio Selector Pills */}
              <div className="flex items-center space-x-1.5 bg-[#0C101E]/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
                {(['1:1', '9:16', '16:9', '3:4'] as AspectRatio[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      aspectRatio === r
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-[#0C101E]/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-amber-300 font-bold px-1.5">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1.0)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Export / Save Action Ribbon below Canvas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleExportImage('png')}
              disabled={isExporting}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer border border-amber-300"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isExporting ? 'ምድላው...' : '4K PNG ውረድ'}</span>
            </button>

            <button
              onClick={() => handleExportImage('jpeg')}
              disabled={isExporting}
              className="py-3 px-3 rounded-2xl bg-[#161B2E] hover:bg-[#1E2540] border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>JPEG ውረድ</span>
            </button>

            <button
              onClick={handleCopyToClipboard}
              className="py-3 px-3 rounded-2xl bg-[#161B2E] hover:bg-[#1E2540] border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
              <span>ቅዳሕ (Copy)</span>
            </button>

            <button
              onClick={handleSaveToInsights}
              className="py-3 px-3 rounded-2xl bg-[#161B2E] hover:bg-[#1E2540] border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>ኣቐምጥ (Save)</span>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: CUSTOMIZATION & DESIGN CONTROLS                             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Navigation Control Tabs */}
          <div className="flex items-center space-x-1 bg-[#0E1220] p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'style', labelTi: 'ቅዲ (Style)', icon: Grid },
              { id: 'text', labelTi: 'ቃል (Text)', icon: Type },
              { id: 'palette', labelTi: 'ሕብሪ (Colors)', icon: Palette },
              { id: 'geometry', labelTi: 'ቅርጺ (Geometry)', icon: Sliders },
              { id: 'export', labelTi: 'ምውራድ (Export)', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center space-x-1 transition-all cursor-pointer ${
                    activePanel === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] truncate">{tab.labelTi}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: ARTISTIC STYLE SELECTOR */}
          {activePanel === 'style' && (
            <div className="bg-[#0C101D] p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                {language === 'ti' ? 'ናይ ኪነ-ጽሕፈት ቅዲ ምረጹ' : 'Select Calligraphic Style'}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'talisman', title: 'ማኅተም ኣክሱም', en: 'Talismanic Seal', desc: 'Concentric talisman & radial sunburst cross' },
                  { id: 'manuscript', title: 'ብራና ጥበብ', en: 'Illuminated Manuscript', desc: 'Interlaced Harag ribbon knotwork border' },
                  { id: 'mandala', title: 'መንደላ ፊደላት', en: 'Fidel Mandala', desc: 'Kaleidoscope orbital sacred geometry' },
                  { id: 'stela', title: 'ሓወልቲ ኦበሊስክ', en: 'Sovereign Stela', desc: 'Tiered architectural granite column' },
                  { id: 'wave', title: 'ወርቃዊ ማዕበል', en: 'Golden Wave', desc: 'Harmonic sine ribbons with stardust particles' },
                  { id: 'crest', title: 'ናይ ንግስነት ማዕተብ', en: 'Imperial Crest', desc: 'Royal heraldic cross & crown medallion' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id as CalligraphyStyle)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      style === s.id
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                        : 'bg-[#121626] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-black text-[#F3E5AB] flex items-center justify-between">
                      <span>{s.title}</span>
                      {style === s.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {s.en}
                    </div>
                    <p className="text-[9.5px] text-slate-400/80 leading-tight mt-1.5">
                      {s.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Center Icon Symbol Picker */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'ti' ? 'ማእከላይ ምልክት (Center Talisman Symbol)' : 'Center Sacred Emblem'}
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'cross', label: '✞ መስቀል' },
                    { id: 'lion', label: '🦁 ዘውዲ' },
                    { id: 'stela', label: '🏛️ ሓወልቲ' },
                    { id: 'sun', label: '☀️ ጸሓይ' },
                    { id: 'eye', label: '👁️ ማዕተብ' },
                    { id: 'lotus', label: '🌸 ዕንባባ' },
                    { id: 'none', label: '✕ የለን' },
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      onClick={() => setCenterIcon(ic.id as CenterIcon)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        centerIcon === ic.id
                          ? 'bg-amber-500 text-slate-950 border-amber-300'
                          : 'bg-[#15192C] text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {ic.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEXT & GE'EZ KEYBOARD TRAY */}
          {activePanel === 'text' && (
            <div className="bg-[#0C101D] p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
              
              {/* Primary Word Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-300 block">
                  {language === 'ti' ? 'ቀንዲ ቃል ወይ ስም (Primary Word / Name)' : 'Primary Word or Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="e.g. ሰላም, ፍቕሪ, ኣክሱም..."
                    className="w-full bg-[#14192B] border border-amber-500/50 focus:border-amber-400 rounded-2xl px-4 py-3 text-base sm:text-lg font-bold text-white placeholder-slate-500 focus:outline-none shadow-inner"
                  />
                  {word && (
                    <button
                      onClick={() => setWord('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Subtitle Inscription */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'ti' ? 'ንኡስ መግለጺ (Secondary Inscription)' : 'Secondary Subtitle Inscription'}
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. AXUMITE SACRED HERITAGE"
                  className="w-full bg-[#14192B] border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Quick Preset Words Chips */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ti' ? 'ቅዱሳት ቃላት (Sacred Words Presets)' : 'Sacred Word Presets'}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap max-h-36 overflow-y-auto pr-1">
                  {PRESET_WORDS.map((p) => (
                    <button
                      key={p.ti}
                      onClick={() => {
                        setWord(p.ti);
                        setSubtitle(p.subtitle);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        word === p.ti
                          ? 'bg-amber-500 text-slate-950 border-amber-300'
                          : 'bg-[#15192C] text-[#F3E5AB] border-slate-700/80 hover:border-amber-500/50'
                      }`}
                    >
                      <span>{p.ti}</span>
                      <span className="text-[10px] opacity-70 ml-1">({p.en.split(' ')[0]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Ge'ez Fidel Keyboard Tray */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{language === 'ti' ? 'ፊደላት ግዕዝ (Ge\'ez Fidel Tray)' : "Ge'ez Fidel Tray"}</span>
                  <span className="text-[10px] text-amber-400">Click to append</span>
                </div>

                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 max-h-40 overflow-y-auto p-2 bg-[#090C16] rounded-2xl border border-slate-800">
                  {GEEZ_KEYBOARD_FIDELS.map((fidel, i) => (
                    <button
                      key={i}
                      onClick={() => setWord((prev) => prev + fidel)}
                      className="h-8 rounded-lg bg-[#14192B] hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer border border-slate-800 active:scale-95"
                    >
                      {fidel}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: COLOR PALETTES & TEXTURES */}
          {activePanel === 'palette' && (
            <div className="bg-[#0C101D] p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                {language === 'ti' ? 'ሕብሪ ምረጹ (Color Palettes)' : 'Royal Color Themes'}
              </div>

              <div className="space-y-2">
                {[
                  { id: 'axum-gold', name: 'ወርቂ ኣክሱም (Royal Axum Gold)', colors: ['#F59E0B', '#F3E5AB', '#141829'] },
                  { id: 'crimson-gold', name: 'ንግስነት ቀይሕ (Imperial Crimson)', colors: ['#E11D48', '#FDE047', '#4A051A'] },
                  { id: 'lapis-silver', name: 'ሰማያዊ ላፒስ (Sacred Lapis & Silver)', colors: ['#38BDF8', '#E2E8F0', '#0F2557'] },
                  { id: 'sanctuary-emerald', name: 'ሓምላይ ቤተ-መቕደስ (Sanctuary Emerald)', colors: ['#10B981', '#FCD34D', '#063B2C'] },
                  { id: 'solar-ochre', name: 'በረኻዊ ኦከር (Solar Terracotta)', colors: ['#F97316', '#FDE68A', '#542008'] },
                  { id: 'cyber-neon', name: 'ሳይበር ኦሮራ (Cyber Aurora Neon)', colors: ['#06B6D4', '#F43F5E', '#1E1035'] },
                  { id: 'ancient-vellum', name: 'ጥንታዊ ብራና (Ancient Vellum Parchment)', colors: ['#854D0E', '#451A03', '#FBF3DD'] },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id as ColorTheme)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      theme === th.id
                        ? 'bg-amber-500/15 border-amber-400 text-white'
                        : 'bg-[#121626] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center -space-x-1.5">
                        {th.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border-2 border-[#0C101D] shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold">{th.name}</span>
                    </div>
                    {theme === th.id && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                ))}
              </div>

              {/* Background Mode Selector */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'ti' ? 'ናይ ድሕረ-ባይታ ዓይነት (Background Mode)' : 'Background Texture'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'theme', label: 'Theme Gradient' },
                    { id: 'parchment', label: '📜 ብራና (Vellum)' },
                    { id: 'dark-basalt', label: '🗿 ጸሊም ባዛልት' },
                    { id: 'clean-white', label: '⚪ ንጹህ ጻዕዳ' },
                    { id: 'transparent', label: '⚑ ግልጺ (PNG)' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBgMode(b.id as BackgroundMode)}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        bgMode === b.id
                          ? 'bg-amber-500 text-slate-950 border-amber-300'
                          : 'bg-[#15192C] text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GEOMETRY & PARAMETERS SLIDERS */}
          {activePanel === 'geometry' && (
            <div className="bg-[#0C101D] p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                {language === 'ti' ? 'ናይ ጂኦሜትሪ ቅጥዕታት (Fine-Tuning)' : 'Geometric Fine-Tuning'}
              </div>

              {/* Symmetry Folds */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{language === 'ti' ? 'ምድጋም ጂኦሜትሪ (Symmetry Folds)' : 'Symmetry Axes'}</span>
                  <span className="text-amber-400 font-mono">{symmetryFolds}-Fold</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[4, 6, 8, 12, 16, 24].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSymmetryFolds(f)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        symmetryFolds === f
                          ? 'bg-amber-500 text-slate-950 border-amber-300'
                          : 'bg-[#15192C] text-slate-300 border-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Harag Knotwork Density */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{language === 'ti' ? 'ሓረግ ጽዓት (Harag Knotwork Density)' : 'Harag Knot Density'}</span>
                  <span className="text-amber-400 font-mono">{haragDensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={haragDensity}
                  onChange={(e) => setHaragDensity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Glow Intensity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{language === 'ti' ? 'ብርሃን ድሙቕነት (Luminous Glow)' : 'Glow Bloom Intensity'}</span>
                  <span className="text-amber-400 font-mono">{glowIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Stardust Particles */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{language === 'ti' ? 'ወርቃዊ ብልጭታ (Stardust Particles)' : 'Gold Foil Dust Sparkles'}</span>
                  <span className="text-amber-400 font-mono">{stardustCount}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={stardustCount}
                  onChange={(e) => setStardustCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Glyph Scale */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{language === 'ti' ? 'ዓቐን ፊደል (Glyph Scale)' : 'Typography Scale'}</span>
                  <span className="text-amber-400 font-mono">{Math.round(glyphScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={Math.round(glyphScale * 100)}
                  onChange={(e) => setGlyphScale(Number(e.target.value) / 100)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

            </div>
          )}

          {/* TAB 5: EXPORT RESOLUTION & FORMATS */}
          {activePanel === 'export' && (
            <div className="bg-[#0C101D] p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                {language === 'ti' ? 'ምውራድን ምዕቃብን (Export Masterpiece)' : 'Export Masterpiece'}
              </div>

              {/* Resolution Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'ti' ? 'ናይ ስእሊ ጽሬት (Canvas Resolution)' : 'Export Resolution'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'hd', label: '1080p HD', desc: '1200 x 1200' },
                    { id: '2k', label: '2K QHD', desc: '2048 x 2048' },
                    { id: '4k', label: '4K UHD', desc: '3840 x 3840' },
                  ].map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setExportResolution(res.id as any)}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        exportResolution === res.id
                          ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                          : 'bg-[#14192B] text-slate-300 border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{res.label}</div>
                      <div className="text-[10px] opacity-75 font-mono">{res.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleExportImage('png')}
                  disabled={isExporting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer border border-amber-200"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>{isExporting ? 'Generating High-Res File...' : `Download Lossless PNG (${exportResolution.toUpperCase()})`}</span>
                </button>

                <button
                  onClick={() => handleExportImage('jpeg')}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-2xl bg-[#181D30] hover:bg-[#202742] border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Download JPEG Image</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="w-full py-3 px-4 rounded-2xl bg-[#181D30] hover:bg-[#202742] border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>Copy Image to Clipboard</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                💡 Masterpiece generated using native Canvas 2D vectors and Ge'ez Harag procedural knotwork mathematics. Crystal clear for print posters, wall frames, phone wallpapers, and digital emblems.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
