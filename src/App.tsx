import {useEffect, useState} from 'react'
import {Howl} from "howler"
import {useAtomValue} from "jotai"
import {globalPocketbase} from './globalState'
import {Progress, Slider} from "@mantine/core";
import {formatTime, getSongPercent} from "./util.ts";

function App() {
    const pb = useAtomValue(globalPocketbase);
    const [currentSong, setcurrentSong] = useState<Howl | undefined>(undefined)
    const [currentSongProgress, setCurrentSongProgress] = useState("");
    const [currentSongVolume, setCurrentSongVolume] = useState<number>(100)
    useEffect(() => {
        (async () => {
            const song = (await pb.collection("songs").getList()).items[0];
            const file = pb.getFileUrl(song, song.song);
            const audio = new Howl({
                src: [file],
            })
            setcurrentSong(audio);
            console.log(file)
            console.log(song)
        })()
    }, [pb])

    // Update Song Percent
    useEffect(() => {
        if (!currentSong) return;
        const progressInterval = setInterval(() => {
            setCurrentSongProgress(getSongPercent(currentSong))
        }, 100)
        return () => {
            clearInterval(progressInterval);
            if (!currentSong) return
            currentSong.unload()
        }

    }, [currentSong])

    // Update Volume
    useEffect(() => {
        if (!currentSong) return;
        currentSong.volume(currentSongVolume/100);
    }, [currentSong, currentSongVolume])

    return (
        <>
            <h1>Duration {formatTime(currentSong?.duration() || 0)}</h1>
            <h1>Progress {currentSongProgress}</h1>
            <button onClick={() => currentSong?.play()}>Play</button>
            <button onClick={() => currentSong?.pause()}>Pause</button>
            <Progress value={Number(currentSongProgress)}/>
            <h1>Volume</h1>
            <Slider value={currentSongVolume} onChange={setCurrentSongVolume}/>
        </>
    )
}

export default App
