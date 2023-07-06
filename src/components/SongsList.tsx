import {useAtomValue, useSetAtom} from "jotai/index";
import {
  globalCurrentSongDetails,
  globalCurrentSongInstance,
  globalPocketbase,
  globalSongsPlaylist
} from "../globalState.ts";
import {useEffect, useState} from "react";
import Song from "../types/song.ts";
import {Howl} from "howler";

export function SongsList() {
  const pb = useAtomValue(globalPocketbase);
  const setPlaylist = useSetAtom(globalSongsPlaylist)
  const setCurrentSongInst = useSetAtom(globalCurrentSongInstance)
  const setCurrentSongDet= useSetAtom(globalCurrentSongDetails)
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
        <button onClick={() => setPlaylist((prev) => [...prev, s])} >Add to playlist</button>
      </div>)}
    </div>
  )
}