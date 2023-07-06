import {useAtomValue, useSetAtom} from "jotai/index";
import {currentSongDetails, currentSongInstance, globalPocketbase} from "../globalState.ts";
import {useEffect, useState} from "react";
import Song from "../types/song.ts";
import {Howl} from "howler";

export function SongsList() {
  const pb = useAtomValue(globalPocketbase);
  const setCurrentSongInst = useSetAtom(currentSongInstance)
  const setCurrentSongDet= useSetAtom(currentSongDetails)
  const [currentPage, ] = useState(1)
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
    setCurrentSongInst(new Howl({
      src: [url]
    }))
    setCurrentSongDet(song);
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