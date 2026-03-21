import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  autoCorrelate, 
  noteFromPitch, 
  centsOffFromPitch, 
  getNoteString,
  standardTuning,
  getClosestStandardString,
  getCentsOffTarget
} from '../utils/pitchDetection';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

export default function GuitarTuner({ darkMode }) {
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [pitch, setPitch] = useState(null);
  const [note, setNote] = useState(null);
  const [cents, setCents] = useState(0);

  const [tuningMode, setTuningMode] = useState('auto'); // 'auto' | 'manual'
  const [targetString, setTargetString] = useState(standardTuning[0]);
  const tuningModeRef = useRef('auto');
  const targetStringRef = useRef(standardTuning[0]);

  const handleModeChange = (mode) => {
    setTuningMode(mode);
    tuningModeRef.current = mode;
  };

  const handleTargetChange = (strObj) => {
    setTargetString(strObj);
    targetStringRef.current = strObj;
    handleModeChange('manual');
  };

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsListening(true);
      isListeningRef.current = true;
      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin di browser Anda.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    isListeningRef.current = false;
    setPitch(null);
    setNote(null);
    setCents(0);

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    analyserRef.current = null;
  };

  const updatePitch = () => {
    if (!analyserRef.current || !isListeningRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    // Auto-correlate gets fundamental frequency
    const ac = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    if (ac !== -1) {
      const freq = ac;
      setPitch(freq);

      if (tuningModeRef.current === 'auto') {
        const closest = getClosestStandardString(freq);
        const centDiff = getCentsOffTarget(freq, closest.hz);
        setNote(closest.note);
        setCents(centDiff);
      } else {
        const target = targetStringRef.current;
        const centDiff = getCentsOffTarget(freq, target.hz);
        setNote(target.note);
        setCents(centDiff);
      }
    }

    rafIdRef.current = requestAnimationFrame(updatePitch);
  };

  // UI Colors depending on correctness
  const getTuningColor = () => {
    if (Math.abs(cents) < 10) return 'text-green-500';
    if (Math.abs(cents) < 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getIndicatorColor = () => {
    if (Math.abs(cents) < 10) return 'bg-green-500';
    if (Math.abs(cents) < 30) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // Calculate needle rotation (-50 cents to +50 cents maps to -45deg to +45deg)
  const needleRotation = Math.max(-45, Math.min(45, (cents / 50) * 45));

  return (
    <div className={`mt-6 flex flex-col items-center justify-center p-8 rounded-2xl transition-colors duration-300 w-full ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 shadow-sm border border-gray-200'
    }`}>
      
      {/* Tuning Mode Toggle (Switch) */}
      <div className="flex justify-between items-center w-full max-w-sm mb-4 px-2">
        <span className={`font-bold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tuning Mode</span>
        <label className="flex items-center cursor-pointer gap-3">
          <span className={`font-bold text-sm select-none ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Auto
          </span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={tuningMode === 'auto'} 
              onChange={(e) => handleModeChange(e.target.checked ? 'auto' : 'manual')} 
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              tuningMode === 'auto' 
                ? 'bg-blue-500' 
                : darkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
              tuningMode === 'auto' ? 'translate-x-6' : 'translate-x-0'
            }`}></div>
          </div>
        </label>
      </div>

      <div className="mb-6 flex flex-col items-center w-full">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {standardTuning.map((str) => {
             let isHighlighted = false;
             if (tuningMode === 'manual') {
               isHighlighted = targetString.note === str.note;
             } else {
               isHighlighted = note === str.note;
             }
             
             return (
              <button
                key={str.note}
                onClick={() => handleTargetChange(str)}
                className={`w-12 h-12 rounded-full font-bold flex flex-col items-center justify-center transition-all ${
                  isHighlighted
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
                title={`Stem senar ${str.note} (${str.hz} Hz)`}
              >
                <span className="text-lg leading-tight">{str.note.replace(/[0-9]/g, '')}</span>
                <span className="text-[10px] opacity-75 leading-none">{str.note}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-8 py-4 text-lg rounded-full font-bold transition-all ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
          }`}
        >
          {isListening ? <><FaMicrophoneSlash /> Berhenti</> : <><FaMicrophone /> Mulai Stem Gitar</>}
        </button>
      </div>

      <div className={`relative w-full max-w-sm h-48 flex items-end justify-center overflow-hidden mb-8 border-b-2 ${
        darkMode ? 'border-gray-700' : 'border-gray-300'
      }`}>
        {/* Dial Background lines */}
        <div className={`absolute top-4 w-72 h-72 rounded-full border-t-[6px] border-l-[6px] border-r-[6px] opacity-30 ${
          darkMode ? 'border-gray-500' : 'border-gray-400'
        }`} />
        
        {/* Guide lines */}
        <div className={`absolute bottom-0 w-[2px] h-6 mb-2 ${darkMode ? 'bg-green-400' : 'bg-green-500'} bg-opacity-80 z-0`}></div>
        <div className={`absolute bottom-0 left-[25%] w-[2px] h-4 mb-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} z-0 -rotate-[30deg] origin-bottom`}></div>
        <div className={`absolute bottom-0 right-[25%] w-[2px] h-4 mb-2 ${darkMode ? 'bg-gray-500' : 'bg-gray-400'} z-0 rotate-[30deg] origin-bottom`}></div>

        {/* Needle */}
        <motion.div 
          className="absolute bottom-2 w-1.5 h-36 origin-bottom rounded-t-full z-10"
          style={{ backgroundColor: isListening ? 'transparent' : 'gray' }}
          initial={{ rotate: 0 }}
          animate={{ rotate: isListening ? needleRotation : 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
           <div className={`w-full h-full rounded-t-full ${isListening ? getIndicatorColor() : 'bg-gray-400'} transition-colors duration-300`} />
        </motion.div>

        {/* Center Pivot */}
        <div className={`absolute bottom-[-10px] w-6 h-6 rounded-full z-20 ${
           darkMode ? 'bg-gray-300' : 'bg-gray-600'
        }`} />

        {/* Labels below dial */}
        <div className={`absolute bottom-2 left-6 font-bold text-sm opacity-60 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>⬇ Flat</div>
        <div className={`absolute bottom-2 right-6 font-bold text-sm opacity-60 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sharp ⬆</div>
      </div>

      {isListening ? (
        <div className="text-center w-full min-h-[140px]">
          <div className="flex items-center justify-center gap-4">
            {/* Flat indicator */}
            <div className={`text-5xl font-black transition-opacity duration-200 ${note && cents < -10 ? 'text-red-500 opacity-100 drop-shadow-md' : 'text-gray-300 opacity-20 dark:text-gray-600'}`}>
               ◀
            </div>

            <div className="flex flex-col items-center justify-center w-32">
              <h2 className={`text-7xl font-black ${getTuningColor()} transition-colors duration-200`}>
                {note || '--'}
              </h2>
            </div>
            
            {/* Sharp indicator */}
            <div className={`text-5xl font-black transition-opacity duration-200 ${note && cents > 10 ? 'text-red-500 opacity-100 drop-shadow-md' : 'text-gray-300 opacity-20 dark:text-gray-600'}`}>
               ▶
            </div>
          </div>
          <div className={`mt-3 font-mono text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {pitch ? `${Math.round(pitch)} Hz` : 'Mendengarkan...'}
          </div>
          <div className={`mt-2 text-lg font-bold min-h-[28px] ${getTuningColor()}`}>
            {note ? (
              Math.abs(cents) < 10 
              ? '✅ Pas di Tengah!' 
              : cents < 0 
                ? 'Kencangkan (Naikkan nada) ⬆️' 
                : 'Kendurkan (Turunkan nada) ⬇️'
            ) : 'Bunyikan senar...'}
          </div>
        </div>
      ) : (
        <div className={`text-center py-6 min-h-[140px] flex flex-col justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg">Tuner gitar siap digunakan.</p>
          <p className="text-sm mt-2 opacity-80">Klik "Mulai Stem Gitar" dan izinkan akses mikrofon.</p>
        </div>
      )}
    </div>
  );
}
