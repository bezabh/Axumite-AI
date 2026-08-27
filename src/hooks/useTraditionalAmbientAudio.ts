import { useState, useEffect } from 'react';
import { traditionalAmbientAudio, AmbientAudioState, TraditionalInstrument } from '../utils/traditionalAmbientAudio';

export function useTraditionalAmbientAudio() {
  const [state, setState] = useState<AmbientAudioState>(() => traditionalAmbientAudio.getState());

  useEffect(() => {
    const unsubscribe = traditionalAmbientAudio.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const toggle = () => traditionalAmbientAudio.toggle();
  const start = () => traditionalAmbientAudio.start();
  const stop = () => traditionalAmbientAudio.stop();
  const setVolume = (volume: number) => traditionalAmbientAudio.setVolume(volume);
  const setInstrument = (instrument: TraditionalInstrument) => traditionalAmbientAudio.setInstrument(instrument);

  return {
    isPlaying: state.isPlaying,
    volume: state.volume,
    instrument: state.instrument,
    currentMode: state.currentMode,
    toggle,
    start,
    stop,
    setVolume,
    setInstrument,
  };
}
