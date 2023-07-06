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
import {SongsListSong} from "./SongsListSong.tsx";
import {Center, Grid} from "@mantine/core";
import {nanoid} from "nanoid";

export function SongsList() {
  const pb = useAtomValue(globalPocketbase);
  const setPlaylist = useSetAtom(globalSongsPlaylist)
  const setCurrentSongInst = useSetAtom(globalCurrentSongInstance)
  const setCurrentSongDet = useSetAtom(globalCurrentSongDetails)
  const [currentPage,] = useState(1)
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

    <Grid grow gutter={"xs"} justify={"flex-start"} align={"stretch"} style={{ paddingBottom: "8%"}}>
      {songs.map((s) =>
        <Grid.Col span={2}>
          <Center>
            <SongsListSong key={nanoid()} song={s} onPlayClick={() => playSong(s)}
                           onPlaylistAddClick={() => setPlaylist((prev) => [...prev, s])}/>
          </Center>
        </Grid.Col>
      )}
      {songs.map((s) =>
        <Grid.Col span={2}>
          <Center>
            <SongsListSong key={nanoid()} song={s} onPlayClick={() => playSong(s)}
                           onPlaylistAddClick={() => setPlaylist((prev) => [...prev, s])}/>
          </Center>
        </Grid.Col>
      )}
    </Grid>
  )
}