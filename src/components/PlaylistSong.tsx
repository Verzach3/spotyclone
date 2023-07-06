import {Avatar, Card, Center, Stack, Text} from "@mantine/core";
import {IconMusic} from "@tabler/icons-react";
import Song from "../types/song.ts";

export function PlaylistSong({ song }: { song: Song}) {
  return (
    <Card p={0} style={{ backgroundColor: "#1A1B1E"}}>
      <Center inline>

      <Avatar size={"lg"} variant={"filled"}>
        <IconMusic/>
      </Avatar>
      <Stack style={{ marginLeft: "0.5em"}}>
        <Text weight={500} style={{ marginBottom: "-0.5em"}}>
          {song.name}
        </Text>
        <Text weight={200} style={{ marginTop: "-0.5em"}}>
          {song.artist}
        </Text>
      </Stack>
      </Center>
    </Card>
    )
}