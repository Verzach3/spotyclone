import { atom } from "jotai"
import Pocketbase from "pocketbase"
import { serverURL } from "./constants.ts";
export const globalPocketbase = atom(new Pocketbase(serverURL))