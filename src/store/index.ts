import { atom } from "jotai";
import type { Note } from "../domain/note";

export const notesAtom = atom<Note[]>([]);
