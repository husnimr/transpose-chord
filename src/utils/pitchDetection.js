export const standardTuning = [
  { note: 'E2', hz: 82.41 },
  { note: 'A2', hz: 110.00 },
  { note: 'D3', hz: 146.83 },
  { note: 'G3', hz: 196.00 },
  { note: 'B3', hz: 246.94 },
  { note: 'E4', hz: 329.63 }
];

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function noteFromPitch(frequency) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

export function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function centsOffFromPitch(frequency, note) {
  return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

export function getNoteString(note) {
  return noteStrings[note % 12];
}

export function autoCorrelate(buf, sampleRate) {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / buf.length);
  if (rms < 0.01)
    return -1;

  let r1 = 0, r2 = buf.length - 1, thres = 0.2;
  for (let i = 0; i < buf.length / 2; i++)
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < buf.length / 2; i++)
    if (Math.abs(buf[buf.length - i]) < thres) { r2 = buf.length - i; break; }

  buf = buf.slice(r1, r2);
  let c = new Array(buf.length).fill(0);
  for (let i = 0; i < buf.length; i++)
    for (let j = 0; j < buf.length - i; j++)
      c[i] = c[i] + buf[j] * buf[j + i];

  let d = 0; while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < buf.length; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export function getCentsOffTarget(frequency, targetFrequency) {
  return Math.floor(1200 * Math.log(frequency / targetFrequency) / Math.log(2));
}

export function getClosestStandardString(frequency) {
  let closest = standardTuning[0];
  let minCents = Math.abs(getCentsOffTarget(frequency, standardTuning[0].hz));
  for(let i=1; i<standardTuning.length; i++) {
     let centsDiff = Math.abs(getCentsOffTarget(frequency, standardTuning[i].hz));
     if (centsDiff < minCents) {
        minCents = centsDiff;
        closest = standardTuning[i];
     }
  }
  return closest;
}
