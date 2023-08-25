import {useAtomValue, useSetAtom} from "jotai";
import {
  globalChangeModel,
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

export function SongsList() {
  const pb = useAtomValue(globalPocketbase);
  const setPlaylist = useSetAtom(globalSongsPlaylist)
  const setCurrentSongInst = useSetAtom(globalCurrentSongInstance)
  const setCurrentSongDet = useSetAtom(globalCurrentSongDetails)
  const changeModel = useAtomValue(globalChangeModel)
  const [currentPage,] = useState(1)
  const [songs, setSongs] = useState<Song[]>([]);
  useEffect(() => {
    getSongs()
  }, [changeModel])

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
        <Grid.Col span={2} key={s.id}>
          <Center >
            <SongsListSong  song={s} onPlayClick={() => playSong(s)}
                           onPlaylistAddClick={() => setPlaylist((prev) => [...prev, s])}/>
          </Center>
        </Grid.Col>
      )}
    </Grid>
  )
}