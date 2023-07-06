import {ActionIcon, Card, Center, Stack, Text, ThemeIcon} from "@mantine/core";
import {IconMusic, IconPlayerPlayFilled, IconPlaylistAdd} from "@tabler/icons-react";
import Song from "../types/song.ts";

export function SongsListSong({song, onPlayClick, onPlaylistAddClick}: { song: Song, onPlayClick: Function, onPlaylistAddClick: Function }) {
  return (
    <Card p={0} style={{marginInline: "2em", marginTop: "2em", marginBottom: "1em", backgroundColor: "#1A1B1E"}}>
      <Stack>
        <ThemeIcon size={300}>
          <IconMusic/>
        </ThemeIcon>

        <Center inline style={{justifyContent: "space-between"}}>
          <Stack>

            <Text weight={600} size={"xl"} style={{marginTop: "-0.5em"}}>
              {song.name}
            </Text>
            <Text size={"lg"} style={{marginTop: "-1em"}}>
              {song.artist}
            </Text>
            <Text size={"md"} style={{marginTop: "-1.4em"}}>
              {song.genres.join(", ")}
            </Text>
          </Stack>
          <Stack>
            <ActionIcon onClick={() => onPlaylistAddClick()}>
              <IconPlaylistAdd/>
            </ActionIcon>
            <ActionIcon onClick={() => onPlayClick()}>
              <IconPlayerPlayFilled/>
            </ActionIcon>
          </Stack>
        </Center>
      </Stack>
    </Card>
  )
}