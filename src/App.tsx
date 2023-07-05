import {useEffect, useState} from 'react'
import {Howl} from "howler"
import {useAtomValue} from "jotai"
import {globalPocketbase} from './globalState'
import {Progress} from "@mantine/core";

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
            <h1>Duration {currentSong?.duration()}</h1>
            <h1>Progress {currentSongProgress}</h1>
            <button onClick={() => currentSong?.play()}>Play</button>
            <button onClick={() => currentSong?.pause()}>Pause</button>
            <Progress value={currentSongProgress}/>
        </>
    )
}

function formatTime(secs: number) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function getSongPercent(song: Howl) {
    return (((song.seek() || 0) / (song.duration() || 1)) * 100) || 0
}

export default App
