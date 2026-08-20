import React, { createContext, useContext, useState, useEffect } from 'react';

export type GoldIntensity = 'soft' | 'balanced' | 'rich' | 'pure-axum';
export type ThemeHue = 
  | 'royal-axum' 
  | 'redsea-emerald' 
  | 'dahlak-sapphire' 
  | 'amethyst-stela' 
  | 'terracotta-sun' 
  | 'obsidian-monolith';

export interface BrandingConfig {
  goldIntensity: GoldIntensity;
  themeHue: ThemeHue;
  goldShimmerEffect: boolean;
  borderGlow: boolean;
  customAccentHex?: string;
}

export interface BrandingThemeContextType {
  branding: BrandingConfig;
  setGoldIntensity: (intensity: GoldIntensity) => void;
  setThemeHue: (hue: ThemeHue) => void;
  setGoldShimmerEffect: (enabled: boolean) => void;
  setBorderGlow: (enabled: boolean) => void;
  setCustomAccentHex: (hex: string | undefined) => void;
  updateBranding: (partial: Partial<BrandingConfig>) => void;
  resetToDefaultBranding: () => void;
  // Computed CSS tokens
  goldAccentColor: string;
  goldAccentGlow: string;
  themeHueColor: string;
  themeHueBg: string;
}

const DEFAULT_BRANDING: BrandingConfig = {
  goldIntensity: 'balanced',
  themeHue: 'royal-axum',
  goldShimmerEffect: true,
  borderGlow: true,
};

const GOLD_PALETTE: Record<GoldIntensity, { primary: string; glow: string; text: string; multiplier: number }> = {
  soft: {
    primary: '#D1B26F',
    glow: 'rgba(209, 178, 111, 0.25)',
    text: '#C2A35B',
    multiplier: 0.7,
  },
  balanced: {
    primary: '#E1C47D',
    glow: 'rgba(225, 196, 125, 0.4)',
    text: '#D4AF37',
    multiplier: 1.0,
  },
  rich: {
    primary: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.55)',
    text: '#FFC800',
    multiplier: 1.35,
  },
  'pure-axum': {
    primary: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.75)',
    text: '#B45309',
    multiplier: 1.7,
  },
};

const THEME_HUE_PALETTE: Record<ThemeHue, { primary: string; bgGradient: string; nameTi: string; nameEn: string }> = {
  'royal-axum': {
    primary: '#0F2856',
    bgGradient: 'from-[#071630] via-[#0F2856] to-[#0A192F]',
    nameTi: 'ንግሳዊ ኣክሱም (Royal Sovereign Blue)',
    nameEn: 'Royal Axum Navy',
  },
  'redsea-emerald': {
    primary: '#064E3B',
    bgGradient: 'from-[#022c22] via-[#064e3b] to-[#047857]',
    nameTi: 'ቀይሕ ባሕሪ ኤመራልድ (Red Sea Emerald)',
    nameEn: 'Red Sea Emerald',
  },
  'dahlak-sapphire': {
    primary: '#0C4A6E',
    bgGradient: 'from-[#082f49] via-[#0c4a6e] to-[#0369a1]',
    nameTi: 'ዳህላክ ሳፋየር (Dahlak Sapphire)',
    nameEn: 'Dahlak Archipelago Sapphire',
  },
  'amethyst-stela': {
    primary: '#3B0764',
    bgGradient: 'from-[#2e0249] via-[#3b0764] to-[#581c87]',
    nameTi: 'ሓወልቲ ኣሜቲስት (Imperial Amethyst)',
    nameEn: 'Axumite Stela Amethyst',
  },
  'terracotta-sun': {
    primary: '#7C2D12',
    bgGradient: 'from-[#431407] via-[#7c2d12] to-[#9a3412]',
    nameTi: 'ጸሓይ ቀርኒ ኣፍሪቃ (Terracotta Sunrise)',
    nameEn: 'Horn Terracotta Sunrise',
  },
  'obsidian-monolith': {
    primary: '#0F172A',
    bgGradient: 'from-[#050508] via-[#090D16] to-[#0F172A]',
    nameTi: 'ጸሊም ሓወልቲ (Obsidian Monolith)',
    nameEn: 'Obsidian Monolith Stealth',
  },
};

const STORAGE_KEY = 'axumite_custom_branding_v1';

const BrandingThemeContext = createContext<BrandingThemeContextType | undefined>(undefined);

export const BrandingThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_BRANDING, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load branding preferences:', e);
    }
    return DEFAULT_BRANDING;
  });

  // Save changes to localStorage and apply CSS custom properties
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(branding));
    } catch (e) {
      console.warn('Failed to save branding preferences:', e);
    }

    const goldData = GOLD_PALETTE[branding.goldIntensity] || GOLD_PALETTE.balanced;
    const hueData = THEME_HUE_PALETTE[branding.themeHue] || THEME_HUE_PALETTE['royal-axum'];

    const root = document.documentElement;
    root.style.setProperty('--axum-gold', branding.customAccentHex || goldData.primary);
    root.style.setProperty('--axum-gold-glow', goldData.glow);
    root.style.setProperty('--axum-gold-text', goldData.text);
    root.style.setProperty('--axum-hue-primary', hueData.primary);
    root.style.setProperty('--axum-shimmer-active', branding.goldShimmerEffect ? '1' : '0');

    if (branding.borderGlow) {
      root.classList.add('axum-border-glow-enabled');
    } else {
      root.classList.remove('axum-border-glow-enabled');
    }
  }, [branding]);

  const setGoldIntensity = (intensity: GoldIntensity) => {
    setBranding((prev) => ({ ...prev, goldIntensity: intensity }));
  };

  const setThemeHue = (hue: ThemeHue) => {
    setBranding((prev) => ({ ...prev, themeHue: hue }));
  };

  const setGoldShimmerEffect = (enabled: boolean) => {
    setBranding((prev) => ({ ...prev, goldShimmerEffect: enabled }));
  };

  const setBorderGlow = (enabled: boolean) => {
    setBranding((prev) => ({ ...prev, borderGlow: enabled }));
  };

  const setCustomAccentHex = (hex: string | undefined) => {
    setBranding((prev) => ({ ...prev, customAccentHex: hex }));
  };

  const updateBranding = (partial: Partial<BrandingConfig>) => {
    setBranding((prev) => ({ ...prev, ...partial }));
  };

  const resetToDefaultBranding = () => {
    setBranding(DEFAULT_BRANDING);
  };

  const goldData = GOLD_PALETTE[branding.goldIntensity] || GOLD_PALETTE.balanced;
  const hueData = THEME_HUE_PALETTE[branding.themeHue] || THEME_HUE_PALETTE['royal-axum'];

  return (
    <BrandingThemeContext.Provider
      value={{
        branding,
        setGoldIntensity,
        setThemeHue,
        setGoldShimmerEffect,
        setBorderGlow,
        setCustomAccentHex,
        updateBranding,
        resetToDefaultBranding,
        goldAccentColor: branding.customAccentHex || goldData.primary,
        goldAccentGlow: goldData.glow,
        themeHueColor: hueData.primary,
        themeHueBg: hueData.bgGradient,
      }}
    >
      {children}
    </BrandingThemeContext.Provider>
  );
};

export const useBrandingTheme = (): BrandingThemeContextType => {
  const context = useContext(BrandingThemeContext);
  if (!context) {
    throw new Error('useBrandingTheme must be used within a BrandingThemeProvider');
  }
  return context;
};

export { THEME_HUE_PALETTE, GOLD_PALETTE };
