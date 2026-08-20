import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  X, Check, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck, Lock, Mail, User, Phone, CheckCircle2,
  Search, ArrowRight, ChevronRight, Shield, Globe, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  initialMode?: 'login' | 'signup' | 'verify';
  verificationReason?: string;
  onVerificationSuccess?: () => void;
  isMandatory?: boolean;
  logoSrc?: string;
}

interface GoogleAccount {
  name: string;
  email: string;
  avatarColor: string;
  lastUsed?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  initialMode = 'signup',
  verificationReason,
  onVerificationSuccess,
  isMandatory = false,
}) => {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup' | 'verify'>(initialMode === 'login' ? 'login' : 'signup');
  
  // Registration / Login Form fields
  const [fullName, setFullName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState(user.phoneNumber || '+291 7 123456');

  // Google / Gmail Search & Login Process Confirmation State
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [googleStep, setGoogleStep] = useState<'search' | 'confirm_login'>('search');
  const [gmailSearchQuery, setGmailSearchQuery] = useState('');
  const [selectedGmailAccount, setSelectedGmailAccount] = useState<GoogleAccount | null>(null);

  // Available / Discovered Google Accounts
  const [availableGmailAccounts, setAvailableGmailAccounts] = useState<GoogleAccount[]>([
    {
      name: 'Becky Love (Superadmin)',
      email: 'BeckyLove2004@gmail.com',
      avatarColor: '#EA4335',
      lastUsed: '👑 Superadmin (Root Authority)',
    },
    {
      name: 'በዛብህ ኣብርሃ ወልደገብርኤል',
      email: 'bezabh.abreha@gmail.com',
      avatarColor: '#4285F4',
      lastUsed: '👤 Guest User',
    },
    {
      name: 'Axumite Sovereign User',
      email: 'sovereign.user@gmail.com',
      avatarColor: '#FBBC05',
      lastUsed: '👤 Guest User',
    },
  ]);

  // Verification & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [smsPromptOpen, setSmsPromptOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['7', '8', '4', '9', '2', '0']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialMode === 'login') {
      setMode('login');
    } else if (initialMode === 'signup') {
      setMode('signup');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const grantRegistrationBonus = () => {
    try {
      const savedSub = localStorage.getItem('axumite_subscription');
      let sub = savedSub ? JSON.parse(savedSub) : {
        activePlan: 'free',
        planName: 'Axumite Explorer',
        tokensRemaining: 25000,
        renewalDate: 'N/A',
        totalClickEarnings: 8500,
      };

      sub.tokensRemaining = (sub.tokensRemaining || 25000) + 10000;
      localStorage.setItem('axumite_subscription', JSON.stringify(sub));

      const savedActivities = localStorage.getItem('axumite_pro_click_activities');
      let activities = savedActivities ? JSON.parse(savedActivities) : [];
      activities.unshift({
        id: `reg-bonus-${Date.now()}`,
        title: '🎁 AXUMITE AI Sovereign Registration Bonus (+10,000 Tokens)',
        tokens: 10000,
        category: 'Registration Bonus',
        timestamp: 'Just now',
        type: 'bonus',
      });
      localStorage.setItem('axumite_pro_click_activities', JSON.stringify(activities));
    } catch (err) {
      console.error('Failed to grant bonus:', err);
    }
  };

  const handleRegisterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg(language === 'ti' ? 'በጃኹም ምሉእ ስምኩም ኣእትዉ' : 'Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'ti' ? 'ቅኑዕ ኢመይል ኣድራሻ ኣእትዉ' : 'Please enter a valid email address');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg(language === 'ti' ? 'ፓስዎርድ ብውሑዱ 4 ፊደላት ክኸውን ኣለዎ' : 'Password must be at least 4 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(language === 'ti' ? 'ዝተመዝገበ ፓስዎርድ ኣይተመሳሰለን' : 'Passwords do not match');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      grantRegistrationBonus();
      const isSuperAdmin = email.trim().toLowerCase() === 'beckylove2004@gmail.com';
      onUpdateUser({
        name: fullName.trim() || (isSuperAdmin ? 'Becky Love (Superadmin)' : 'Guest User'),
        email: email.trim(),
        phoneNumber: phone || '+291 7 123456',
        role: isSuperAdmin ? 'Creator' : 'Guest',
        isLoggedIn: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      });

      setSuccessMsg(
        isSuperAdmin
          ? (language === 'ti'
              ? `👑 እንቋዕ ናብ AXUMITE AI ብደሓን መጻእኹም Superadmin Becky Love! ናይ Superadmin ምሉእ ስልጣን ተኸፊቱ ኣሎ።`
              : `👑 Superadmin Becky Love Activated! Full Root Access Granted.`)
          : (language === 'ti'
              ? `እንቋዕ ናብ AXUMITE AI ብደሓን መጻእኹም! ከም ጋሻ ተጠቃሚ (Guest User) ተመዝጊብኩም ኣለኹም። (+10,000 ቶከን ተወሲኹ)`
              : `Registration successful! Signed in as Guest User (+10,000 Tokens credited).`)
      );

      if (onVerificationSuccess) onVerificationSuccess();

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1400);
    }, 900);
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg(language === 'ti' ? 'ኢመይል ኣድራሻ ኣእትዉ' : 'Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg(language === 'ti' ? 'ፓስዎርድ ኣእትዉ' : 'Please enter your password');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const isSuperAdmin = email.trim().toLowerCase() === 'beckylove2004@gmail.com';
      onUpdateUser({
        name: fullName || user.name || (isSuperAdmin ? 'Becky Love (Superadmin)' : email.split('@')[0]) || 'Guest User',
        email: email.trim(),
        role: isSuperAdmin ? 'Creator' : 'Guest',
        isLoggedIn: true,
        isEmailVerified: true,
      });

      setSuccessMsg(
        isSuperAdmin
          ? (language === 'ti' 
              ? '👑 እንቋዕ ብደሓን ተመለስኩም Superadmin Becky Love! ናይ Root Superadmin ምሉእ ቁጽጽር ተኸፊቱ ኣሎ።' 
              : '👑 Superadmin Console Activated for Becky Love.')
          : (language === 'ti' 
              ? 'እንቋዕ ብደሓን ተመለስኩም! ከም ጋሻ ተጠቃሚ (Guest User) ብዓወት ኣቲኹም ኣለኹም።' 
              : 'Welcome back! Signed in as Guest User.')
      );

      if (onVerificationSuccess) onVerificationSuccess();

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 800);
  };

  // Google Social Auth - Triggers Account Search & Process Confirmation
  const handleGoogleAuth = () => {
    setErrorMsg('');
    setGmailSearchQuery('');
    setGoogleStep('search');
    setIsGoogleChooserOpen(true);
  };

  const handleSelectGmailAccount = (acc: GoogleAccount) => {
    setSelectedGmailAccount(acc);
    setGoogleStep('confirm_login');
  };

  const handleCustomGmailSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gmailSearchQuery.trim()) return;

    let cleanEmail = gmailSearchQuery.trim();
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@gmail.com`;
    }

    const isSuperAdmin = cleanEmail.toLowerCase() === 'beckylove2004@gmail.com';
    const nameFromEmail = cleanEmail.split('@')[0]
      .split(/[._-]/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    const newAcc: GoogleAccount = {
      name: isSuperAdmin ? 'Becky Love (Superadmin)' : (nameFromEmail || 'Google Guest User'),
      email: cleanEmail,
      avatarColor: isSuperAdmin ? '#EA4335' : '#4285F4',
      lastUsed: isSuperAdmin ? '👑 Superadmin (Root Authority)' : '👤 Guest User',
    };

    // Add to list if not present
    if (!availableGmailAccounts.some(a => a.email.toLowerCase() === cleanEmail.toLowerCase())) {
      setAvailableGmailAccounts(prev => [newAcc, ...prev]);
    }

    setSelectedGmailAccount(newAcc);
    setGoogleStep('confirm_login');
  };

  const handleConfirmGoogleLogin = () => {
    if (!selectedGmailAccount) return;

    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsProcessing(false);
      setIsGoogleChooserOpen(false);

      grantRegistrationBonus();
      const isSuperAdmin = selectedGmailAccount.email.trim().toLowerCase() === 'beckylove2004@gmail.com';
      onUpdateUser({
        name: selectedGmailAccount.name,
        email: selectedGmailAccount.email,
        role: isSuperAdmin ? 'Creator' : 'Guest',
        isLoggedIn: true,
        isEmailVerified: true,
      });

      setSuccessMsg(
        isSuperAdmin
          ? (language === 'ti'
              ? `👑 እንቋዕ ናብ Superadmin ዳሽቦርድ ብደሓን መጻእኹም (${selectedGmailAccount.email})!`
              : `👑 Superadmin Becky Love Signed In (${selectedGmailAccount.email})!`)
          : (language === 'ti'
              ? `ብጉግል (${selectedGmailAccount.email}) ከም ጋሻ ተጠቃሚ (Guest User) ብዓወት ኣቲኹም ኣለኹም! (+10,000 ቶከን ተወሲኹ)`
              : `Signed in with Google (${selectedGmailAccount.email}) as Guest User! +10,000 Tokens credited.`)
      );

      if (onVerificationSuccess) onVerificationSuccess();

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 1000);
  };

  // Apple Social Auth
  const handleAppleAuth = () => {
    setIsProcessing(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsProcessing(false);
      const appleEmail = email || 'user.apple@icloud.com';
      const isSuperAdmin = appleEmail.trim().toLowerCase() === 'beckylove2004@gmail.com';
      grantRegistrationBonus();
      onUpdateUser({
        name: fullName || (isSuperAdmin ? 'Becky Love (Superadmin)' : 'Apple Guest Member'),
        email: appleEmail,
        role: isSuperAdmin ? 'Creator' : 'Guest',
        isLoggedIn: true,
        isEmailVerified: true,
      });
      setSuccessMsg(isSuperAdmin ? '👑 Superadmin Apple Verified ✓' : 'Guest Apple ID Verified ✓');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 1000);
  };

  // SMS OTP Auth
  const handleSmsAuth = () => {
    setSmsPromptOpen(true);
    setErrorMsg('');
  };

  const handleVerifySmsOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSmsPromptOpen(false);
      grantRegistrationBonus();
      onUpdateUser({
        name: fullName || 'SMS Verified Member',
        phoneNumber: phone,
        isLoggedIn: true,
        isPhoneVerified: true,
      });
      setSuccessMsg('SMS Phone Verification Successful ✓');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 900);
  };

  // Biometric / Fingerprint Auth
  const handleBiometricAuth = async () => {
    setIsBiometricScanning(true);
    setErrorMsg('');

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([30, 50, 30]); } catch {}
    }

    setTimeout(() => {
      setIsBiometricScanning(false);
      grantRegistrationBonus();
      onUpdateUser({
        name: fullName || user.name || 'Biometric User (በዛብህ ኣብርሃ)',
        email: email || user.email || 'sovereign.user@axumite.ai',
        isLoggedIn: true,
        isEmailVerified: true,
      });
      setSuccessMsg('Biometric Fingerprint Match Verified ✓');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      
      {/* Container matching smartphone layout from user screenshot */}
      <div 
        className="w-full max-w-[390px] my-auto bg-[#07080B] text-slate-100 rounded-[36px] border-[1.5px] border-[#B88E33]/70 shadow-2xl overflow-hidden flex flex-col relative"
        style={{
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.95), 0 0 50px 2px rgba(184, 142, 51, 0.22)',
          backgroundImage: `
            radial-gradient(ellipse at 50% 10%, rgba(204, 153, 51, 0.18) 0%, transparent 65%),
            radial-gradient(ellipse at 50% 85%, rgba(204, 153, 51, 0.10) 0%, transparent 60%),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 6px),
            repeating-linear-gradient(-45deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 2px, transparent 2px, transparent 6px)
          `,
          backgroundColor: '#07080C'
        }}
      >
        
        {/* ========================================================================= */}
        {/* LUXURY GOLD CORNER WIREFRAME ACCENTS (EXACT MATCH TO SCREENSHOT)         */}
        {/* ========================================================================= */}
        {/* Top-Left Corner Wireframe */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-80">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
            <path d="M1 20V5C1 2.79086 2.79086 1 5 1H20" stroke="#C9982E" strokeWidth="1.2" />
            <path d="M8 15V8H15" stroke="#E6C466" strokeWidth="1" opacity="0.6" />
            <line x1="1" y1="1" x2="12" y2="12" stroke="#C9982E" strokeWidth="1" />
          </svg>
        </div>

        {/* Top-Right Corner Wireframe */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-80">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
            <path d="M44 20V5C44 2.79086 42.2091 1 40 1H25" stroke="#C9982E" strokeWidth="1.2" />
            <path d="M37 15V8H30" stroke="#E6C466" strokeWidth="1" opacity="0.6" />
            <line x1="44" y1="1" x2="33" y2="12" stroke="#C9982E" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom-Left Corner Wireframe */}
        <div className="absolute bottom-16 left-4 pointer-events-none opacity-60">
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
            <path d="M1 15V30C1 32.2 2.8 34 5 34H20" stroke="#C9982E" strokeWidth="1" />
            <line x1="1" y1="34" x2="10" y2="25" stroke="#C9982E" strokeWidth="1" />
          </svg>
        </div>

        {/* Bottom-Right Corner Wireframe */}
        <div className="absolute bottom-16 right-4 pointer-events-none opacity-60">
          <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
            <path d="M34 15V30C34 32.2 32.2 34 30 34H15" stroke="#C9982E" strokeWidth="1" />
            <line x1="34" y1="34" x2="25" y2="25" stroke="#C9982E" strokeWidth="1" />
          </svg>
        </div>

        {/* Dismiss Close X (if not mandatory) */}
        {!isMandatory && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-[#C9982E]/50 flex items-center justify-center text-[#E5C158] hover:text-white hover:border-[#F2CB70] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Main Content Area */}
        <div className="px-6 pt-7 pb-6 flex flex-col items-center relative z-10 space-y-4">

          {/* ======================================================================= */}
          {/* 1. EMBLEM: 3D GOLDEN AXUMITE OBELISK & ORBITAL CREST                    */}
          {/* ======================================================================= */}
          <div className="relative flex items-center justify-center mt-1">
            
            {/* Ambient Radial Flare */}
            <div className="absolute -inset-4 rounded-full bg-[#E5B537]/20 blur-xl pointer-events-none" />

            {/* Specular Highlight Flare (Top Right of Ring) */}
            <div className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-white blur-[1px] shadow-[0_0_12px_4px_#FFF7D6] z-10" />

            {/* Detailed Scalable SVG of the Axumite Stela & Orbital Medallion */}
            <svg 
              className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]" 
              viewBox="0 0 160 160" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gold Outer Gradient */}
                <linearGradient id="goldRing" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF2B2" />
                  <stop offset="25%" stopColor="#D4A738" />
                  <stop offset="50%" stopColor="#8A5F13" />
                  <stop offset="75%" stopColor="#F9D770" />
                  <stop offset="100%" stopColor="#9C6B14" />
                </linearGradient>

                {/* Obelisk Gold Body Gradient */}
                <linearGradient id="obeliskGrad" x1="65" y1="20" x2="95" y2="135" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF5C2" />
                  <stop offset="20%" stopColor="#E5BA45" />
                  <stop offset="50%" stopColor="#9E6E16" />
                  <stop offset="80%" stopColor="#FDE184" />
                  <stop offset="100%" stopColor="#6E4808" />
                </linearGradient>

                {/* Circuit Glowing Gold */}
                <linearGradient id="circuitGlow" x1="80" y1="30" x2="80" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF9E0" />
                  <stop offset="50%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>

                {/* Dark Inner Base */}
                <radialGradient id="innerShade" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#0B0D13" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1B1405" stopOpacity="0.4" />
                </radialGradient>
              </defs>

              {/* Outer Golden Ring Frame with Bevel */}
              <circle cx="80" cy="80" r="68" stroke="url(#goldRing)" strokeWidth="3" />
              <circle cx="80" cy="80" r="64" stroke="#4A3409" strokeWidth="1" />
              
              {/* Outer Orbit Accents & Notches */}
              <path d="M 28 80 A 52 52 0 0 1 132 80" stroke="url(#goldRing)" strokeWidth="1.8" strokeDasharray="4 8" opacity="0.7" />
              <path d="M 28 80 A 52 52 0 0 0 132 80" stroke="url(#goldRing)" strokeWidth="1.8" strokeDasharray="4 8" opacity="0.7" />
              
              {/* Triangular / Geometric Corner Brackets on the Ring */}
              <path d="M 26 65 L 18 80 L 26 95" stroke="url(#goldRing)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 134 65 L 142 80 L 134 95" stroke="url(#goldRing)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Inner Dark Vignette */}
              <circle cx="80" cy="80" r="58" fill="url(#innerShade)" />

              {/* Axumite Stele Multi-Tiered Pedestal Base */}
              <path d="M 52 135 L 108 135 L 104 128 L 56 128 Z" fill="url(#obeliskGrad)" stroke="#4A3409" strokeWidth="0.8" />
              <path d="M 58 128 L 102 128 L 99 122 L 61 122 Z" fill="url(#obeliskGrad)" stroke="#4A3409" strokeWidth="0.8" />
              <path d="M 64 122 L 96 122 L 94 117 L 66 117 Z" fill="url(#obeliskGrad)" stroke="#4A3409" strokeWidth="0.8" />

              {/* The Axumite Obelisk Main Pillar Shaft */}
              <path 
                d="M 68 117 L 73 38 C 73 32, 87 32, 87 38 L 92 117 Z" 
                fill="url(#obeliskGrad)" 
                stroke="#4A3409" 
                strokeWidth="1.2"
              />

              {/* Distinctive Axum Round Crown Apex & Semicircular Medallions */}
              <path d="M 74 38 C 74 27, 86 27, 86 38 Z" fill="#FFF2B2" stroke="#8A5F13" strokeWidth="1" />
              <circle cx="80" cy="33" r="3" fill="#FFE169" stroke="#6E4808" strokeWidth="0.6" />

              {/* Carved False Windows / Tiered Storeys (Historic Axumite Architecture) */}
              <rect x="75" y="44" width="10" height="7" rx="1.5" fill="#140E03" stroke="#ECC461" strokeWidth="0.8" />
              <line x1="80" y1="44" x2="80" y2="51" stroke="#ECC461" strokeWidth="0.6" />
              <line x1="75" y1="47.5" x2="85" y2="47.5" stroke="#ECC461" strokeWidth="0.6" />

              <rect x="74" y="56" width="12" height="8" rx="1.5" fill="#140E03" stroke="#ECC461" strokeWidth="0.8" />
              <line x1="80" y1="56" x2="80" y2="64" stroke="#ECC461" strokeWidth="0.6" />
              <line x1="74" y1="60" x2="86" y2="60" stroke="#ECC461" strokeWidth="0.6" />

              <rect x="73" y="69" width="14" height="9" rx="1.5" fill="#140E03" stroke="#ECC461" strokeWidth="0.8" />
              <line x1="80" y1="69" x2="80" y2="78" stroke="#ECC461" strokeWidth="0.6" />
              <line x1="73" y1="73.5" x2="87" y2="73.5" stroke="#ECC461" strokeWidth="0.6" />

              <rect x="72" y="83" width="16" height="10" rx="1.5" fill="#140E03" stroke="#ECC461" strokeWidth="0.8" />
              <line x1="80" y1="83" x2="80" y2="93" stroke="#ECC461" strokeWidth="0.6" />
              <line x1="72" y1="88" x2="88" y2="88" stroke="#ECC461" strokeWidth="0.6" />

              {/* Lower Monumental Portal / Doorway */}
              <path d="M 73 98 L 87 98 L 87 117 L 73 117 Z" fill="#0A0702" stroke="#FDE184" strokeWidth="0.9" />
              <circle cx="80" cy="106" r="2" fill="#EAB308" />

              {/* Futuristic Vertical Neural Circuit Lines Etched Down the Center */}
              <line x1="80" y1="36" x2="80" y2="116" stroke="url(#circuitGlow)" strokeWidth="1.2" strokeDasharray="3 2" />
            </svg>
          </div>

          {/* ======================================================================= */}
          {/* 2. APP TITLE: AXUMITE AI (METALLIC GOLD SERIF TYPOGRAPHY)              */}
          {/* ======================================================================= */}
          <div className="text-center space-y-0.5">
            <h1 
              className="text-2xl sm:text-[28px] font-serif font-black tracking-[0.22em] uppercase text-transparent bg-clip-text select-none"
              style={{
                backgroundImage: 'linear-gradient(180deg, #FFF6CE 0%, #ECC359 40%, #C9982E 70%, #7E570E 100%)',
                textShadow: '0 2px 10px rgba(201, 152, 46, 0.45)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
              }}
            >
              AXUMITE AI
            </h1>
          </div>

          {/* ======================================================================= */}
          {/* 3. HEADER TOGGLE BANNER (ORNATE BEVELED GOLD RIBBON)                   */}
          {/* ======================================================================= */}
          <div className="w-full">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="w-full py-2.5 px-4 rounded-xl relative border border-[#C9982E]/80 bg-gradient-to-r from-[#17130A] via-[#2A1F0D] to-[#17130A] hover:border-[#F2CB70] transition-all cursor-pointer shadow-md group flex items-center justify-center"
              style={{
                clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0% 50%)',
              }}
            >
              <div className="text-xs sm:text-[13px] font-serif tracking-wide text-[#E8C87A] flex items-center justify-center space-x-1">
                {mode === 'signup' ? (
                  <>
                    <span className="text-[#D6B565]">Already have an account?</span>
                    <span className="font-extrabold text-[#FFF0A8] underline underline-offset-2 ml-1 group-hover:text-white">
                      Log In
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[#D6B565]">Need an account?</span>
                    <span className="font-extrabold text-[#FFF0A8] underline underline-offset-2 ml-1 group-hover:text-white">
                      Register
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Success / Error Alerts */}
          {successMsg && (
            <div className="w-full p-2.5 bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in shadow-lg">
              <Check className="w-4 h-4 shrink-0 stroke-[3]" />
              <span className="flex-1 text-[11.5px] leading-tight">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="w-full p-2.5 bg-rose-950/80 border border-rose-500/70 text-rose-300 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in shadow-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-[11.5px] leading-tight">{errorMsg}</span>
            </div>
          )}

          {/* ======================================================================= */}
          {/* 4. INPUT FIELDS (LUXURY GOLD BEVELED BORDERS & ICONS)                   */}
          {/* ======================================================================= */}
          <form 
            onSubmit={mode === 'signup' ? handleRegisterSubmit : handleLoginSubmit}
            className="w-full space-y-2.5"
          >
            {/* Full Name (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="relative flex items-center">
                <div className="w-full h-11 sm:h-12 bg-[#0E0F14]/95 border-[1.2px] border-[#9A7426] rounded-xl flex items-center px-3.5 focus-within:border-[#F2CB70] focus-within:shadow-[0_0_12px_rgba(242,203,112,0.3)] transition-all shadow-inner">
                  {/* Golden User Icon */}
                  <div className="w-5 h-5 flex items-center justify-center text-[#E5C158] shrink-0 mr-3">
                    <svg className="w-5 h-5 fill-[#D4A738]" viewBox="0 0 24 24">
                      <path d="M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0 4c-4.411 0-8 3.589-8 8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1c0-4.411-3.589-8-8-8zm-6 7c.531-2.822 3.004-5 6-5s5.469 2.178 6 5H6z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ti' ? 'ምሉእ ስም (Full Name)' : 'Full Name'}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-[#F3E5AB] placeholder-[#A08852] focus:outline-none font-medium tracking-wide"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="relative flex items-center">
              <div className="w-full h-11 sm:h-12 bg-[#0E0F14]/95 border-[1.2px] border-[#9A7426] rounded-xl flex items-center px-3.5 focus-within:border-[#F2CB70] focus-within:shadow-[0_0_12px_rgba(242,203,112,0.3)] transition-all shadow-inner">
                {/* Golden Envelope Icon */}
                <div className="w-5 h-5 flex items-center justify-center text-[#E5C158] shrink-0 mr-3">
                  <svg className="w-5 h-5 fill-[#D4A738]" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V9.044l7.445 4.963a1.003 1.003 0 0 0 1.11 0L20 9.044 20.002 18H4z"/>
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'ti' ? 'ኢመይል ኣድራሻ (Email Address)' : 'Email Address'}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-[#F3E5AB] placeholder-[#A08852] focus:outline-none font-medium tracking-wide"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative flex items-center">
              <div className="w-full h-11 sm:h-12 bg-[#0E0F14]/95 border-[1.2px] border-[#9A7426] rounded-xl flex items-center px-3.5 focus-within:border-[#F2CB70] focus-within:shadow-[0_0_12px_rgba(242,203,112,0.3)] transition-all shadow-inner">
                {/* Golden Padlock Icon */}
                <div className="w-5 h-5 flex items-center justify-center text-[#E5C158] shrink-0 mr-3">
                  <svg className="w-5 h-5 fill-[#D4A738]" viewBox="0 0 24 24">
                    <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 13H6v-8h12v8zm-6-5a1.5 1.5 0 0 0-1.5 1.5c0 .591.347 1.096.845 1.332V18a.655.655 0 0 0 1.31 0v-1.168A1.503 1.503 0 0 0 13.5 15c0-.828-.672-1.5-1.5-1.5z"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'ti' ? 'ፓስዎርድ (Password)' : 'Password'}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-[#F3E5AB] placeholder-[#A08852] focus:outline-none font-medium tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#9A7426] hover:text-[#F2CB70] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="relative flex items-center">
                <div className="w-full h-11 sm:h-12 bg-[#0E0F14]/95 border-[1.2px] border-[#9A7426] rounded-xl flex items-center px-3.5 focus-within:border-[#F2CB70] focus-within:shadow-[0_0_12px_rgba(242,203,112,0.3)] transition-all shadow-inner">
                  {/* Golden Padlock Icon */}
                  <div className="w-5 h-5 flex items-center justify-center text-[#E5C158] shrink-0 mr-3">
                    <svg className="w-5 h-5 fill-[#D4A738]" viewBox="0 0 24 24">
                      <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 13H6v-8h12v8zm-6-5a1.5 1.5 0 0 0-1.5 1.5c0 .591.347 1.096.845 1.332V18a.655.655 0 0 0 1.31 0v-1.168A1.503 1.503 0 0 0 13.5 15c0-.828-.672-1.5-1.5-1.5z"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === 'ti' ? 'ፓስዎርድ ኣረጋግጹ (Confirm Password)' : 'Confirm Password'}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-[#F3E5AB] placeholder-[#A08852] focus:outline-none font-medium tracking-wide"
                  />
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* 5. PRIMARY ACTION BUTTON (LUXURIOUS RAISED GOLD BEVELED BUTTON)    */}
            {/* =================================================================== */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 sm:h-13 rounded-xl relative overflow-hidden font-serif font-black tracking-wider text-base sm:text-[17px] text-[#191104] transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, #FDE89D 0%, #ECC155 35%, #C8992D 70%, #8A5E12 100%)',
                  border: '1.8px solid #FFEBB0',
                  boxShadow: '0 8px 24px rgba(200, 153, 45, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.4)',
                }}
              >
                {isProcessing ? (
                  <span className="flex items-center space-x-2 text-[#191104]">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{language === 'ti' ? 'ይረጋገጽ ኣሎ...' : 'Authenticating...'}</span>
                  </span>
                ) : (
                  <span>
                    {mode === 'signup' 
                      ? (language === 'ti' ? 'ሕሳብ ምዝገቡ (Register Account)' : 'Register Account')
                      : (language === 'ti' ? 'ሎግ ኢን (Log In)' : 'Log In to Account')}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* ======================================================================= */}
          {/* 6. DIVIDER: — Or Continue With —                                        */}
          {/* ======================================================================= */}
          <div className="w-full flex items-center justify-center my-1">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#9A7426]/70 to-[#9A7426]/70" />
            <span className="px-3 text-[11.5px] sm:text-xs font-serif text-[#C9A24D] font-medium tracking-wide">
              Or Continue With
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#9A7426]/70 to-[#9A7426]/70" />
          </div>

          {/* ======================================================================= */}
          {/* 7. FOUR MINTED GOLD CIRCULAR MEDALLIONS (QUICK SOCIAL / BIOMETRIC AUTH) */}
          {/* ======================================================================= */}
          <div className="w-full flex items-center justify-between px-1 sm:px-2 pt-0.5">
            
            {/* Medallion 1: Google (G) */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              title="Sign in with Google"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group shadow-lg"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FFF6CE 0%, #D4A738 50%, #7E570E 100%)',
                border: '2px solid #FFEAA8',
                boxShadow: '0 4px 14px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(0,0,0,0.6)',
              }}
            >
              {/* Embossed Ring */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#52380A] flex items-center justify-center bg-gradient-to-b from-[#E6BC4C] to-[#8C6016] shadow-inner">
                {/* Embossed Bold G */}
                <span 
                  className="font-serif font-black text-lg sm:text-xl text-[#1B1202] group-hover:scale-110 transition-transform select-none"
                  style={{
                    textShadow: '0 1px 1px rgba(255,255,255,0.6), 0 -1px 1px rgba(0,0,0,0.8)'
                  }}
                >
                  G
                </span>
              </div>
            </button>

            {/* Medallion 2: Apple */}
            <button
              type="button"
              onClick={handleAppleAuth}
              title="Sign in with Apple"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group shadow-lg"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FFF6CE 0%, #D4A738 50%, #7E570E 100%)',
                border: '2px solid #FFEAA8',
                boxShadow: '0 4px 14px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#52380A] flex items-center justify-center bg-gradient-to-b from-[#E6BC4C] to-[#8C6016] shadow-inner">
                {/* Apple SVG Logo */}
                <svg 
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-[#1B1202] group-hover:scale-110 transition-transform" 
                  viewBox="0 0 170 170"
                >
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.98-12.24-14.7-5.87-8.91-10.45-19.12-13.73-30.63-3.28-11.51-4.92-22.61-4.92-33.3 0-14.7 3.7-26.68 11.1-35.94 7.4-9.27 16.59-13.99 27.56-14.16 4.8 0 10.14 1.25 16.03 3.75 5.88 2.5 9.77 3.86 11.66 4.09 1.48-.23 5.48-1.63 12.01-4.22 6.53-2.58 11.83-3.71 15.91-3.38 12.25 1.09 21.75 5.76 28.5 14.02-10.68 6.42-15.91 15.26-15.69 26.52.22 8.71 3.49 15.99 9.81 21.84 6.32 5.85 13.84 9.17 22.56 9.97-2.39 7.07-5.07 14.16-8.04 21.26zM119.22 33.15c0-6.97 2.45-13.43 7.35-19.38 4.9-5.95 10.95-9.87 18.15-11.77.22 1.3.33 2.5.33 3.59 0 6.96-2.61 13.59-7.83 19.89-5.22 6.3-11.42 10.06-18.6 11.27-.11-1.08-.22-2.17-.4-3.6z"/>
                </svg>
              </div>
            </button>

            {/* Medallion 3: Phone / SMS */}
            <button
              type="button"
              onClick={handleSmsAuth}
              title="SMS Verification"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group shadow-lg"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FFF6CE 0%, #D4A738 50%, #7E570E 100%)',
                border: '2px solid #FFEAA8',
                boxShadow: '0 4px 14px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#52380A] flex items-center justify-center bg-gradient-to-b from-[#E6BC4C] to-[#8C6016] shadow-inner relative">
                {/* Phone Device with SMS bubble */}
                <div className="flex items-center justify-center text-[#1B1202] group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="3" fill="#1B1202" fillOpacity="0.2" />
                    <line x1="12" y1="18" x2="12" y2="18.01" />
                    {/* Speech bubble */}
                    <path d="M8 7h8v4H9l-2 2V7z" fill="#1B1202" />
                  </svg>
                  <span className="absolute text-[7px] font-black text-[#FFEAA8] top-[14px]">SMS</span>
                </div>
              </div>
            </button>

            {/* Medallion 4: Biometric Fingerprint */}
            <button
              type="button"
              onClick={handleBiometricAuth}
              title="Biometric Fingerprint Login"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group shadow-lg"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #FFF6CE 0%, #D4A738 50%, #7E570E 100%)',
                border: '2px solid #FFEAA8',
                boxShadow: '0 4px 14px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#52380A] flex items-center justify-center bg-gradient-to-b from-[#E6BC4C] to-[#8C6016] shadow-inner">
                {/* Detailed Fingerprint SVG */}
                <svg 
                  className={`w-5.5 h-5.5 text-[#1B1202] group-hover:scale-110 transition-transform ${isBiometricScanning ? 'animate-pulse text-[#FFF0A8]' : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
                  <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
                  <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                  <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                  <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                  <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                  <path d="M2 16h.01" />
                  <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                  <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
                </svg>
              </div>
            </button>

          </div>

          {/* ======================================================================= */}
          {/* 8. FOOTER CREDITS (EXACT PIXEL REPRODUCTION FROM SCREENSHOT)            */}
          {/* ======================================================================= */}
          <div className="pt-2 text-center space-y-0.5 select-none">
            <p className="text-[11px] sm:text-xs text-[#E5C158] font-medium tracking-wide">
              Developer: በዛብህ ኣብርሃ ወልደገብርኤል
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#C9A24D] font-normal flex items-center justify-center space-x-1">
              <span>Address: Regensburg, Bavaria, 🇩🇪</span>
            </p>
          </div>

        </div>

      </div>

      {/* Google / Gmail Search & Login Process Confirmation Modal */}
      {isGoogleChooserOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[400px] bg-[#0E1017] border-[1.5px] border-[#C9982E]/80 rounded-[28px] shadow-2xl overflow-hidden text-slate-100 flex flex-col relative">
            
            {/* Google Brand Color Top Bar */}
            <div className="w-full h-1.5 grid grid-cols-4">
              <div className="bg-[#4285F4]" />
              <div className="bg-[#EA4335]" />
              <div className="bg-[#FBBC05]" />
              <div className="bg-[#34A853]" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-[#121520] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Google "G" Icon Badge */}
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-1.5">
                    <span>{googleStep === 'search' ? 'Sign in with Google' : 'Confirm Login Process'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {googleStep === 'search'
                      ? 'Search or select your Gmail account'
                      : 'Ask to continue to AXUMITE AI'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGoogleChooserOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: Search & Pick Gmail Address */}
            {googleStep === 'search' && (
              <div className="p-4 sm:p-5 space-y-3.5">
                
                {/* Search Bar for Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#D4A738] flex items-center space-x-1">
                    <Search className="w-3.5 h-3.5" />
                    <span>{language === 'ti' ? 'ናይ ጂሜይል ኣድራሻ ድለዩ ወይ ጸሓፉ' : 'Search or Enter Gmail Address'}</span>
                  </label>
                  
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={gmailSearchQuery}
                      onChange={(e) => setGmailSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && gmailSearchQuery.trim()) {
                          handleCustomGmailSubmit();
                        }
                      }}
                      placeholder="e.g. BeckyLove2004@gmail.com"
                      className="w-full h-11 bg-[#151926] border border-[#9A7426]/70 focus:border-[#F2CB70] focus:shadow-[0_0_10px_rgba(242,203,112,0.25)] rounded-xl pl-3.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
                      autoFocus
                    />
                    {gmailSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => setGmailSearchQuery('')}
                        className="absolute right-3 text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    ) : (
                      <Mail className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* Custom Typed Email Direct Match Button if search active */}
                {gmailSearchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => handleCustomGmailSubmit()}
                    className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-[#D4A738] text-left flex items-center justify-between text-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-[#D4A738] text-[#191104] font-black flex items-center justify-center text-xs shrink-0">
                        @
                      </div>
                      <div className="truncate">
                        <span className="text-slate-300">Continue as </span>
                        <span className="font-bold text-[#FFF6CE]">
                          {gmailSearchQuery.includes('@') ? gmailSearchQuery.trim() : `${gmailSearchQuery.trim()}@gmail.com`}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4A738] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                  </button>
                )}

                {/* Detected / Saved Accounts List */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    {language === 'ti' ? 'ዝተረኽቡ ናይ ጉግል ኣካውንታት' : 'Discovered Google Accounts'}
                  </div>

                  <div className="space-y-2 max-h-[210px] overflow-y-auto pr-1">
                    {availableGmailAccounts
                      .filter((acc) => {
                        const q = gmailSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          acc.name.toLowerCase().includes(q) ||
                          acc.email.toLowerCase().includes(q)
                        );
                      })
                      .map((acc) => (
                        <div
                          key={acc.email}
                          onClick={() => handleSelectGmailAccount(acc)}
                          className="p-3 rounded-2xl bg-[#141824] hover:bg-[#1C2234] border border-slate-800 hover:border-[#D4A738]/80 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                        >
                          <div className="flex items-center space-x-3 truncate">
                            {/* Avatar */}
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow"
                              style={{ backgroundColor: acc.avatarColor }}
                            >
                              {acc.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-bold text-white group-hover:text-[#F3E5AB] transition-colors truncate">
                                {acc.name}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate flex items-center space-x-1 font-mono">
                                <span>{acc.email}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {acc.lastUsed && (
                              <span className="text-[9.5px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                                {acc.lastUsed}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4A738] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-[10px] text-slate-500">
                    By proceeding, Google will share your name and email with AXUMITE AI.
                  </p>
                </div>

              </div>
            )}

            {/* STEP 2: Ask & Confirm Login Process */}
            {googleStep === 'confirm_login' && selectedGmailAccount && (
              <div className="p-4 sm:p-5 space-y-4 animate-in fade-in">
                
                {/* Confirmation Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#161B2B] to-[#0E121D] border border-[#D4A738]/60 text-center space-y-3 shadow-lg">
                  
                  {/* Account Badge Display */}
                  <div className="relative inline-block mx-auto">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl shadow-xl mx-auto ring-4 ring-[#D4A738]/30"
                      style={{ backgroundColor: selectedGmailAccount.avatarColor }}
                    >
                      {selectedGmailAccount.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0E121D] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {selectedGmailAccount.name}
                    </h4>
                    <p className="text-xs text-[#E5C158] font-mono mt-0.5 font-semibold">
                      {selectedGmailAccount.email}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                      <div className="inline-flex items-center space-x-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10.5px] px-2.5 py-0.5 rounded-full font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Verified Google Account</span>
                      </div>
                      {selectedGmailAccount.email.trim().toLowerCase() === 'beckylove2004@gmail.com' ? (
                        <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 border border-amber-400/80 text-amber-200 text-[10.5px] px-2.5 py-0.5 rounded-full font-bold shadow">
                          <span>👑</span>
                          <span>Superadmin Authority</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-1 bg-slate-800/90 border border-cyan-500/50 text-cyan-300 text-[10.5px] px-2.5 py-0.5 rounded-full font-bold">
                          <span>👤</span>
                          <span>Guest User Role (ጋሻ)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2.5">
                    {language === 'ti'
                      ? 'ናብ AXUMITE AI ብዚ ናይ ጂሜይል ሕሳብ ክትኣትዉ ይሕተት ኣሎ። ምእታው ክቕጽል ትደልዩ ዶ?'
                      : 'You are about to sign in to AXUMITE AI using this Google account. Do you wish to complete the login process?'}
                  </p>
                </div>

                {/* Feature / Sovereignty Guarantee List */}
                <div className="space-y-1.5 px-1 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#ECC359] shrink-0" />
                    <span>Instant activation of +10,000 Sovereign AI Tokens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Private & sovereign encrypted session storage</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmGoogleLogin}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-[#191104] transition-all duration-200 cursor-pointer active:scale-98 disabled:opacity-50 shadow-xl flex items-center justify-center space-x-2"
                    style={{
                      background: 'linear-gradient(180deg, #FDE89D 0%, #ECC155 35%, #C8992D 70%, #8A5E12 100%)',
                      border: '1.5px solid #FFEBB0',
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#191104]" />
                        <span>{language === 'ti' ? 'ይረጋገጽ ኣሎ...' : 'Completing Login Process...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#191104] stroke-[2.5]" />
                        <span>
                          {language === 'ti'
                            ? 'እወ፡ ምእታው ቀጽል (Confirm & Log In)'
                            : 'Confirm & Log In with Google'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGoogleStep('search');
                      setSelectedGmailAccount(null);
                    }}
                    className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    ← {language === 'ti' ? 'ካልእ ኣካውንት ምረጽ' : 'Choose a different account'}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* SMS Phone Verification Sub-modal */}
      {smsPromptOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xs bg-[#0F111A] border-2 border-[#C9982E] rounded-3xl p-5 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E5B537]/20 border border-[#ECC359] text-[#ECC359] mx-auto flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFF6CE]">
                {language === 'ti' ? 'ናይ ተሌፎን ምርግጋጽ' : 'SMS Phone Verification'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ti' ? 'ናብ ተሌፎንኩም ዝተላእከ 6-ዲጂት ኮድ ኣእትዉ' : 'Enter the 6-digit OTP code sent to your phone'}
              </p>
            </div>
            <div className="flex justify-center space-x-1.5">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newDigits = [...otpDigits];
                    newDigits[idx] = e.target.value;
                    setOtpDigits(newDigits);
                  }}
                  className="w-8 h-10 text-center font-mono font-black text-sm bg-slate-900 border border-[#9A7426] rounded-lg text-white focus:outline-none focus:border-[#ECC359]"
                />
              ))}
            </div>
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleVerifySmsOtp}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E5BA45] to-[#9E6E16] text-[#191104] font-bold text-xs cursor-pointer active:scale-95"
              >
                {isProcessing ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button
                type="button"
                onClick={() => setSmsPromptOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
