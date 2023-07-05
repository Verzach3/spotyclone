import {useAtomValue} from "jotai/index";
import {currentSong} from "../globalState.ts";
import {useEffect, useState} from "react";
import {formatTime, getSecondsFromPercentage, getSongPercent} from "../util.ts";
import {Slider} from "@mantine/core";

export function Player() {
    const currentSongVal = useAtomValue(currentSong)
    const [currentSongProgress, setCurrentSongProgress] = useState("");
    const [currentSongVolume, setCurrentSongVolume] = useState<number>(100)
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
// Update Song Percent
    useEffect(() => {
        if (!currentSongVal) return;
        const progressInterval = setInterval(() => {
            setCurrentSongProgress(getSongPercent(currentSongVal))
        }, 100)
        play()
        return () => {
            clearInterval(progressInterval);
            if (!currentSongVal) return
            currentSongVal.unload()
        }

    }, [currentSongVal])

// Update Volume
    useEffect(() => {
        if (!currentSongVal) return;
        currentSongVal.volume(currentSongVolume / 100);
    }, [currentSongVal, currentSongVolume])

    function play() {
        if (!currentSongVal) return;
        if (currentSongVal.playing()) return;
        currentSongVal.play()
        setIsPlaying(currentSongVal.playing())
    }

    function pause() {
        if (!currentSongVal) return;
        if (!currentSongVal.playing()) return;
        currentSongVal.pause()
        setIsPlaying(currentSongVal.playing())
    }

    function mute() {
        if (!currentSongVal) return;
        const isMuted = currentSongVal.mute()
        currentSongVal.mute(!isMuted)
        setIsMuted(!isMuted)
    }

    function seekSong(percentage: number) {
        if (!currentSongVal) return;
        currentSongVal.seek(getSecondsFromPercentage(currentSongVal.duration(), percentage))
    }

    return (
        <>
            <h1>Duration M: {formatTime(currentSongVal?.duration() || 0)} S: {currentSongVal?.duration()}</h1>
            <h1>Progress {currentSongProgress}</h1>
            <h1>Is Playing?: {isPlaying}</h1>
            <button onClick={play}>Play</button>
            <button onClick={pause}>Pause</button>
            <button onClick={mute}>{isMuted ? "unMute" : "Mute"}</button>
            <Slider value={Number(currentSongProgress)} onChange={seekSong}/>
            <h1>Volume</h1>
            <Slider value={currentSongVolume} onChange={setCurrentSongVolume}/>
        </>
    )
}
