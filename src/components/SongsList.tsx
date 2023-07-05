import {useAtomValue, useSetAtom} from "jotai/index";
import {currentSong, globalPocketbase} from "../globalState.ts";
import {useEffect, useState} from "react";
import Song from "../types/song.ts";
import {Howl} from "howler";

export function SongsList () {
    const pb = useAtomValue(globalPocketbase);
    const setCurrentSong = useSetAtom(currentSong)
    const [currentPage, setCurrentPage] = useState(1)
    const [songs, setSongs] = useState<Song[]>([]);
    useEffect(() => {
       getSongs()
    }, [])

    async function getSongs() {
        const songs = (await pb.collection("songs").getList<Song>(currentPage, 30)).items;
        setSongs(songs || [])
    }

    async function playSong(song: Song) {
        const url = pb.getFileUrl(song as never, song.song)
        setCurrentSong(new Howl({
            src: [url]
        }))
    }

    return (
        <div>
            {songs.map((s) => <div key={s.id}>
                <h1>{s.name}</h1>
                <h2>{s.artist}</h2>
                <button onClick={() => playSong(s)}>Play</button>
            </div>)}
        </div>
    )
}