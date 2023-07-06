import {Drawer, Stack, Text} from "@mantine/core";
import {useAtom} from "jotai";
import {globalCurrentSongDetails, globalPlaylistDrawerOpened, globalSongsPlaylist} from "../globalState.ts";
import {PlaylistSong} from "./PlaylistSong.tsx";
import {useAtomValue} from "jotai/index";

export function PlaylistDrawer() {
  const [isOpen, setIsOpen] = useAtom(globalPlaylistDrawerOpened)
  const [playlist, setPlaylist] = useAtom(globalSongsPlaylist);
  const currentSongDet = useAtomValue(globalCurrentSongDetails);
  return (
    <Drawer opened={isOpen} onClose={() => setIsOpen(false)} withCloseButton={false} position={"right"}
            styles={{inner: {height: "40em", marginTop: "10em"}, content: {borderRadius: "90%"}}}>
      <Stack>
        <Text>
          Reproduciendo Actualmente
        </Text>
        {currentSongDet &&
            <PlaylistSong song={currentSongDet}/>
        }
        {playlist.length > 0 && <Text>
            A continuacion
        </Text>
        }
        {playlist.length > 0 && playlist.map((song) =>
          <PlaylistSong song={song}/>
        )}
      </Stack>
    </Drawer>
  )
}