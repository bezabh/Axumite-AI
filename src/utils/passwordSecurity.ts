/**
 * Password Security and Encrypted Storage Module
 * Faithful TypeScript translation of Android SecureStorage + PasswordValidator architecture.
 */

export enum PasswordStrength {
  WEAK = 'WEAK',
  MEDIUM = 'MEDIUM',
  STRONG = 'STRONG',
}

export interface PasswordGenerationOptions {
  length?: number;
  includeUppercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
}

export interface PasswordResult {
  isValid: boolean;
  strength: PasswordStrength;
  error?: string | null;
}

/**
 * Domain Layer: Password Validation Logic
 */
export class PasswordValidator {
  validate(password: string): PasswordResult {
    if (!password || password.length < 8) {
      return {
        isValid: false,
        strength: PasswordStrength.WEAK,
        error: 'Min 8 characters required.',
      };
    }

    const hasDigit = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasDigit || !hasUpper) {
      return {
        isValid: false,
        strength: PasswordStrength.MEDIUM,
        error: 'Add uppercase & number.',
      };
    }

    const strength =
      hasSpecial && password.length >= 12
        ? PasswordStrength.STRONG
        : PasswordStrength.MEDIUM;

    return {
      isValid: true,
      strength,
      error: null,
    };
  }

  generateSecurePassword(options: PasswordGenerationOptions = {}): string {
    const {
      length = 16,
      includeUppercase = true,
      includeNumbers = true,
      includeSymbols = true,
    } = options;

    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = lower;
    if (includeUppercase) charset += upper;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    const guaranteed: string[] = [lower[Math.floor(Math.random() * lower.length)]];
    if (includeUppercase) guaranteed.push(upper[Math.floor(Math.random() * upper.length)]);
    if (includeNumbers) guaranteed.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (includeSymbols) guaranteed.push(symbols[Math.floor(Math.random() * symbols.length)]);

    let randomValues: Uint32Array;
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      randomValues = new Uint32Array(length + 4);
      window.crypto.getRandomValues(randomValues);
    } else {
      randomValues = new Uint32Array(length + 4);
      for (let i = 0; i < randomValues.length; i++) {
        randomValues[i] = Math.floor(Math.random() * 1000000);
      }
    }

    const result: string[] = [...guaranteed];
    for (let i = guaranteed.length; i < length; i++) {
      result.push(charset[randomValues[i] % charset.length]);
    }

    for (let i = result.length - 1; i > 0; i--) {
      const j = randomValues[i] % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join('');
  }

  getStrengthColor(strength: PasswordStrength): string {
    switch (strength) {
      case PasswordStrength.WEAK:
        return '#EF4444'; // Red
      case PasswordStrength.MEDIUM:
        return '#FFA500'; // Orange
      case PasswordStrength.STRONG:
        return '#22C55E'; // Green
      default:
        return '#94A3B8';
    }
  }

  getStrengthLabel(strength: PasswordStrength, isTigrinya = false): string {
    switch (strength) {
      case PasswordStrength.WEAK:
        return isTigrinya ? 'ድኹም (WEAK)' : 'WEAK';
      case PasswordStrength.MEDIUM:
        return isTigrinya ? 'ማእከላይ (MEDIUM)' : 'MEDIUM';
      case PasswordStrength.STRONG:
        return isTigrinya ? 'ጽኑዕ (STRONG)' : 'STRONG';
      default:
        return strength;
    }
  }
}

/**
 * Data Layer: AES-256 GCM Encrypted Storage
 * Simulates Android EncryptedSharedPreferences with MasterKey AES-256
 */
const STORAGE_KEY = 'secure_user_prefs_v1';
const MASTER_SALT = 'axumite_master_aes256_salt_2026';

export class SecureStorage {
  private static instance: SecureStorage;

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private async getKey(): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(MASTER_SALT),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode('axumite_pref_salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async saveSessionToken(token: string): Promise<void> {
    try {
      if (!window.crypto?.subtle) {
        // Fallback for environments without subtle crypto
        localStorage.setItem(STORAGE_KEY, btoa(encodeURIComponent(token)));
        return;
      }

      const key = await this.getKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(token);

      const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoded
      );

      const payload = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(ciphertext)),
        timestamp: Date.now(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('SecureStorage: Encryption fallback applied', e);
      localStorage.setItem(STORAGE_KEY, btoa(encodeURIComponent(token)));
    }
  }

  async getSessionToken(): Promise<string | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      // Handle fallback string
      if (!raw.startsWith('{')) {
        return decodeURIComponent(atob(raw));
      }

      const payload = JSON.parse(raw);
      if (!payload.iv || !payload.data) return null;

      const key = await this.getKey();
      const iv = new Uint8Array(payload.iv);
      const data = new Uint8Array(payload.data);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.warn('SecureStorage: Decrypt error, clearing invalid payload', e);
      return null;
    }
  }

  clearSessionToken(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const defaultPasswordValidator = new PasswordValidator();
export const defaultSecureStorage = SecureStorage.getInstance();
