import {useEffect, useState} from 'react'
import {Howl} from "howler"
import {useAtomValue} from "jotai"
import {globalPocketbase} from './globalState'
import {Progress} from "@mantine/core";
import {formatTime, getSongPercent} from "./util.ts";

function App() {
    const pb = useAtomValue(globalPocketbase);
    const [currentSong, setcurrentSong] = useState<Howl | undefined>(undefined)
    const [currentSongProgress, setCurrentSongProgress] = useState(0);
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


    return (
        <>
            <h1>Duration {formatTime(currentSong?.duration() || 0)}</h1>
            <h1>Progress {currentSongProgress}</h1>
            <button onClick={() => currentSong?.play()}>Play</button>
            <button onClick={() => currentSong?.pause()}>Pause</button>
            <Progress value={currentSongProgress}/>
        </>
    )
}

export default App
