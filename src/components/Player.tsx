import {useAtomValue} from "jotai/index";
import {currentSong} from "../globalState.ts";
import {useEffect, useState} from "react";
import {formatTime, getSecondsFromPercentage, getSongPercent} from "../util.ts";
import {Slider} from "@mantine/core";

export function Player() {
    const currentSongVal = useAtomValue(currentSong)
    const [currentSongProgress, setCurrentSongProgress] = useState("");
    const [currentSongVolume, setCurrentSongVolume] = useState<number>(100)

// Update Song Percent
    useEffect(() => {
        if (!currentSongVal) return;
        const progressInterval = setInterval(() => {
            setCurrentSongProgress(getSongPercent(currentSongVal))
        }, 100)
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
        
    }

    return (
        <>
            <h1>Duration {formatTime(currentSongVal?.duration() || 0)} S: {currentSongVal?.duration()}</h1>
            <h1>Progress {currentSongProgress}</h1>
            <button onClick={() => currentSongVal?.play()}>Play</button>
            <button onClick={() => currentSongVal?.pause()}>Pause</button>
            <Slider value={Number(currentSongProgress)} onChange={(v) => {
                currentSongVal?.seek(getSecondsFromPercentage(currentSongVal?.duration(), v))
            }}/>
            <h1>Volume</h1>
            <Slider value={currentSongVolume} onChange={setCurrentSongVolume}/>
        </>
    )
}
