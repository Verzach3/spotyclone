import {atom} from "jotai"
import Pocketbase from "pocketbase"
import {serverURL} from "./constants.ts";
import {Howl} from "howler";

export const globalPocketbase = atom(new Pocketbase(serverURL))
export const currentSong = atom<Howl | undefined>(undefined)