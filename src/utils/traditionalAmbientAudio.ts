/**
 * Axumite Traditional Tigray Ambient Sound Engine
 * Synthesizes soft, meditative, looping traditional Tigray/Ethiopian acoustic instruments:
 * - Masinko (ማሲንቆ): Bowed single-string lute with diamond soundbox resonance & emotive vibrato
 * - Kirar (ክራር): Plucked 5/6-string pentatonic lyre with warm harmonic decay & body cavity resonance
 * - Washint (ዋሽንት): Breathy traditional bamboo acoustic flute
 * - Axumite Ensemble (ሕውስዋስ): Harmonized Kirar plucks + Masinko bowed lines + Washint breath
 *
 * Provides real-time volume continuation, persistent storage, and zero-latency Web Audio API synthesis.
 */

export type TraditionalInstrument = 'masinko' | 'kirar' | 'washint' | 'ensemble';

export interface AmbientAudioState {
  isPlaying: boolean;
  volume: number; // 0.0 to 1.0
  instrument: TraditionalInstrument;
  currentMode: string;
}

type StateListener = (state: AmbientAudioState) => void;

// Traditional Pentatonic Modes of the Horn of Africa (Frequencies in Hz)
// Pentatonic Scales: Tizita, Bati, Ambassel, Anchihoye
const MODES = {
  tizita: [
    130.81, 146.83, 164.81, 196.00, 220.00, // C3, D3, E3, G3, A3
    261.63, 293.66, 329.63, 392.00, 440.00, // C4, D4, E4, G4, A4
    523.25, 587.33                          // C5, D5
  ],
  bati: [
    130.81, 164.81, 174.61, 196.00, 246.94, // C3, E3, F3, G3, B3
    261.63, 329.63, 349.23, 392.00, 493.88, // C4, E4, F4, G4, B4
    523.25                                  // C5
  ],
  ambassel: [
    130.81, 138.59, 174.61, 196.00, 207.65, // C3, Db3, F3, G3, Ab3
    261.63, 277.18, 349.23, 392.00, 415.30, // C4, Db4, F4, G4, Ab4
    523.25                                  // C5
  ],
  anchihoye: [
    130.81, 146.83, 174.61, 196.00, 220.00, // C3, D3, F3, G3, A3
    261.63, 293.66, 349.23, 392.00, 440.00, // C4, D4, F4, G4, A4
    523.25                                  // C5
  ]
};

class TraditionalAmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isPlaying = false;
  private volume = 0.35; // Default soft ambient volume (35%)
  private instrument: TraditionalInstrument = 'ensemble';
  private currentModeKey: keyof typeof MODES = 'tizita';
  private schedulerTimer: number | null = null;
  private nextNoteTime = 0;
  private stepIndex = 0;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    // Restore persistent volume & instrument preferences
    try {
      const savedVol = localStorage.getItem('axumite_ambient_sound_volume');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }

      const savedInst = localStorage.getItem('axumite_ambient_instrument') as TraditionalInstrument;
      if (savedInst && ['masinko', 'kirar', 'washint', 'ensemble'].includes(savedInst)) {
        this.instrument = savedInst;
      }
    } catch {
      // LocalStorage access fallback
    }
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AmbientAudioState {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      instrument: this.instrument,
      currentMode: this.currentModeKey,
    };
  }

  private initAudio() {
    if (this.ctx && this.ctx.state !== 'closed') return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Create subtle warm acoustic reverb impulse (recreates ancient stone hall / Axumite obelisk acoustics)
    this.createAcousticReverb();

    this.masterGain.connect(this.ctx.destination);
  }

  private createAcousticReverb() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const rate = this.ctx.sampleRate;
      const length = rate * 2.2; // 2.2 seconds natural decay
      const decay = 2.0;
      const impulse = this.ctx.createBuffer(2, length, rate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const n = i / length;
        const e = Math.exp(-n * decay);
        left[i] = (Math.random() * 2 - 1) * e;
        right[i] = (Math.random() * 2 - 1) * e;
      }

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = impulse;

      const reverbGain = this.ctx.createGain();
      reverbGain.gain.value = 0.28; // Subtle warm reverb wet mix

      this.reverbNode.connect(reverbGain);
      reverbGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Reverb node init fallback:', e);
    }
  }

  public async start(): Promise<void> {
    this.initAudio();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume notice:', err);
      }
    }

    if (this.isPlaying) return;

    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.stepIndex = 0;

    // Smooth fade in
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume), this.ctx.currentTime + 0.8);

    this.scheduleNotes();
    this.notify();

    try {
      localStorage.setItem('axumite_ambient_sound_enabled', 'true');
    } catch {}
  }

  public stop(): void {
    if (!this.isPlaying || !this.ctx || !this.masterGain) {
      this.isPlaying = false;
      this.notify();
      return;
    }

    // Smooth gentle fade out to prevent clicks
    try {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    } catch {}

    if (this.schedulerTimer !== null) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }

    setTimeout(() => {
      this.isPlaying = false;
      this.notify();
    }, 520);

    try {
      localStorage.setItem('axumite_ambient_sound_enabled', 'false');
    } catch {}
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;

    if (this.ctx && this.masterGain && this.isPlaying) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }

    try {
      localStorage.setItem('axumite_ambient_sound_volume', clamped.toString());
    } catch {}

    this.notify();
  }

  public setInstrument(inst: TraditionalInstrument): void {
    this.instrument = inst;
    try {
      localStorage.setItem('axumite_ambient_instrument', inst);
    } catch {}
    this.notify();
  }

  public setMode(mode: keyof typeof MODES): void {
    if (MODES[mode]) {
      this.currentModeKey = mode;
      this.notify();
    }
  }

  // Lookahead Scheduler for Seamless Ambient Music
  private scheduleNotes = () => {
    if (!this.isPlaying || !this.ctx) return;

    const lookAheadTime = 0.4;
    while (this.nextNoteTime < this.ctx.currentTime + lookAheadTime) {
      this.playNoteStep(this.nextNoteTime, this.stepIndex);
      
      // Traditional Ethiopian 6/8 and 4/4 meditative rhythmic pacing
      const stepDuration = 0.42 + (Math.sin(this.stepIndex * 0.5) * 0.08);
      this.nextNoteTime += stepDuration;
      this.stepIndex = (this.stepIndex + 1) % 64;

      // Periodically shift subtle modal coloration every 32 steps
      if (this.stepIndex % 32 === 0) {
        const modeKeys: (keyof typeof MODES)[] = ['tizita', 'bati', 'ambassel', 'anchihoye'];
        this.currentModeKey = modeKeys[Math.floor(Math.random() * modeKeys.length)];
      }
    }

    this.schedulerTimer = window.setTimeout(this.scheduleNotes, 150);
  };

  private playNoteStep(time: number, step: number) {
    if (!this.ctx || !this.masterGain) return;

    const scale = MODES[this.currentModeKey];
    const inst = this.instrument;

    // 1. KIRAR PLUCKED PASSAGE
    if (inst === 'kirar' || inst === 'ensemble') {
      // Kirar rhythmic arpeggiated ostinato & ornamentation
      const kirarPattern = [0, 2, 4, 7, 5, 2, 0, 4, 2, 5, 7, 9, 7, 4, 2, 0];
      const noteIdx = kirarPattern[step % kirarPattern.length];
      const freq = scale[noteIdx % scale.length];

      const isAccent = step % 4 === 0;
      const velocity = isAccent ? 0.35 : 0.22;

      this.synthesizeKirarPluck(freq, time, velocity);

      // Add gentle octave bass drone on root steps
      if (step % 8 === 0) {
        this.synthesizeKirarPluck(scale[0] * 0.5, time, 0.4);
      }
    }

    // 2. MASINKO BOWED PASSAGE
    if (inst === 'masinko' || inst === 'ensemble') {
      // Masinko plays lyrical, emotive sustained phrases every 4 steps
      if (step % 4 === 0) {
        const masinkoMelody = [4, 5, 7, 5, 4, 2, 0, 2, 4, 7, 8, 7, 5, 4, 2, 0];
        const melodyIdx = masinkoMelody[(Math.floor(step / 4)) % masinkoMelody.length];
        const baseFreq = scale[melodyIdx % scale.length];
        const nextMelodyIdx = masinkoMelody[(Math.floor(step / 4) + 1) % masinkoMelody.length];
        const targetFreq = scale[nextMelodyIdx % scale.length];

        const duration = 1.6; // Long sustained bowed note
        this.synthesizeMasinkoBow(baseFreq, targetFreq, time, duration, inst === 'ensemble' ? 0.18 : 0.32);
      }
    }

    // 3. WASHINT FLUTE PASSAGE
    if (inst === 'washint') {
      if (step % 3 === 0) {
        const fluteMelody = [7, 8, 10, 8, 7, 5, 4, 2, 5, 7, 8, 10];
        const fluteIdx = fluteMelody[(Math.floor(step / 3)) % fluteMelody.length];
        const freq = scale[fluteIdx % scale.length] * 1.0;
        this.synthesizeWashintFlute(freq, time, 1.2, 0.28);
      }
    }
  }

  /**
   * Synthesizes Kirar (ክራር) Acoustic Plucked Lyre
   * Characterized by crisp initial nail/plectrum attack, warm string body resonance, and exponential decay.
   */
  private synthesizeKirarPluck(freq: number, startTime: number, velocity: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const bodyFilter = this.ctx.createBiquadFilter();

    // Fundamental + slight triangle warmth
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 2, startTime); // 2nd harmonic sparkle

    // Acoustic Kirar Soundbox Filter (Resonant Body Cavity)
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.setValueAtTime(Math.min(freq * 1.8, 2200), startTime);
    bodyFilter.Q.setValueAtTime(2.5, startTime);

    // Fast pluck attack + natural string decay
    const duration = 1.4;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(velocity, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(velocity * 0.3, startTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(bodyFilter);
    subOsc.connect(bodyFilter);
    bodyFilter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbNode) {
      gain.connect(this.reverbNode);
    }

    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration);
    subOsc.stop(startTime + duration);
  }

  /**
   * Synthesizes Masinko (ማሲንቆ) Traditional Bowed Lute
   * Characterized by horsehair bow friction (sawtooth/filtered triangle), expressive vibrato LFO, and vocal leather formant filter.
   */
  private synthesizeMasinkoBow(startFreq: number, endFreq: number, startTime: number, duration: number, velocity: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const vibratoLFO = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const formantFilter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Bowed friction wave
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, startTime);
    // Subtle traditional sliding microtonal glide (portamento)
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration * 0.7);

    // Traditional expressive vibrato (5.6 Hz vibrato with depth)
    vibratoLFO.frequency.setValueAtTime(5.6, startTime);
    vibratoGain.gain.setValueAtTime(startFreq * 0.025, startTime); // ~2.5% frequency vibrato depth
    vibratoLFO.connect(osc.frequency);

    // Diamond Leather Soundbox Formant (gives Masinko its distinct vocal warmth)
    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(780, startTime);
    formantFilter.Q.setValueAtTime(3.8, startTime);

    // Bowed attack and release envelope
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(velocity, startTime + 0.18); // Smooth bow bite
    gain.gain.setValueAtTime(velocity * 0.85, startTime + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(formantFilter);
    formantFilter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbNode) {
      gain.connect(this.reverbNode);
    }

    vibratoLFO.start(startTime);
    osc.start(startTime);

    vibratoLFO.stop(startTime + duration);
    osc.stop(startTime + duration);
  }

  /**
   * Synthesizes Washint (ዋሽንት) Breathy Bamboo Flute
   */
  private synthesizeWashintFlute(freq: number, startTime: number, duration: number, velocity: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Bamboo body resonance filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2.2, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(velocity, startTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbNode) {
      gain.connect(this.reverbNode);
    }

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

// Global Singleton Instance
export const traditionalAmbientAudio = new TraditionalAmbientAudioEngine();
