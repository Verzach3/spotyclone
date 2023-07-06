import {Howl} from "howler";

export function formatTime(secs: number) {
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = Math.floor(secs - minutes * 60) || 0;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export function getSongPercent(song: Howl) {
  return ((((song.seek() || 0) / (song.duration() || 1)) * 100) || 0).toFixed(2)
}

export function getSecondsFromPercentage(duration: number, percentage: number) {
  return (duration) * (percentage / 100)
}

// Dios mio que hice aqui? T-T
export function secondsToStyledTime(seconds: number) {
  return (seconds / 60).toFixed(2).split(".").map((v, i) => {
    if (i === 0) return v;
    return Math.trunc(Number(v) * 0.6)
  }).join(":")
}

