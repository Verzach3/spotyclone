import {atom} from "jotai"
import Pocketbase from "pocketbase"
import {serverURL} from "./constants.ts";
import {Howl} from "howler";
import Song from "./types/song.ts"

export const globalPocketbase = atom(new Pocketbase(serverURL))
export const currentSongInstance = atom<Howl | undefined>(undefined)
export const currentSongDetails = atom<Song | undefined>(undefined);