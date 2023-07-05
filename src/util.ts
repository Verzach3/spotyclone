import {Howl} from "howler";

export function formatTime(secs: number) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.floor(secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export function getSongPercent(song: Howl) {
    return (((song.seek() || 0) / (song.duration() || 1)) * 100) || 0
}