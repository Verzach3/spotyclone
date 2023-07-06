import {useAtomValue} from "jotai/index";
import {currentSongDetails, currentSongInstance} from "../globalState.ts";
import {useEffect, useState} from "react";
import {formatTime, getSecondsFromPercentage, getSongPercent, secondsToStyledTime} from "../util.ts";
import {ActionIcon, Affix, Avatar, Center, Slider, Stack, Text} from "@mantine/core";
import {
  IconMusic,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconVolume,
  IconVolumeOff
} from "@tabler/icons-react";

export function Player() {
  const currentSongInst = useAtomValue(currentSongInstance)
  const currentSongDet = useAtomValue(currentSongDetails)

  const [currentSongProgress, setCurrentSongProgress] = useState("");
  const [currentSongProgressSeconds, setCurrentSongProgressSeconds] = useState(0);
  const [currentSongVolume, setCurrentSongVolume] = useState<number>(100)
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
// Update Song Percent
  useEffect(() => {
    if (!currentSongInst) return;
    const progressInterval = setInterval(() => {
      setCurrentSongProgress(getSongPercent(currentSongInst))
      setCurrentSongProgressSeconds(Number(getSecondsFromPercentage(currentSongInst.duration(), Number(getSongPercent(currentSongInst))).toFixed(2)))
    }, 100)
    play()
    return () => {
      clearInterval(progressInterval);
      if (!currentSongInst) return
      currentSongInst.unload()
    }

  }, [currentSongInst])

// Update Volume
  useEffect(() => {
    if (!currentSongInst) return;
    currentSongInst.volume(currentSongVolume / 100);
  }, [currentSongInst, currentSongVolume])

  function play() {
    if (!currentSongInst) return;
    if (currentSongInst.playing()) return;
    currentSongInst.play()
    setIsPlaying(true)
  }

  function pause() {
    if (!currentSongInst) return;
    if (!currentSongInst.playing()) return;
    currentSongInst.pause()
    setIsPlaying(false)
  }

  function togglePlay() {
    if (!currentSongInst) return;
    if (currentSongInst.playing()) {
      pause()
      return;
    } else {
      play()
    }
  }

  function mute() {
    if (!currentSongInst) return;
    const isMuted = currentSongInst.mute()
    currentSongInst.mute(!isMuted)
    setIsMuted(!isMuted)
  }

  function seekSong(percentage: number) {
    if (!currentSongInst) return;
    currentSongInst.seek(getSecondsFromPercentage(currentSongInst.duration(), percentage))
  }


  return (
    <Affix bottom={0} style={{width: "100% "}}>
      <Stack spacing={0} style={{paddingBottom: "1em"}}>
        <Center inline style={{justifyContent: "space-evenly"}}>
          <Text style={{marginLeft: "0.3em"}}>{secondsToStyledTime(currentSongProgressSeconds)}</Text>
          <Slider thumbChildren={<IconMusic/>} value={Number(currentSongProgress)} onChangeEnd={seekSong} label={(v) => secondsToStyledTime(getSecondsFromPercentage(currentSongInst?.duration() || 0, v))} color={"green"}
                  style={{width: "100%", marginInline: "0.3em"}}/>
          <Text style={{marginRight: "0.3em"}}>{formatTime(currentSongInst?.duration() || 0)}</Text>
        </Center>
        <Center style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginInline: "0.3em",
          paddingTop: "0.5em"
        }}>
          <Center style={{marginLeft: "0.5em"}}>

            <Avatar color={"red"} gradient={{from: '#ed6ea0', to: '#ec8c69', deg: 35}} variant={"gradient"} size={"md"}>
              <IconMusic/>
            </Avatar>
            <Stack spacing={0} ml={"0.3em"}>

              <Text weight={500} mb={"-0.1em"}>{currentSongDet?.name || "--/--"}</Text>
              <Text weight={200} size={"xs"}>{currentSongDet?.artist || "--/--"}</Text>
            </Stack>
          </Center>
          <ActionIcon onClick={togglePlay}>
            <IconPlayerSkipBack/>
          </ActionIcon>
          <ActionIcon onClick={togglePlay} variant={"filled"} radius={"xl"} size={"xl"}>
            {isPlaying ? <IconPlayerPlayFilled/> : <IconPlayerPauseFilled/>}
          </ActionIcon>
          <ActionIcon onClick={togglePlay}>
            <IconPlayerSkipForward/>
          </ActionIcon>
          <Center inline style={{width: "10em", marginRight: "1em"}}>
            <ActionIcon onClick={mute}>
              {isMuted ? <IconVolumeOff/> : <IconVolume/>}
            </ActionIcon>
            <Slider value={currentSongVolume} onChangeEnd={setCurrentSongVolume} style={{width: "100%"}}/>
          </Center>
        </Center>
      </Stack>
    </Affix>
  )
}
