import {
  ActionIcon,
  Affix,
  Button,
  Center,
  FileInput,
  Input,
  Modal,
  MultiSelect,
  rem,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import {IconPlayerPlayFilled, IconPlaylistAdd, IconSearch, IconUpload} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {useDebouncedValue} from "@mantine/hooks";
import {useAtomValue, useSetAtom} from "jotai/index";
import {
  globalCurrentSongDetails,
  globalCurrentSongInstance,
  globalPocketbase,
  globalSongsPlaylist
} from "../globalState.ts";
import Song from "../types/song.ts";
import {PlaylistSong} from "./PlaylistSong.tsx";
import {nanoid} from "nanoid";
import {Howl} from "howler";
import {Dropzone} from "@mantine/dropzone";
import {useForm} from "@mantine/form";

export function SearchAffix() {
  const [uploadModalOpened, setUploadModalOpened] = useState(false)
  const [searchModalOpened, setSearchModalOpened] = useState(false)
  const [inputVal, setInputVal] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const setCurrentSongInst = useSetAtom(globalCurrentSongInstance)
  const setCurrentSongDet = useSetAtom(globalCurrentSongDetails)
  const pb = useAtomValue(globalPocketbase)
  const [val] = useDebouncedValue(inputVal, 100)
  const setPlaylist = useSetAtom(globalSongsPlaylist)

  async function playSong(song: Song) {
    const url = pb.getFileUrl(song as never, song.song)
    setCurrentSongInst(new Howl({
      src: [url]
    }))
    setCurrentSongDet(song);
  }

  useEffect(() => {
    if (!searchModalOpened) return;
    console.log("Searching..")
    pb.collection("songs").getList<Song>(1, 10, {
      filter: `name ~ "${val}"`
    }).then((r) => {
      setResults(r.items)
    })
  }, [pb, val])

  useEffect(() => {
    console.log(results)
  }, [results])

  const form = useForm({
    initialValues: {
      name: '',
      artist: '',
      thumbnail: null,
      genres: '',
      song: null,
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(form.values);
    // Aquí puedes enviar los datos del formulario a tu backend o realizar otras acciones
  };

  const multiSelectData = [
    {value: 'Pop', label: 'Pop'},
    {value: 'Rock', label: 'Rock'},
    {value: 'Hip-hop', label: 'Hip-hop'},
    {value: 'R&B (Ritmo y Blues)', label: 'R&B (Ritmo y Blues)'},
    {value: 'Country', label: 'Country'},
    {value: 'Jazz', label: 'Jazz'},
    {value: 'Blues', label: 'Blues'},
    {value: 'Electrónica', label: 'Electrónica'},
    {value: 'Dance', label: 'Dance'},
    {value: 'Reggae', label: 'Reggae'},
    {value: 'Gospel', label: 'Gospel'},
    {value: 'Alternativo', label: 'Alternativo'},
    {value: 'Indie', label: 'Indie'},
    {value: 'Folk', label: 'Folk'},
    {value: 'Punk', label: 'Punk'},
    {value: 'Metal', label: 'Metal'},
    {value: 'Clásica', label: 'Clásica'},
    {value: 'Soul', label: 'Soul'},
    {value: 'Funk', label: 'Funk'},
    {value: 'Disco', label: 'Disco'},
    {value: 'Ska', label: 'Ska'},
    {value: 'Rap', label: 'Rap'},
    {value: 'Grunge', label: 'Grunge'},
    {value: 'New Wave', label: 'New Wave'},
    {value: 'Techno', label: 'Techno'},
    {value: 'House', label: 'House'},
    {value: 'Dubstep', label: 'Dubstep'},
    {value: 'Latina', label: 'Latina'},
    {value: 'Reguetón', label: 'Reguetón'},
    {value: 'Salsa', label: 'Salsa'},
    {value: 'Mariachi', label: 'Mariachi'},
    {value: 'Norteño', label: 'Norteño'},
    {value: 'Ranchera', label: 'Ranchera'},
    {value: 'Cumbia', label: 'Cumbia'},
    {value: 'Vallenato', label: 'Vallenato'},
    {value: 'Porro', label: 'Porro'},
    {value: 'Carranga', label: 'Carranga'},
    {value: 'Corridos', label: 'Corridos'}
  ];


  return (
    <div>

      <Modal opened={searchModalOpened} onClose={() => setSearchModalOpened(false)} withCloseButton={false}>
        <Input icon={<IconSearch/>} value={inputVal} onChange={(e) => setInputVal(e.target.value)}
               style={{marginBottom: "1em"}}/>
        <Stack style={{justifyContent: "left"}}>

          {results && results.map((s) =>
            <Center inline>

              <div style={{marginTop: "0.5em", width: "100%"}}>
                <PlaylistSong key={nanoid()} song={s}/>
              </div>
              <Center>
                <ActionIcon style={{marginRight: "0.2em"}} onClick={() => setPlaylist((prev) => {
                  if (prev.includes(s)) return prev;
                  return [...prev, s]
                })}>
                  <IconPlaylistAdd/>
                </ActionIcon>
                <ActionIcon onClick={() => playSong(s)}>
                  <IconPlayerPlayFilled/>
                </ActionIcon>
              </Center>
            </Center>
          )}
          {results.length === 0 && <Center>
              <Text>
                  No se encontraron resultados
              </Text>
          </Center>}
        </Stack>
      </Modal>
      <Modal opened={uploadModalOpened} onClose={() => setUploadModalOpened(false)} withCloseButton={false} >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            placeholder="Enter the name"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Artist"
            placeholder="Enter the artist"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("artist")}
          />

          <FileInput
            label="Thumbnail"
            placeholder="Drop or select an image"
            accept="image/*"
            style={{marginTop: "1em"}}
            {...form.getInputProps("thumbnail")}
          />

          <MultiSelect
            data={multiSelectData}
            label="Genres"
            placeholder="Enter the genres"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("genres")}
          />

          <FileInput
            label="Song"
            placeholder="Drop or select an audio file"
            accept="audio/webm,audio/mp3"
            required
            style={{marginTop: "1em"}}
            {...form.getInputProps("song")}
          />

          <Button type="submit" style={{marginTop: "1em"}}>Submit</Button>
        </form>
      </Modal>
      <Affix position={{top: rem(10), right: rem(15)}}>
        <Center>
          <ActionIcon variant={"filled"} size={"xl"} onClick={() => setUploadModalOpened(true)}>
            <IconUpload/>
          </ActionIcon>
          <ActionIcon style={{marginLeft: "1em"}} variant={"filled"} size={"xl"}
                      onClick={() => setSearchModalOpened(true)}>
            <IconSearch/>
          </ActionIcon>
        </Center>
      </Affix>
    </div>
  )
}